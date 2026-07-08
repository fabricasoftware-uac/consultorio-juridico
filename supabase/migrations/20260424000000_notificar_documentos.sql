CREATE OR REPLACE FUNCTION public.trg_documento_notificar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Notificar a estudiantes y asesores del caso (excepto quien subio)
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, NEW.id_caso, 'documento_subido',
    'Documento subido',
    'Se subio un nuevo documento al caso #' || NEW.id_caso::TEXT
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = NEW.id_caso AND ec.id_estudiante != NEW.id_usuario AND ec.fecha_fin_asignacion IS NULL;

  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, NEW.id_caso, 'documento_subido',
    'Documento subido',
    'Se subio un nuevo documento al caso #' || NEW.id_caso::TEXT
  FROM public.asesores_casos ac
  WHERE ac.id_caso = NEW.id_caso AND ac.id_asesor != NEW.id_usuario AND ac.fecha_fin_asignacion IS NULL;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_documento_notificar ON public.documentos_caso;
CREATE TRIGGER trg_documento_notificar
  AFTER INSERT ON public.documentos_caso
  FOR EACH ROW EXECUTE FUNCTION public.trg_documento_notificar();
