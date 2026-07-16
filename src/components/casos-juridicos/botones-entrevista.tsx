"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { toast } from "sonner";
import type { Caso, Demandado, ContratoLaboral } from "app/types/database";
import { getContratoByUsuarioId } from "../../../supabase/queries/getContratoByUsuarioId";
import { exportarEntrevistaExcel } from "@/lib/exportar-entrevista-excel";
import { EntrevistaReadonly } from "./entrevista-readonly";

interface Props {
  idCaso: string;
  caso: Caso;
  demandado: Demandado | null;
}

export function BotonesEntrevista({ idCaso, caso, demandado }: Props) {
  const [contrato, setContrato] = useState<ContratoLaboral | null>(null);
  const [loadingContrato, setLoadingContrato] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch contrato cuando el componente se monta
  useEffect(() => {
    const userId = caso?.usuarios?.id_usuario;
    if (userId) {
      setLoadingContrato(true);
      getContratoByUsuarioId(userId)
        .then((data) => setContrato(data))
        .finally(() => setLoadingContrato(false));
    }
  }, [caso?.usuarios?.id_usuario]);

  const handleExportar = async () => {
    try {
      await exportarEntrevistaExcel(caso, demandado, contrato, idCaso);
      toast.success("Entrevista exportada a Excel");
    } catch {
      toast.error("Error al exportar");
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="text-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Ver entrevista
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportar}
          disabled={loadingContrato}
          className="text-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Exportar Excel
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle className="text-lg">Entrevista — {caso.usuarios?.nombre_completo || `Caso #${idCaso}`}</DialogTitle>
            <DialogDescription>
              Caso #{idCaso} · {caso.estado?.replace(/_/g, " ")}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-4 overflow-y-auto flex-1">
            <EntrevistaReadonly caso={caso} demandado={demandado} contrato={contrato} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
