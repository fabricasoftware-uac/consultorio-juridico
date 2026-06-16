import { supabase } from "@/lib/supabase/supabase-client";

export type AuditEvent = {
  id: number;
  id_caso: number;
  id_usuario: string;
  accion: string;
  descripcion: string;
  metadata: Record<string, any> | null;
  created_at: string;
};

export async function getAuditEventsByCaso(
  id_caso: string,
): Promise<AuditEvent[]> {
  const { data, error } = await supabase
    .from("auditoria_casos")
    .select("*")
    .eq("id_caso", id_caso)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al traer auditoría:", error);
    return [];
  }

  return data ?? [];
}

export async function insertAuditEvent(
  id_caso: string | number,
  accion: string,
  descripcion: string,
  metadata?: Record<string, any>,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("auditoria_casos").insert({
    id_caso: Number(id_caso),
    id_usuario: user?.id ?? "unknown",
    accion,
    descripcion,
    metadata: metadata ?? null,
  });

  if (error) {
    console.error("Error al insertar evento de auditoría:", error);
  }
}

export type ObservacionConAutor = AuditEvent & {
  autor_nombre?: string;
};

export async function getObservacionesByCaso(
  id_caso: string,
): Promise<ObservacionConAutor[]> {
  const { data, error } = await supabase
    .from("auditoria_casos")
    .select("*, perfiles(nombre_completo)")
    .eq("id_caso", id_caso)
    .eq("accion", "observacion")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error al traer observaciones:", error);
    return [];
  }

  return (data ?? []).map((item: any) => ({
    ...item,
    autor_nombre: item.perfiles?.nombre_completo ?? "Desconocido",
  }));
}
