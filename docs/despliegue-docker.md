# Despliegue con Docker — Frontend + Supabase self-hosted

Guía para desplegar el Consultorio Jurídico en un servidor propio: el **frontend
Next.js** en un contenedor y el **stack completo de Supabase** (Postgres, Auth,
Storage, Realtime, PostgREST, Kong, Studio) auto-hospedado con Docker, con TLS
mediante **Caddy**. Los cron se disparan desde **cron-job.org**.

> **Alcance:** esta guía asume que el servidor ya tiene **Docker + Docker Compose**
> instalados y que tienes acceso al DNS del dominio (en **Cloudflare**). No cubre la
> instalación del sistema operativo, firewall ni Docker.

> **Dominio actual (temporal):** `consultorio.emprendelab-web.com`. Cuando la
> universidad asigne el dominio definitivo, sigue la sección **12. Cambiar de dominio**.

---

## 1. Arquitectura

```
Internet ──(80/443)──► Caddy (auto-TLS)
                          ├── consultorio.emprendelab-web.com        ─► web (Next.js :3000)
                          ├── api.consultorio.emprendelab-web.com     ─► kong (:8000)  [Supabase]
                          └── studio.consultorio.emprendelab-web.com  ─► studio (:3000, basic auth)

Stack Supabase: db(17) · auth · rest · realtime · storage · imgproxy · kong · meta · studio

cron-job.org ──► POST /api/cron/* (con Authorization: Bearer <CRON_SECRET>)
```

- El **navegador** habla directo con `api.consultorio.emprendelab-web.com` (Kong)
  para auth, realtime y subida directa a Storage → por eso Kong debe ser público con TLS.
- **Postgres nunca se expone públicamente**; solo es accesible dentro de la red Docker.
- **Studio** se protege con basic auth en Caddy (idealmente además restringido por IP/VPN).

### Archivos de este repo

| Archivo | Rol |
|---|---|
| `Dockerfile` | Build del frontend (salida standalone). |
| `.dockerignore` | Excluye artefactos y secretos del contexto de build. |
| `.env.production.example` | Plantilla de env del frontend → copiar a `deploy/.env`. |
| `deploy/docker-compose.yml` | Servicios app: `web`, `caddy`. |
| `deploy/Caddyfile` | Reverse proxy + TLS. |
| `deploy/supabase/docker-compose.override.yml` | Customizaciones del stack Supabase oficial. |
| `deploy/supabase/.env.example` | Plantilla de env del stack Supabase. |
| `deploy/scripts/crear-bucket.sql` | Crea el bucket `documentos-casos`. |
| `deploy/scripts/migrar-storage.ts` | Copia archivos de Storage Cloud → self-host. |

---

## 2. Requisitos previos

- Servidor Linux con **Docker Engine + Compose v2** y **≥ 4 GB de RAM** (el stack
  completo de Supabase consume memoria).
- **Cloudflare** con 3 registros **`A` en modo DNS-only (nube gris, sin proxy)**
  apuntando a la IP pública del servidor:
  - `consultorio.emprendelab-web.com`
  - `api.consultorio.emprendelab-web.com`
  - `studio.consultorio.emprendelab-web.com`
  > ⚠️ **Deben ser DNS-only (gris).** Con el proxy de Cloudflare (naranja) se rompe
  > el reto TLS HTTP-01 de Caddy y el certificado universal de Cloudflare no cubre
  > subdominios de 4º nivel (`api.consultorio…`). En gris, Caddy emite los
  > certificados directamente vía Let's Encrypt (requiere puertos **80 y 443** abiertos).
- Cuenta de **Resend** con dominio de envío verificado (ya la tienes; la API key va
  en el `.env`). También se usa su SMTP para los correos de recuperación de contraseña.
- **Supabase CLI** (ver sección 3) para aplicar migraciones.
- El repositorio clonado en el servidor (o en tu máquina, para las migraciones).
- Cuenta en **cron-job.org** (ya la tienes) para los cron jobs.

---

## 3. Instalar la Supabase CLI (guía rápida)

Se usa para aplicar las migraciones con `supabase db push`. Elige una opción:

```bash
# Opción A — Homebrew (macOS / Linux)
brew install supabase/tap/supabase

# Opción B — Vía el repo (ya es devDependency del proyecto)
pnpm install
pnpm supabase --version        # o: pnpm exec supabase <cmd>

# Opción C — Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Opción D — Binario directo
# Descarga el paquete de tu SO desde https://github.com/supabase/cli/releases
```

