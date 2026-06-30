-- Eliminar restriccion antigua
ALTER TABLE public.llamados_atencion DROP CONSTRAINT IF EXISTS llamados_atencion_id_caso_tipo_key;

-- Nueva restriccion: solo permite un llamado NO RESUELTO por caso+tipo
CREATE UNIQUE INDEX IF NOT EXISTS llamados_atencion_activo_key
  ON public.llamados_atencion (id_caso, tipo)
  WHERE resuelto = false;

-- Funcion generadora con ON CONFLICT (por fila, no por lote)
CREATE OR REPLACE FUNCTION public.generar_llamados_atencion()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ec.id_estudiante, 'estudiante',
    'El estudiante ha excedido el plazo de 3 dias para la entrega inicial del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante <= now()
    AND c.estado = 'en_proceso'
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ac.id_asesor, 'asesor',
    'El asesor ha excedido el plazo de 2 dias para la aprobacion del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor <= now()
    AND c.estado IN ('pendiente_aprobacion', 'en_correccion')
    AND ac.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  RETURN 1;
END;
$$;
