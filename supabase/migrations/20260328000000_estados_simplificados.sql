ALTER TYPE public.estado_enum ADD VALUE IF NOT EXISTS 'en_correccion';
ALTER TABLE public.casos DROP COLUMN IF EXISTS aprobacion_asesor;
