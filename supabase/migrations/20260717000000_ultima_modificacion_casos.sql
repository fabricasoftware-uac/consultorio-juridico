-- Agrega seguimiento de última modificación a los casos
-- para permitir ordenamiento por actividad reciente

-- 1. Agregar columna (nullable inicialmente para backfill seguro)
ALTER TABLE public.casos
ADD COLUMN IF NOT EXISTS ultima_modificacion TIMESTAMPTZ;

-- 2. Backfill: usa la última fecha de auditoría, o fecha_creacion si no hay auditoría
UPDATE public.casos c
SET ultima_modificacion = COALESCE(
  (SELECT MAX(a.created_at) FROM public.auditoria_casos a WHERE a.id_caso = c.id_caso),
  c.fecha_creacion::timestamptz
);

-- 3. Hacerla no-nullable después del backfill
ALTER TABLE public.casos
ALTER COLUMN ultima_modificacion SET NOT NULL;

-- 4. Trigger 1: actualiza desde auditoria_casos (captura acciones semánticas)
CREATE OR REPLACE FUNCTION public.set_ultima_modificacion_from_audit()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.casos
  SET ultima_modificacion = NEW.created_at
  WHERE id_caso = NEW.id_caso
    AND (ultima_modificacion IS NULL OR NEW.created_at > ultima_modificacion);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_update_ultima_modificacion ON public.auditoria_casos;
CREATE TRIGGER trg_audit_update_ultima_modificacion
  AFTER INSERT ON public.auditoria_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ultima_modificacion_from_audit();

-- 5. Trigger 2: safety net para UPDATES directos en casos que no pasan por auditoría
CREATE OR REPLACE FUNCTION public.set_ultima_modificacion_direct()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualiza si ultima_modificacion no fue cambiada explícitamente
  -- (por ejemplo, por el trigger de auditoría o por código de la app)
  IF NEW.ultima_modificacion IS NOT DISTINCT FROM OLD.ultima_modificacion THEN
    NEW.ultima_modificacion = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_casos_update_ultima_modificacion ON public.casos;
CREATE TRIGGER trg_casos_update_ultima_modificacion
  BEFORE UPDATE ON public.casos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ultima_modificacion_direct();

-- 6. Índice para ordenamiento eficiente
CREATE INDEX IF NOT EXISTS idx_casos_ultima_modificacion
  ON public.casos (ultima_modificacion DESC);
