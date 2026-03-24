INSERT INTO public.role_permissions (role, permission)
VALUES
('asesor', 'usuarios.update'),
('asesor', 'demandados.update')
ON CONFLICT DO NOTHING;
