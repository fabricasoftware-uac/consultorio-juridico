-- ============================================================================
-- Migración: Auto-resolución de llamados de atención en casos cerrados y archivados
-- Fecha: 04 de Noviembre de 2026
--
-- 1. Actualiza el trigger en public.casos para auto-resolver TODOS los llamados de atención
--    pendientes (tanto estudiante como asesor) cuando el caso pasa a 'cerrado' o 'archivado'.
--    Mantiene la auto-resolución de llamados de 'asesor' al pasar a 'activo' o 'en_correccion'.
-- 2. Actualiza public.generar_llamados_atencion() para excluir casos 'cerrado' o 'archivado'.
-- 3. Saneamiento de datos existentes:
--    - Auto-resuelve llamados pendientes de casos ya cerrados o archivados.
--    - Limpia fechas de vencimiento pendientes en casos cerrados o archivados.
-- ============================================================================

-- 1. Función y trigger para auto-resolver llamados de atención
CREATE OR REPLACE FUNCTION public.trg_autoresolver_llamados_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (OLD.estado IS DISTINCT FROM NEW.estado) THEN
    -- Si el caso se cierra o archiva, se auto-resuelven todos los llamados activos (estudiante y asesor)
    IF NEW.estado IN ('cerrado', 'archivado') THEN
      UPDATE public.llamados_atencion
      SET resuelto = true,
          fecha_resolucion = now(),
          motivo_resolucion = 'Caso cerrado/archivado'
      WHERE id_caso = NEW.id_caso
        AND resuelto = false;
    -- Si el caso pasa a activo o en_correccion, se auto-resuelven los llamados de tipo asesor
    ELSIF NEW.estado IN ('activo', 'en_correccion') THEN
      UPDATE public.llamados_atencion
      SET resuelto = true,
          fecha_resolucion = now(),
          motivo_resolucion = 'Caso pasó a estado ' || NEW.estado::TEXT
      WHERE id_caso = NEW.id_caso
        AND tipo = 'asesor'
        AND resuelto = false;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Eliminar el trigger antiguo si existe
DROP TRIGGER IF EXISTS trg_autoresolver_llamado_asesor ON public.casos;
DROP TRIGGER IF EXISTS trg_autoresolver_llamados ON public.casos;

-- Crear el trigger unificado para auto-resolución de llamados
CREATE TRIGGER trg_autoresolver_llamados
  AFTER UPDATE ON public.casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_autoresolver_llamados_fn();

-- 2. Actualizar public.generar_llamados_atencion()
CREATE OR REPLACE FUNCTION public.generar_llamados_atencion()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF EXTRACT(DOW FROM now()) IN (0, 6) THEN
    RETURN 0;
  END IF;

  -- Llamados a estudiantes por vencimiento de plazo (excluyendo casos cerrados o archivados)
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ec.id_estudiante, 'estudiante',
    'El estudiante ha excedido el plazo de 3 dias habiles para la entrega del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante IS NOT NULL
    AND c.fecha_vencimiento_estudiante <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  -- Llamados a asesores por vencimiento de plazo (excluyendo casos cerrados o archivados)
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ac.id_asesor, 'asesor',
    'El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor IS NOT NULL
    AND c.fecha_vencimiento_asesor <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND ac.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  RETURN 1;
END;
$$;

-- 3. Saneamiento de datos existentes (data cleanup)
-- a) Auto-resolver llamados pendientes de casos ya cerrados o archivados
UPDATE public.llamados_atencion la
SET resuelto = true,
    fecha_resolucion = now(),
    motivo_resolucion = 'Auto-resuelto: caso cerrado o archivado'
FROM public.casos c
WHERE la.id_caso = c.id_caso
  AND c.estado IN ('cerrado', 'archivado')
  AND la.resuelto = false;

-- b) Limpiar cualquier fecha_vencimiento_estudiante o fecha_vencimiento_asesor en casos cerrados o archivados
UPDATE public.casos
SET fecha_vencimiento_estudiante = NULL,
    fecha_vencimiento_asesor = NULL
WHERE estado IN ('cerrado', 'archivado')
  AND (fecha_vencimiento_estudiante IS NOT NULL OR fecha_vencimiento_asesor IS NOT NULL);
