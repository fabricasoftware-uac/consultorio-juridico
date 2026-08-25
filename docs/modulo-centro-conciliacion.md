# Módulo Centro de Conciliación

Diseño del quinto rol del sistema. **Documento de diseño — nada de esto está implementado todavía.**

## Qué se quiere

Algunos casos (no todos) se derivan al Centro de Conciliación. **Quien deriva es el asesor**, al
determinar que el caso corresponde a esa vía. El caso completo —con su estudiante asignado y toda la
información registrada— aparece en el panel del centro, donde la encargada lo revisa y lo trabaja:
sube anexos, le pide ajustes al estudiante o le solicita actualizaciones sobre los hechos.

Decisiones tomadas:

| Pregunta | Decisión |
|---|---|
| ¿Qué pasa con asesor y estudiante al derivar? | **Siguen trabajando el caso.** Conciliación es una vía paralela, no un traspaso. |
| ¿Cuántas personas usan el módulo? | **Una encargada**, con acceso a todos los casos derivados. El modelo aguanta que entre una segunda sin cambios de esquema. |
| ¿Se puede revertir la derivación? | **Sí**, la encargada devuelve el caso al asesor con un motivo. |
| ¿Quién cierra el caso? | La encargada **cierra la conciliación** y registra el resultado. El **cierre del caso sigue siendo del asesor**. |

---

## Hallazgos del código que condicionan el diseño

### 1. Ya existe un `'conciliacion'`, y significa otra cosa

`area_enum` incluye `'conciliacion'` desde `20260423000000_formulario_unificado.sql:78`, y el
estudiante lo puede elegir en la entrevista (`FormSteps.tsx:517`). Eso es **materia del caso**, no
**destino**: un caso de familia puede irse al Centro de Conciliación.

Son dos ejes independientes y no deben mezclarse. El módulo nuevo **no** filtra por
`casos.area = 'conciliacion'` ni escribe ese valor.

### 2. `estaAsignado()` es el único cuello de autorización

`supabase/migrations/20251022022959_crea_politicas_y_hooks_autorizacion.sql:104`

```sql
CREATE FUNCTION public.estaAsignado(uid uuid, caso_id integer) RETURNS boolean ...
  SELECT 1 FROM public.estudiantes_casos WHERE id_estudiante = uid AND id_caso = caso_id
  UNION ALL
  SELECT 1 FROM public.asesores_casos    WHERE id_asesor     = uid AND id_caso = caso_id
```

Las políticas RLS de `casos` (select y update), `documentos_caso` (select/insert) y
`actividades_caso` (select/insert) pasan **todas** por ahí. Agregarle una tercera rama da acceso al
rol nuevo a detalle, anexos y bitácora de una sola vez: es el punto de extensión barato.

### 3. `auditoria_casos` es la excepción — no usa `estaAsignado`

`20260329000000_auditoria_casos.sql` define políticas explícitas por rol
(`auditoria_select_admin`, `auditoria_select_estudiante`, `auditoria_select_asesor`). El rol nuevo
necesita **su propia política** ahí; la extensión de `estaAsignado` no lo cubre.

### 4. El JWT asume un rol por usuario

`custom_access_token_hook` hace `select role into user_role from perfiles_roles where user_id = ...`
sin `LIMIT` ni `ORDER BY`. Con dos roles, plpgsql toma una fila arbitraria. **Si la encargada ya
existe en el sistema como asesora, hay que resolverlo antes** (usuario aparte, o rediseñar el hook).

### 5. Dos mecanismos que parecen reutilizables pero no lo son

- **`estado = 'en_correccion'`** es lo que usa el asesor en `handleSolicitarAjustes`
  (`asesor/mis-casos/[id]/page.tsx:191`) para devolver el caso. Reabre la entrevista del estudiante.
  Para un caso ya aprobado y activo eso es incorrecto: la encargada quiere una *actualización de
  hechos*, no una re-entrevista.
- **`llamados_atencion`** tiene `CHECK (tipo IN ('estudiante','asesor'))` y `UNIQUE(id_caso, tipo)`
  (`20260327000000_alertas_tempranas.sql:18`): un solo llamado vivo por tipo y caso. La encargada
  necesita varias solicitudes simultáneas con historial de respuesta.

### 6. `notificar_usuarios_caso()` no conoce el rol nuevo

