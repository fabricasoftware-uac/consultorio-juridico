-- 1. Tabla de notificaciones internas
CREATE TABLE public.notificaciones_usuario (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario UUID NOT NULL,
  id_caso INTEGER REFERENCES public.casos(id_caso) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notif_usuario_leida
  ON public.notificaciones_usuario (id_usuario, leida);

-- 2. RLS: cada usuario solo ve sus notificaciones
ALTER TABLE public.notificaciones_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_own_select ON public.notificaciones_usuario
  FOR SELECT USING (id_usuario = auth.uid());

CREATE POLICY notif_own_update ON public.notificaciones_usuario
  FOR UPDATE USING (id_usuario = auth.uid());

-- 3. Funcion para notificar a usuarios de un caso (excepto el autor)
CREATE OR REPLACE FUNCTION public.notificar_usuarios_caso(
  p_id_caso INTEGER,
  p_id_autor UUID,
  p_tipo TEXT,
  p_titulo TEXT,
  p_mensaje TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Notificar a estudiantes asignados
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, p_id_caso, p_tipo, p_titulo, p_mensaje
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = p_id_caso
    AND ec.id_estudiante != p_id_autor
    AND ec.fecha_fin_asignacion IS NULL;

  -- Notificar a asesores asignados
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, p_id_caso, p_tipo, p_titulo, p_mensaje
  FROM public.asesores_casos ac
  WHERE ac.id_caso = p_id_caso
    AND ac.id_asesor != p_id_autor
    AND ac.fecha_fin_asignacion IS NULL;
END;
$$;

-- 4. Trigger sobre auditoria_casos para eventos existentes
CREATE OR REPLACE FUNCTION public.trg_auditoria_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_titulo TEXT;
  v_mensaje TEXT;
BEGIN
  -- Solo procesar eventos relevantes
  IF NEW.accion NOT IN ('entrevista', 'aprobacion', 'correccion', 'observacion') THEN
    RETURN NEW;
  END IF;

  CASE NEW.accion
    WHEN 'entrevista' THEN
      v_titulo := 'Entrevista completada';
      v_mensaje := 'El estudiante completo la entrevista del caso #' || NEW.id_caso::TEXT;
    WHEN 'aprobacion' THEN
      v_titulo := 'Caso aprobado';
      v_mensaje := 'El asesor aprobo el caso #' || NEW.id_caso::TEXT;
    WHEN 'correccion' THEN
      v_titulo := 'Ajustes solicitados';
      v_mensaje := 'El asesor solicito ajustes en el caso #' || NEW.id_caso::TEXT;
    WHEN 'observacion' THEN
      v_titulo := 'Nueva observacion';
      v_mensaje := 'Hay una nueva observacion en el caso #' || NEW.id_caso::TEXT;
  END CASE;

  PERFORM public.notificar_usuarios_caso(
    NEW.id_caso, NEW.id_usuario, NEW.accion, v_titulo, v_mensaje
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auditoria_notificar ON public.auditoria_casos;
CREATE TRIGGER trg_auditoria_notificar
  AFTER INSERT ON public.auditoria_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_auditoria_notificar();

-- 5. Trigger para asignacion de estudiante
CREATE OR REPLACE FUNCTION public.trg_asignacion_estudiante_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_estudiante, NEW.id_caso, 'asignacion_estudiante',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_asignacion_estudiante_notificar ON public.estudiantes_casos;
CREATE TRIGGER trg_asignacion_estudiante_notificar
  AFTER INSERT ON public.estudiantes_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_asignacion_estudiante_notificar();

-- 6. Trigger para asignacion de asesor
CREATE OR REPLACE FUNCTION public.trg_asignacion_asesor_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_asesor, NEW.id_caso, 'asignacion_asesor',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_asignacion_asesor_notificar ON public.asesores_casos;
CREATE TRIGGER trg_asignacion_asesor_notificar
  AFTER INSERT ON public.asesores_casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_asignacion_asesor_notificar();
