CREATE OR REPLACE FUNCTION public.trg_actividad_notificar()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, NEW.id_caso, 'actividad_registrada',
    'Nueva actividad', 'Se registro una nueva actividad en el caso #' || NEW.id_caso::TEXT
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = NEW.id_caso AND ec.id_estudiante != NEW.id_usuario AND ec.fecha_fin_asignacion IS NULL;
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, NEW.id_caso, 'actividad_registrada',
    'Nueva actividad', 'Se registro una nueva actividad en el caso #' || NEW.id_caso::TEXT
  FROM public.asesores_casos ac
  WHERE ac.id_caso = NEW.id_caso AND ac.id_asesor != NEW.id_usuario AND ac.fecha_fin_asignacion IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_actividad_notificar ON public.actividades_caso;
CREATE TRIGGER trg_actividad_notificar
  AFTER INSERT ON public.actividades_caso
  FOR EACH ROW EXECUTE FUNCTION public.trg_actividad_notificar();
