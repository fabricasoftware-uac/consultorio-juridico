"use client";

import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "../../components/NavbarAdmin";
import { Spinner } from "@/components/ui/spinner";
import { getStatusBadge } from "@/components/ui/status-badge";
import { formatArea, nombreMostrado } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  ArrowLeft, GraduationCap, Clock, Calendar, User, Phone, Mail,
} from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [estudiante, setEstudiante] = useState<any>(null);
  const [casos, setCasos] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<{ dia: string; turno: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("estudiantes").select("*, perfil:perfiles(*)").eq("id_perfil", id).single(),
      supabase.from("estudiantes_casos").select("*, casos!inner(id_caso, area, estado, fecha_creacion, fecha_cierre, periodo, usuarios!inner(nombre_completo, cedula))").eq("id_estudiante", id).order("fecha_asignacion", { ascending: false }),
      // Los turnos reales viven en `horarios`; estudiantes.dia/turno son
      // columnas muertas desde la migración 20260423000000.
      supabase.from("horarios").select("dia, turno").eq("id_perfil", id),
    ]).then(([{ data: est }, { data: casosData }, { data: horariosData }]) => {
      setEstudiante(est);
      setCasos(casosData ?? []);
      setHorarios(horariosData ?? []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><Spinner className="h-10 w-10 text-blue-600" /></div></div>
  );

  if (!estudiante) return (
    <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><p className="text-slate-500">Estudiante no encontrado</p></div></div>
  );

  const activos = casos.filter((c: any) => c.casos && !["cerrado","archivado"].includes(c.casos.estado));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/estudiantes" className="flex items-center text-sm text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Volver a estudiantes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-none shadow-sm lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl"><GraduationCap className="w-6 h-6 text-blue-600" /></div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{nombreMostrado(estudiante.perfil?.nombre_completo)}</h1>
                <p className="text-xs text-slate-500">CC: {estudiante.perfil?.cedula || "—"}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{estudiante.semestre != null ? `${estudiante.semestre}° Semestre · ` : ""}{estudiante.jornada || "Jornada no definida"}</span></div>
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                {horarios.length === 0 ? (
                  <span className="text-amber-600">Sin turnos registrados</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {horarios.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-[11px] font-medium">
                        {h.dia} · {h.turno}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{estudiante.perfil?.telefono || "—"}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-600 truncate">{estudiante.perfil?.correo || "—"}</span></div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-sm lg:col-span-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Resumen de casos</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-700">{casos.length}</p>
                <p className="text-xs text-blue-500">Total asignados</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-2xl font-bold text-amber-700">{activos.length}</p>
                <p className="text-xs text-amber-500">Activos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-700">{casos.length - activos.length}</p>
                <p className="text-xs text-green-500">Finalizados</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-sm font-bold text-slate-700">Casos asignados</h2>
          </div>
          {casos.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-400">No tiene casos asignados</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">#</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Cliente</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Área</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Estado</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Período</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden lg:table-cell">Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {casos.map((ec: any) => {
                    const c = ec.casos;
                    if (!c) return null;
                    return (
                      <tr key={`${ec.id_estudiante}-${ec.id_caso}`} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="p-3 font-mono text-xs text-slate-500">
                          <Link href={`/admin/todos-los-casos/${c.id_caso}`} className="text-blue-600 hover:underline">#{c.id_caso}</Link>
                        </td>
                        <td className="p-3 font-medium text-slate-800 text-xs">{c.usuarios?.nombre_completo || "—"}</td>
                        <td className="p-3 text-slate-600 text-xs hidden md:table-cell">{formatArea(c.area)}</td>
                        <td className="p-3">{getStatusBadge(c.estado)}</td>
                        <td className="p-3 text-slate-500 text-xs hidden md:table-cell">{c.periodo || "—"}</td>
                        <td className="p-3 text-slate-500 text-xs hidden lg:table-cell">{ec.fecha_asignacion ? new Date(ec.fecha_asignacion).toLocaleDateString("es-CO") : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
