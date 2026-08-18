-- ============================================================================
-- Ingreso con Google para estudiantes — Agosto 2026
--
-- 1. handle_new_user() ahora entiende los metadatos que entrega Google
--    (full_name / name), que no usan la clave 'nombre_completo' que envía el
--    registro administrativo.
-- 2. A quien entre por Google con correo institucional se le asigna el rol
--    'estudiante' dentro de la misma transacción del INSERT en auth.users, de
--    modo que custom_access_token_hook ya vea el rol cuando GoTrue emite el
--    access token (sin esto el primer JWT saldría con user_role = null).
--
-- NO se crea fila en public.estudiantes: "perfil incompleto" se representa
-- justamente por la ausencia de esa fila. Crearla vacía dejaría semestre NULL
-- y rompería el listado del admin (Estudiante.semestre está tipado como number
-- y src/app/admin/estudiantes/page.tsx hace student.semestre.toString()).
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  dominio_institucional constant text := '@uniautonoma.edu.co';
  proveedor text;
begin
  insert into public.perfiles (id, nombre_completo, correo, cedula, telefono)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nombre_completo',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.email,
    new.raw_user_meta_data ->> 'cedula',
    new.raw_user_meta_data ->> 'telefono'
  );

  proveedor := new.raw_app_meta_data ->> 'provider';

  -- Alta por Google con correo institucional => estudiante.
  -- Los usuarios creados por el admin (provider 'email') reciben su rol en
  -- registerUser.ts, así que aquí se los deja intactos.
  if proveedor = 'google'
     and new.email is not null
     and lower(new.email) like '%' || dominio_institucional
  then
    insert into public.perfiles_roles (user_id, role)
    values (new.id, 'estudiante')
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;
