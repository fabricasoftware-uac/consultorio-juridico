CREATE OR REPLACE FUNCTION public.trg_asignacion_estudiante_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Notificacion
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_estudiante, NEW.id_caso, 'asignacion_estudiante',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  -- Auditoria
  INSERT INTO public.auditoria_casos
    (id_caso, id_usuario, accion, descripcion)
  VALUES (
    NEW.id_caso, NEW.id_estudiante, 'asignacion',
    'Estudiante asignado al caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_asignacion_asesor_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Notificacion
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_asesor, NEW.id_caso, 'asignacion_asesor',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  -- Auditoria
  INSERT INTO public.auditoria_casos
    (id_caso, id_usuario, accion, descripcion)
  VALUES (
    NEW.id_caso, NEW.id_asesor, 'asignacion',
    'Asesor asignado al caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;
