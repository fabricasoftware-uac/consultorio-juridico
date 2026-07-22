-- 1. Helper: un caso admite documentos mientras no este cerrado ni archivado
CREATE OR REPLACE FUNCTION public.caso_admite_documentos(p_id_caso INTEGER)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.casos c
    WHERE c.id_caso = p_id_caso
      AND c.estado NOT IN ('cerrado', 'archivado')
  );
$$;

-- 2. El estudiante no puede subir documentos a un caso cerrado o archivado.
--    Asesor, pro_apoyo y admin conservan la capacidad de subir.
DROP POLICY IF EXISTS doc_insert_assign ON public.documentos_caso;
CREATE POLICY doc_insert_assign ON public.documentos_caso
  FOR INSERT WITH CHECK (
    (
      public.estaAsignado(auth.uid(), id_caso)
      OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
    )
    AND (
      (auth.jwt() ->> 'user_role')::public.app_role <> 'estudiante'
      OR public.caso_admite_documentos(id_caso)
    )
  );

-- 3. Recordatorio manual: el asesor avisa al estudiante que faltan documentos.
--    notificaciones_usuario no tiene politica de INSERT, por eso SECURITY DEFINER.
--    Anti-spam: no repite el aviso dentro de las ultimas 24 horas.
CREATE OR REPLACE FUNCTION public.recordar_documentos_caso(p_id_caso INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_rol  public.app_role := (auth.jwt() ->> 'user_role')::public.app_role;
  v_rows INTEGER;
BEGIN
  -- v_rol IS NULL debe rechazarse explicitamente: `NULL NOT IN (...)` evalua a NULL
  -- y un IF sobre NULL no entra, dejando pasar a un llamador sin claim de rol.
  IF v_rol IS NULL OR v_rol NOT IN ('asesor', 'pro_apoyo', 'admin') THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  IF v_rol = 'asesor' AND NOT public.estaAsignado(auth.uid(), p_id_caso) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, p_id_caso, 'documentos_faltantes',
    'Faltan documentos',
    'El caso #' || p_id_caso::TEXT || ' no tiene documentos adjuntos. Cargalos desde el detalle del caso.'
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = p_id_caso
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.notificaciones_usuario n
      WHERE n.id_usuario = ec.id_estudiante
        AND n.id_caso    = p_id_caso
        AND n.tipo       = 'documentos_faltantes'
        AND n.created_at > now() - INTERVAL '24 hours'
    );

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;

-- 4. Grants. caso_admite_documentos se evalua dentro de una politica RLS, asi que
--    conserva el EXECUTE por defecto (igual que public.estaAsignado). En cambio
--    recordar_documentos_caso queda expuesta como RPC: solo sesiones autenticadas.
REVOKE EXECUTE ON FUNCTION public.recordar_documentos_caso(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recordar_documentos_caso(INTEGER) TO authenticated;
