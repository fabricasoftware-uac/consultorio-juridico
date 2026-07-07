-- Tabla de horarios personalizados
CREATE TABLE public.horarios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_perfil UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  turno TEXT NOT NULL,
  dia TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_horarios_perfil ON public.horarios (id_perfil);

-- RLS: usuario ve sus propios horarios, admin/pro_apoyo todos
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY horarios_select_own ON public.horarios
  FOR SELECT USING (
    id_perfil = auth.uid()
    OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

CREATE POLICY horarios_insert_admin ON public.horarios
  FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

CREATE POLICY horarios_delete_admin ON public.horarios
  FOR DELETE USING (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

-- Migrar datos existentes de estudiantes
INSERT INTO public.horarios (id_perfil, turno, dia)
SELECT id_perfil, COALESCE(turno::TEXT, ''), COALESCE(dia, '')
FROM public.estudiantes
WHERE dia IS NOT NULL;

-- Migrar datos existentes de asesores
INSERT INTO public.horarios (id_perfil, turno, dia)
SELECT id_perfil, COALESCE(turno::TEXT, ''), COALESCE(dia, '')
FROM public.asesores
WHERE dia IS NOT NULL;
