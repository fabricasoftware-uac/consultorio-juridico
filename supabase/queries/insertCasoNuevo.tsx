import { supabase } from "@/lib/supabase/supabase-client";
import type { Caso } from "../../src/app/types/database";
import { insertAuditEvent } from "./auditoriaCasos";
import { sumarDiasHabiles } from "@/lib/utils";

export async function insertCasoNuevo(
  caso: Caso,
  id_usuario: string,
): Promise<Caso[]> {
  const { data, error } = await supabase
    .from("casos")
    .insert({
      id_usuario: id_usuario,
      area: caso.area,
      fecha_creacion: caso.fecha_creacion,
      estado: caso.estado,
      observaciones: caso.observaciones,
      tipo_proceso: caso.tipo_proceso || "No creado",
      fecha_vencimiento_estudiante: sumarDiasHabiles(new Date(), 3).toISOString(),
      periodo: (() => {
        const ahora = new Date();
        const year = ahora.getFullYear();
        return ahora.getMonth() < 6 ? `${year}-1` : `${year}-2`;
      })(),
    })
    .select();

  if (error) {
    console.error("Error al insertar el caso:", error);
    throw error;
  }

  const inserted = data?.[0];
  if (inserted?.id_caso) {
    await insertAuditEvent(
      inserted.id_caso,
      "creacion",
      `Caso creado en área ${inserted.area} con estado ${inserted.estado}.`,
      { area: inserted.area, estado: inserted.estado },
    );
  }

  return data ?? [];
}
