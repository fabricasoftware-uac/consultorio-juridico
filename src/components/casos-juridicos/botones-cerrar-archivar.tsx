"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabase-client";
import { insertAuditEvent } from "../../../supabase/queries/auditoriaCasos";
import { toast } from "sonner";
import { Archive, CheckCircle } from "lucide-react";

interface Props {
  idCaso: string;
  estado: string;
  clasificacion?: string | null;
  onRefresh: () => void;
}

export function BotonesCerrarArchivar({ idCaso, estado, clasificacion, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  if (estado === "cerrado" || estado === "archivado") return null;

  const handleAction = async (nuevoEstado: "cerrado" | "archivado") => {
    // Validar documentos antes de cerrar
    if (nuevoEstado === "cerrado" && clasificacion !== "solo_asesoria") {
      const { data: docs } = await supabase
        .from("documentos_caso")
        .select("estado_doc")
        .eq("id_caso", idCaso);

      const pendientes = docs?.filter((d) => d.estado_doc !== "aprobado").length ?? 0;
      if (pendientes > 0) {
        toast.error(`Hay ${pendientes} documento(s) pendiente(s) de aprobación. No se puede cerrar el caso hasta que todos estén aprobados.`);
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("casos")
        .update({ estado: nuevoEstado, fecha_cierre: new Date().toISOString() })
        .eq("id_caso", idCaso);
      if (error) throw error;

      await insertAuditEvent(
        idCaso,
        nuevoEstado === "cerrado" ? "cierre" : "archivado",
        `El caso fue ${nuevoEstado === "cerrado" ? "cerrado" : "archivado"}.`,
        { estado_anterior: estado, nuevo_estado: nuevoEstado },
      );

      toast.success(`Caso ${nuevoEstado === "cerrado" ? "cerrado" : "archivado"} exitosamente`);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Error al actualizar el caso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("cerrado")}
          disabled={loading}
          className="flex-1 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 h-8"
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1" />
          Cerrar caso
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("archivado")}
          disabled={loading}
          className="flex-1 text-xs text-slate-500 border-slate-200 hover:bg-slate-100 h-8"
        >
          <Archive className="w-3.5 h-3.5 mr-1" />
          Archivar
        </Button>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-700 leading-relaxed">
        <p className="font-semibold mb-1">¿Cuándo usar cada uno?</p>
        <p><strong>Cerrar caso:</strong> el trámite finalizó exitosamente. El cliente recibió la asesoría, el proceso judicial concluyó o se llegó a un acuerdo.</p>
        <p className="mt-1"><strong>Archivar:</strong> el caso no pudo continuar. El cliente no volvió, no se pudo contactar, abandonó el proceso, o no se cumplen los requisitos para continuar.</p>
      </div>
    </div>
  );
}
