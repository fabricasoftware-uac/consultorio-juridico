import { supabase } from "@/lib/supabase/supabase-client";

export type LlamadoAtencion = {
  id: number;
  id_caso: number;
  id_usuario: string;
  tipo: "estudiante" | "asesor";
  motivo: string;
  fecha_creacion: string;
  leido: boolean;
  resuelto?: boolean;
  fecha_resolucion?: string | null;
  resuelto_por?: string | null;
};

export async function getLlamadosByCaso(
  id_caso: string,
): Promise<LlamadoAtencion[]> {
  const { data, error } = await supabase
    .from("llamados_atencion")
    .select("*")
    .eq("id_caso", id_caso)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    console.error("Error al traer llamados de atención:", error);
    return [];
  }

  return data ?? [];
}
