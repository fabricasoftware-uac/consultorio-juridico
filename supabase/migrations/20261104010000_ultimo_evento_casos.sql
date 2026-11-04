-- Migración para registrar el último evento en la tabla de casos
-- Permite mostrar un resumen del último cambio o actividad directamente en los listados

-- 1. Agregar columna para el último evento
ALTER TABLE public.casos
ADD COLUMN IF NOT EXISTS ultimo_evento TEXT;

-- 2. Backfill para casos existentes tomando la última descripción de auditoria_casos
--    Deshabilitamos temporalmente el trigger para evitar sobreescribir ultima_modificacion con now()
ALTER TABLE public.casos DISABLE TRIGGER trg_casos_update_ultima_modificacion;

UPDATE public.casos c
SET ultimo_evento = COALESCE(
  (
    SELECT a.descripcion
    FROM public.auditoria_casos a
    WHERE a.id_caso = c.id_caso
    ORDER BY a.created_at DESC
    LIMIT 1
  ),
  'Caso registrado'
),
ultima_modificacion = COALESCE(
  (
    SELECT MAX(a.created_at)
    FROM public.auditoria_casos a
    WHERE a.id_caso = c.id_caso
  ),
  c.fecha_creacion::timestamptz
);

ALTER TABLE public.casos ENABLE TRIGGER trg_casos_update_ultima_modificacion;

-- 3. Actualizar la función y trigger para mantener sincronizados ultima_modificacion y ultimo_evento
CREATE OR REPLACE FUNCTION public.set_ultima_modificacion_from_audit()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.casos
  SET ultima_modificacion = NEW.created_at,
      ultimo_evento = NEW.descripcion
  WHERE id_caso = NEW.id_caso;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_update_ultima_modificacion ON public.auditoria_casos;
CREATE TRIGGER trg_audit_update_ultima_modificacion
  AFTER INSERT ON public.auditoria_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ultima_modificacion_from_audit();
