-- ============================================================================
-- El estudiante elige el asesor que le dio retroalimentación — Agosto 2026
--
-- Antes el pro-apoyo asignaba el asesor al crear el caso (opcional, y de hecho
-- la mayoría de casos quedaban sin asesor). Ahora el estudiante lo selecciona
-- en los primeros pasos de la entrevista, y esa selección ES la asignación del
-- caso: así no se duplica el proceso y cualquier asesor puede atender a
-- cualquier estudiante.
--
-- Va por RPC porque el rol `estudiante` no tiene el permiso
-- `asesores_casos.create`, y no queremos dárselo: con SECURITY DEFINER podemos
-- exigir exactamente las condiciones correctas (ser el estudiante del caso, y
-- que el caso siga siendo editable).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.asignar_asesor_retroalimentacion(
  p_id_caso  INTEGER,
  p_id_asesor UUID
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_rol      public.app_role := (auth.jwt() ->> 'user_role')::public.app_role;
  v_uid      UUID            := auth.uid();
  v_estado   public.estado_enum;
  v_anterior UUID;
BEGIN
  -- NULL NOT IN (...) evalúa a NULL y dejaría pasar a un llamador sin rol.
  IF v_rol IS NULL OR v_rol <> 'estudiante' THEN
    RAISE EXCEPTION 'Solo el estudiante del caso puede registrar la retroalimentación';
  END IF;

  -- Debe ser el estudiante actualmente asignado a ESTE caso.
  IF NOT EXISTS (
    SELECT 1 FROM public.estudiantes_casos ec
    WHERE ec.id_caso = p_id_caso
      AND ec.id_estudiante = v_uid
      AND ec.fecha_fin_asignacion IS NULL
  ) THEN
    RAISE EXCEPTION 'No estás asignado a este caso';
  END IF;

  SELECT c.estado INTO v_estado FROM public.casos c WHERE c.id_caso = p_id_caso;
  IF v_estado IS NULL THEN
    RAISE EXCEPTION 'El caso no existe';
  END IF;

  -- Queda fijo al enviar la entrevista: después solo el pro-apoyo reasigna.
  IF v_estado NOT IN ('en_proceso', 'en_correccion') THEN
    RAISE EXCEPTION 'La entrevista ya fue enviada; pide al profesional de apoyo que reasigne el asesor';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.asesores a WHERE a.id_perfil = p_id_asesor
  ) THEN
    RAISE EXCEPTION 'El asesor seleccionado no existe';
  END IF;

  SELECT ac.id_asesor INTO v_anterior
  FROM public.asesores_casos ac
  WHERE ac.id_caso = p_id_caso AND ac.fecha_fin_asignacion IS NULL
  LIMIT 1;

  -- Ya estaba asignado ese mismo asesor: no hay nada que hacer.
  IF v_anterior = p_id_asesor THEN
    RETURN;
  END IF;

  -- Cierra la asignación previa (la del pro-apoyo o una elección anterior).
  UPDATE public.asesores_casos
  SET fecha_fin_asignacion = CURRENT_DATE
  WHERE id_caso = p_id_caso AND fecha_fin_asignacion IS NULL;

  -- La PK es (id_asesor, id_caso): si este asesor ya estuvo asignado antes y se
  -- le cerró, se reabre la fila en vez de insertar una duplicada.
  INSERT INTO public.asesores_casos (id_asesor, id_caso, fecha_asignacion, fecha_fin_asignacion)
  VALUES (p_id_asesor, p_id_caso, CURRENT_DATE, NULL)
  ON CONFLICT (id_asesor, id_caso) DO UPDATE
    SET fecha_asignacion = CURRENT_DATE, fecha_fin_asignacion = NULL;

  INSERT INTO public.auditoria_casos (id_caso, id_usuario, accion, descripcion, metadata)
  VALUES (
    p_id_caso, v_uid, 'asesor_retroalimentacion',
    CASE WHEN v_anterior IS NULL
      THEN 'El estudiante registró el asesor que le brindó retroalimentación'
      ELSE 'El estudiante cambió el asesor que le brindó retroalimentación'
    END,
    jsonb_build_object('asesor_anterior', v_anterior, 'asesor_nuevo', p_id_asesor)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.asignar_asesor_retroalimentacion(INTEGER, UUID) FROM anon;
GRANT  EXECUTE ON FUNCTION public.asignar_asesor_retroalimentacion(INTEGER, UUID) TO authenticated;
