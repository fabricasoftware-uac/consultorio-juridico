import { supabase } from "@/lib/supabase/supabase-client";

/**
 * Registra el asesor que le dio retroalimentación al estudiante y lo asigna al
 * caso. Va por RPC porque el rol `estudiante` no tiene `asesores_casos.create`;
 * la función valida en el servidor que sea el estudiante del caso y que el caso
 * siga siendo editable.
 */
export async function asignarAsesorRetroalimentacion(
  idCaso: number,
  idAsesor: string,
) {
  const { error } = await supabase.rpc("asignar_asesor_retroalimentacion", {
    p_id_caso: idCaso,
    p_id_asesor: idAsesor,
  });
  if (error) throw new Error(error.message);
}
