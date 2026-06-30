-- Politicas de storage para el bucket documentos-casos
-- Ejecutar en SQL Editor de Supabase Dashboard

-- Permitir SELECT a usuarios asignados al caso
CREATE POLICY "doc_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documentos-casos'
    AND EXISTS (
      SELECT 1 FROM public.estudiantes_casos
      WHERE id_caso = (storage.foldername(name))[2]::INTEGER
        AND id_estudiante = auth.uid()
      UNION ALL
      SELECT 1 FROM public.asesores_casos
      WHERE id_caso = (storage.foldername(name))[2]::INTEGER
        AND id_asesor = auth.uid()
    )
  );

-- Permitir SELECT a admin y pro_apoyo
CREATE POLICY "doc_select_admin" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documentos-casos'
    AND (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Permitir INSERT a cualquier autenticado (validacion de caso en el backend)
CREATE POLICY "doc_insert_auth" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documentos-casos'
    AND auth.role() = 'authenticated'
  );

-- Permitir DELETE a admin/pro_apoyo
CREATE POLICY "doc_delete_admin" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documentos-casos'
    AND (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );
