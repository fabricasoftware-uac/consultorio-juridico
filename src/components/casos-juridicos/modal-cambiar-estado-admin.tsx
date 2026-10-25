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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  ShieldAlert,
  Loader2,
  Info,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  FileCheck,
} from "lucide-react";
import type { EstadoEnum } from "app/types/database";
import { cambiarEstadoCasoAdmin } from "app/admin/actions/caseActions";
import { getStatusBadge } from "@/components/ui/status-badge";

interface ModalCambiarEstadoAdminProps {
  idCaso: number | string;
  estadoActual: EstadoEnum;
  onSuccess?: () => void;
}

interface EstadoInfo {
  label: string;
  descripcion: string;
  efecto?: string;
  icon: typeof Info;
  colorClass: string;
}

const GLOSARIO_ESTADOS: Record<EstadoEnum, EstadoInfo> = {
  en_proceso: {
    label: "En proceso",
    descripcion:
      "El estudiante está elaborando la entrevista o recopilando pruebas previas.",
    icon: Clock,
    colorClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  pendiente_aprobacion: {
    label: "Pendiente de aprobación",
    descripcion:
      "La entrevista fue radicada y espera la revisión y visto bueno del docente asesor.",
    icon: FileCheck,
    colorClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  en_correccion: {
    label: "En corrección",
    descripcion:
      "El asesor devolvió el caso al estudiante con observaciones para ajustes obligatorios.",
    efecto: "Se asignan automáticamente 3 días hábiles al estudiante para corregir.",
    icon: AlertTriangle,
    colorClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  activo: {
    label: "Activo / Aprobado",
    descripcion:
      "Caso formalmente aprobado y clasificado en trámite o asesoría legal en curso.",
    efecto: "Limpia fechas de vencimiento de revisión del asesor.",
    icon: CheckCircle2,
    colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cerrado: {
    label: "Cerrado",
    descripcion:
      "Trámite finalizado exitosamente (asesoría concluida o proceso judicial terminado con éxito).",
    efecto: "Registra fecha de cierre actual y limpia vencimientos pendientes.",
    icon: CheckCircle2,
    colorClass: "bg-slate-50 text-slate-700 border-slate-200",
  },
  archivado: {
    label: "Archivado",
    descripcion:
      "Trámite que no pudo continuar (usuario incontactable, desistimiento voluntario o falta de requisitos).",
    efecto: "Registra fecha de cierre actual y limpia vencimientos pendientes.",
    icon: Archive,
    colorClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

export function ModalCambiarEstadoAdmin({
  idCaso,
  estadoActual,
  onSuccess,
}: ModalCambiarEstadoAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoEnum>(estadoActual);
  const [motivo, setMotivo] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleOpen = () => {
    setNuevoEstado(estadoActual);
    setMotivo("");
    setIsOpen(true);
  };

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      toast.error("Por favor ingresa el motivo o justificación del cambio de estado.");
      return;
    }

    if (nuevoEstado === estadoActual) {
      toast.info("El caso ya se encuentra en este estado.");
      return;
    }

    startTransition(async () => {
      const res = await cambiarEstadoCasoAdmin(
        Number(idCaso),
        nuevoEstado,
        motivo,
      );

      if (res.success) {
        toast.success(res.message);
        setIsOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error);
      }
    });
  };

  const estadoInfo = GLOSARIO_ESTADOS[nuevoEstado];
  const IconComponent = estadoInfo?.icon || Info;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="w-full text-xs font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800 h-9 transition-colors flex items-center justify-center gap-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Cambiar Estado
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900 text-lg">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Cambio de Estado Administrativo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Modifica el estado del caso # {idCaso}. Esta acción queda registrada
              con fines de auditoría y trazabilidad.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Estado Actual */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Estado Actual:
              </span>
              <div>{getStatusBadge(estadoActual)}</div>
            </div>

            {/* Selector de Nuevo Estado */}
            <div className="space-y-1.5">
              <Label htmlFor="nuevo-estado" className="text-xs font-semibold text-slate-700">
                Nuevo Estado a Asignar
              </Label>
              <Select
                value={nuevoEstado}
                onValueChange={(val) => setNuevoEstado(val as EstadoEnum)}
                disabled={isPending}
              >
                <SelectTrigger id="nuevo-estado" className="h-10 text-sm">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en_proceso">
                    En proceso
                  </SelectItem>
                  <SelectItem value="pendiente_aprobacion">
                    Pendiente de aprobación
                  </SelectItem>
                  <SelectItem value="en_correccion">
                    En corrección
                  </SelectItem>
                  <SelectItem value="activo">
                    Activo / Aprobado
                  </SelectItem>
                  <SelectItem value="cerrado">
                    Cerrado
                  </SelectItem>
                  <SelectItem value="archivado">
                    Archivado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Glosario Interactivo Dinámico */}
            {estadoInfo && (
              <div
                className={`p-3.5 rounded-xl border transition-all duration-200 ${estadoInfo.colorClass}`}
              >
                <div className="flex items-start gap-2.5">
                  <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold leading-tight">
                      Glosario: {estadoInfo.label}
                    </p>
                    <p className="leading-relaxed opacity-95">
                      {estadoInfo.descripcion}
                    </p>
                    {estadoInfo.efecto && (
                      <p className="font-medium text-[11px] mt-1 pt-1 border-t border-current/20">
                        ⚡ {estadoInfo.efecto}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Justificación obligatoria */}
            <div className="space-y-1.5">
              <Label htmlFor="motivo-cambio" className="text-xs font-semibold text-slate-700">
                Motivo o Justificación del Cambio <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="motivo-cambio"
                placeholder="Explica la razón por la cual se cambia el estado del caso de forma administrativa..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={isPending}
                rows={3}
                className="text-sm border-slate-200 resize-none rounded-xl"
              />
              <p className="text-[11px] text-slate-400">
                Este motivo se almacenará permanentemente en el registro de auditoría del caso.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmar}
              disabled={isPending || !motivo.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Confirmar Cambio de Estado"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
