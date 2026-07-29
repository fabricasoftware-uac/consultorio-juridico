import { supabase } from "@/lib/supabase/supabase-client";

export async function insertAsesoresCasos(id_caso: string, id_asesor: string) {
  const { error } = await supabase.from("asesores_casos").insert({
    id_asesor,
    id_caso,
    fecha_asignacion: new Date().toISOString(),
    fecha_fin_asignacion: null,
  });

  if (error) {
    console.error("Error al insertar el asesor:", error);
    throw error;
  }
}
