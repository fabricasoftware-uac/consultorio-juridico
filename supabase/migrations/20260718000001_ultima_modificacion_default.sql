-- Fix: ultima_modificacion necesita DEFAULT now() para INSERTS nuevos
-- La migracion 20260717000000 agrego la columna NOT NULL pero sin DEFAULT,
-- lo cual rompe cualquier INSERT que no incluya explicitamente la columna.

-- 1. Agregar DEFAULT now() para futuros INSERTS
ALTER TABLE public.casos
ALTER COLUMN ultima_modificacion SET DEFAULT now();

-- 2. Backfill de seguridad: cualquier caso creado despues de la migracion anterior
--    (pero antes de este fix) que tenga NULL por el insert fallido no deberia existir,
--    pero cubrimos el caso hipotetico de inserts que saltaron la validacion
UPDATE public.casos
SET ultima_modificacion = fecha_creacion::timestamptz
WHERE ultima_modificacion IS NULL;

-- 3. Seguridad adicional: trigger BEFORE INSERT para casos creados sin DEFAULT
--    (cubre edge cases como COPY, bulk inserts, etc.)
CREATE OR REPLACE FUNCTION public.set_ultima_modificacion_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ultima_modificacion IS NULL THEN
        NEW.ultima_modificacion = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_casos_insert_ultima_modificacion ON public.casos;
CREATE TRIGGER trg_casos_insert_ultima_modificacion
  BEFORE INSERT ON public.casos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ultima_modificacion_on_insert();
