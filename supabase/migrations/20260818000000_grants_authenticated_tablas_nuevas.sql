-- ============================================================================
-- Restaura los privilegios de `authenticated` en las tablas nuevas — Ago 2026
--
-- La migración 20251026005451 hizo:
--     grant select on all tables in schema public to authenticated;
-- pero `on all tables` solo afecta a las tablas que YA existían. Las creadas
-- después quedaron sin ningún GRANT para `authenticated`:
--     horarios, actividades_caso, auditoria_casos, documentos_caso,
--     llamados_atencion, notificaciones_pendientes, notificaciones_usuario
--
-- Tienen políticas RLS correctas, pero RLS se evalúa DESPUÉS del permiso de
-- tabla: sin GRANT, la consulta muere con "permission denied for table X"
-- antes de siquiera mirar la política.
--
-- Síntoma concreto: getEstudiantes() no podía leer `horarios`, así que el
-- selector de estudiantes del pro-apoyo salía vacío y el detalle del
-- estudiante no mostraba turnos.
--
-- En Supabase Cloud estos grants existen por defecto, por eso solo se veía en
-- local. La migración es idempotente y allá no cambia nada.
--
-- `perfiles_roles` se deja aparte a propósito: la migración 20251022022959 le
-- revocó todo a `authenticated` salvo SELECT, para que nadie pueda asignarse
-- roles desde el navegador. Eso se conserva.
-- ============================================================================

grant select, insert, update, delete
  on all tables in schema public
  to authenticated;

grant usage, select
  on all sequences in schema public
  to authenticated;

-- Restaura la restricción deliberada sobre perfiles_roles (solo lectura).
revoke insert, update, delete
  on table public.perfiles_roles
  from authenticated;

-- Que las tablas y secuencias futuras hereden los permisos y no se repita
-- este hueco con la próxima tabla que se cree.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
  grant usage, select on sequences to authenticated;
