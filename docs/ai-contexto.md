# AI Context — Consultorio Jurídico

> Documento técnico completo para alimentar modelos de IA en la generación de documentación adicional, análisis de código, y comprensión del sistema.

---

## 1. Stack y Versiones

| Componente | Versión / Detalle |
|---|---|
| **Next.js** | 15.5.9 (App Router, Turbopack en dev) |
| **React** | 19.1.0 |
| **TypeScript** | ^5.9.3 |
| **Supabase JS** | ^2.76.0 |
| **Supabase SSR** | ^0.8.0 |
| **Tailwind CSS** | v4.1.15 con `@tailwindcss/postcss` |
| **shadcn/ui** | Estilo new-york, basado en Radix UI |
| **Radix UI** | 20+ paquetes (accordion, dialog, dropdown, select, tabs, etc.) |
| **react-hook-form** | ^7.65.0 |
| **zod** | ^4.1.12 |
| **Recharts** | ^2.15.4 (gráficos de analíticas) |
| **ExcelJS** | ^4.4.0 (exportación Excel) |
| **sonner** | ^2.0.7 (toast notifications) |
| **lucide-react** | ^0.545.0 (iconos) |
| **pnpm** | v9+ (gestor de paquetes con workspace) |
| **Node.js** | 20+ |
| **PostgreSQL** | 17 (via Supabase local + Docker) |
| **Supabase CLI** | ^2.51.0 |
| **Snaplet Seed** | 0.98.0 (seeding tipado) |

---

## 2. Esquema de Base de Datos

### 2.1 Diagrama de Relaciones

```
auth.users
   │
   ▼
perfiles (id UUID PK → auth.users.id)
   │
   ├──► estudiantes (id_perfil PK → perfiles.id)
   │       │
   │       ▼
   │    estudiantes_casos (id_estudiante, id_caso)
   │
   ├──► asesores (id_perfil PK → perfiles.id)
   │       │
   │       ▼
   │    asesores_casos (id_asesor, id_caso)
   │
   └──► perfiles_roles (user_id → auth.users.id, role)
           │
           ▼
        role_permissions (role, permission)

usuarios (id_usuario UUID PK)
   │
   ▼
casos (id_caso SERIAL PK → usuarios.id_usuario)
   │
   ├──► demandados (id_demandado SERIAL PK → casos.id_caso)
   ├──► documentos_caso (id BIGSERIAL PK → casos.id_caso)
   ├──► llamados_atencion (id BIGSERIAL PK → casos.id_caso)
   ├──► auditoria_casos (id BIGSERIAL PK → casos.id_caso)
   ├──► actividades_caso (id BIGSERIAL PK → casos.id_caso)
   ├──► notificaciones_pendientes (id BIGSERIAL PK → casos.id_caso)
   ├──► notificaciones_usuario (id BIGSERIAL PK → casos.id_caso)
   └──► contratos_laborales (id_contrato SERIAL PK → usuarios.id_usuario)

horarios (id BIGSERIAL PK → perfiles.id)
```

### 2.2 Tablas Principales

#### `perfiles`
Perfil base de cada usuario del sistema. Se crea automáticamente via trigger `on_auth_user_created` al registrarse en `auth.users`.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | Referencia a `auth.users.id` |
| `nombre_completo` | TEXT | Del metadata de auth |
| `correo` | TEXT | Del metadata de auth |
| `cedula` | TEXT | Del metadata de auth |
| `telefono` | TEXT | Del metadata de auth |
| `activo` | BOOLEAN | Añadido en migración 20260303000000 |

#### `estudiantes`
Extiende `perfiles` para usuarios con rol `estudiante`.

| Columna | Tipo | Notas |
|---|---|---|
| `id_perfil` | UUID PK FK | → `perfiles.id` |
| `semestre` | INTEGER | |
| `jornada` | `jornada_enum` | `diurna`, `nocturna`, `mixto` |
| `turno` | `turno_enum` | `9-11`, `2-4`, `4-6` |
| `total_casos` | INT | Carga de casos (calculado) |

#### `asesores`
Extiende `perfiles` para usuarios con rol `asesor`.

| Columna | Tipo | Notas |
|---|---|---|
| `id_perfil` | UUID PK FK | → `perfiles.id` |
| `turno` | `turno_enum` | |
| `area` | `area_enum` | Área de especialización |
| `total_casos` | INT | Carga de casos (calculado) |

#### `usuarios`
Solicitantes/clientes del consultorio (NO son usuarios del sistema).

| Columna | Tipo | Notas |
|---|---|---|
| `id_usuario` | UUID PK | |
| `nombre_completo` | VARCHAR(100) | |
| `sexo` | CHAR(1) / `sexo_enum` | |
| `cedula` | VARCHAR(45) UNIQUE | |
| `telefono` | VARCHAR(45) | |
| `correo` | VARCHAR(100) | Editable en entrevista |
| `edad` | INTEGER | |
| `estado_civil` | `estado_civil_enum` | `soltero`, `casado`, `unión libre`, `viudo`, `divorciado`, `otro` |
| `estrato` | INTEGER | |
| `direccion` | VARCHAR(100) | |
| `tipo_vivienda` | VARCHAR(50) | |
| `situacion_laboral` | `situacion_laboral_enum` | `independiente`, `dependiente`, `desempleado`, `otro` |
| `otros_ingresos` | BOOLEAN | |
| `tiene_contrato` | BOOLEAN | |
| `tiene_representado` | BOOLEAN | |
| + 22 campos sociodemográficos | | Ver sección 12 |

#### `casos`
Tabla central del sistema. Cada caso representa un proceso jurídico.

| Columna | Tipo | Notas |
|---|---|---|
| `id_caso` | SERIAL PK | |
| `id_usuario` | UUID FK | → `usuarios.id_usuario` |
| `resumen_hechos` | TEXT | |
| `observaciones` | TEXT | |
| `fecha_creacion` | DATE | DEFAULT CURRENT_DATE |
| `estado` | `estado_enum` | Ver sección 4 (state machine) |
| `fecha_cierre` | DATE | |
| `area` | `area_enum` | `no_asignada`, `laboral`, `familia`, `penal`, `civil`, `civil_familia`, `publica`, `conciliacion`, `privado`, `otros` |
| `tipo_proceso` | TEXT | |
| `clasificacion` | `clasificacion_enum` | `en_tramite`, `solo_asesoria` |
| `periodo` | TEXT | Formato `YYYY-1` o `YYYY-2` (semestres) |
| `fecha_vencimiento_estudiante` | TIMESTAMPTZ | Plazo para entrega de entrevista |
| `fecha_vencimiento_asesor` | TIMESTAMPTZ | Plazo para aprobación |

#### `estudiantes_casos` / `asesores_casos`
Relaciones many-to-many con tracking temporal. Estructura idéntica para ambas.

