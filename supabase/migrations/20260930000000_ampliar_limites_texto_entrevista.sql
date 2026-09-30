-- ============================================================================
-- Migración: Ampliar límites de texto en formulario de entrevista
-- Fecha: 30 de Septiembre de 2026
--
-- Motivo:
--   Varias columnas de texto en tablas principales de la entrevista socioeconómica
--   y laboral tenían límites rígidos tipo VARCHAR(100) heredados del esquema inicial.
--   Al capturar direcciones largas, múltiples contactos familiares, correos
--   electrónicos o descripciones de ingresos, PostgreSQL lanzaba el error
--   22001 (value too long for type character varying).
--
-- Solución:
--   Migrar estas columnas al tipo TEXT, siguiendo las mejores prácticas de
--   PostgreSQL donde no existe penalización de rendimiento respecto a VARCHAR(N)
--   y se evitan restricciones artificiales en campos de texto variable.
-- ============================================================================

-- 1. Tabla: usuarios (información sociodemográfica del usuario/solicitante)
ALTER TABLE public.usuarios
  ALTER COLUMN direccion TYPE text,
  ALTER COLUMN contacto_familiar TYPE text,
  ALTER COLUMN correo TYPE text,
  ALTER COLUMN concepto_otros_ingresos TYPE text;

-- 2. Tabla: demandados (datos del demandado o contraparte)
ALTER TABLE public.demandados
  ALTER COLUMN nombre_completo TYPE text,
  ALTER COLUMN lugar_residencia TYPE text,
  ALTER COLUMN correo TYPE text;

-- 3. Tabla: contratos_laborales (datos del empleador o patrono)
ALTER TABLE public.contratos_laborales
  ALTER COLUMN representante_legal TYPE text,
  ALTER COLUMN direccion_empresa TYPE text,
  ALTER COLUMN correo_patrono TYPE text;
