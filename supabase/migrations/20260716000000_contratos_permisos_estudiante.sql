-- Agrega permisos faltantes para que el estudiante, asesor y pro_apoyo
-- puedan leer y actualizar contratos laborales existentes
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('estudiante', 'contratos_laborales.read'),
  ('estudiante', 'contratos_laborales.update'),
  ('asesor', 'contratos_laborales.read'),
  ('asesor', 'contratos_laborales.update'),
  ('pro_apoyo', 'contratos_laborales.read'),
  ('pro_apoyo', 'contratos_laborales.update');
