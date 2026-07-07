import { supabase } from "@/lib/supabase/supabase-client";
import type { Estudiante } from "../../src/app/types/database";

export async function getEstudiantes(
  soloActivos: boolean = false,
): Promise<Estudiante[]> {
  let query = supabase.from("estudiantes").select(`
    id_perfil,
    semestre,
    jornada,
    turno,
    dia,
    perfil:perfiles!${soloActivos ? "inner" : "estudiantes_id_perfil_fkey"} (
      nombre_completo,
      correo,
      telefono,
      cedula,
      activo
    )
  `);

  if (soloActivos) {
    query = query.eq("perfiles.activo", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al traer los estudiantes:", error);
    return [];
  }

  // Conteo de casos ACTIVOS (fecha_fin_asignacion IS NULL)
  const ids = data?.map((e) => e.id_perfil) ?? [];
  const { data: counts } = await supabase
    .from("estudiantes_casos")
    .select("id_estudiante")
    .in("id_estudiante", ids)
    .is("fecha_fin_asignacion", null);

  const countMap: Record<string, number> = {};
  counts?.forEach((c) => {
    countMap[c.id_estudiante] = (countMap[c.id_estudiante] || 0) + 1;
  });

  const formattedData = data?.map((est) => ({
    ...est,
    total_casos: countMap[est.id_perfil] || 0,
  }));

  return formattedData as unknown as Estudiante[];
}