| Columna | Tipo |
|---|---|
| `id_estudiante` / `id_asesor` | UUID FK |
| `id_caso` | INTEGER FK |
| `fecha_asignacion` | DATE |
| `fecha_fin_asignacion` | DATE (NULL = activo) |
| PK compuesta | (`id_estudiante`, `id_caso`) |

#### `demandados`
| Columna | Tipo |
|---|---|
| `id_demandado` | SERIAL PK |
| `id_caso` | INTEGER FK |
| `nombre_completo` | VARCHAR(100) |
| `documento` | VARCHAR(45) |
| `celular` | VARCHAR(45) |
| `lugar_residencia` | VARCHAR(100) |
| `correo` | VARCHAR(100) |

#### `documentos_caso`
Metadatos de archivos. Los archivos reales están en Supabase Storage bucket `documentos-casos`.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | BIGSERIAL PK | |
| `id_caso` | INTEGER FK | |
| `id_usuario` | UUID | Usuario que subió |
| `storage_path` | TEXT UNIQUE | Ruta: `{id_caso}/{uuid}.{ext}` |
| `nombre_original` | TEXT | |
| `tipo` | TEXT | |
| `mime_type` | TEXT | |
| `tamano` | BIGINT | Bytes |
| `estado_doc` | TEXT | `pendiente`, `aprobado`, `rechazado` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `llamados_atencion`
Alertas por incumplimiento de plazos.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | BIGSERIAL PK | |
| `id_caso` | INTEGER FK | |
| `id_usuario` | UUID | Usuario notificado |
| `tipo` | TEXT | `estudiante` o `asesor` |
| `motivo` | TEXT | |
| `fecha_creacion` | TIMESTAMPTZ | |
| `leido` | BOOLEAN | |
| `resuelto` | BOOLEAN | Añadido en 20260408000000 |
| UNIQUE parcial | (`id_caso`, `tipo`) WHERE `resuelto = false` | |

#### `auditoria_casos`
Registro inmutable de acciones sobre casos.

| Columna | Tipo |
|---|---|
| `id` | BIGSERIAL PK |
| `id_caso` | INTEGER FK |
| `id_usuario` | UUID (autor) |
| `accion` | TEXT (`creacion`, `asignacion`, `entrevista`, `aprobacion`, `correccion`, `observacion`) |
| `descripcion` | TEXT |
| `metadata` | JSONB |
| `created_at` | TIMESTAMPTZ |

#### `actividades_caso`
| Columna | Tipo |
|---|---|
| `id` | BIGSERIAL PK |
| `id_caso` | INTEGER FK |
| `id_usuario` | UUID (autor) |
| `titulo` | TEXT |
| `descripcion` | TEXT DEFAULT '' |
| `created_at` | TIMESTAMPTZ |

#### `notificaciones_usuario`
Notificaciones internas en la UI (campana).

| Columna | Tipo |
|---|---|
| `id` | BIGSERIAL PK |
| `id_usuario` | UUID (destinatario) |
| `id_caso` | INTEGER FK (nullable) |
| `tipo` | TEXT |
| `titulo` | TEXT |
| `mensaje` | TEXT |
| `leida` | BOOLEAN DEFAULT FALSE |
| `created_at` | TIMESTAMPTZ |
| `read_at` | TIMESTAMPTZ |

#### `notificaciones_pendientes`
Cola de emails por enviar.

| Columna | Tipo |
|---|---|
| `id` | BIGSERIAL PK |
| `id_caso` | INTEGER FK |
| `id_usuario` | UUID |
| `tipo_notificacion` | `notification_type` (`ESTUDIANTE_ASIGNADO`, `ASESOR_ASIGNADO`) |
| `canal` | TEXT DEFAULT 'email' |
| `source` | TEXT |
| `status` | `notification_status` (`PENDING` → `PROCESSING` → `SENT` / `FAILED`) |
| `attempts` | INT DEFAULT 0 |
| `last_error` | TEXT |
| UNIQUE | (`id_caso`, `id_usuario`, `tipo_notificacion`) |

#### `horarios`
| Columna | Tipo |
|---|---|
| `id` | BIGSERIAL PK |
| `id_perfil` | UUID FK → `perfiles.id` |
| `turno` | TEXT |
| `dia` | TEXT |

#### `contratos_laborales`
| Columna | Tipo |
|---|---|
| `id_contrato` | SERIAL PK |
| `id_usuario` | UUID FK |
| `tipo_contrato` | `tipo_contrato_enum` |
| `representante_legal` | VARCHAR(100) |
| `correo_patrono` | VARCHAR(100) |
| `direccion_empresa` | VARCHAR(100) |
| `fecha_inicio` | DATE |
| `fecha_fin` | DATE |
| `continua` | BOOLEAN |
| `salario_inicial` | NUMERIC(10,2) |
| `salario_actual` | NUMERIC(10,2) |

### 2.3 Enums Clave

```sql
app_role:            'admin', 'pro_apoyo', 'estudiante', 'asesor'
estado_enum:         'en_proceso', 'pendiente_aprobacion', 'en_correccion',
                     'activo', 'cerrado', 'archivado'
area_enum:           'no_asignada', 'laboral', 'familia', 'penal', 'civil',
                     'civil_familia', 'publica', 'conciliacion', 'privado', 'otros'
clasificacion_enum:  'en_tramite', 'solo_asesoria'
estado_civil_enum:   'soltero', 'casado', 'union libre', 'viudo',
                     'divorciado', 'otro'  -- NOTE: "unión libre" with ó
situacion_laboral_enum: 'independiente', 'dependiente', 'desempleado', 'otro'
jornada_enum:        'diurna', 'nocturna', 'mixto'
turno_enum:          '9-11', '2-4', '4-6'
tipo_contrato_enum:  'escrito', 'verbal', 'prestacion_servicios', 'otro'
notification_status: 'PENDING', 'PROCESSING', 'SENT', 'FAILED'
notification_type:   'ESTUDIANTE_ASIGNADO', 'ASESOR_ASIGNADO'
app_permission:      37 valores (CRUD por tabla + casos_asignados + perfiles_roles)
```


---

## 3. Autenticación y Roles

### 3.1 Flujo de Auth

1. **Registro/Login**: Supabase Auth (`auth.users`) con email + contraseña
2. **Trigger `on_auth_user_created`**: crea automáticamente un registro en `perfiles` con datos de `raw_user_meta_data` (nombre_completo, correo, cedula, telefono)
3. **Custom Access Token Hook**: función `custom_access_token_hook(event jsonb)` que se ejecuta al generar el JWT:
   - Lee `perfiles_roles` para el `user_id`
   - Inyecta el claim `user_role` en el JWT
