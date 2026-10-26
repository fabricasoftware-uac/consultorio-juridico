-- Migración: Período Académico y Transición Semestral
-- Fecha: 2026-10-25

-- 1. Tabla de configuración global del sistema
CREATE TABLE IF NOT EXISTS public.configuracion_sistema (
  clave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  descripcion TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar valor inicial para el período activo
INSERT INTO public.configuracion_sistema (clave, valor, descripcion)
VALUES ('periodo_activo', '2026-2', 'Período académico vigente del Consultorio Jurídico')
ON CONFLICT (clave) DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.configuracion_sistema ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas previas si existiesen
DROP POLICY IF EXISTS "Lectura configuracion_sistema autenticados" ON public.configuracion_sistema;
DROP POLICY IF EXISTS "Escritura configuracion_sistema admin" ON public.configuracion_sistema;

-- Lectura (SELECT) para cualquier usuario autenticado
CREATE POLICY "Lectura configuracion_sistema autenticados"
  ON public.configuracion_sistema
  FOR SELECT
  TO authenticated
  USING (true);

-- Escritura (ALL) exclusiva para el rol admin
CREATE POLICY "Escritura configuracion_sistema admin"
  ON public.configuracion_sistema
  FOR ALL
  TO authenticated
  USING (((auth.jwt() ->> 'user_role')::public.app_role = 'admin'::public.app_role))
  WITH CHECK (((auth.jwt() ->> 'user_role')::public.app_role = 'admin'::public.app_role));

-- Privilegios de tabla
GRANT ALL ON TABLE public.configuracion_sistema TO authenticated;
GRANT ALL ON TABLE public.configuracion_sistema TO service_role;

-- 2. Columna para trazabilidad de actualización semestral del estudiante
ALTER TABLE public.estudiantes ADD COLUMN IF NOT EXISTS ultimo_periodo_actualizado TEXT;

-- 3. Inicializar a los estudiantes existentes que ya tienen perfil completo con el período activo actual
UPDATE public.estudiantes
SET ultimo_periodo_actualizado = '2026-2'
WHERE ultimo_periodo_actualizado IS NULL
  AND semestre IS NOT NULL;
