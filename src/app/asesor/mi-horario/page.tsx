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

import {
  ScheduleEditor,
  HorarioDia,
  HorarioSemana,
  diasSemana,
  turnosDisponibles,
  horarioPorDefecto,
} from "@/components/ScheduleEditor";

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
          <ScheduleEditor horario={horario} onChangeDia={handleChangeDia} />
        </Card>
      </main>
    </div>
  );
}