4. **Middleware de Next.js** (`src/middleware.ts` → `src/lib/supabase/middleware.ts`):
   - Crea `createServerClient` con cookies
   - Permite flujos de auth (PKCE con `code`, recovery con `token`, magic link con `type`)
   - Redirige no autenticados a `/`
   - Decodifica el JWT manualmente (`atob`) para leer `user_role`
   - Protege rutas por prefijo según `ROLE_ROUTES`

### 3.2 Mapa de Rutas por Rol

```
/admin/*       → admin
/asesor/*      → asesor
/estudiante/*  → estudiante
/pro-apoyo/*   → pro_apoyo
```

Rutas públicas (sin sesión requerida): `/`, `/recuperar-contrasena/*`, `/auth/*`, `/centro-ayuda/*`, `/api/cron/*`

Redirección al hacer login (desde `/`):
- `admin` → `/admin/inicio`
- `asesor` → `/asesor/inicio`
- `estudiante` → `/estudiante/inicio`
- `pro_apoyo` → `/pro-apoyo/inicio`

### 3.3 Clientes Supabase

| Cliente | Archivo | Constructor | Uso |
|---|---|---|---|
| Browser | `src/lib/supabase/supabase-client.ts` | `createBrowserClient` | Componentes `"use client"`, hooks, realtime |
| Server | `src/lib/supabase/supabase-server.ts` | `createServerClient` | Server Components, Server Actions |
| Admin | `src/lib/supabase/supabase-admin.ts` | `createClient` con `service_role` key | API Routes, cron, seed (NUNCA en cliente) |
| Middleware | `src/lib/supabase/middleware.ts` | `createServerClient` con cookies | `updateSession()` para RBAC |

### 3.4 Sistema de Permisos

Basado en dos tablas:
- **`perfiles_roles`**: asigna roles a usuarios (`user_id`, `role`)
- **`role_permissions`**: asigna permisos granulares a roles (`role`, `permission`)

La función `authorize(requested_permission)` verifica si el `user_role` del JWT tiene el permiso solicitado. Se usa en políticas RLS así:

```sql
CREATE POLICY "permitir ver todos los casos"
ON public.casos FOR SELECT
USING (public.authorize('casos.read'));
```

Permisos existentes (37 total): `{tabla}.{create|read|update|delete}` para casos, usuarios, estudiantes, asesores, contratos_laborales, estudiantes_casos, asesores_casos, demandados, perfiles, más `casos_asignados.read`, `casos_asignados.update`, `perfiles_roles.read`.

---

## 4. Máquina de Estados del Caso

### 4.1 Diagrama

```
                        ┌─────────────┐
                        │ EN_PROCESO  │ ◄── Estudiante completa entrevista
                        └──────┬──────┘
                               │ (estudiante envía)
                               ▼
                   ┌───────────────────────┐
          ┌───────►│ PENDIENTE_APROBACION  │
          │        └───────────┬───────────┘
          │                    │
          │     ┌──────────────┼──────────────┐
          │     │ (asesor      │ (asesor      │ (asesor clasifica
          │     │  solicita    │  aprueba)    │  solo_asesoria)
          │     │  ajustes)    │              │
          │     ▼              ▼              ▼
          │  ┌──────────┐  ┌────────┐    ┌─────────┐
          │  │EN_CORREC-│  │ ACTIVO │    │ CERRADO │
          │  │CION      │  └───┬────┘    └─────────┘
          │  └─────┬────┘      │
          │        │           ├──► CERRADO (proceso concluido)
          │        │           │
          │        │           └──► ARCHIVADO (inactivo, restaurable)
          │        │
          └────────┘ (estudiante reenvía correcciones)
```

### 4.2 Descripción de Estados

| Estado | Significado | Quién actúa |
|---|---|---|
| `en_proceso` | Caso creado, esperando entrevista | Estudiante completa 8 pasos |
| `pendiente_aprobacion` | Entrevista enviada, esperando revisión | Asesor revisa y decide |
| `en_correccion` | Entrevista devuelta con observaciones | Estudiante corrige y reenvía |
| `activo` | Caso aprobado, en trámite jurídico | Trabajo colaborativo con documentos |
| `cerrado` | Proceso concluido exitosamente | Solo consulta histórica |
| `archivado` | Inactivo por decisión administrativa | Restaurable por admin |

### 4.3 Reglas de Transición

| Transición | Trigger |
|---|---|
| `en_proceso` → `pendiente_aprobacion` | Estudiante completa y envía entrevista |
| `pendiente_aprobacion` → `en_correccion` | Asesor solicita ajustes con observaciones |
| `en_correccion` → `pendiente_aprobacion` | Estudiante corrige y reenvía |
| `pendiente_aprobacion` → `activo` | Asesor aprueba (clasificación `en_tramite`) |
| `pendiente_aprobacion` → `cerrado` | Asesor clasifica como `solo_asesoria` |
| `activo` → `cerrado` | Asesor/Pro-Apoyo cierra (docs aprobados si `en_tramite`) |
| `activo` → `archivado` | Admin/Pro-Apoyo archiva |

**Notas históricas:**
- El estado `aprobado` fue renombrado a `activo` (migración 20260427000000)
- El campo `aprobacion_asesor` (BOOLEAN) fue eliminado (migración 20260328000000)
- El estado `en_correccion` reemplazó el antiguo `requiere_ajustes`

---

## 5. Flujos Clave

### 5.1 Flujo Principal: Creación y Ciclo de Vida de un Caso

```
Pro-Apoyo crea caso:
  1. Registra solicitante en tabla usuarios
  2. Crea caso con estado=en_proceso, área, tipo_proceso
  3. Asigna estudiante → estudiantes_casos (con fecha_asignacion)
  4. Asigna asesor → asesores_casos (con fecha_asignacion)
  5. Triggers: notificaciones a estudiante y asesor, entrada en auditoria_casos

Estudiante completa entrevista:
  1. Accede a "Mis Casos", selecciona caso en_proceso
  2. Completa formulario de 8 pasos (22 campos sociodemográficos)
  3. Borrador guardado en localStorage (draft)
  4. Validación final con cédula del solicitante
  5. Envía: caso pasa a pendiente_aprobacion, se registra en auditoría

Asesor revisa:
  Opción A - Aprueba: caso → activo (si clasificación en_tramite)
  Opción B - Solicita ajustes: caso → en_correccion (loop)
  Opción C - Solo asesoría: caso → cerrado directamente

Caso activo: trabajo colaborativo
  - Subida de documentos con flujo aprobación
  - Observaciones (chat interno)
  - Actividades del caso
  - Llamados de atención si hay vencimientos

Cierre: asesor/pro-apoyo cierra (o archiva)
```

### 5.2 Flujo de Documentos

