"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BellRing, Send, UserCheck, AlertTriangle, Loader2 } from "lucide-react";
import { solicitarCierreCasoAdmin } from "app/admin/actions/caseActions";

export interface ModalSolicitarCierreAdminProps {
  idCaso: number | string;
  estado: string;
  nombreAsesor?: string | null;
  tieneAsesor: boolean;
  onSuccess?: () => void;
}

export function ModalSolicitarCierreAdmin({
  idCaso,
  estado,
  nombreAsesor,
  tieneAsesor,
  onSuccess,
}: ModalSolicitarCierreAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [isPending, startTransition] = useTransition();

  // Solo se debe mostrar cuando el caso está activo
  if (estado !== "activo") {
    return null;
  }

  const handleOpenChange = (open: boolean) => {
    if (isPending) return;
    setIsOpen(open);
    if (!open) {
      setObservaciones("");
    }
  };

  const handleEnviar = () => {
    const motivoLimpio = observaciones.trim();
    if (!motivoLimpio) {
      toast.error("Por favor ingresa las observaciones o el motivo de la solicitud.");
      return;
    }

    if (!tieneAsesor) {
      toast.error("El caso no cuenta con un asesor activo asignado.");
      return;
    }

    startTransition(async () => {
      const res = await solicitarCierreCasoAdmin(Number(idCaso), motivoLimpio);

      if (res.success) {
        toast.success(res.message);
        setObservaciones("");
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full text-xs font-semibold text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 h-9 transition-colors flex items-center justify-center gap-1.5"
      >
        <BellRing className="w-3.5 h-3.5" />
        Solicitar cierre al asesor
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-lg">
              <BellRing className="w-5 h-5 text-purple-600" />
              Solicitar Cierre del Caso al Asesor
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Envía una notificación formal al docente asesor asignado para que revise y
              proceda con el cierre del caso #{idCaso}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {tieneAsesor ? (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-purple-50/80 border border-purple-100 text-purple-900 text-xs">
                <UserCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-semibold text-purple-950">Asesor activo asignado:</span>
                  <p className="text-purple-800 font-medium">{nombreAsesor || "Docente Asesor"}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Sin asesor asignado</span>
                  <p className="text-amber-800 mt-0.5">
                    Este caso no tiene un docente asesor asignado actualmente. Debe asignar un asesor antes de solicitar el cierre.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="motivo-solicitud-cierre" className="text-xs font-semibold text-slate-700">
                Observaciones / Motivo de la solicitud *
              </Label>
              <Textarea
                id="motivo-solicitud-cierre"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Explique las razones por las cuales el caso debe ser cerrado (ej. trámite cumplido, inactividad justificada, acuerdo entre partes)..."
                className="min-h-[110px] text-xs resize-none"
                disabled={isPending || !tieneAsesor}
              />
              <p className="text-[11px] text-slate-500">
                Esta observación quedará registrada en la auditoría del caso y será visible para el asesor en su panel.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleEnviar}
              disabled={isPending || !tieneAsesor || !observaciones.trim()}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Enviar solicitud
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