`20260405000000_notificaciones_usuario.sql:26` inserta notificaciones solo para estudiantes y
asesores asignados. Sin una cuarta rama, la encargada no se entera de nada.

---

## Decisión de fondo: vía paralela, no estado del caso

**No** se agrega `'en_conciliacion'` a `estado_enum`. Razones:

1. `casos.estado` se consume en badges, filtros (`case-filters.tsx`), analíticas, el cron de alertas
   tempranas y los paneles de los cuatro roles. Un valor nuevo obliga a tocar todo eso.
2. Dejaría el caso "no activo" cuando sí lo está: sigue trabajándose en paralelo.
3. La conciliación tiene su propio ciclo de vida (recibido → en revisión → citado → acuerdo / sin
   acuerdo / desistimiento / inasistencia) que no cabe en `estado_enum` sin contaminarlo.

**Regla que mantiene los dos ejes separados: ninguna pieza del módulo escribe `casos.estado`.**

---

## Esquema

### Rol

`app_role` += `'centro_conciliacion'`. Ruta `/conciliacion`, nombre visible "Centro de Conciliación".

### `conciliaciones` — una fila por derivación

```sql
create type public.estado_conciliacion_enum as enum (
  'recibido',       -- el asesor derivó; la encargada aún no lo abre
  'en_revision',    -- la encargada lo está trabajando
  'citado',         -- audiencia programada
  'acuerdo',
  'sin_acuerdo',
  'desistimiento',
  'inasistencia',
  'devuelto'        -- la encargada lo regresó al asesor
);

create table public.conciliaciones (
  id                bigint generated always as identity primary key,
  id_caso           integer not null references public.casos(id_caso) on delete cascade,
  derivado_por      uuid    not null,
  motivo_derivacion text    not null,
  estado            public.estado_conciliacion_enum not null default 'recibido',
  fecha_derivacion  timestamptz not null default now(),
  fecha_audiencia   timestamptz,
  lugar_audiencia   text,
  resultado         text,
  motivo_devolucion text,
  fecha_cierre      timestamptz,
  cerrado_por       uuid,
  updated_at        timestamptz
);

-- Un caso solo puede tener UNA conciliación abierta a la vez.
create unique index conciliaciones_caso_abierta
  on public.conciliaciones (id_caso) where fecha_cierre is null;

create index idx_conciliaciones_caso   on public.conciliaciones (id_caso);
create index idx_conciliaciones_estado on public.conciliaciones (estado, fecha_derivacion desc);
```

Índice único **parcial** en vez de `UNIQUE(id_caso)`: permite volver a derivar un caso que ya pasó
por el centro (por ejemplo tras una devolución) conservando el histórico.

### `conciliacion_solicitudes` — lo que la encargada le pide al estudiante

```sql
create table public.conciliacion_solicitudes (
  id              bigint generated always as identity primary key,
  id_conciliacion bigint  not null references public.conciliaciones(id) on delete cascade,
  -- Desnormalizado a propósito: las RLS y el panel del estudiante filtran por caso.
  id_caso         integer not null references public.casos(id_caso) on delete cascade,
  tipo            text    not null check (tipo in ('ajuste','actualizacion_hechos','documento')),
  descripcion     text    not null,
  fecha_limite    date,
  estado          text    not null default 'pendiente'
                    check (estado in ('pendiente','respondida','cancelada')),
  respuesta       text,
  respondida_por  uuid,
  respondida_en   timestamptz,
  creada_por      uuid    not null,
  created_at      timestamptz not null default now()
);

create index idx_solicitudes_caso   on public.conciliacion_solicitudes (id_caso, estado);
create index idx_solicitudes_concil on public.conciliacion_solicitudes (id_conciliacion, created_at desc);
```

### Lo que NO se crea

- **Anexos**: se reutiliza `documentos_caso` y el bucket `documentos-casos` tal cual. La encargada
  sube al mismo sitio y estudiante y asesor los ven sin cambios.
- **Bitácora**: se reutilizan `actividades_caso` y `auditoria_casos`.
- **Tabla de asignación**: no hace falta. El acceso se deriva de que el caso esté derivado.

---

## Autorización

### Extensión de `estaAsignado()`

