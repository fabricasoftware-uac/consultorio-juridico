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

  // Los horarios reales viven en `horarios` desde la migración
  // 20260423000000_formulario_unificado. Las columnas estudiantes.dia y
  // estudiantes.turno quedaron muertas: registerEstudiante nunca las escribe.
  const { data: horarios, error: errorHorarios } = await supabase
    .from("horarios")
    .select("id_perfil, dia, turno")
    .in("id_perfil", ids);

  // Si esto falla en silencio, el filtro "estudiantes de hoy" se vacía y parece
  // que no hubiera nadie disponible. Mejor que quede constancia en consola.
  if (errorHorarios) {
    console.error("Error al traer los horarios:", errorHorarios);
  }

  const horariosMap: Record<string, { dia: string; turno: string }[]> = {};
  horarios?.forEach((h) => {
    (horariosMap[h.id_perfil] ??= []).push({ dia: h.dia, turno: h.turno });
  });

  const formattedData = data?.map((est) => ({
    ...est,
    total_casos: countMap[est.id_perfil] || 0,
    horarios: horariosMap[est.id_perfil] ?? [],
  }));

  return formattedData as unknown as Estudiante[];
}
