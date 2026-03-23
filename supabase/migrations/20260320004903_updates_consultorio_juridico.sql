-- Migración de esquema: Añadir campos a estudiantes, asesores y casos

-- 1. Día y Horarios
ALTER TABLE public.estudiantes ADD COLUMN IF NOT EXISTS dia TEXT;
ALTER TABLE public.asesores ADD COLUMN IF NOT EXISTS dia TEXT;
ALTER TABLE public.asesores ADD COLUMN IF NOT EXISTS horario JSONB;

-- 2. Modificar area_enum (no se pueden eliminar valores en PG fácilmente, 
-- pero añadiremos los nuevos).
ALTER TYPE public.area_enum ADD VALUE IF NOT EXISTS 'civil_familia';
ALTER TYPE public.area_enum ADD VALUE IF NOT EXISTS 'publica';

-- 3. Observaciones y Clasificación
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS observaciones_estudiante TEXT;

-- Crear tipo enum para clasificación si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'clasificacion_enum') THEN
        CREATE TYPE public.clasificacion_enum AS ENUM ('en_tramite', 'solo_asesoria');
    END IF;
END$$;

ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS clasificacion public.clasificacion_enum;
