CREATE TABLE public.actividades_caso (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_actividades_caso ON public.actividades_caso (id_caso, created_at DESC);

ALTER TABLE public.actividades_caso ENABLE ROW LEVEL SECURITY;

-- Lectura: asignados al caso + admin/pro_apoyo
CREATE POLICY act_select ON public.actividades_caso
  FOR SELECT USING (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Insercion: mismo criterio
CREATE POLICY act_insert ON public.actividades_caso
  FOR INSERT WITH CHECK (
    public.estaAsignado(auth.uid(), id_caso)
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );
