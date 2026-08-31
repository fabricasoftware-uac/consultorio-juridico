-- ============================================================================
-- Permitir reasignar a la misma persona más de una vez — Agosto 2026
--
-- Al reasignar Alejandra -> Mario -> Alejandra saltaba un error de llave
-- duplicada. La causa: estudiantes_casos y asesores_casos tienen
-- PRIMARY KEY (id_persona, id_caso), o sea que cada persona solo puede aparecer
-- UNA vez por caso. La tabla está modelada como "asignación actual" pero se usa
-- como historial: guarda fecha_asignacion / fecha_fin_asignacion y la UI de
-- reasignación muestra el histórico con sus rangos.
--
-- Se reemplaza la PK compuesta por uno sustituto, de modo que una persona pueda
-- entrar y salir del caso las veces que haga falta, cada tramo en su propia
-- fila.
--
-- A cambio se conserva por índice la regla que el resto del código ya da por
-- cierta: UNA sola asignación vigente por caso. Media aplicación hace
-- `find(e => !e.fecha_fin_asignacion)`, que con dos filas activas escogería una
-- arbitrariamente. Además la reasignación cierra e inserta en dos pasos sin
-- transacción, así que sin el índice dos reasignaciones simultáneas podrían
-- dejar el caso con dos responsables.
--
-- Verificado antes de aplicar: ningún caso tiene hoy más de una asignación
-- vigente, y ninguna otra tabla referencia estas dos por clave foránea.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Idempotente a propósito: si un push falla a medias, se puede reintentar sin
-- dejar el esquema en un estado intermedio.
-- ---------------------------------------------------------------------------

-- estudiantes_casos
ALTER TABLE public.estudiantes_casos DROP CONSTRAINT IF EXISTS estudiantes_casos_pkey;

ALTER TABLE public.estudiantes_casos
  ADD COLUMN IF NOT EXISTS id BIGINT GENERATED ALWAYS AS IDENTITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.estudiantes_casos'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE public.estudiantes_casos ADD PRIMARY KEY (id);
  END IF;
END$$;

CREATE UNIQUE INDEX IF NOT EXISTS estudiantes_casos_una_vigente
  ON public.estudiantes_casos (id_caso)
  WHERE fecha_fin_asignacion IS NULL;

-- Al soltar la PK compuesta se pierde su índice, del que dependía la búsqueda
-- por (persona, caso) que hace estaAsignado en CADA evaluación de RLS.
CREATE INDEX IF NOT EXISTS idx_estudiantes_casos_persona
  ON public.estudiantes_casos (id_estudiante, id_caso);

-- asesores_casos
ALTER TABLE public.asesores_casos DROP CONSTRAINT IF EXISTS asesores_casos_pkey;

ALTER TABLE public.asesores_casos
  ADD COLUMN IF NOT EXISTS id BIGINT GENERATED ALWAYS AS IDENTITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.asesores_casos'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE public.asesores_casos ADD PRIMARY KEY (id);
  END IF;
END$$;

CREATE UNIQUE INDEX IF NOT EXISTS asesores_casos_una_vigente
  ON public.asesores_casos (id_caso)
  WHERE fecha_fin_asignacion IS NULL;

CREATE INDEX IF NOT EXISTS idx_asesores_casos_persona
  ON public.asesores_casos (id_asesor, id_caso);

-- ---------------------------------------------------------------------------
-- asignar_asesor_retroalimentacion ya no puede usar ON CONFLICT
--
-- Se apoyaba en la PK (id_asesor, id_caso) para "reabrir" la fila de un asesor
-- que ya hubiera estado asignado. Esa PK ya no existe, y además reabrir la fila
-- era justamente lo que borraba el historial: el tramo anterior se perdía. Con
-- la llave sustituta, cada paso del asesor por el caso queda como una fila
-- propia y basta un INSERT.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.asignar_asesor_retroalimentacion(
  p_id_caso  INTEGER,
  p_id_asesor UUID
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_rol      public.app_role := (auth.jwt() ->> 'user_role')::public.app_role;
  v_uid      UUID            := auth.uid();
  v_estado   public.estado_enum;
  v_anterior UUID;
BEGIN
  -- NULL NOT IN (...) evalúa a NULL y dejaría pasar a un llamador sin rol.
  IF v_rol IS NULL OR v_rol <> 'estudiante' THEN
    RAISE EXCEPTION 'Solo el estudiante del caso puede registrar la retroalimentación';
  END IF;

  -- Debe ser el estudiante actualmente asignado a ESTE caso.
  IF NOT EXISTS (
    SELECT 1 FROM public.estudiantes_casos ec
    WHERE ec.id_caso = p_id_caso
      AND ec.id_estudiante = v_uid
      AND ec.fecha_fin_asignacion IS NULL
  ) THEN
    RAISE EXCEPTION 'No estás asignado a este caso';
  END IF;

  SELECT c.estado INTO v_estado FROM public.casos c WHERE c.id_caso = p_id_caso;
  IF v_estado IS NULL THEN
    RAISE EXCEPTION 'El caso no existe';
  END IF;

  -- Queda fijo al enviar la entrevista: después solo el pro-apoyo reasigna.
  IF v_estado NOT IN ('en_proceso', 'en_correccion') THEN
    RAISE EXCEPTION 'La entrevista ya fue enviada; pide al profesional de apoyo que reasigne el asesor';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.asesores a WHERE a.id_perfil = p_id_asesor
  ) THEN
    RAISE EXCEPTION 'El asesor seleccionado no existe';
  END IF;

  SELECT ac.id_asesor INTO v_anterior
  FROM public.asesores_casos ac
  WHERE ac.id_caso = p_id_caso AND ac.fecha_fin_asignacion IS NULL
  LIMIT 1;

  -- Ya estaba asignado ese mismo asesor: no hay nada que hacer.
  IF v_anterior = p_id_asesor THEN
    RETURN;
  END IF;

  -- Cierra la asignación previa (la del pro-apoyo o una elección anterior).
  UPDATE public.asesores_casos
  SET fecha_fin_asignacion = CURRENT_DATE
  WHERE id_caso = p_id_caso AND fecha_fin_asignacion IS NULL;

  -- ÚNICO cambio respecto a 20260818000001: era un INSERT ... ON CONFLICT
  -- (id_asesor, id_caso) DO UPDATE, que reabría la fila del asesor que ya
  -- hubiera pasado por el caso. Esa PK ya no existe, y reabrir la fila era
  -- justamente lo que borraba el tramo anterior del historial. Ahora cada paso
  -- por el caso queda como una fila propia.
  INSERT INTO public.asesores_casos (id_asesor, id_caso, fecha_asignacion, fecha_fin_asignacion)
  VALUES (p_id_asesor, p_id_caso, CURRENT_DATE, NULL);

  INSERT INTO public.auditoria_casos (id_caso, id_usuario, accion, descripcion, metadata)
  VALUES (
    p_id_caso, v_uid, 'asesor_retroalimentacion',
    CASE WHEN v_anterior IS NULL
      THEN 'El estudiante registró el asesor que le brindó retroalimentación'
      ELSE 'El estudiante cambió el asesor que le brindó retroalimentación'
    END,
    jsonb_build_object('asesor_anterior', v_anterior, 'asesor_nuevo', p_id_asesor)
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.asignar_asesor_retroalimentacion(INTEGER, UUID) FROM anon;
GRANT  EXECUTE ON FUNCTION public.asignar_asesor_retroalimentacion(INTEGER, UUID) TO authenticated;
