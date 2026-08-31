-- ============================================================================
-- estaAsignado solo cuenta asignaciones VIGENTES — Agosto 2026
--
-- Los estudiantes reportaron que un caso reasignado a otro compañero les seguía
-- apareciendo en su panel.
--
-- La reasignación era correcta: cierra la fila anterior poniéndole
-- fecha_fin_asignacion e inserta una nueva (ReasignarEquipo.tsx y
-- reasignar-equipo-tabla.tsx). El problema estaba en estaAsignado(), que
-- comprobaba la mera existencia de la fila sin mirar si seguía vigente, de modo
-- que el estudiante anterior conservaba el acceso para siempre.
--
-- No era solo cosmético: esta función gobierna las políticas RLS de casos,
-- documentos_caso y actividades_caso, así que el estudiante saliente podía
-- abrir el caso, leer los documentos del usuario y escribir observaciones en un
-- expediente que ya no era suyo.
--
-- notificar_usuarios_caso() (20260405000000) siempre filtró
-- `fecha_fin_asignacion IS NULL`: la intención del esquema era esta desde el
-- principio y la función de permisos se quedó atrás.
--
-- Alcance: cerrar o archivar un caso NO escribe fecha_fin_asignacion (se
-- verificó en cerrar-caso-asesor, botones-cerrar-archivar y
-- archivar-caso-pro-apoyo), así que nadie pierde acceso a su historial de casos
-- cerrados. Lo único que cierra una asignación es una reasignación explícita,
-- que es justo el caso que se quiere revocar.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.estaAsignado(uid uuid, caso_id integer)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.estudiantes_casos
     WHERE id_estudiante = uid
       AND id_caso = caso_id
       AND fecha_fin_asignacion IS NULL
    UNION ALL
    SELECT 1 FROM public.asesores_casos
     WHERE id_asesor = uid
       AND id_caso = caso_id
       AND fecha_fin_asignacion IS NULL
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '';
