# Consultorio Jurídico — UAC

Sistema de gestión de casos jurídicos para un consultorio universitario. Administra el ciclo de vida completo de un caso legal: desde la recepción del solicitante hasta el cierre o archivo, con flujos de trabajo colaborativos entre estudiantes, asesores, profesionales de apoyo y administradores.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Runtime | Node.js 20+ |
| Lenguaje | TypeScript |
| UI | React 19, Tailwind CSS v4, shadcn/ui (new-york), Radix UI |
| Base de datos | PostgreSQL 17 (via Supabase) |
| Auth | Supabase Auth (JWT con custom claims) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime (Postgres CDC) |
| Gestor de paquetes | pnpm v9+ |
| Gráficos | Recharts |
| Exportación | ExcelJS |
| Formularios | React Hook Form + Zod |

## Arquitectura

El sistema opera con **cuatro roles** controlados por RBAC a nivel de middleware y base de datos:

| Rol | Prefijo de ruta | Descripción |
|---|---|---|
| `admin` | `/admin/*` | Administrador del sistema: gestiona usuarios, consulta analíticas, exporta datos |
| `pro_apoyo` | `/pro-apoyo/*` | Profesional de apoyo: crea casos, asigna equipos, reasigna, cierra/archiva |
| `asesor` | `/asesor/*` | Asesor jurídico: aprueba/solicita ajustes de entrevistas, clasifica casos, gestiona documentos |
| `estudiante` | `/estudiante/*` | Estudiante de derecho: completa la entrevista de 8 pasos, sube documentos, interactúa con el asesor |

Cada rol tiene su propio dashboard con vistas, permisos y notificaciones específicos. La autorización se aplica en tres capas:

1. **Middleware de Next.js** — redirige según el claim `user_role` del JWT
2. **Row Level Security (RLS)** — políticas de PostgreSQL por rol y tabla
3. **Custom access token hook** — función `custom_access_token_hook` que inyecta `user_role` en el JWT desde `perfiles_roles`

### Supabase Clients

| Cliente | Archivo | Uso |
|---|---|---|
| Browser | `src/lib/supabase/supabase-client.ts` | Componentes cliente, hooks de realtime |
| Server | `src/lib/supabase/supabase-server.ts` | Server Components y Server Actions |
| Admin | `src/lib/supabase/supabase-admin.ts` | API Routes, cron jobs, seed script (service role — NUNCA en el navegador) |
| Middleware | `src/lib/supabase/middleware.ts` | Validación de sesión + RBAC por ruta |

## Ciclo de Vida de un Caso

```
EN_PROCESO ──► PENDIENTE_APROBACION ──► ACTIVO ──► CERRADO ──► ARCHIVADO
                    │      ▲
                    ▼      │
               EN_CORRECCION
```

| Estado | Significado | Responsable |
|---|---|---|
| `en_proceso` | El estudiante debe completar la entrevista de 8 pasos | Estudiante |
| `pendiente_aprobacion` | Entrevista enviada, esperando revisión del asesor | Asesor |
| `en_correccion` | El asesor solicitó ajustes; el estudiante debe corregir y reenviar | Estudiante → Asesor |
| `activo` | Caso aprobado, en trámite jurídico formal. Documentos activos | Asesor / Pro-Apoyo |
| `cerrado` | El asesor certificó que el caso está completo; pendiente de archivo del pro-apoyo | Asesor |
| `archivado` | El pro-apoyo dio el visto bueno final. Caso archivado definitivamente | Pro-Apoyo |

### Transiciones clave

- **Estudiante envía entrevista** → `en_proceso` → `pendiente_aprobacion`
- **Asesor solicita ajustes** → `pendiente_aprobacion` → `en_correccion`
- **Estudiante reenvía** → `en_correccion` → `pendiente_aprobacion`
- **Asesor aprueba** → `pendiente_aprobacion` → `activo`
- **Caso con clasificación "Solo asesoría"** → se cierra directamente desde `pendiente_aprobacion`
- **Cierre formal** → `activo` → `cerrado` (requiere documentos aprobados si es "En trámite", lo ejecuta el asesor)
- **Archivo final** → `cerrado` → `archivado` (visto bueno final del pro-apoyo)

## Requisitos Previos

- **Node.js** v20+
- **pnpm** v9+ (`npm install -g pnpm`)
- **Docker** (para Supabase local)

## Configuración del Entorno

Copia el archivo de ejemplo y ajusta las variables:

```bash
cp .env.example .env
```

