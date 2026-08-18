-- ============================================================================
-- Restaura los privilegios estándar de `service_role` — Agosto 2026
--
-- En una base construida solo a partir de estas migraciones, `service_role`
-- queda con REFERENCES/TRIGGER/TRUNCATE pero SIN SELECT/INSERT/UPDATE/DELETE
-- sobre las tablas de `public`. Resultado: todo lo que pasa por
-- `supabaseAdmin` (src/lib/supabase/supabase-admin.ts) falla con
-- "permission denied":
--   - src/app/admin/actions/registerUser.ts  (alta de usuarios)
--   - src/app/actions/completarPerfilEstudiante.ts
--   - src/app/auth/callback/route.ts
--   - /api/cron/*, /api/admin/analiticas, /api/admin/exportar
--
-- En Supabase Cloud estos grants ya existen por defecto, por eso el problema
-- solo se ve en el entorno local. Esta migración es idempotente y allí no
-- cambia nada.
--
-- `service_role` es la llave de servicio: por diseño omite RLS y nunca se
-- expone al navegador. Restaurarle los privilegios es la postura estándar de
-- Supabase, no una relajación de la seguridad del proyecto: las políticas RLS
-- que gobiernan a `authenticated` y `anon` quedan intactas.
-- ============================================================================

grant usage on schema public to service_role;

grant select, insert, update, delete
  on all tables in schema public
  to service_role;

grant usage, select
  on all sequences in schema public
  to service_role;

-- Nota: no se tocan los privilegios de funciones. EXECUTE ya es público por
-- defecto en Postgres, y un `grant execute on all functions` volvería a
-- habilitar public.custom_access_token_hook, que la migración
-- 20251022022959 revocó deliberadamente.

-- Que las tablas/secuencias creadas por migraciones futuras hereden lo mismo.
alter default privileges in schema public
  grant select, insert, update, delete on tables to service_role;

alter default privileges in schema public
  grant usage, select on sequences to service_role;
