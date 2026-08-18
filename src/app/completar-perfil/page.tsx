"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";
import { completarPerfilEstudiante } from "../actions/completarPerfilEstudiante";
import { GeometricBackground } from "@/components/global/GeometricBackground";
import { Logo } from "@/components/global/LogoUac";
import type { JornadaEnum } from "../types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangleIcon, Plus, Trash2 } from "lucide-react";

interface PerfilForm {
  cedula: string;
  telefono: string;
  semestre: string;
  jornada: JornadaEnum | "";
  horarios: { turno: string; dia: string }[];
}

const EMPTY_FORM: PerfilForm = {
  cedula: "",
  telefono: "",
  semestre: "",
  jornada: "",
  // Arranca con una fila: el caso común es un solo turno.
  horarios: [{ dia: "", turno: "" }],
};

const DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

// `valor` debe coincidir con turno_enum ("9-11" | "2-4" | "4-6"); el resto es
// solo presentación para que el estudiante entienda el horario real.
const TURNOS = [
  { valor: "9-11", etiqueta: "Mañana", rango: "9–11 am" },
  { valor: "2-4", etiqueta: "Tarde", rango: "2–4 pm" },
  { valor: "4-6", etiqueta: "Tarde", rango: "4–6 pm" },
];

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [form, setForm] = useState<PerfilForm>(EMPTY_FORM);
  const [identidad, setIdentidad] = useState({ nombre: "", correo: "" });
  const [cargando, setCargando] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/");
        return;
      }
      setIdentidad({
        nombre:
          (user.user_metadata?.nombre_completo as string) ??
          (user.user_metadata?.full_name as string) ??
          (user.user_metadata?.name as string) ??
          "",
        correo: user.email ?? "",
      });
      setCargando(false);
    });
  }, [router]);

  const set = (field: keyof PerfilForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const cambiarHorario = (idx: number, campo: "dia" | "turno", valor: string) =>
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.map((h, i) =>
        i === idx ? { ...h, [campo]: valor } : h,
      ),
    }));

  const agregarFila = () =>
    setForm((prev) => ({
      ...prev,
      horarios: [...prev.horarios, { dia: "", turno: "" }],
    }));

  const quitarFila = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== idx),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cedula || !form.telefono || !form.semestre || !form.jornada) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    const semestre = parseInt(form.semestre, 10);
    if (isNaN(semestre) || semestre < 1 || semestre > 10) {
      toast.error("El semestre debe ser un número entre 1 y 10.");
      return;
    }

    // Se descartan las filas a medio llenar y los duplicados exactos.
    const horarios = form.horarios
      .filter((h) => h.dia && h.turno)
      .filter(
        (h, i, arr) =>
          arr.findIndex((x) => x.dia === h.dia && x.turno === h.turno) === i,
      );

    if (horarios.length === 0) {
      toast.error("Selecciona el día y la hora de tu turno.");
      return;
    }

    startTransition(async () => {
      const result = await completarPerfilEstudiante({
        cedula: form.cedula,
        telefono: form.telefono,
        semestre,
        jornada: form.jornada as JornadaEnum,
        horarios,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      // El rol ya está en el JWT; se refresca para que el middleware y el
      // layout vean el estado nuevo de inmediato.
      await supabase.auth.refreshSession();
      router.refresh();
      router.push("/estudiante/inicio");
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-50 py-10 px-4 sm:px-6">
      <GeometricBackground />

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <Logo className="h-20 w-20 text-blue-700" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Completa tu registro
          </h1>
          <p className="text-sm text-slate-600 max-w-md">
            Solo un paso más para acceder a tu panel de estudiante.
          </p>
        </div>

        <Alert className="border-amber-200 bg-amber-50 rounded-xl">
          <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
          <AlertTitle className="font-semibold text-amber-900">
            La información debe ser verídica y real
          </AlertTitle>
          <AlertDescription className="text-amber-800 text-sm mt-1">
            Estos datos se usan para asignarte casos, contactarte y programar tus
            turnos en el consultorio. Registrar información falsa o inexacta puede
            acarrear sanciones académicas.
          </AlertDescription>
        </Alert>

        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/90 backdrop-blur-md rounded-2xl">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">
              Tus datos
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Todos los campos son obligatorios.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600">Nombre completo</Label>
                  <Input
                    value={identidad.nombre}
                    disabled
                    className="h-9 text-sm bg-slate-50 text-slate-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-600">
                    Correo institucional
                  </Label>
                  <Input
                    value={identidad.correo}
                    disabled
                    className="h-9 text-sm bg-slate-50 text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="perfil-cedula" className="text-xs">
                    Número de documento
                  </Label>
                  <Input
                    id="perfil-cedula"
                    inputMode="numeric"
                    value={form.cedula}
                    onChange={(e) =>
                      set("cedula")(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={isPending}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Solo números, sin puntos ni espacios.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="perfil-telefono" className="text-xs">
                    Teléfono
                  </Label>
                  <Input
                    id="perfil-telefono"
                    inputMode="numeric"
                    value={form.telefono}
                    onChange={(e) =>
                      set("telefono")(e.target.value.replace(/\D/g, ""))
                    }
                    disabled={isPending}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-slate-500">
                    Número de celular a 10 dígitos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="perfil-semestre" className="text-xs">
                    Semestre
                  </Label>
                  <Input
                    id="perfil-semestre"
                    type="number"
                    min={1}
                    max={10}
                    value={form.semestre}
                    onChange={(e) => set("semestre")(e.target.value)}
                    disabled={isPending}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-slate-500">Del 1 al 10.</p>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="perfil-jornada" className="text-xs">
                    Jornada
                  </Label>
                  <Select
                    value={form.jornada}
                    onValueChange={set("jornada")}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Selecciona tu jornada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diurna">Diurna</SelectItem>
                      <SelectItem value="nocturna">Nocturna</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-800">
                  Ingresa tu turno en el consultorio
                </Label>
                <p className="text-xs text-slate-500">
                  El día y la hora en que atiendes. Si tienes más de un turno,
                  agrégalos con el botón de abajo.
                </p>

                <div className="space-y-2 pt-1">
                  {form.horarios.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Select
                        value={h.dia}
                        onValueChange={(v) => cambiarHorario(i, "dia", v)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-10 text-sm flex-1">
                          <SelectValue placeholder="Día" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIAS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={h.turno}
                        onValueChange={(v) => cambiarHorario(i, "turno", v)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-10 text-sm flex-1">
                          <SelectValue placeholder="Hora" />
                        </SelectTrigger>
                        <SelectContent>
                          {TURNOS.map((t) => (
                            <SelectItem key={t.valor} value={t.valor}>
                              {t.rango}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <button
                        type="button"
                        aria-label="Quitar este turno"
                        onClick={() => quitarFila(i)}
                        disabled={isPending || form.horarios.length === 1}
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-slate-200 disabled:hover:text-slate-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={agregarFila}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Agregar otro turno
                </button>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold mt-2"
              >
                {isPending ? <Spinner className="mr-2 h-5 w-5" /> : null}
                {isPending ? "Guardando..." : "Confirmar y continuar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
