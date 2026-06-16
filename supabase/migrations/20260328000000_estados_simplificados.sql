ALTER TYPE public.estado_enum ADD VALUE IF NOT EXISTS 'requiere_ajustes';
ALTER TABLE public.casos DROP COLUMN IF EXISTS aprobacion_asesor;