> ⚠️ **`npm install -g supabase` NO está soportado** por el proyecto de Supabase.
> Usa una de las opciones de arriba. Si usas la Opción B, antepón `pnpm` a los
> comandos `supabase` de esta guía (`pnpm supabase db push …`).

---

## 4. Generar secretos

| Secreto | Cómo generarlo |
|---|---|
| `POSTGRES_PASSWORD` | `openssl rand -base64 24` |
| `JWT_SECRET` | `openssl rand -base64 48` (≥ 40 chars) |
| `ANON_KEY` / `SERVICE_ROLE_KEY` | JWT firmados con `JWT_SECRET` (ver abajo) |
| `CRON_SECRET` | `openssl rand -hex 32` |
| `DASHBOARD_PASSWORD` | contraseña fuerte para Studio |
| `STUDIO_PASSWORD_HASH` | `docker run --rm caddy:2-alpine caddy hash-password --plaintext 'TU_CLAVE'` |

**ANON_KEY y SERVICE_ROLE_KEY** son JWT con los claims `role: anon` y
`role: service_role` firmados con tu `JWT_SECRET`. Genéralos con el generador de
llaves de la documentación de self-hosting de Supabase (*Self-Hosting → Generate
API Keys*). **Deben ser coherentes** con lo que usa el frontend:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `ANON_KEY`
- `NEXT_SUPABASE_SERVICE_ROLE_KEY` = `SERVICE_ROLE_KEY`

---

## 5. Levantar el stack de Supabase

1. Clona el stack oficial dentro de `deploy/supabase/` (junto al override de este repo):

   ```bash
   cd deploy/supabase
   curl -fsSLO https://raw.githubusercontent.com/supabase/supabase/master/docker/docker-compose.yml
   curl -fsSLO https://raw.githubusercontent.com/supabase/supabase/master/docker/.env.example
   # (o clona el repo y copia la carpeta docker/)
   ```

2. Crea `deploy/supabase/.env` a partir del `.env` oficial y de la plantilla de este
   repo; completa **todas** las claves de la sección 4 y las URLs públicas:

   ```bash
   cp .env.example .env   # la plantilla de este repo lista lo mínimo a ajustar
   # edita .env: JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY, POSTGRES_PASSWORD,
   # SITE_URL, API_EXTERNAL_URL, SUPABASE_PUBLIC_URL, ADDITIONAL_REDIRECT_URLS,
   # SMTP_*, FILE_SIZE_LIMIT, DASHBOARD_*
   ```

3. Levanta el stack con el nombre de proyecto **`supabase`** (crea la red
   `supabase_default` que reutiliza la app), aplicando el override:

   ```bash
   docker compose -f docker-compose.yml -f docker-compose.override.yml -p supabase up -d
   docker compose -p supabase ps      # todos healthy
   ```

   El override activa lo crítico: **el auth hook** (`custom_access_token_hook`), el
   límite de Storage (50 MiB) y Postgres 17. Verifica el último tag `17.x` de
   `supabase/postgres` y ajústalo en el override si hace falta.

---

## 6. Aplicar migraciones

Desde una máquina con el repo y la Supabase CLI, apuntando a la BD del self-host:

```bash
supabase db push --db-url "postgresql://postgres:$POSTGRES_PASSWORD@<host>:5432/postgres"
```

> El puerto de Postgres no está expuesto públicamente. Ejecútalo **en el servidor**
> (host = `localhost` si publicas el puerto de `db` solo a loopback) o mediante un
> túnel SSH: `ssh -L 5432:localhost:5432 usuario@servidor`.

Esto crea el esquema `public`, las funciones (`custom_access_token_hook`,
`authorize`, `estaAsignado`, `generar_llamados_atencion`, …), las políticas RLS y
añade tablas a la publicación `supabase_realtime`.

---

## 7. Crear el bucket de Storage

Ningún migration crea el bucket. Ejecútalo manualmente:

```bash
psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres" \
  -f deploy/scripts/crear-bucket.sql
```

(o pega su contenido en Studio → SQL Editor.)

---

## 8. Migrar datos desde Supabase Cloud

> Punto de mayor riesgo. Hazlo en **ventana de mantenimiento** y, si puedes, deja el
> proyecto Cloud en solo-lectura durante la copia.

### 8.1 Datos de `public` + `auth`