```
Subida directa al storage (cliente → Supabase Storage):
  1. Validación en cliente: tipo (PDF/Word/Excel/img/ZIP), tamaño (25MB)
  2. Validación en API: cantidad (max 30 por caso)
  3. Archivo subido a bucket "documentos-casos" con path {id_caso}/{uuid}.{ext}
  4. Metadatos insertados en tabla documentos_caso (estado_doc = pendiente)
  5. Notificación en tiempo real a asignados del caso

Aprobación por asesor:
  - Menú de 3 puntos (⋮) en cada documento
  - Opciones: "Aprobar" (estado_doc = aprobado) o "Rechazar" (estado_doc = rechazado)
  - Badge verde en documentos aprobados
  - Para cerrar caso "en_tramite": todos los documentos deben estar aprobados

Eliminación:
  - Solo admin y pro_apoyo pueden eliminar (política RLS doc_delete)
  - Elimina tanto el archivo del storage como el registro en documentos_caso

Límites:
  - 25 MB por archivo (límite de Supabase Storage)
  - 30 documentos por caso (validado en API)
  - La API route tiene límite adicional de 4.5 MB (Vercel serverless body limit)
    → la subida directa desde el cliente evita este límite para archivos >4.5MB
```

### 5.3 Flujo de Llamados de Atención

```
Generación (función PL/pgSQL: generar_llamados_atencion()):
  1. Invocada vía cron job: POST /api/cron/check-plazos (requiere CRON_SECRET)
  2. Solo se ejecuta en días hábiles (lunes a viernes) — verifica EXTRACT(DOW)
  3. Busca casos con fecha_vencimiento <= now() y estado activo
  4. Para estudiantes: plazo de 3 días hábiles desde asignación (estado en_proceso)
  5. Para asesores: plazo de 2 días hábiles (estado pendiente_aprobacion o en_correccion)
  6. Inserta en llamados_atencion si no existe uno no resuelto (ON CONFLICT DO NOTHING)
  7. Un solo llamado por caso+tipo mientras no esté resuelto

Cálculo de plazos:
  - Función sumar_dias_habiles(start_date, num_days): suma días saltando fines de semana
  - Función auxiliar en TypeScript: sumarDiasHabiles() en src/lib/utils.ts
  - Al crear caso, se calcula fecha_vencimiento_estudiante = ahora + 3 días hábiles
  - Al enviar entrevista, se calcula fecha_vencimiento_asesor = ahora + 2 días hábiles

Visualización:
  - Componente countdown-timer.tsx muestra cuenta regresiva
  - Sección "Llamados de atención" en el detalle del caso
  - Badge en sidebar del caso
  - Resolución: al completar acción (entrevista/aprobación), el llamado se marca resuelto
```

### 5.4 Flujo de Notificaciones

```
Notificaciones internas (UI):
  1. Triggers en DB: al asignar estudiante/asesor, al auditar eventos
     (entrevista, aprobacion, correccion, observacion)
  2. Insertan en notificaciones_usuario para cada asignado (excepto autor)
  3. Supabase Realtime notifica cambios en tiempo real
  4. Campana en navbar muestra contador de no leídas
  5. Al hacer clic, se marca como leída (campo leida, read_at)

Notificaciones por email:
  1. Triggers en DB: al insertar en estudiantes_casos / asesores_casos
  2. Insertan en notificaciones_pendientes (cola)
  3. Cron job: POST /api/cron/enviar-notificaciones
  4. Función pop_notificaciones_pendientes(limit): SELECT FOR UPDATE SKIP LOCKED
  5. Estados: PENDING → PROCESSING → SENT (o FAILED con reintentos)
```

---

## 6. Estructura de Archivos

```
consultorio-juridico/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Layout raíz (providers, tema)
│   │   ├── page.tsx                  # Landing / login público
│   │   ├── globals.css               # Estilos globales + Tailwind
│   │   ├── admin/                    # Dashboard admin
│   │   │   └── inicio/               # Vista principal con analíticas
│   │   ├── asesor/                   # Dashboard asesor
│   │   │   ├── inicio/               # Lista de casos asignados
│   │   │   └── components/           # NavBar, componentes específicos
│   │   ├── estudiante/               # Dashboard estudiante
│   │   │   ├── inicio/               # Mis casos
│   │   │   └── components/           # NavBar, entrevista
│   │   ├── pro-apoyo/                # Dashboard pro-apoyo
│   │   │   ├── inicio/               # Todos los casos
│   │   │   ├── crear-caso/           # Formulario de creación
│   │   │   └── components/           # NavBar, selector de equipo
│   │   ├── auth/                     # Callback de autenticación
│   │   ├── centro-ayuda/             # Centro de ayuda contextual
│   │   ├── cambiar-contrasena/       # Cambio de contraseña
│   │   ├── recuperar-contrasena/     # Recuperación de contraseña
│   │   ├── api/                      # API Routes
│   │   │   ├── documentos/           # GET lista, POST upload
│   │   │   │   └── [id]/             # GET/PATCH/DELETE por documento
│   │   │   ├── admin/
│   │   │   │   ├── analiticas/       # GET métricas agregadas
│   │   │   │   └── exportar/         # GET exportación Excel
│   │   │   ├── cron/
│   │   │   │   ├── check-plazos/     # POST generar llamados
│   │   │   │   └── enviar-notificaciones/ # POST enviar emails
│   │   │   ├── actividades/          # CRUD actividades por caso
│   │   │   └── notificaciones/       # GET/PATCH notificaciones
│   │   └── types/                    # Tipos TypeScript (entrevista, etc.)
│   ├── components/
│   │   ├── ui/                       # shadcn/ui (new-york): 30+ componentes
│   │   ├── casos-juridicos/          # Componentes específicos de casos
│   │   │   ├── case-detail-shell.tsx  # Shell del detalle de caso
│   │   │   ├── case-info-tab.tsx     # Pestaña de información del caso
│   │   │   ├── case-filters.tsx      # Filtros de búsqueda
│   │   │   ├── client-info.tsx       # Información del solicitante
│   │   │   ├── defendant-info.tsx    # Información del demandado
│   │   │   ├── student-info.tsx      # Info del estudiante asignado
│   │   │   ├── advisor-info.tsx      # Info del asesor asignado
│   │   │   ├── documentos-caso.tsx   # Gestión de documentos
│   │   │   ├── observaciones-chat.tsx # Chat de observaciones
│   │   │   ├── actividades-caso.tsx  # Lista de actividades
│   │   │   ├── llamados-list.tsx     # Llamados de atención
│   │   │   ├── caso-auditoria.tsx    # Historial del caso
│   │   │   ├── countdown-timer.tsx   # Cuenta regresiva de vencimiento
│   │   │   ├── botones-cerrar-archivar.tsx # Acciones de cierre
│   │   │   ├── reasignar-equipo-tabla.tsx # Reasignación de equipo
│   │   │   └── shared-ui.tsx         # Componentes UI compartidos
│   │   ├── global/                   # Componentes globales (navbar, etc.)
│   │   ├── HorariosEditor.tsx        # Editor de horarios
│   │   ├── ScheduleEditor.tsx        # Editor de horarios semanales
│   │   └── SearchableSelector.tsx    # Selector con búsqueda
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── supabase-client.ts    # Browser client
│   │   │   ├── supabase-server.ts    # Server client
│   │   │   ├── supabase-admin.ts     # Admin client (service role)
│   │   │   └── middleware.ts         # Middleware client + RBAC
│   │   ├── hooks/
│   │   │   ├── useRealtimeCasos.ts   # Hook: cambios en lista de casos
│   │   │   └── useRealtimeCaso.ts    # Hook: cambios en caso individual
│   │   ├── utils.ts                  # cleanData, formatArea, sumarDiasHabiles
│   │   ├── email.ts                  # Utilidades de envío de email
│   │   └── format-date.ts           # Formateo de fechas
│   ├── middleware.ts                 # Entry point del middleware de Next.js
│   └── types/                        # Declaraciones de tipos
├── supabase/
│   ├── migrations/                   # 47 migraciones SQL (orden cronológico)
│   ├── queries/                      # 14 consultas tipadas (.tsx)
│   ├── seeds/                        # SQL seeds (no usados actualmente)
│   ├── snippets/                     # Fragmentos SQL reutilizables
│   ├── config.toml                   # Configuración de Supabase local
│   └── schema.sql                    # Schema SQL completo generado
├── scripts/
│   └── seed.ts                       # Seed con Snaplet: 4 usuarios de prueba
├── .env.example                      # Plantilla de variables de entorno
├── package.json                      # Dependencias y scripts
├── tsconfig.json                     # Config TypeScript (baseUrl: src/)
├── components.json                   # Config shadcn/ui (aliases engañosos)
├── next.config.ts                    # Config de Next.js
├── postcss.config.mjs                # PostCSS con Tailwind v4
└── eslint.config.mjs                 # ESLint con Next.js defaults
```

