-- Tabla de metadatos de documentos
CREATE TABLE public.documentos_caso (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  nombre_original TEXT NOT NULL,
  tipo TEXT,
  mime_type TEXT,
  tamano BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_documentos_caso
  ON public.documentos_caso (id_caso, created_at DESC);

-- RLS
ALTER TABLE public.documentos_caso ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier usuario asignado al caso
CREATE POLICY doc_select ON public.documentos_caso
  FOR SELECT USING (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Insercion: mismo criterio
CREATE POLICY doc_insert ON public.documentos_caso
  FOR INSERT WITH CHECK (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Eliminar: admin, pro_apoyo o quien subio el archivo
CREATE POLICY doc_delete ON public.documentos_caso
  FOR DELETE USING (
    id_usuario = auth.uid()
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );
