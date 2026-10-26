"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "../components/NavBarAsesor";
import { supabase } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";
import {
  Clock,
  ArrowLeft,
  CalendarCheck2,
  CalendarX2,
  Info,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import {
  HorarioSemana,
  diasSemana,
  horarioPorDefecto,
} from "@/components/ScheduleEditor";

const LABELS_TURNO: Record<string, string> = {
  "9-11": "9:00 a.m. - 11:00 a.m.",
  "2-4": "2:00 p.m. - 4:00 p.m.",
  "4-6": "4:00 p.m. - 6:00 p.m.",
};

export default function MiHorarioPage() {
  const [horario, setHorario] = useState<HorarioSemana>(horarioPorDefecto);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const { data: authData, error: authErr } =
          await supabase.auth.getUser();
        if (authErr || !authData.user) throw authErr;

        const uid = authData.user.id;

        const { data: asesor, error: asesorErr } = await supabase
          .from("asesores")
          .select("horario")
          .eq("id_perfil", uid)
          .single();

        if (asesorErr && asesorErr.code !== "PGRST116") {
          throw asesorErr;
        }

        if (asesor?.horario && Object.keys(asesor.horario).length > 0) {
          setHorario({ ...horarioPorDefecto, ...(asesor.horario as any) });
        } else {
          // Fallback resiliente: consultar tabla relacional public.horarios
          const { data: filasHorario } = await supabase
            .from("horarios")
            .select("dia, turno")
            .eq("id_perfil", uid);

          if (filasHorario && filasHorario.length > 0) {
            const horarioReconstruido = { ...horarioPorDefecto };
            filasHorario.forEach((f: any) => {
              const diaNormalizado = diasSemana.find(
                (d) => d.toLowerCase() === f.dia?.toLowerCase(),
              );
              if (diaNormalizado) {
                horarioReconstruido[diaNormalizado] = {
                  activo: true,
                  turno: f.turno,
                };
              }
            });
            setHorario(horarioReconstruido);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar el horario de atención");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const diasAsignados = diasSemana.filter(
    (dia) => horario[dia]?.activo && horario[dia]?.turno,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Spinner className="h-10 w-10 text-blue-600 mb-4" />
          <p className="mt-4 text-slate-500 font-medium">
            Consultando tu horario de atención asignado...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* Breadcrumb / Navigation */}
        <div className="mb-6 space-y-3">
          <Link
            href="/asesor/mis-casos"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis casos
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                  <Clock className="w-7 h-7" />
                </div>
                Mi Horario de Atención
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
                Consulta los días y turnos de atención asignados para tus asesorías jurídicas presenciales.
              </p>
            </div>

            <div className="shrink-0 bg-blue-50 border border-blue-200/60 rounded-xl px-4 py-2.5 flex items-center gap-3">
              <CalendarCheck2 className="w-5 h-5 text-blue-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Días asignados
                </p>
                <p className="text-lg font-bold text-blue-950">
                  {diasAsignados.length} de {diasSemana.length} días
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerta Informativa Institucional */}
        <div className="mb-8 rounded-2xl bg-amber-50/80 border border-amber-200 p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-700" />
              Administración Centralizada de Horarios
            </h2>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              Los horarios de atención son asignados y administrados por la Coordinación del Consultorio Jurídico. Si requieres una modificación en tus días o turnos, por favor comunícate con la administración.
            </p>
          </div>
        </div>

        {/* Schedule Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diasSemana.map((dia) => {
            const info = horario[dia] || horarioPorDefecto[dia];
            const estaActivo = !!info?.activo;
            const turnoFormateado = LABELS_TURNO[info?.turno] || info?.turno || "9-11";

            return (
              <Card
                key={dia}
                className={`transition-all duration-200 border rounded-2xl overflow-hidden ${
                  estaActivo
                    ? "bg-white border-blue-200/80 shadow-xs hover:border-blue-300"
                    : "bg-slate-50/70 border-slate-200/60 opacity-75"
                }`}
              >
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base font-bold text-slate-800">
                    {dia}
                  </CardTitle>
                  {estaActivo ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold gap-1 hover:bg-emerald-50">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Asignado
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-slate-400 bg-slate-100/60 border-slate-200 text-xs font-normal"
                    >
                      No asignado
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-4">
                  {estaActivo ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                        <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                        <span>{info?.turno}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 pl-7">
                        {turnoFormateado}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-400 py-2">
                      <CalendarX2 className="w-4 h-4 shrink-0 text-slate-400" />
                      <span className="text-xs font-medium">
                        Sin turno programado
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