### Path Aliases (desde `tsconfig.json`)

| Alias | Ruta real |
|---|---|
| `@/components/*` | `src/components/*` |
| `@/lib/*` | `src/lib/*` |
| `@/utils/*` | `src/utils/*` |
| `@/types/*` | `src/types/*` |

Nota: `components.json` define aliases diferentes; confiar en `tsconfig.json`.

---

## 7. API Routes

### 7.1 Documentos

**`GET /api/documentos?id_caso={id}`**
- Auth: Bearer token (verifica usuario vía `supabaseAdmin.auth.getUser`)
- Responde: `{ documentos: [...] }` con metadatos + `signed_url` por documento

**`POST /api/documentos`**
- Auth: Bearer token
- Body: `FormData` con `file` (File) y `id_caso` (string)
- Validaciones: tipo MIME (PDF, Word, Excel, imágenes, ZIP), tamaño (4.5 MB en API route), cantidad (max 30 por caso)
- Sube a Supabase Storage bucket `documentos-casos`, path: `{id_caso}/{uuid}.{ext}`
- Inserta metadatos en `documentos_caso`
- Nota: para archivos >4.5 MB, la subida debe hacerse directamente desde el cliente a Supabase Storage, y luego registrar metadatos

**`GET /api/documentos/[id]`** — Obtener documento individual
**`PATCH /api/documentos/[id]`** — Actualizar estado (`estado_doc`: pendiente/aprobado/rechazado)
**`DELETE /api/documentos/[id]`** — Eliminar documento y archivo del storage

### 7.2 Admin

**`GET /api/admin/analiticas?periodo={periodo}`**
- Auth: Bearer token
- Responde con métricas agregadas:
  - `totalUsuarios`, `totalCasos`
  - `casosPorEstado` (en_proceso, pendiente_aprobacion, en_correccion, activo, cerrado, archivado)
  - `casosPorArea`, `casosPorPeriodo`, `casosPorMes`, `casosPorClasificacion`
  - Demográficos: `sexo`, `edadRangos`, `estrato`, `estadoCivil`, `tipoVivienda`, `situacionLaboral`
  - Diversidad: `enfoqueDiverso`, `caracterizacionLgbtiq`
  - `totalEstudiantes`, `cargaEstudiantes`, `totalAsesores`, `cargaAsesores`
  - `totalLlamados`, `llamadosPorTipo`, `llamadosResueltos`, `llamadosPendientes`
  - `totalDemandados`, `totalContratos`, `contratosPorTipo`
  - `periodos` (lista de periodos disponibles)

**`GET /api/admin/exportar?tipo={tipo}&periodo={periodo}`**
- Auth: Bearer token + validación de rol (admin o pro_apoyo)
- `tipo`: `casos`, `usuarios`, `estudiantes`, `asesores`, `llamados`, `demandados`, `contratos`
- Genera archivo `.xlsx` con ExcelJS
- Ejemplo columnas para `usuarios`: id_usuario, nombre_completo, sexo, cedula, edad, estado_civil, estrato, direccion, telefono, correo, tipo_vivienda, situacion_laboral, enfoque_diverso, caracterizacion_lgbtiq
- Ejemplo columnas para `casos`: id_caso, nombre_solicitante, cedula, area, estado, clasificacion, fecha_creacion, fecha_cierre, periodo, resumen_hechos

### 7.3 Cron

**`POST /api/cron/check-plazos`**
- Auth: header `Authorization: Bearer {CRON_SECRET}`
- Ejecuta `generar_llamados_atencion()` (función PL/pgSQL)
- Responde: `{ generated: number, timestamp: string }`
- Ruta pública (no requiere sesión de usuario)

**`POST /api/cron/enviar-notificaciones`**
- Auth: header `Authorization: Bearer {CRON_SECRET}`
- Procesa lote de `notificaciones_pendientes` con `pop_notificaciones_pendientes(limit)`
- Envía emails y actualiza status a SENT o FAILED

### 7.4 Otros Endpoints

**`/api/actividades`** — CRUD de actividades por caso
**`/api/notificaciones`** — GET (listar no leídas), PATCH (marcar como leída)

---

## 8. Realtime

### 8.1 Configuración

Supabase Realtime está configurado sobre la publicación `supabase_realtime` (Postgres CDC). Las tablas suscritas se añadieron incrementalmente:

| Migración | Tablas añadidas |
|---|---|
| 20260325000000 | `casos`, `estudiantes_casos`, `asesores_casos` |
| 20260331000000 | `auditoria_casos` |
| 20260406000000 | `notificaciones_usuario` |
| 20260426000000 | `documentos_caso`, `actividades_caso` |

### 8.2 Hooks

