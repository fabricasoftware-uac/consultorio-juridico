ALTER TABLE public.documentos_caso
  ADD COLUMN IF NOT EXISTS estado_doc TEXT NOT NULL DEFAULT 'pendiente'
  CHECK (estado_doc IN ('pendiente', 'aprobado', 'rechazado'));
