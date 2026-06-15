-- 1. Columnas de vencimiento en casos
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS fecha_vencimiento_estudiante TIMESTAMPTZ;
ALTER TABLE public.casos ADD COLUMN IF NOT EXISTS fecha_vencimiento_asesor TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_casos_vencimiento_estudiante
  ON public.casos (fecha_vencimiento_estudiante)
  WHERE fecha_vencimiento_estudiante IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_casos_vencimiento_asesor
  ON public.casos (fecha_vencimiento_asesor)
  WHERE fecha_vencimiento_asesor IS NOT NULL;

-- 2. Tabla de llamados de atención
CREATE TABLE IF NOT EXISTS public.llamados_atencion (
  id BIGSERIAL PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('estudiante', 'asesor')),
  motivo TEXT NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
  leido BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(id_caso, tipo)
);

CREATE INDEX IF NOT EXISTS idx_llamados_id_usuario ON public.llamados_atencion (id_usuario);
CREATE INDEX IF NOT EXISTS idx_llamados_id_caso ON public.llamados_atencion (id_caso);

-- 3. RLS
ALTER TABLE public.llamados_atencion ENABLE ROW LEVEL SECURITY;

CREATE POLICY llamados_admin_all ON public.llamados_atencion
  FOR ALL USING (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );

CREATE POLICY llamados_estudiante_own ON public.llamados_atencion
  FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::public.app_role = 'estudiante'
    AND id_usuario = auth.uid()
  );

CREATE POLICY llamados_asesor_own ON public.llamados_atencion
  FOR SELECT USING (
    (auth.jwt() ->> 'user_role')::public.app_role = 'asesor'
    AND id_usuario = auth.uid()
  );

-- 4. Función para generar llamados vencidos (procesamiento masivo)
CREATE OR REPLACE FUNCTION public.generar_llamados_atencion()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  total INTEGER := 0;
BEGIN
  -- Estudiantes vencidos (3 días desde fecha_creacion)
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ec.id_estudiante,
    'estudiante',
    'El estudiante ha excedido el plazo de 3 días para la entrega inicial del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante'
    );
  GET DIAGNOSTICS total = ROW_COUNT;

  -- Asesores vencidos (2 días desde asignación)
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ac.id_asesor,
    'asesor',
    'El asesor ha excedido el plazo de 2 días para la aprobación del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor'
    );
  GET DIAGNOSTICS total = total + ROW_COUNT;

  RETURN total;
END;
$$;