**`useRealtimeCasos(onChange)`** (`src/lib/hooks/useRealtimeCasos.ts`)
- Escucha cambios (`event: "*"`) en `casos`, `estudiantes_casos`, `asesores_casos`
- Llama a `onChange()` en cada evento (refresca lista de casos)
- Usado en vistas de lista de casos

**`useRealtimeCaso(idCaso, onRefresh)`** (`src/lib/hooks/useRealtimeCaso.ts`)
- Escucha cambios filtrados por `id_caso` en `casos`, `estudiantes_casos`, `asesores_casos`
- Llama a `onRefresh()` en cada evento
- Usado en la vista de detalle de caso individual

Ambos hooks usan el browser client (`supabase` de `@/lib/supabase/supabase-client`), crean un canal con nombre único, y limpian el canal al desmontar (`supabase.removeChannel`).

---

## 9. Políticas RLS

### 9.1 `casos`

| Política | Operación | Condición |
|---|---|---|
| `permitir insertar un caso` | INSERT | `authorize('casos.create')` |
| `permitir ver todos los casos` | SELECT | `authorize('casos.read')` |
| `permitir actualizar un caso` | UPDATE | `authorize('casos.update')` |
| `permitir eliminar un caso` | DELETE | `authorize('casos.delete')` |
| `permitir ver casos asignados propios` | SELECT | `authorize('casos.read') AND estaAsignado(auth.uid(), id_caso)` |
| `permitir actualizar casos asignados propios` | UPDATE | `authorize('casos.update') AND estaAsignado(auth.uid(), id_caso)` |

### 9.2 `estudiantes_casos` / `asesores_casos`

- SELECT/INSERT/UPDATE/DELETE: `authorize('{tabla}.{operacion}')`
- SELECT propio: `AND id_estudiante = auth.uid()` (estudiantes)
- SELECT propio: `AND id_asesor = auth.uid()` (asesores)

### 9.3 `documentos_caso`

| Política | Operación | Condición |
|---|---|---|
| `doc_select` | SELECT | `estaAsignado(auth.uid(), id_caso) OR role IN ('admin','pro_apoyo')` |
| `doc_insert` | INSERT | Mismo criterio que SELECT |
| `doc_delete` | DELETE | `id_usuario = auth.uid() OR role IN ('admin','pro_apoyo')` |

### 9.4 `storage.objects` (bucket `documentos-casos`)

| Política | Operación | Condición |
|---|---|---|
| `doc_select_own` | SELECT | Bucket = `documentos-casos` AND usuario asignado al caso (extrae `id_caso` del path con `storage.foldername`) |
| `doc_select_admin` | SELECT | Bucket = `documentos-casos` AND role IN ('admin','pro_apoyo') |
| `doc_insert_auth` | INSERT | Bucket = `documentos-casos` AND `auth.role() = 'authenticated'` |
| `doc_delete_admin` | DELETE | Bucket = `documentos-casos` AND role IN ('admin','pro_apoyo') |

### 9.5 Otras Tablas

- **`perfiles`**: INSERT con `authorize('perfiles.insert')`, SELECT/UPDATE con `authorize('perfiles.{read|update}')`, UPDATE propio con `auth.uid() = id`
- **`llamados_atencion`**: admin/pro_apoyo ALL; estudiante/asesor solo SELECT propio (`id_usuario = auth.uid()`)
- **`auditoria_casos`**: admin/pro_apoyo SELECT todo; estudiante/asesor SELECT solo casos asignados; INSERT cualquier autenticado
- **`notificaciones_usuario`**: SELECT/UPDATE solo propio (`id_usuario = auth.uid()`)
- **`notificaciones_pendientes`**: RLS habilitado, sin políticas públicas (solo service role)
- **`actividades_caso`**: SELECT/INSERT mismo criterio que `documentos_caso`
- **`horarios`**: SELECT propio o admin/pro_apoyo; INSERT/DELETE solo admin/pro_apoyo
- **`contratos_laborales`**, **`demandados`**: CRUD con `authorize()`
- **`usuarios`**: CRUD con `authorize('usuarios.{create|read|update|delete}')`

### 9.6 Función auxiliar `estaAsignado`

