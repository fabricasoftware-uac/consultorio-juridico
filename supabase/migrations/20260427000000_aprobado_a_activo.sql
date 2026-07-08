ALTER TYPE public.estado_enum ADD VALUE IF NOT EXISTS 'activo';
UPDATE public.casos SET estado = 'activo' WHERE estado = 'aprobado';
