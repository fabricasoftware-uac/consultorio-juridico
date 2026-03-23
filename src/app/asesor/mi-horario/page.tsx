"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Navbar } from "../components/NavBarAsesor";
import { supabase } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";
import { Clock, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Asesor } from "app/types/database";

type Turno = "9-11" | "2-4" | "4-6";
type HorarioDia = { activo: boolean; turno: Turno };
type HorarioSemana = Record<string, HorarioDia>;

const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const turnosDisponibles: Turno[] = ["9-11", "2-4", "4-6"];

const horarioPorDefecto: HorarioSemana = diasSemana.reduce((acc, dia) => {
  acc[dia] = { activo: true, turno: "9-11" };
  return acc;
}, {} as HorarioSemana);

export default function MiHorarioPage() {
  const [horario, setHorario] = useState<HorarioSemana>(horarioPorDefecto);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: authData, error: authErr } =
          await supabase.auth.getUser();
        if (authErr || !authData.user) throw authErr;

        const uid = authData.user.id;
        setUserId(uid);

        const { data: asesor, error: asesorErr } = await supabase
          .from("asesores")
          .select("*")
          .eq("id_perfil", uid)
          .single();

        if (asesorErr && asesorErr.code !== "PGRST116") {
          throw asesorErr;
        }

        if (asesor?.horario) {
          // Merge on top of default
          setHorario({ ...horarioPorDefecto, ...(asesor.horario as any) });
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar el horario");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChangeDia = (
    dia: string,
    field: keyof HorarioDia,
    value: any,
  ) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from("asesores")
        .update({ horario })
        .eq("id_perfil", userId);

      if (error) throw error;
      toast.success("Horario guardado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar el horario");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Spinner className="h-10 w-10 text-blue-600 mb-4" />
          <p className="mt-4 text-slate-500 font-medium">Cargando horario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <div className="mb-8 space-y-4">
          <Link
            href="/asesor/inicio"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-8 h-8 text-blue-700" />
                Mi Horario de Atención
              </h1>
              <p className="text-slate-500 mt-1">
                Selecciona tu turno de atención para cada día.
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-md h-11 px-6 w-full sm:w-auto"
            >
              {saving ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>

        <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-6 sm:p-8 rounded-2xl">
          <div className="space-y-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-3">Día</div>
              <div className="col-span-4 text-center">Estado</div>
              <div className="col-span-5 text-center">Turno asignado</div>
            </div>

            {diasSemana.map((dia) => {
              const info = horario[dia] || horarioPorDefecto[dia];
              return (
                <div
                  key={dia}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-xl transition-all ${
                    info.activo
                      ? "bg-blue-50/50 border border-blue-200"
                      : "bg-slate-50 border border-transparent opacity-60"
                  }`}
                >
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-start">
                    <span
                      className={`font-bold text-xl sm:text-base ${
                        info.activo ? "text-blue-900" : "text-slate-500"
                      }`}
                    >
                      {dia}
                    </span>
                    <div className="sm:hidden">
                      <label
                        className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl shadow-sm border transition-all active:scale-95 ${
                          info.activo
                            ? "bg-blue-700 border-blue-800 text-white"
                            : "bg-white border-slate-300 text-slate-600"
                        }`}
                      >
                        <span className="text-sm font-black uppercase tracking-tight select-none">
                          {info.activo ? "Disponible" : "No disponible"}
                        </span>
                        <Switch
                          checked={info.activo}
                          onCheckedChange={(val) =>
                            handleChangeDia(dia, "activo", val)
                          }
                          className="scale-125 data-[state=checked]:bg-white data-[state=checked]:[&_span]:bg-blue-700 data-[state=unchecked]:bg-slate-200"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-4 hidden sm:flex justify-center">
                    <label
                      className={`flex items-center gap-4 cursor-pointer p-2 px-4 rounded-full border-2 transition-all active:scale-95 ${
                        info.activo
                          ? "bg-blue-700 border-blue-800 text-white shadow-lg"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-sm font-black uppercase tracking-wide min-w-[100px] text-center select-none">
                        {info.activo ? "Disponible" : "No disponible"}
                      </span>
                      <Switch
                        checked={info.activo}
                        onCheckedChange={(val) =>
                          handleChangeDia(dia, "activo", val)
                        }
                        className="scale-150 data-[state=checked]:bg-white data-[state=checked]:[&_span]:bg-blue-700 data-[state=unchecked]:bg-slate-300"
                      />
                    </label>
                  </div>

                  <div
                    className={`sm:col-span-5 flex flex-wrap gap-2 justify-center transition-all ${!info.activo ? "pointer-events-none grayscale" : ""}`}
                  >
                    {turnosDisponibles.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleChangeDia(dia, "turno", t)}
                        disabled={!info.activo}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                          info.turno === t
                            ? "bg-blue-700 border-blue-800 text-white shadow-md scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700"
                        } ${!info.activo ? "opacity-30" : ""}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}
