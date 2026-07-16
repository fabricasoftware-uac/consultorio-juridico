import { supabase } from "@/lib/supabase/supabase-client";

export async function guardarEntrevista({
  idCaso,
  usuarioId,
  caso,
  usuario,
  demandado,
  contrato,
}: {
  idCaso: number;
  usuarioId: string;
  caso: Record<string, unknown>;
  usuario: Record<string, unknown>;
  demandado?: Record<string, unknown> | null;
  contrato?: Record<string, unknown> | null;
}) {
  const { error } = await supabase.rpc("guardar_entrevista", {
    p_id_caso: idCaso,
    p_usuario_id: usuarioId,
    p_caso: caso,
    p_usuario: usuario,
    p_demandado: demandado ?? null,
    p_contrato: contrato ?? null,
  });

  if (error) {
    throw new Error(`Error en guardar_entrevista: ${error.message}`);
  }
}
