-- ============================================
-- MIGRACION UNIFICADA - Abril 2026
-- Horarios + Actividades + Docs + Formulario
-- ============================================

-- 1. Horarios personalizados
CREATE TABLE IF NOT EXISTS public.horarios (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_perfil UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
  turno TEXT NOT NULL,
  dia TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_horarios_perfil ON public.horarios (id_perfil);
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS horarios_select_own ON public.horarios;
DROP POLICY IF EXISTS horarios_insert_admin ON public.horarios;
DROP POLICY IF EXISTS horarios_delete_admin ON public.horarios;
CREATE POLICY horarios_select_own ON public.horarios FOR SELECT USING (id_perfil = auth.uid() OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin','pro_apoyo'));
CREATE POLICY horarios_insert_admin ON public.horarios FOR INSERT WITH CHECK ((auth.jwt() ->> 'user_role')::public.app_role IN ('admin','pro_apoyo'));
CREATE POLICY horarios_delete_admin ON public.horarios FOR DELETE USING ((auth.jwt() ->> 'user_role')::public.app_role IN ('admin','pro_apoyo'));

INSERT INTO public.horarios (id_perfil, turno, dia) SELECT id_perfil, COALESCE(turno::TEXT,''), COALESCE(dia,'') FROM public.estudiantes WHERE dia IS NOT NULL;
INSERT INTO public.horarios (id_perfil, turno, dia) SELECT id_perfil, COALESCE(turno::TEXT,''), COALESCE(dia,'') FROM public.asesores WHERE dia IS NOT NULL;

-- 2. Actividades de caso
CREATE TABLE IF NOT EXISTS public.actividades_caso (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_actividades_caso ON public.actividades_caso (id_caso, created_at DESC);
ALTER TABLE public.actividades_caso ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS act_select ON public.actividades_caso;
DROP POLICY IF EXISTS act_insert ON public.actividades_caso;
CREATE POLICY act_select ON public.actividades_caso FOR SELECT USING (public.estaAsignado(auth.uid(),id_caso) OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin','pro_apoyo'));
CREATE POLICY act_insert ON public.actividades_caso FOR INSERT WITH CHECK (public.estaAsignado(auth.uid(),id_caso) OR (auth.jwt() ->> 'user_role')::public.app_role IN ('admin','pro_apoyo'));

-- 3. Estado de documentos (aprobacion)
ALTER TABLE public.documentos_caso ADD COLUMN IF NOT EXISTS estado_doc TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_doc IN ('pendiente','aprobado','rechazado'));

-- 4. Identificacion de usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS tipo_documento TEXT DEFAULT 'CC';
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS fecha_expedicion_doc DATE;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS ciudad_expedicion TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS nacionalidad TEXT;

-- 5. Identidad y orientacion
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS identidad_genero TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS orientacion_sexual TEXT;

-- 6. Sociodemograficos
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS escolaridad TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS grupo_etnico TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS barrio TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS zona TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS tenencia_vivienda TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS comuna TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS tiene_sisben BOOLEAN;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS personas_cargo INT;

-- 7. Socioeconomicos
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS rango_salarial TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS servicios_publicos TEXT;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS sabe_leer BOOLEAN;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS discapacidad TEXT;

-- 8. Condicion actual
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS condicion_actual TEXT;

-- 9. Correcciones de enums
ALTER TYPE public.estado_civil_enum ADD VALUE IF NOT EXISTS 'viudo';
ALTER TYPE public.estado_civil_enum ADD VALUE IF NOT EXISTS 'divorciado';
ALTER TYPE public.sexo_enum ADD VALUE IF NOT EXISTS 'OTRO';
ALTER TYPE public.area_enum ADD VALUE IF NOT EXISTS 'conciliacion';
ALTER TYPE public.area_enum ADD VALUE IF NOT EXISTS 'privado';
