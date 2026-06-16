CREATE TABLE IF NOT EXISTS public.auditoria_casos (
  id BIGSERIAL PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  accion TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_caso
  ON public.auditoria_casos (id_caso, created_at DESC);

ALTER TABLE public.auditoria_casos ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT (lectura)
CREATE POLICY auditoria_select_admin ON public.auditoria_casos
  FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

CREATE POLICY auditoria_select_estudiante ON public.auditoria_casos
  FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::public.app_role = 'estudiante'
    AND EXISTS (
      SELECT 1 FROM public.estudiantes_casos
      WHERE id_estudiante = auth.uid() AND id_caso = auditoria_casos.id_caso
    )
  );

CREATE POLICY auditoria_select_asesor ON public.auditoria_casos
  FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::public.app_role = 'asesor'
    AND EXISTS (
      SELECT 1 FROM public.asesores_casos
      WHERE id_asesor = auth.uid() AND id_caso = auditoria_casos.id_caso
    )
  );

-- Políticas de INSERT (escritura) — cualquier autenticado puede insertar
CREATE POLICY auditoria_insert_all ON public.auditoria_casos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
