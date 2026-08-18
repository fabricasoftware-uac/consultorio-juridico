import { supabase } from "@/lib/supabase/supabase-client";

/**
 * Guarda el avance parcial de la entrevista en el servidor, para que el
 * estudiante pueda retomarla desde cualquier dispositivo.
 *
 * Va por RPC: el estudiante no tiene UPDATE sobre `casos`, y la función acota
 * la escritura a las columnas del borrador y a sus propios casos editables.
 */
export async function guardarBorradorEntrevista(
  idCaso: number,
  borrador: Record<string, unknown>,
): Promise<string> {
  const { data, error } = await supabase.rpc("guardar_borrador_entrevista", {
    p_id_caso: idCaso,
    p_borrador: borrador,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function limpiarBorradorEntrevista(idCaso: number) {
  const { error } = await supabase.rpc("limpiar_borrador_entrevista", {
    p_id_caso: idCaso,
  });
  if (error) console.error("No se pudo limpiar el borrador:", error.message);
}