Variables requeridas:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de la API de Supabase (local: `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `NEXT_SUPABASE_DATABASE_URL` | Cadena de conexión directa a PostgreSQL |
| `NEXT_SUPABASE_SERVICE_ROLE_KEY` | Clave de service role (solo servidor) |
| `CRON_SECRET` | Secreto compartido para endpoints `/api/cron/*` |

## Instalación y Ejecución Local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar Supabase local (Docker)
pnpm supabase start

# 3. Ejecutar migraciones (borra datos existentes)
pnpm supabase db reset

# 4. Poblar con datos de prueba (4 usuarios, contraseña: "testuser")
npx tsx scripts/seed.ts

# 5. Iniciar servidor de desarrollo
pnpm dev
```

El servidor estará en [http://localhost:3000](http://localhost:3000).

### Usuarios de prueba

| Email | Rol |
|---|---|
| `admin@ejemplo.com` | admin |
| `proapoyo@ejemplo.com` | pro_apoyo |
| `asesor@ejemplo.com` | asesor |
| `estudiante@ejemplo.com` | estudiante |

Contraseña para todos: `testuser`

## Funcionalidades Principales

### Entrevista de 8 pasos

Formulario de entrevista con 22 campos sociodemográficos recolectados en 8 pasos tipo wizard. Incluye:

- **Identificación**: tipo de documento, fecha de expedición, ciudad de expedición, fecha de nacimiento, nacionalidad
- **Identidad y orientación**: identidad de género, orientación sexual
- **Sociodemográficos**: escolaridad, grupo étnico, barrio, zona, tenencia de vivienda, comuna, SISBEN, personas a cargo
- **Socioeconómicos**: rango salarial, servicios públicos, sabe leer, discapacidad
- **Condición actual**: enfoque diferencial y caracterización LGBTIQ+

Persistencia de borrador en `localStorage` para evitar pérdida de datos. El campo de correo electrónico del solicitante es editable durante la entrevista.

### Documentos con flujo de aprobación

- **Subida directa** a Supabase Storage (bucket `documentos-casos`)
- **Límites**: 25 MB por archivo, máximo 30 documentos por caso
- **Formatos permitidos**: PDF, Word, Excel, imágenes (JPG/PNG), ZIP
- **Flujo de aprobación**: `pendiente` → `aprobado` / `rechazado` por el asesor
- Los documentos aprobados muestran badge verde; para cerrar un caso "En trámite" todos deben estar aprobados
- Eliminación restringida a admin y pro-apoyo
- **Casos cerrados**: una vez el caso pasa a `cerrado` o `archivado`, el estudiante ya no puede cargar documentos (bloqueado en la UI y por la política RLS `doc_insert_assign`). Asesor, pro-apoyo y admin conservan la capacidad de subir
- **Recordatorio de documentos faltantes**: si un caso abierto no tiene documentos adjuntos, el estudiante ve una alerta ámbar en la tarjeta "Documentos" y un badge "Sin documentos" en su lista de casos. El asesor puede enviarle un recordatorio a la campanita con el botón "Recordar al estudiante" (RPC `recordar_documentos_caso`, máximo uno cada 24 h)

### Llamados de Atención (business-day-aware)

Alertas automáticas generadas cuando se exceden plazos:

- **Estudiante**: 3 días hábiles para completar la entrevista
- **Asesor**: 2 días hábiles para aprobar/revisar

La función `generar_llamados_atencion()` se ejecuta vía cron (`/api/cron/check-plazos`) y solo genera alertas en días hábiles (lunes a viernes), usando `sumar_dias_habiles()` para el cómputo de plazos.

### Notificaciones en tiempo real

- **Realtime**: Supabase Realtime sobre las tablas `casos`, `estudiantes_casos`, `asesores_casos`, `notificaciones_usuario`
- **Notificaciones internas**: campana en la navbar con contador de no leídas
- **Notificaciones por email**: cola `notificaciones_pendientes` con estado PENDING → PROCESSING → SENT
- **Triggers automáticos**: al asignar estudiante/asesor, al completar entrevista, al aprobar, al solicitar ajustes, al escribir observaciones

### Observaciones (chat interno)

Sección de comunicación estilo chat entre estudiante y asesor dentro de cada caso, con actualización en tiempo real.

### Auditoría

Tabla `auditoria_casos` que registra toda acción sobre un caso (creación, asignaciones, cambios de estado, aprobaciones). Visible para admin, pro-apoyo y los asignados al caso.

### Analíticas y Exportación

- **Dashboard de analíticas** (`/api/admin/analiticas`): métricas de casos por estado, área, periodo, mes, clasificación; demográficos (sexo, edad, estrato, estado civil, vivienda, situación laboral); diversidad (enfoque diverso, LGBTIQ+); carga de estudiantes y asesores; llamados de atención
- **Exportación Excel** (`/api/admin/exportar`): exporta casos, usuarios, estudiantes, asesores, llamados, demandados o contratos en formato `.xlsx` con ExcelJS

### Reasignación de equipo

Sidebar "Equipo asignado" en el detalle del caso permite reasignar estudiantes y asesores. El selector muestra nombre, carga actual de casos, día y jornada disponible.

## Estructura del Proyecto

```
consultorio-juridico/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Dashboard de administrador
│   │   ├── asesor/             # Dashboard de asesor
│   │   ├── estudiante/         # Dashboard de estudiante
│   │   ├── pro-apoyo/          # Dashboard de profesional de apoyo
│   │   ├── auth/               # Callback de autenticación
│   │   ├── centro-ayuda/       # Centro de ayuda contextual por rol
│   │   ├── api/                # API Routes
│   │   │   ├── documentos/     # GET lista, POST upload
│   │   │   ├── admin/analiticas/  # GET métricas
│   │   │   ├── admin/exportar/    # GET exportación Excel
│   │   │   ├── cron/check-plazos/ # POST generar llamados
│   │   │   ├── cron/enviar-notificaciones/ # POST enviar emails
│   │   │   ├── actividades/    # CRUD de actividades por caso
│   │   │   └── notificaciones/ # Gestión de notificaciones
│   │   └── layout.tsx          # Layout raíz
│   ├── components/
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   ├── casos-juridicos/    # Componentes específicos de casos
│   │   ├── global/             # Componentes compartidos
│   │   ├── HorariosEditor.tsx
│   │   ├── ScheduleEditor.tsx
│   │   └── SearchableSelector.tsx
│   ├── lib/
│   │   ├── supabase/           # Clientes Supabase (browser, server, admin, middleware)
│   │   ├── hooks/              # Hooks personalizados (useRealtimeCasos, useRealtimeCaso)
│   │   ├── email.ts            # Utilidades de envío de email
│   │   ├── format-date.ts      # Formateo de fechas
│   │   └── utils.ts            # cleanData(), formatArea(), sumarDiasHabiles()
│   ├── middleware.ts           # Middleware de Next.js (sesión + RBAC)
│   └── types/                  # Tipos TypeScript
├── supabase/
│   ├── migrations/             # 47 migraciones SQL
│   ├── queries/                # Consultas tipadas a la BD
│   ├── config.toml             # Configuración de Supabase local
│   └── schema.sql              # Schema completo generado
├── scripts/
│   └── seed.ts                 # Script de seeding con Snaplet
├── .env.example
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Comandos Útiles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con Turbopack |
| `pnpm build` | Build de producción |
| `pnpm start` | Iniciar servidor de producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm typecheck` | Verificar tipos con TypeScript |
| `pnpm supabase start` | Iniciar contenedores Docker de Supabase |
| `pnpm supabase stop` | Detener contenedores |
| `pnpm supabase db reset` | Borrar BD y re-aplicar migraciones |
| `pnpm supabase migration new <nombre>` | Crear nueva migración |
| `npx tsx scripts/seed.ts` | Poblar BD con datos de prueba |

## Servicios Locales

| Servicio | URL |
|---|---|
| Aplicación | http://localhost:3000 |
| Supabase Studio | http://localhost:54323 |
| Inbucket (emails) | http://localhost:54324 |
| API Supabase | http://localhost:54321 |
| PostgreSQL | localhost:54322 |

## Notas Técnicas

- **JWT**: expiración de 1 hora, refresh token rotation habilitado
- **Signups**: habilitados, confirmación de email deshabilitada en desarrollo
- **Subida de archivos**: el límite de 4.5 MB del body de Vercel serverless se evita mediante subida directa al storage de Supabase desde el cliente; la API Route solo maneja metadatos
- **Migraciones**: 47 archivos SQL en orden cronológico. No modificar migraciones ya aplicadas; siempre crear nuevas
- **Realtime**: la publicación `supabase_realtime` incluye las tablas `casos`, `estudiantes_casos`, `asesores_casos`, `notificaciones_usuario`, `auditoria_casos`, `documentos_caso`, `actividades_caso`

## Licencia

Privado — Universidad Autónoma del Caribe.
