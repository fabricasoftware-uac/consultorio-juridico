"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  actualizarSemestreEstudianteAction,
  type DatosEstudianteTransicion,
} from "app/actions/periodoAcademicoActions";
import { sugerirSiguienteSemestre } from "@/lib/transicion-semestral";
import type { JornadaEnum } from "app/types/database";
import {
  Sparkles,
  Calendar,
  Clock,
  Phone,
  GraduationCap,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const DIAS = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
] as const;

const TURNOS = [
  { valor: "9-11", label: "Mañana (9:00 am - 11:00 am)" },
  { valor: "2-4", label: "Tarde (2:00 pm - 4:00 pm)" },
  { valor: "4-6", label: "Tarde (4:00 pm - 6:00 pm)" },
] as const;

interface ModalActualizarSemestreProps {
  open: boolean;
  periodoActivo: string;
  datosEstudiante: DatosEstudianteTransicion | null;
  onSuccess: () => void;
}

export function ModalActualizarSemestre({
  open,
  periodoActivo,
  datosEstudiante,
  onSuccess,
}: ModalActualizarSemestreProps) {
  const [semestre, setSemestre] = useState<string>("7");
  const [jornada, setJornada] = useState<JornadaEnum>("diurna");
  const [telefono, setTelefono] = useState<string>("");
  const [horarios, setHorarios] = useState<{ dia: string; turno: string }[]>([
    { dia: "", turno: "" },
  ]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!datosEstudiante) return;

    // Sugerencia: semestre + 1 si es menor a 10, o tope 10
    const sugerido = sugerirSiguienteSemestre(datosEstudiante.semestre);
    setSemestre(sugerido.toString());

    if (datosEstudiante.jornada) {
      setJornada(datosEstudiante.jornada);
    }

    if (datosEstudiante.telefono) {
      setTelefono(datosEstudiante.telefono.replace(/\D/g, ""));
    }

    if (datosEstudiante.horarios && datosEstudiante.horarios.length > 0) {
      setHorarios(datosEstudiante.horarios);
    } else {
      setHorarios([{ dia: "", turno: "" }]);
    }
  }, [datosEstudiante]);

  const agregarTurno = () => {
    setHorarios((prev) => [...prev, { dia: "", turno: "" }]);
  };

  const quitarTurno = (index: number) => {
    if (horarios.length <= 1) return;
    setHorarios((prev) => prev.filter((_, i) => i !== index));
  };

  const actualizarTurno = (
    index: number,
    campo: "dia" | "turno",
    valor: string,
  ) => {
    setHorarios((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [campo]: valor } : item)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const semestreNum = parseInt(semestre, 10);
    if (isNaN(semestreNum) || semestreNum < 1 || semestreNum > 10) {
      toast.error("Por favor selecciona un semestre válido (1 al 10).");
      return;
    }

    if (!jornada) {
      toast.error("Por favor selecciona tu jornada.");
      return;
    }

    const telLimpio = telefono.trim().replace(/\D/g, "");
    if (!telLimpio || telLimpio.length < 7 || telLimpio.length > 15) {
      toast.error("Por favor ingresa un número de teléfono válido (7 a 15 dígitos).");
      return;
    }

    const horariosValidos = horarios.filter((h) => h.dia && h.turno);
    if (horariosValidos.length === 0) {
      toast.error("Por favor registra al menos un turno con día y horario de atención.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await actualizarSemestreEstudianteAction({
          semestre: semestreNum,
          jornada,
          telefono: telLimpio,
          horarios: horariosValidos,
        });

        if (res.success) {
          toast.success(res.message);
          onSuccess();
        } else {
          toast.error(res.error || "Ocurrió un error al actualizar tus datos.");
        }
      } catch (err) {
        console.error("Error al actualizar semestre:", err);
        toast.error("Error de conexión. Inténtalo nuevamente.");
      }
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl [&>button.absolute]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                ¡Bienvenido al nuevo período académico {periodoActivo}!
              </DialogTitle>
              <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Período Vigente: {periodoActivo}
              </span>
            </div>
          </div>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed pt-1">
            Para recibir casos y coordinar tus turnos de asesoría, por favor
            confirma tu información académica para este semestre:
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Semestre y Jornada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="modal-semestre" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Semestre
              </Label>
              <Select
                value={semestre}
                onValueChange={setSemestre}
                disabled={isPending}
              >
                <SelectTrigger id="modal-semestre" className="h-10 rounded-xl bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona semestre" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      Semestre {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-jornada" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Jornada
              </Label>
              <Select
                value={jornada}
                onValueChange={(val) => setJornada(val as JornadaEnum)}
                disabled={isPending}
              >
                <SelectTrigger id="modal-jornada" className="h-10 rounded-xl bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Selecciona jornada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diurna">Diurna</SelectItem>
                  <SelectItem value="nocturna">Nocturna</SelectItem>
                  <SelectItem value="mixto">Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label htmlFor="modal-telefono" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Teléfono de contacto
            </Label>
            <Input
              id="modal-telefono"
              inputMode="numeric"
              placeholder="Ej. 3001234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50 border-slate-200"
            />
            <p className="text-[11px] text-slate-500">
              Número de teléfono o celular donde los asesores y coordinadores puedan contactarte.
            </p>
          </div>

          {/* Turnos en Consultorio */}
          <div className="space-y-2.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  Turno(s) en Consultorio
                </Label>
                <p className="text-[11px] text-slate-500">
                  Indica los días y horarios en los que asistirás presencialmente al consultorio.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarTurno}
                disabled={isPending}
                className="text-xs h-8 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Agregar Turno
              </Button>
            </div>

            <div className="space-y-2">
              {horarios.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl border border-slate-200/70">
                  <div className="flex-1">
                    <Select
                      value={h.dia}
                      onValueChange={(val) => actualizarTurno(idx, "dia", val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-9 bg-white text-xs rounded-lg border-slate-200">
                        <SelectValue placeholder="Selecciona día" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <Select
                      value={h.turno}
                      onValueChange={(val) => actualizarTurno(idx, "turno", val)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-9 bg-white text-xs rounded-lg border-slate-200">
                        <SelectValue placeholder="Selecciona turno" />
                      </SelectTrigger>
                      <SelectContent>
                        {TURNOS.map((t) => (
                          <SelectItem key={t.valor} value={t.valor} className="text-xs">
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {horarios.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => quitarTurno(idx)}
                      disabled={isPending}
                      className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                      title="Eliminar este turno"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10 px-6 shadow-xs flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando información...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar y Continuar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