Con las migraciones ya aplicadas (esquema idéntico), copia **solo datos**:

```bash
# Desde Cloud (usa la connection string del proyecto Cloud):
pg_dump "$CLOUD_DB_URL" --data-only --no-owner \
  --schema=public --schema=auth \
  --exclude-table-data='auth.schema_migrations' \
  -f datos.sql

# Restaurar en el self-host:
psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres" -f datos.sql
```

- Se incluyen `auth.users` y `auth.identities`: los hashes bcrypt de contraseñas se
  preservan, así los usuarios **conservan su login**.
- **Verifica la compatibilidad de versión de GoTrue.** Si el esquema `auth` difiere,
  restaura solo las columnas comunes de `auth.users`/`auth.identities` y prueba el
  login antes de continuar.
- Si aparecen conflictos por triggers (p. ej. `handle_new_user`) al restaurar,
  restaura primero `auth` y luego `public`, o desactiva temporalmente el trigger.

### 8.2 Objetos de Storage

Copia los archivos del bucket con el script incluido:

```bash
SRC_SUPABASE_URL=https://<ref>.supabase.co \
SRC_SERVICE_ROLE_KEY=<service_role Cloud> \
DST_SUPABASE_URL=https://api.consultorio.emprendelab-web.com \
DST_SERVICE_ROLE_KEY=<service_role self-host> \
npx tsx deploy/scripts/migrar-storage.ts
```

Verifica conteos finales (`casos`, `usuarios`, `documentos_caso`, `perfiles_roles`)
y que los documentos abran con signed URL en el self-host.

---

## 9. Construir y desplegar el frontend + Caddy

1. Crea `deploy/.env` a partir de la plantilla (ya trae el dominio actual):

   ```bash
   cp .env.production.example deploy/.env
   # Completa las claves vacías: NEXT_PUBLIC_SUPABASE_ANON_KEY,
   # NEXT_SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET, RESEND_API_KEY,
   # STUDIO_PASSWORD_HASH. Los dominios ya vienen configurados.
   ```

2. Construye y levanta (el stack Supabase debe estar arriba, sección 5):

   ```bash
   cd deploy
   docker compose --env-file .env up -d --build
   docker compose ps
   ```

   Caddy pedirá los certificados TLS automáticamente (requiere DNS ya propagado en
   gris y puertos 80/443 abiertos).

> **Recordatorio:** las `NEXT_PUBLIC_*` se hornean en el build. Si cambias de
> dominio o de `ANON_KEY`, hay que **reconstruir** la imagen (`up -d --build`), no
> basta reiniciar.

---

## 10. Configurar los cron en cron-job.org

Crea **2 jobs** en cron-job.org (ambos **POST**, tratando el código 200 como éxito):

| Job | URL | Frecuencia | Header (Advanced → Headers) |
|---|---|---|---|
| Drenar cola de emails (respaldo) | `https://consultorio.emprendelab-web.com/api/cron/enviar-notificaciones` | cada 5 min | `Authorization: Bearer <CRON_SECRET>` |
| Generar llamados de atención | `https://consultorio.emprendelab-web.com/api/cron/check-plazos` | 1×/día hábil (p. ej. 07:00 L–V) | `Authorization: Bearer <CRON_SECRET>` |

Notas:
- `<CRON_SECRET>` es el mismo valor de `deploy/.env`.
- `enviar-notificaciones` también se dispara desde el frontend al asignar un caso;
  el job de cron-job.org es respaldo y maneja reintentos de la cola.
- `check-plazos` ya filtra fines de semana internamente (puedes dejarlo diario).
- Ambos endpoints responden en < 30 s (dentro del timeout de cron-job.org).
- Sin el header correcto, los endpoints devuelven **401**.

---

## 11. (Opcional) Seed de usuarios de prueba

Solo para entornos no productivos:

```bash
# Requiere .env con NEXT_PUBLIC_SUPABASE_URL y NEXT_SUPABASE_SERVICE_ROLE_KEY del self-host
npx tsx scripts/seed.ts
psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres" -f supabase/seeds/seed.sql
```

---

## 12. Cambiar de dominio (cuando la universidad asigne el suyo)

1. **Cloudflare (o el DNS que corresponda):** crea los 3 registros `A` del nuevo
   dominio en **DNS-only (gris)** apuntando a la IP del servidor.
