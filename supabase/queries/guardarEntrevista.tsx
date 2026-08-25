import { supabase } from "@/lib/supabase/supabase-client";

export async function guardarEntrevista({
  idCaso,
  usuarioId,
  caso,
  usuario,
  demandado,
  contrato,
  cambios,
  esCorreccion,
}: {
  idCaso: number;
  usuarioId: string;
  caso: Record<string, unknown>;
  usuario: Record<string, unknown>;
  demandado?: Record<string, unknown> | null;
  contrato?: Record<string, unknown> | null;
  cambios?: Record<string, unknown> | null;
  esCorreccion?: boolean;
}) {
  let { error } = await supabase.rpc("guardar_entrevista", {
    p_id_caso: idCaso,
    p_usuario_id: usuarioId,
    p_caso: caso,
    p_usuario: usuario,
    p_demandado: demandado ?? null,
    p_contrato: contrato ?? null,
    p_cambios: cambios ?? null,
    p_es_correccion: esCorreccion ?? false,
  });

  if (error) {
    // Si la función RPC antigua todavía tiene 6 parámetros, la llamamos e insertamos la auditoría por fuera
    const fallback = await supabase.rpc("guardar_entrevista", {
      p_id_caso: idCaso,
      p_usuario_id: usuarioId,
      p_caso: caso,
      p_usuario: usuario,
      p_demandado: demandado ?? null,
      p_contrato: contrato ?? null,
    });

    if (fallback.error) {
      throw new Error(`Error en guardar_entrevista: ${fallback.error.message}`);
    }

    if (esCorreccion && cambios) {
      await supabase.from("auditoria_casos").insert({
        id_caso: idCaso,
        id_usuario: usuarioId,
        accion: "edicion_estudiante_correccion",
        descripcion: "El estudiante aplicó correcciones al caso y lo envió para revisión.",
        metadata: cambios,
      });
    }
  }
}
