import { supabase } from "@/lib/supabase/supabase-client";

export type Horario = {
  id?: number;
  id_perfil: string;
  turno: string;
  dia: string;
};

export async function getHorarios(idPerfil: string): Promise<Horario[]> {
  const { data } = await supabase.from("horarios").select("*").eq("id_perfil", idPerfil);
  return data ?? [];
}

export async function saveHorarios(idPerfil: string, horarios: Omit<Horario, "id" | "id_perfil">[]) {
  // Borrar existentes
  await supabase.from("horarios").delete().eq("id_perfil", idPerfil);
  // Insertar nuevos
  if (horarios.length > 0) {
    const rows = horarios.map((h) => ({ id_perfil: idPerfil, turno: h.turno, dia: h.dia }));
    await supabase.from("horarios").insert(rows);
  }
}
