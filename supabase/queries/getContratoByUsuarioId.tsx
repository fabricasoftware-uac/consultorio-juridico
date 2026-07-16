import { supabase } from "@/lib/supabase/supabase-client";
import type { ContratoLaboral } from "../../src/app/types/database";

export async function getContratoByUsuarioId(
  id_usuario: string,
): Promise<ContratoLaboral | null> {
  const { data, error } = await supabase
    .from("contratos_laborales")
    .select("*")
    .eq("id_usuario", id_usuario)
    .maybeSingle();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching contrato by usuario ID:", error);
    }
    return null;
  }

  return data;
}
