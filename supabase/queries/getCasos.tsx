import { supabase } from "@/lib/supabase/supabase-client";
import type { Caso } from "../../src/app/types/database";

export async function getCasos(): Promise<Caso[]> {
  const { data, error } = await supabase.from("casos").select(`
    id_caso,
    tipo_proceso,
    resumen_hechos,
    observaciones,
    area,
    estado,
    clasificacion,
    fecha_creacion,
    fecha_cierre,
    fecha_vencimiento_estudiante,
    fecha_vencimiento_asesor,
    fecha_entrega_entrevista,
    ultima_modificacion,
    periodo,
    documentos_caso (count),
    usuarios (
      id_usuario,
      cedula,
      nombre_completo,
      correo,
      telefono
    ),
    estudiantes_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      estudiante:estudiantes (
        id_perfil,
        semestre,
        jornada,
        turno,
        ultimo_periodo_actualizado,
        perfil:perfiles (
          id,
          nombre_completo,
          correo,
          telefono,
          cedula,
          activo,
          horarios (
            dia,
            turno
          )
        )
      )
    ),
    asesores_casos (
      fecha_asignacion,
      fecha_fin_asignacion,
      asesor:asesores (
        id_perfil,
        area,
        turno,
        perfil:perfiles (
          nombre_completo,
          correo,
          telefono,
          cedula
        )
      )
    )
  `);

  if (error) {
    console.error("Error al traer los casos:", error);
    return [];
  }

  const formatted = data?.map((caso: any) => ({
    ...caso,
    estudiantes_casos: caso.estudiantes_casos?.map((ec: any) => ({
      ...ec,
      estudiante: ec.estudiante
        ? {
            ...ec.estudiante,
            horarios: ec.estudiante.perfil?.horarios ?? ec.estudiante.horarios ?? [],
          }
        : ec.estudiante,
    })),
  }));

  return (formatted ?? []) as unknown as Caso[];
}
