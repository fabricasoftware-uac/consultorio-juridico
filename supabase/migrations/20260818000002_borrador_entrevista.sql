-- ============================================================================
-- Borrador de entrevista en el servidor — Agosto 2026
--
-- Hasta ahora el avance de la entrevista solo vivía en localStorage: si el
-- estudiante empezaba en el PC del consultorio y seguía en su celular, perdía
-- todo. Solo al ENVIAR la entrevista completa se persistía algo.
--
-- Se guarda el formulario entero como jsonb en la propia fila del caso, no en
-- una tabla aparte: es 1-a-1 con el caso, se borra solo al borrarse el caso, y
-- evita un join más en el detalle.
-- ============================================================================

ALTER TABLE public.casos
  ADD COLUMN IF NOT EXISTS borrador_entrevista     JSONB,
  ADD COLUMN IF NOT EXISTS borrador_actualizado_en TIMESTAMPTZ;

COMMENT ON COLUMN public.casos.borrador_entrevista IS
  'Avance parcial de la entrevista del estudiante. Se limpia al enviarla.';

-- El estudiante no tiene UPDATE sobre `casos` (solo casos_asignados.update, que
-- gobierna otras políticas), y aunque lo tuviera no queremos darle permiso de
-- escritura sobre toda la fila. Con SECURITY DEFINER acotamos la escritura a
-- estas dos columnas y a los casos que realmente le corresponden.
CREATE OR REPLACE FUNCTION public.guardar_borrador_entrevista(
  p_id_caso   INTEGER,
  p_borrador  JSONB
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_rol    public.app_role := (auth.jwt() ->> 'user_role')::public.app_role;
  v_uid    UUID            := auth.uid();
  v_estado public.estado_enum;
  v_ahora  TIMESTAMPTZ     := now();
BEGIN
  -- NULL NOT IN (...) evalúa a NULL y dejaría pasar a un llamador sin rol.
  IF v_rol IS NULL OR v_rol <> 'estudiante' THEN
    RAISE EXCEPTION 'Solo el estudiante del caso puede guardar el borrador';
  END IF;

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

  -- Solo mientras la entrevista sea editable. Evita que un borrador viejo
  -- reviva sobre un caso ya aprobado.
  IF v_estado NOT IN ('en_proceso', 'en_correccion') THEN
    RAISE EXCEPTION 'La entrevista ya no es editable';
  END IF;

  UPDATE public.casos
  SET borrador_entrevista     = p_borrador,
      borrador_actualizado_en = v_ahora
  WHERE id_caso = p_id_caso;

  RETURN v_ahora;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.guardar_borrador_entrevista(INTEGER, JSONB) FROM anon;
GRANT  EXECUTE ON FUNCTION public.guardar_borrador_entrevista(INTEGER, JSONB) TO authenticated;

-- El envío definitivo deja de necesitar el borrador. Se limpia dentro de
-- guardar_entrevista para que sea parte de la misma transacción y no quede
-- basura si el cliente se cae justo después de enviar.
CREATE OR REPLACE FUNCTION public.limpiar_borrador_entrevista(p_id_caso INTEGER)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.casos
  SET borrador_entrevista     = NULL,
      borrador_actualizado_en = NULL
  WHERE id_caso = p_id_caso;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.limpiar_borrador_entrevista(INTEGER) FROM anon;
GRANT  EXECUTE ON FUNCTION public.limpiar_borrador_entrevista(INTEGER) TO authenticated;
