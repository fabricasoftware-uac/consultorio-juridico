import { supabase } from "@/lib/supabase/supabase-client";
import type { Asesor } from "../../src/app/types/database";

export async function getAsesores(
  soloActivos: boolean = false,
): Promise<Asesor[]> {
  let query = supabase.from("asesores").select(`
    id_perfil,
    turno,
    area,
    horario,
    perfil:perfiles!${soloActivos ? "inner" : "asesores_id_perfil_fkey"} (
      nombre_completo,
      correo,
      telefono,
      activo,
      cedula
    )
  `);

  if (soloActivos) {
    query = query.eq("perfiles.activo", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al traer los asesores:", error);
    return [];
  }

  // Conteo de casos ACTIVOS (fecha_fin_asignacion IS NULL)
  const ids = data?.map((a) => a.id_perfil) ?? [];
  const { data: counts } = await supabase
    .from("asesores_casos")
    .select("id_asesor")
    .in("id_asesor", ids)
    .is("fecha_fin_asignacion", null);

  const countMap: Record<string, number> = {};
  counts?.forEach((c) => {
    countMap[c.id_asesor] = (countMap[c.id_asesor] || 0) + 1;
  });

  const formattedData = data?.map((ase) => ({
    ...ase,
    total_casos: countMap[ase.id_perfil] || 0,
  }));

  return formattedData as unknown as Asesor[];
}
