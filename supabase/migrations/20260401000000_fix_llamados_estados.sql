CREATE OR REPLACE FUNCTION public.generar_llamados_atencion()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ec.id_estudiante,
    'estudiante',
    'El estudiante ha excedido el plazo de 3 d?as para la entrega inicial del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante <= now()
    AND c.estado = 'en_proceso'
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante'
    );

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ac.id_asesor,
    'asesor',
    'El asesor ha excedido el plazo de 2 d?as para la aprobaci?n del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor <= now()
    AND c.estado IN ('pendiente_aprobacion', 'en_correccion')
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor'
    );

  RETURN 1;
END;
$$;
