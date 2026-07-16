-- Agrega permisos faltantes para que el estudiante
-- pueda leer y actualizar sus contratos laborales existentes
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('estudiante', 'contratos_laborales.read'),
  ('estudiante', 'contratos_laborales.update');