```sql
CREATE FUNCTION public.estaAsignado(uid uuid, caso_id integer)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.estudiantes_casos
    WHERE id_estudiante = uid AND id_caso = caso_id
    UNION ALL
    SELECT 1 FROM public.asesores_casos
    WHERE id_asesor = uid AND id_caso = caso_id
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

---

## 10. Migraciones Clave

### Listado completo (47 migraciones)

| # | Archivo | Descripción |
|---|---|---|
| 1 | `20251021020314_crea_tablas.sql` | Tablas base: usuarios, perfiles, estudiantes, asesores, casos, demandados, estudiantes_casos, asesores_casos, contratos_laborales. Enums, PKs, FKs, RLS habilitado |
| 2 | `20251022022959_crea_politicas_y_hooks_autorizacion.sql` | `custom_access_token_hook`, función `authorize()`, políticas RLS para todas las tablas, función `estaAsignado()` |
| 3 | `20251022053502_modifica_funcion_handle_new_user.sql` | Ajuste del trigger `handle_new_user` |
| 4 | `20251023012756_crea_politicas_para_roles_permissions.sql` | Políticas adicionales para `role_permissions` |
| 5 | `20251025223706_ajusta_politicas.sql` | Ajustes de políticas |
| 6 | `20251025225033_permite_auth_hook_manejar_tablas_con_permisos.sql` | Grants para `supabase_auth_admin` |
| 7 | `20251026005451_grant_to_read_all_tables.sql` | Grants de lectura |
| 8 | `20251026221014_gen_rand_uuid_for_usuarios.sql` | UUID automático para `usuarios` |
| 9 | `20251026222502_alter_table_usuario_make_nullable_fields.sql` | Campos nullable en usuarios |
| 10 | `20251026222807_alter_table_casos_make_nullable_fields.sql` | Campos nullable en casos |
| 11 | `20251028032501_create_policy_to_read_casos_asignados.sql` | Política para casos asignados |
| 12 | `20260224161638_adjust_new_permissions_to_students.sql` | Ajuste permisos estudiantes |
| 13 | `20260224173602_inset_roles_and_permissions.sql` | Inserción de roles y permisos |
| 14 | `20260225031321_permission_to_see_own_data.sql` | Permiso ver datos propios |
| 15 | `20260302173659_permission_to_see_asesor_data.sql` | Permiso ver datos de asesor |
| 16 | `20260303000000_add_activo_to_perfiles.sql` | Columna `activo` en perfiles |
| 17 | `20260303000001_add_fk_perfiles_roles_to_perfiles.sql` | FK adicional |
| 18 | `20260303040742_permission_to_see_perfiles_roles_data.sql` | Permiso `perfiles_roles.read` |
| 19 | `20260320004903_updates_consultorio_juridico.sql` | Actualizaciones generales |
| 20 | `20260324104500_permissions_for_asesor_update.sql` | Permisos de actualización para asesores |
| 21 | `20260325000000_enable_realtime_casos.sql` | **ALTER PUBLICATION** para casos, estudiantes_casos, asesores_casos |
| 22 | `20260327000000_alertas_tempranas.sql` | **Llamados de atención**: columnas `fecha_vencimiento_*`, tabla `llamados_atencion`, función `generar_llamados_atencion()`, políticas RLS |
| 23 | `20260328000000_estados_simplificados.sql` | Añade `en_correccion` al enum `estado_enum`, elimina columna `aprobacion_asesor` |
| 24 | `20260329000000_auditoria_casos.sql` | **Auditoría**: tabla `auditoria_casos`, políticas (admin/pro_apoyo/estudiante/asesor según asignación) |
| 25 | `20260330000000_fk_auditoria_perfiles.sql` | FK de auditoría a perfiles |
| 26 | `20260331000000_realtime_auditoria.sql` | ALTER PUBLICATION para auditoria_casos |
| 27 | `20260401000000_fix_llamados_estados.sql` | Corrección de estados en función de llamados |
| 28 | `20260402000000_caracterizacion_usuarios.sql` | Campos de caracterización LGBTIQ+ en usuarios |
| 29 | `20260403000000_area_no_asignada.sql` | Añade `no_asignada` al enum `area_enum` |
| 30 | `20260404000000_notificaciones_asignacion.sql` | **Cola de emails**: tabla `notificaciones_pendientes`, función `enqueue_assignment_notification`, triggers, `pop_notificaciones_pendientes` |
| 31 | `20260405000000_notificaciones_usuario.sql` | **Notificaciones UI**: tabla `notificaciones_usuario`, función `notificar_usuarios_caso`, triggers sobre auditoria_casos, estudiantes_casos, asesores_casos |
| 32 | `20260406000000_realtime_notificaciones.sql` | ALTER PUBLICATION para notificaciones_usuario |
| 33 | `20260408000000_resolucion_llamados.sql` | Columna `resuelto` en llamados_atencion, UNIQUE parcial |
| 34 | `20260409000000_documentos_caso.sql` | **Documentos**: tabla `documentos_caso`, políticas RLS |
| 35 | `20260409000001_storage_policies.sql` | Políticas para `storage.objects` en bucket `documentos-casos` |
| 36 | `20260410000000_documentos_permisos.sql` | Permisos adicionales para documentos |
| 37 | `20260411000000_fix_llamados_unique.sql` | Corrección de constraint UNIQUE en llamados |
| 38 | `20260412000000_periodo_casos.sql` | Columna `periodo` en casos, backfill por semestre |
| 39 | `20260413000000_auditoria_asignaciones.sql` | Auditoría de asignaciones |
| 40 | `20260423000000_formulario_unificado.sql` | **Formulario unificado**: tabla `horarios`, tabla `actividades_caso`, columna `estado_doc`, 22 campos sociodemográficos en `usuarios`, nuevos valores de enum |
| 41 | `20260424000000_notificar_documentos.sql` | Triggers de notificación para documentos |
| 42 | `20260425000000_notificar_actividades.sql` | Triggers de notificación para actividades |
| 43 | `20260426000000_realtime_docs_actividades.sql` | ALTER PUBLICATION para documentos_caso y actividades_caso |
| 44 | `20260427000000_aprobado_a_activo.sql` | Añade `activo` al enum `estado_enum` |
| 45 | `20260427000001_migrar_activo.sql` | Migra casos `aprobado` → `activo` |
| 46 | `20260619231334_remote_schema.sql` | Schema remoto |
| 47 | `20260711000000_dias_habiles.sql` | **Días hábiles**: función `sumar_dias_habiles()`, reescritura de `generar_llamados_atencion()` con control de días hábiles y fines de semana |

### Descripciones detalladas de migraciones clave

#### 20260327000000 — Alertas Tempranas
- Añade `fecha_vencimiento_estudiante` y `fecha_vencimiento_asesor` a `casos`
- Crea tabla `llamados_atencion` con constraint UNIQUE por caso+tipo
- Función `generar_llamados_atencion()`: busca casos vencidos sin llamado existente, inserta por cada estudiante/asesor vencido

#### 20260409000000 / 20260409000001 — Documentos
- Crea `documentos_caso` con metadatos (storage_path, nombre_original, tipo, mime_type, tamano)
- Políticas RLS: lectura/inserción para asignados + admin/pro_apoyo, eliminación solo autor o admin/pro_apoyo
- Storage policies: SELECT para asignados + admin, INSERT para cualquier autenticado, DELETE solo admin/pro_apoyo
- El `storage.foldername(name)` extrae el `id_caso` de la ruta `{id_caso}/{uuid}.{ext}`

#### 20260423000000 — Formulario Unificado
- Crea `horarios` (día + turno por perfil) y migra datos de estudiantes/asesores
- Crea `actividades_caso` (título + descripción por caso)
- Añade `estado_doc` a `documentos_caso` (pendiente/aprobado/rechazado)
- 22 campos sociodemográficos en `usuarios` (ver sección 12)
- Nuevos valores de enum: `viudo`, `divorciado` en estado_civil; `OTRO` en sexo; `conciliacion`, `privado` en area

#### 20260427000000 — Aprobado a Activo
- Añade valor `activo` al enum `estado_enum` (reemplaza `aprobado` semánticamente)
- El valor `aprobado` se mantiene en el enum por compatibilidad, pero el sistema usa `activo`
- Migración 20260427000001 convierte casos existentes de `aprobado` a `activo`

#### 20260711000000 — Días Hábiles
- Función `sumar_dias_habiles(start_date, num_days)`: suma días saltando sábados y domingos
- Reescritura completa de `generar_llamados_atencion()`:
  - Solo ejecuta chequeos de lunes a viernes (`EXTRACT(DOW) NOT IN (0,6)`)
  - Filtra por estado correcto (`en_proceso` para estudiantes, `pendiente_aprobacion`/`en_correccion` para asesores)
  - Filtra por `fecha_fin_asignacion IS NULL` (asignación activa)
  - Usa `ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING`
  - Retorna 1 si se ejecutó (independientemente de inserciones)

---

## 11. Límites Conocidos

| Límite | Valor | Dónde se aplica |
|---|---|---|
| Tamaño máximo de archivo (Supabase Storage) | 25 MB | Subida directa al bucket |
| Tamaño máximo de archivo (API Route) | 4.5 MB | `POST /api/documentos` (body de Vercel serverless) |
| Documentos por caso | 30 | Validación en API route |
| Formatos de archivo permitidos | PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, ZIP | Validación por MIME type |
| Tiempo de expiración JWT | 1 hora | Configuración de Supabase Auth |
| Filas máximas en API de Supabase | 1000 | `config.toml` (`max_rows = 1000`) |
| Conexiones máximas de pooler | 100 | `config.toml` (`max_client_conn = 100`) |
| Notificaciones por lote (cron) | 10 (default) | Parámetro `p_limit` en `pop_notificaciones_pendientes` |

**Estrategia para archivos grandes**: la subida directa desde el cliente a Supabase Storage evita el límite de 4.5 MB de Vercel. El cliente usa el bucket client de Supabase para upload, y luego registra los metadatos vía API.

---

## 12. Formulario de Entrevista

### 12.1 Campos Sociodemográficos (22 campos)

El formulario de entrevista recolecta los siguientes campos en la tabla `usuarios`. Fueron añadidos en la migración 20260423000000.

#### Identificación (5 campos)
| Campo | Tipo |
|---|---|
| `tipo_documento` | TEXT (default: 'CC') |
| `fecha_expedicion_doc` | DATE |
| `ciudad_expedicion` | TEXT |
| `fecha_nacimiento` | DATE |
| `nacionalidad` | TEXT |

#### Identidad y Orientación (2 campos)
| Campo | Tipo |
|---|---|
| `identidad_genero` | TEXT |
| `orientacion_sexual` | TEXT |

#### Sociodemográficos (9 campos)
| Campo | Tipo |
|---|---|
| `escolaridad` | TEXT |
| `grupo_etnico` | TEXT |
| `barrio` | TEXT |
| `zona` | TEXT |
| `tenencia_vivienda` | TEXT |
| `comuna` | TEXT |
| `tiene_sisben` | BOOLEAN |
| `personas_cargo` | INT |
| `enfoque_diverso` | BOOLEAN |

#### Socioeconómicos (4 campos)
| Campo | Tipo |
|---|---|
| `rango_salarial` | TEXT |
| `servicios_publicos` | TEXT |
| `sabe_leer` | BOOLEAN |
| `discapacidad` | TEXT |

#### Condición Actual (2 campos)
| Campo | Tipo |
|---|---|
| `condicion_actual` | TEXT |
| `caracterizacion_lgbtiq` | TEXT |

### 12.2 Estructura del Wizard (8 pasos)

El formulario está dividido en 8 pasos tipo wizard. El progreso se persiste en `localStorage` como borrador (draft) para evitar pérdida de datos al recargar o cerrar el navegador.

Al finalizar, el estudiante debe confirmar con la cédula del solicitante antes de enviar. El campo `correo` del solicitante es editable durante la entrevista (los demás campos personales vienen del registro inicial).

### 12.3 Tipos TypeScript

Los tipos para el formulario de entrevista se definen en `src/app/types/`. Incluyen interfaces para cada paso y para el formulario completo.

---

## 13. Funciones PL/pgSQL Clave

### `custom_access_token_hook(event jsonb) → jsonb`
- Hook de Supabase Auth ejecutado al generar JWT
- Lee `perfiles_roles` para el `user_id`
- Inyecta claim `user_role` en el JWT
- Permisos: solo `supabase_auth_admin`

### `authorize(requested_permission app_permission) → boolean`
- Verifica si el `user_role` del JWT tiene el permiso solicitado
- Usa `role_permissions` para la validación
- `SECURITY DEFINER`, usada en políticas RLS

### `estaAsignado(uid uuid, caso_id integer) → boolean`
- Verifica si un usuario (por UUID) está asignado a un caso
- Busca en `estudiantes_casos` y `asesores_casos`
- Usada en políticas RLS para acceso granular

### `handle_new_user() → trigger`
- Trigger AFTER INSERT en `auth.users`
- Crea registro en `perfiles` con datos de `raw_user_meta_data`

### `generar_llamados_atencion() → integer`
- Busca casos con fechas de vencimiento cumplidas
- Inserta en `llamados_atencion` si no existe uno no resuelto
- Solo ejecuta en días hábiles
- `SECURITY DEFINER`

### `sumar_dias_habiles(start_date timestamptz, num_days integer) → timestamptz`
- Suma `num_days` días hábiles a una fecha
- Salta sábados y domingos
- `IMMUTABLE`

### `notificar_usuarios_caso(p_id_caso, p_id_autor, p_tipo, p_titulo, p_mensaje) → void`
- Notifica a todos los asignados de un caso (excepto el autor)
- Inserta en `notificaciones_usuario`
- `SECURITY DEFINER`

### `enqueue_assignment_notification(p_id_caso, p_id_usuario, p_tipo, p_source) → void`
- Encola notificación por email en `notificaciones_pendientes`
- `ON CONFLICT DO NOTHING` para evitar duplicados

### `pop_notificaciones_pendientes(p_limit int) → table(...)`
- Toma un lote de notificaciones PENDING con bloqueo
- `SELECT FOR UPDATE SKIP LOCKED`
- Las marca como PROCESSING

### `trg_auditoria_notificar() → trigger`
- Trigger AFTER INSERT en `auditoria_casos`
- Para acciones `entrevista`, `aprobacion`, `correccion`, `observacion`
- Llama a `notificar_usuarios_caso()` con título y mensaje descriptivo

---

## 14. Patrones y Convenciones

### Nomenclatura
- **Tablas**: `snake_case` en plural (ej: `estudiantes_casos`)
- **Columnas**: `snake_case` (ej: `fecha_vencimiento_estudiante`)
- **Enums**: `{nombre}_enum` en singular (ej: `estado_enum`)
- **Funciones**: `snake_case` o `camelCase` según contexto
- **Archivos TypeScript**: `kebab-case.tsx` (ej: `case-detail-shell.tsx`)
- **Rutas**: agrupadas por rol (`/estudiante/inicio`, `/admin/inicio`)

### Utilidades
- **`cleanData(data)`**: convierte strings vacíos a `null` antes de insertar en BD
- **`formatArea(area)`**: convierte valores de enum a labels legibles
- **`sumarDiasHabiles(fecha, dias)`**: versión TypeScript de la función SQL

### Flujo de datos
- Consultas a BD vía `supabase/queries/*.tsx` (funciones tipadas que importan el browser client)
- Mutaciones en componentes cliente usan el browser client directamente
- API Routes usan exclusivamente `supabaseAdmin` (service role)
- Server Components usan `supabaseServer`

### Manejo de sesión
- El middleware de Next.js es el único punto de validación de sesión + RBAC
- Las API Routes validan token manualmente (no dependen del middleware por el matcher que excluye `/api/*`)
- Los componentes cliente obtienen la sesión vía `supabase.auth.getSession()`
- El rol se extrae del JWT decodificando el payload (`atob(token.split('.')[1])`)