```sql
create or replace function public.estaAsignado(uid uuid, caso_id integer)
returns boolean as $$
begin
  return exists (
    select 1 from public.estudiantes_casos where id_estudiante = uid and id_caso = caso_id
    union all
    select 1 from public.asesores_casos    where id_asesor     = uid and id_caso = caso_id
    union all
    -- El centro de conciliación es una dependencia, no una persona: cualquiera con
    -- ese rol alcanza cualquier caso que le haya sido derivado alguna vez.
    -- Sin filtro por fecha_cierre: la encargada conserva lectura de su histórico.
    -- Que la conciliación esté abierta se valida en los RPC, no aquí.
    select 1 from public.conciliaciones c
    where c.id_caso = caso_id
      and exists (
        select 1 from public.perfiles_roles pr
        where pr.user_id = uid and pr.role = 'centro_conciliacion'
      )
  );
end;
$$ language plpgsql stable security definer set search_path = '';
```

**Cuidado**: la política `permitir actualizar casos asignados propios` también usa `estaAsignado`.
Se neutraliza **no dándole `casos.update`** al rol — la política exige
`authorize('casos.update') AND estaAsignado(...)`, y la primera mitad falla.

### Política de auditoría (no la cubre `estaAsignado`)

```sql
create policy auditoria_select_conciliacion on public.auditoria_casos
  for select using (
    (auth.jwt() ->> 'user_role')::public.app_role = 'centro_conciliacion'
    and exists (select 1 from public.conciliaciones c where c.id_caso = auditoria_casos.id_caso)
  );
```

### Permisos del rol

```sql
insert into public.role_permissions (role, permission) values
  ('centro_conciliacion', 'casos.read'),
  ('centro_conciliacion', 'usuarios.read'),
  ('centro_conciliacion', 'perfiles.read'),
  ('centro_conciliacion', 'estudiantes.read'),
  ('centro_conciliacion', 'estudiantes_casos.read'),
  ('centro_conciliacion', 'asesores.read'),
  ('centro_conciliacion', 'asesores_casos.read'),
  ('centro_conciliacion', 'demandados.read');
```

**Deliberadamente sin `casos.update`.** Todo cambio de estado va por RPC `SECURITY DEFINER`, que es
el patrón ya establecido en el proyecto (`asignar_asesor_retroalimentacion`).

### GRANTs de tabla

Lección ya aprendida dos veces en este proyecto (`20260817000001`, `20260818000000`): **RLS se evalúa
después del permiso de tabla**. Las tablas nuevas necesitan explícitamente:

```sql
grant select, insert, update on public.conciliaciones           to authenticated;
grant select, insert, update on public.conciliacion_solicitudes to authenticated;
grant all on public.conciliaciones, public.conciliacion_solicitudes to service_role;
```

Sin esto, el panel falla con `permission denied for table conciliaciones` aunque las políticas RLS
estén perfectas.

---

## Notificaciones

`notificar_usuarios_caso()` necesita una cuarta rama:

```sql
-- Notificar al centro de conciliación si el caso está derivado y abierto
insert into public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
select pr.user_id, p_id_caso, p_tipo, p_titulo, p_mensaje
from public.perfiles_roles pr
where pr.role = 'centro_conciliacion'
  and pr.user_id != p_id_autor
  and exists (
    select 1 from public.conciliaciones c
    where c.id_caso = p_id_caso and c.fecha_cierre is null
  );
```

Tipos nuevos para los iconos de `CampanitaNotificaciones` y `PaginaNotificaciones`:
`derivacion_conciliacion`, `solicitud_conciliacion`, `respuesta_conciliacion`,
`cierre_conciliacion`. Ambos componentes ya tienen fallback (`FileText`), así que un tipo sin icono
no rompe nada.

`rutaDetalleCaso()` en `src/lib/roles.ts` necesita la entrada `centro_conciliacion`; sin ella
devuelve `null` y las notificaciones de la encargada no serían clickeables.

---

## RPCs (`SECURITY DEFINER`)

| Función | Quién | Valida |
|---|---|---|
| `derivar_a_conciliacion(p_id_caso, p_motivo)` | asesor asignado | caso `activo`, sin conciliación abierta |
| `actualizar_conciliacion(p_id, p_estado, p_fecha_audiencia, p_lugar)` | `centro_conciliacion` | conciliación abierta |
| `crear_solicitud_conciliacion(p_id_concil, p_tipo, p_descripcion, p_fecha_limite)` | `centro_conciliacion` | conciliación abierta |
| `responder_solicitud_conciliacion(p_id_solicitud, p_respuesta)` | estudiante asignado al caso | solicitud `pendiente` |
| `devolver_de_conciliacion(p_id, p_motivo)` | `centro_conciliacion` | conciliación abierta |
| `cerrar_conciliacion(p_id, p_estado_final, p_resultado)` | `centro_conciliacion` | estado final en `acuerdo\|sin_acuerdo\|desistimiento\|inasistencia` |

