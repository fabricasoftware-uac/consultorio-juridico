-- Funcion: sumar dias habiles (lunes a viernes, NO festivos)
CREATE OR REPLACE FUNCTION public.sumar_dias_habiles(start_date TIMESTAMPTZ, num_days INTEGER)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  current_date_var DATE := start_date::DATE;
  days_added INTEGER := 0;
BEGIN
  WHILE days_added < num_days LOOP
    current_date_var := current_date_var + INTERVAL '1 day';
    IF EXTRACT(DOW FROM current_date_var) NOT IN (0, 6) THEN
      days_added := days_added + 1;
    END IF;
  END LOOP;
  RETURN current_date_var + (start_date::TIME);
END;
$$;

-- Funcion generadora: solo ejecuta chequeos de lunes a viernes
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
    'El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.'
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
