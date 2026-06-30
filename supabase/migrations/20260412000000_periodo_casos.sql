-- Agregar columna de periodo
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS periodo TEXT;

-- Backfill: asignar periodo a casos existentes segun fecha_creacion
UPDATE public.casos
SET periodo = CASE
  WHEN EXTRACT(MONTH FROM fecha_creacion) <= 6
    THEN EXTRACT(YEAR FROM fecha_creacion)::TEXT || '-1'
  ELSE EXTRACT(YEAR FROM fecha_creacion)::TEXT || '-2'
END
WHERE periodo IS NULL;
