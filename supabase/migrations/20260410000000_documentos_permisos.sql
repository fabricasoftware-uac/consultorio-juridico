-- Agregar estado para archivado logico
ALTER TABLE public.documentos_caso
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'activo'
  CHECK (estado IN ('activo', 'archivado'));

-- Eliminar politica DELETE anterior y reemplazar con solo admin/pro_apoyo
DROP POLICY IF EXISTS doc_delete ON public.documentos_caso;
CREATE POLICY doc_delete_admin ON public.documentos_caso
  FOR DELETE USING (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Permitir UPDATE a estudiantes y asesores para renombrar/archivar
DROP POLICY IF EXISTS doc_update ON public.documentos_caso;
CREATE POLICY doc_update_assign ON public.documentos_caso
  FOR UPDATE USING (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Insertar: igual que antes
DROP POLICY IF EXISTS doc_insert ON public.documentos_caso;
CREATE POLICY doc_insert_assign ON public.documentos_caso
  FOR INSERT WITH CHECK (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );
