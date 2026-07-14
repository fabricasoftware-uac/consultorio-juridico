-- Add fecha_entrega_entrevista column (already written to by app code: UserRegistrationForm.tsx)
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS fecha_entrega_entrevista TIMESTAMPTZ;

-- Replace generar_llamados_atencion: remove hardcoded estado checks.
-- Phase completion is now signaled exclusively by NULL deadlines (already set by app code).
-- The `IS NOT NULL AND <= now()` check naturally excludes completed phases.
CREATE OR REPLACE FUNCTION public.generar_llamados_atencion()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF EXTRACT(DOW FROM now()) IN (0, 6) THEN
    RETURN 0;
  END IF;

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ec.id_estudiante, 'estudiante',
    'El estudiante ha excedido el plazo de 3 dias habiles para la entrega del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante IS NOT NULL
    AND c.fecha_vencimiento_estudiante <= now()
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ac.id_asesor, 'asesor',
    'El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor IS NOT NULL
    AND c.fecha_vencimiento_asesor <= now()
    AND ac.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  RETURN 1;
END;
$$;
