-- ENUMs
CREATE TYPE public.notification_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'SENT',
  'FAILED'
);

CREATE TYPE public.notification_type AS ENUM (
  'ESTUDIANTE_ASIGNADO',
  'ASESOR_ASIGNADO'
);

-- Tabla de cola de notificaciones
CREATE TABLE public.notificaciones_pendientes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_caso INTEGER NOT NULL REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  id_usuario UUID NOT NULL,
  tipo_notificacion public.notification_type NOT NULL,
  canal TEXT NOT NULL DEFAULT 'email',
  source TEXT NOT NULL,
  status public.notification_status NOT NULL DEFAULT 'PENDING',
  attempts INT NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  UNIQUE(id_caso, id_usuario, tipo_notificacion)
);

-- Indice optimizado para el cron (SKIP LOCKED sobre PENDING)
CREATE INDEX IF NOT EXISTS idx_notificaciones_pending
  ON public.notificaciones_pendientes (id)
  WHERE status = 'PENDING';

-- RLS: sin politicas publicas, solo service role
ALTER TABLE public.notificaciones_pendientes ENABLE ROW LEVEL SECURITY;

-- Funcion de encolado
CREATE OR REPLACE FUNCTION public.enqueue_assignment_notification(
  p_id_caso INTEGER,
  p_id_usuario UUID,
  p_tipo public.notification_type,
  p_source TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notificaciones_pendientes
    (id_caso, id_usuario, tipo_notificacion, source)
  VALUES (p_id_caso, p_id_usuario, p_tipo, p_source)
  ON CONFLICT (id_caso, id_usuario, tipo_notificacion)
  DO NOTHING;
END;
$$;

-- Funciones auxiliares para los triggers
CREATE OR REPLACE FUNCTION public.trg_estudiantes_casos_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.enqueue_assignment_notification(
    NEW.id_caso,
    NEW.id_estudiante,
    'ESTUDIANTE_ASIGNADO',
    'trigger:estudiantes_casos'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_asesores_casos_notify()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  PERFORM public.enqueue_assignment_notification(
    NEW.id_caso,
    NEW.id_asesor,
    'ASESOR_ASIGNADO',
    'trigger:asesores_casos'
  );
  RETURN NEW;
END;
$$;

-- Triggers
DROP TRIGGER IF EXISTS trg_estudiantes_casos_notify ON public.estudiantes_casos;
CREATE TRIGGER trg_estudiantes_casos_notify
  AFTER INSERT ON public.estudiantes_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_estudiantes_casos_notify();

DROP TRIGGER IF EXISTS trg_asesores_casos_notify ON public.asesores_casos;
CREATE TRIGGER trg_asesores_casos_notify
  AFTER INSERT ON public.asesores_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_asesores_casos_notify();

-- Funcion para el cron: toma un lote de pendientes con bloqueo
CREATE OR REPLACE FUNCTION public.pop_notificaciones_pendientes(
  p_limit INT DEFAULT 10
)
RETURNS TABLE(
  id BIGINT,
  id_caso INTEGER,
  id_usuario UUID,
  tipo_notificacion public.notification_type,
  source TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH seleccionadas AS (
    SELECT np.id
    FROM public.notificaciones_pendientes np
    WHERE np.status = 'PENDING'
    ORDER BY np.id
    LIMIT p_limit
    FOR UPDATE OF np SKIP LOCKED
  )
  UPDATE public.notificaciones_pendientes np
  SET status = 'PROCESSING'
  FROM seleccionadas s
  WHERE np.id = s.id
  RETURNING
    np.id,
    np.id_caso,
    np.id_usuario,
    np.tipo_notificacion,
    np.source;
END;
$$;
