-- 1. Nuevo enum para sexo
CREATE TYPE public.sexo_enum AS ENUM (
  'MASCULINO',
  'FEMENINO',
  'INTERSEXUAL',
  'PREFIERO_NO_RESPONDER'
);

-- 2. Migrar columna sexo de CHAR(1) al nuevo enum
ALTER TABLE public.usuarios
  ALTER COLUMN sexo TYPE public.sexo_enum
  USING (
    CASE sexo
      WHEN 'M' THEN 'MASCULINO'::public.sexo_enum
      WHEN 'F' THEN 'FEMENINO'::public.sexo_enum
      ELSE 'PREFIERO_NO_RESPONDER'::public.sexo_enum
    END
  );

-- 3. Nuevo enum para caracterizaci?n LGBTIQ+
CREATE TYPE public.caracterizacion_lgbtiq_enum AS ENUM (
  'GAY',
  'LESBIANA',
  'BISEXUAL',
  'HOMBRE_TRANS',
  'MUJER_TRANS',
  'NO_BINARIO',
  'OTRA',
  'PREFIERO_NO_RESPONDER'
);

-- 4. Nuevas columnas opcionales
ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS enfoque_diverso BOOLEAN,
  ADD COLUMN IF NOT EXISTS caracterizacion_lgbtiq public.caracterizacion_lgbtiq_enum;
