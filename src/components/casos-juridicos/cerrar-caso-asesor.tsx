"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabase-client";
import { insertAuditEvent } from "../../../supabase/queries/auditoriaCasos";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

interface Props {
  idCaso: string;
  estado: string;
  clasificacion?: string | null;
  onRefresh: () => void;
}

export function CerrarCasoAsesor({ idCaso, estado, clasificacion, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  if (estado !== "activo") return null;

  const handleCerrar = async () => {
    // Validar documentos antes de cerrar
    if (clasificacion !== "solo_asesoria") {
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
        .update({
          estado: "cerrado",
          fecha_cierre: new Date().toISOString(),
          fecha_vencimiento_estudiante: null,
          fecha_vencimiento_asesor: null,
        })
        .eq("id_caso", idCaso);
      if (error) throw error;

      await insertAuditEvent(
        idCaso,
        "cierre",
        "El asesor cerró el caso.",
        { estado_anterior: estado, nuevo_estado: "cerrado" },
      );

      toast.success("Caso cerrado exitosamente");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Error al cerrar el caso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCerrar}
      disabled={loading}
      className="w-full text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 h-8"
    >
      <CheckCircle className="w-3.5 h-3.5 mr-1" />
      Cerrar caso
    </Button>
  );
}