Todas escriben en `auditoria_casos` y disparan `notificar_usuarios_caso`.

`cerrar_conciliacion` **no toca `casos.estado`**: el cierre del caso sigue siendo del asesor.

---

## Frontend

### Rutas nuevas

```
src/app/conciliacion/
  components/NavBarConciliacion.tsx
  inicio/page.tsx                    # tablero: sin abrir · en revisión · audiencias próximas
  casos/page.tsx                     # listado + buscador + filtro por estado + paginación
  casos/[id_caso]/page.tsx           # detalle
  notificaciones/page.tsx            # <PaginaNotificaciones role="centro_conciliacion" />
```

El detalle reutiliza los componentes de `src/components/casos-juridicos/` (`case-info-tab`,
`ClientInfo`, `StudentInfo`, `DocumentosCaso`, `ActividadesCaso`, `observaciones-chat`) más un panel
propio de conciliación. `PaginaNotificaciones` ya es genérica por `role`.

El listado sigue el patrón de buscador + paginación que ya se aplicó en `admin/estudiantes` y
`pro-apoyo/crear-caso`.

### Cambios en pantallas existentes

- **`src/app/asesor/mis-casos/[id]/page.tsx`** — botón "Derivar a conciliación" con textarea de
  motivo, en el bloque que hoy solo muestra "Caso Aprobado" para `estado === 'activo'`. Si ya está
  derivado, ese bloque muestra el estado de la conciliación en lugar del botón.
- **`src/app/estudiante/mis-casos/[id_caso]/page.tsx`** — tarjeta "Centro de Conciliación" con el
  estado y las solicitudes pendientes (con fecha límite) y el formulario para responderlas.
- **`src/lib/roles.ts`** — `ROLE_ROUTES["/conciliacion"]`, `ROLE_HOME.centro_conciliacion`,
  `CASO_DETALLE.centro_conciliacion`.
- **`src/lib/supabase/middleware.ts`** — sin cambios: ya lee todo de `roles.ts`.
- **`src/app/admin/actions/registerUser.ts`** — cuarta función `registerCentroConciliacion`, calcada
  de la de `pro_apoyo` (solo perfil, sin tabla específica del rol).
- **`src/app/admin/`** — sección para crear y listar el usuario del centro.
- **`src/app/types/database.ts`** — tipos `Conciliacion` y `ConciliacionSolicitud`.

---

## Riesgos

1. **`supabase db diff` recrea enums.** Ya ocurrió: `20260619231334_remote_schema.sql:13` recreó
   `estado_enum` sin `'activo'` y revirtió silenciosamente `20260427000000`. El valor nuevo de
   `app_role` corre el mismo riesgo — revisar cualquier archivo generado por `db diff` antes de
   commitear.
2. **Un rol por usuario** (hallazgo 4). Bloqueante si la encargada ya tiene otro rol.
3. **Costo de la rama nueva de `estaAsignado`**: se evalúa en cada chequeo RLS sobre `casos`. Los
   índices `idx_conciliaciones_caso` y el `UNIQUE(user_id, role)` que ya existe en `perfiles_roles`
   la mantienen barata.
4. **Colisión conceptual** con `area_enum.conciliacion` (hallazgo 1). Conviene decidir aparte si ese
   valor de área debe seguir existiendo, para que nadie asuma que ambas cosas son la misma.

---

## Orden de las migraciones

`ALTER TYPE ... ADD VALUE` no permite usar el valor nuevo en la misma transacción, así que el rol va
en archivo aparte — mismo patrón que `20260820000000` / `20260820000001`.

1. `..._app_role_centro_conciliacion.sql` — `ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'centro_conciliacion';`
2. `..._conciliacion_schema.sql` — enum de estado, tablas, índices, RLS, grants, `role_permissions`
3. `..._conciliacion_autorizacion.sql` — `estaAsignado`, política de auditoría, `notificar_usuarios_caso`
4. `..._conciliacion_rpcs.sql` — los seis RPC
