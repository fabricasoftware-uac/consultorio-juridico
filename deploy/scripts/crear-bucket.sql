-- Crea el bucket de Storage `documentos-casos` (privado, 50 MiB).
-- Ningún migration lo crea (solo está declarado en config.toml para el CLI local),
-- por eso hay que ejecutarlo manualmente en el self-host DESPUÉS de aplicar migraciones.
--
-- Ejecutar en Studio (SQL Editor) o vía psql:
--   psql "postgresql://postgres:$POSTGRES_PASSWORD@localhost:5432/postgres" -f crear-bucket.sql

insert into storage.buckets (id, name, public, file_size_limit)
values ('documentos-casos', 'documentos-casos', false, 52428800)
on conflict (id) do nothing;