2. **`deploy/.env`:** actualiza `APP_DOMAIN`, `API_DOMAIN`, `STUDIO_DOMAIN`,
   `NEXT_PUBLIC_SUPABASE_URL` (= `https://api.<nuevo>`), `NEXT_PUBLIC_SITE_URL`.
3. **`deploy/supabase/.env`:** actualiza `SITE_URL`, `API_EXTERNAL_URL`,
   `SUPABASE_PUBLIC_URL`, `ADDITIONAL_REDIRECT_URLS`. Aplica:
   `docker compose -p supabase up -d`.
4. **cron-job.org:** cambia la URL base de los 2 jobs.
5. **Reconstruye el frontend** (obligatorio por las `NEXT_PUBLIC_*`):
   `cd deploy && docker compose up -d --build`. Caddy pedirá certificados nuevos.

---

## 13. Verificación end-to-end

- [ ] `docker compose ps` (ambos proyectos): todos los contenedores healthy.
- [ ] `https://consultorio.emprendelab-web.com` carga el login.
- [ ] **Auth + hook:** inicia sesión y confirma que el JWT trae el claim
      `user_role` (decodifica el token) y que el rol ve sus casos. *Si la lista sale
      vacía o da 403, el auth hook no está activo.*
- [ ] **Realtime:** abre el detalle de un caso en dos sesiones y confirma
      actualización en vivo (WebSocket a `api.consultorio.emprendelab-web.com`).
- [ ] **Storage:** sube un documento > 5 MB desde el navegador y ábrelo.
- [ ] **Cron:** `curl -X POST https://consultorio.emprendelab-web.com/api/cron/check-plazos`
      sin header → 401; con `Authorization: Bearer $CRON_SECRET` → 200.
- [ ] **Email (Resend):** asigna un caso y confirma el envío en el dashboard de Resend.
- [ ] **Recuperación de contraseña:** solicita reset y confirma que llega el correo
      (valida el SMTP de GoTrue).

---

## 14. Operación

- **Backups (desde el día 1):**
  - Postgres: `pg_dump` programado (cron del host o contenedor).
  - Storage: copia del volumen de datos del servicio `storage`.
- **Actualizar el frontend:** `git pull && cd deploy && docker compose up -d --build`
  (necesario reconstruir por las `NEXT_PUBLIC_*`).
- **Actualizar Supabase:** subir tags de imagen con cuidado; probar antes.
- **Logs:** `docker compose -p supabase logs -f auth` (o el servicio que sea),
  `docker compose logs -f web caddy`.
- **Secretos:** solo en archivos `.env` fuera de git; rotarlos periódicamente
  (rotar `JWT_SECRET` invalida sesiones y exige regenerar ANON/SERVICE keys y
  reconstruir el frontend).

---

## 15. Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| Login OK pero no ves casos / 403 en todo | El auth hook no inyecta `user_role` | Verifica `GOTRUE_HOOK_CUSTOM_ACCESS_TOKEN_ENABLED/URI` en el servicio `auth` y que la función `custom_access_token_hook` exista con grant a `supabase_auth_admin`. |
| Caddy no obtiene certificado TLS | Cloudflare en naranja (proxy) | Pon los registros en **DNS-only (gris)**; abre 80/443. |
| Realtime no conecta | WebSocket / URL errónea | Confirma `NEXT_PUBLIC_SUPABASE_URL=https://api.consultorio.emprendelab-web.com` y que Caddy proxea `kong`. |
| Subida de archivos grandes falla | Límite de body en Kong o Storage | Revisa `FILE_SIZE_LIMIT` (Storage) y el `client_max_body_size` de Kong. |
| Emails de asignación no llegan | Resend mal configurado | Revisa `RESEND_API_KEY`, `NOTIFICATIONS_FROM_EMAIL` (dominio verificado) y el job de `enviar-notificaciones`. |
| Email de recuperación no llega | SMTP de GoTrue ausente | Configura `SMTP_*` en el `.env` de Supabase (Resend SMTP u otro). |
| Cron da 401 | Header ausente/erróneo | En cron-job.org, añade `Authorization: Bearer <CRON_SECRET>` con el valor de `deploy/.env`. |
| El frontend usa el dominio viejo | `NEXT_PUBLIC_*` horneadas | Reconstruye la imagen (`up -d --build`). |
| La app no reutiliza la red | Nombre de proyecto distinto | Levanta Supabase con `-p supabase` (red `supabase_default`). |
