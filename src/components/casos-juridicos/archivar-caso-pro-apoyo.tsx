"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/supabase-client";
import { insertAuditEvent } from "../../../supabase/queries/auditoriaCasos";
import { toast } from "sonner";
import { Archive, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  idCaso: string;
  estado: string;
  onRefresh: () => void;
}

export function ArchivarCasoProApoyo({ idCaso, estado, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  if (estado !== "cerrado") return null;

  const handleArchivar = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("casos")
        .update({
          estado: "archivado",
          fecha_cierre: new Date().toISOString(),
          fecha_vencimiento_estudiante: null,
          fecha_vencimiento_asesor: null,
        })
        .eq("id_caso", idCaso);
      if (error) throw error;

      await insertAuditEvent(
        idCaso,
        "archivado",
        "El profesional de apoyo archivó el caso como paso final.",
        { estado_anterior: estado, nuevo_estado: "archivado" },
      );

      toast.success("Caso archivado exitosamente");
      setOpen(false);
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Error al archivar el caso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          className="w-full text-xs text-slate-600 border-slate-300 hover:bg-slate-100 h-8"
        >
          <Archive className="w-3.5 h-3.5 mr-1" />
          Archivar caso
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-amber-100">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <DialogTitle>Archivar caso #{idCaso}</DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-sm leading-relaxed">
            ¿Está seguro de archivar este caso? Esta acción no se puede deshacer.
            El caso pasará a estado <strong>archivado</strong> y finalizará su ciclo de vida.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            onClick={handleArchivar}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-800"
          >
            {loading ? "Archivando..." : "Confirmar archivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
