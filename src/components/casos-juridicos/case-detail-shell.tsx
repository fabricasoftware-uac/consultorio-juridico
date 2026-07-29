"use client";

import { useState, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Calendar, AlertTriangle, ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format-date";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import type { Caso } from "app/types/database";

export interface TabConfig {
  value: string;
  label: string;
  content: ReactNode;
}

interface CaseDetailShellProps {
  caso: Caso | undefined;
  loading: boolean;
  error?: string | null;
  idCaso: string;
  navbar: ReactNode;
  tabs: TabConfig[];
  sidebarExtra?: ReactNode;
  backHref: string;
  backLabel: string;
  statusBadge?: ReactNode;
}

export function CaseDetailShell({
  caso,
  loading,
  error,
  idCaso,
  navbar,
  tabs,
  sidebarExtra,
  backHref,
  backLabel,
  statusBadge,
}: CaseDetailShellProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {navbar}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-slate-500 font-medium">
            Cargando detalles del caso...
          </p>
        </div>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="min-h-screen flex flex-col">
        {navbar}
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <p className="text-slate-600 font-medium">
            {error || "El caso no pudo ser encontrado."}
          </p>
          <Link href={backHref}>
            <ChevronLeft className="w-4 h-4 mr-1 inline" />
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {navbar}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href={backHref}
              className="flex items-center text-blue-600 hover:text-blue-700 hover:underline mb-4 transition-colors duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {backLabel}
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Caso #{caso.id_caso}
                  </h1>
                  {statusBadge}
                </div>
                <p className="text-lg text-slate-500 font-medium">
                  {caso.usuarios?.nombre_completo}
                </p>
                {caso.estudiantes_casos?.length ? (
                  <div className="flex items-center mt-4 p-2 px-3 bg-blue-50/50 rounded-lg w-fit">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mr-3">
                      Estudiante asignado:
                    </span>
                    <span className="text-sm font-semibold text-blue-700">
{caso.estudiantes_casos?.find((e: any) => !e.fecha_fin_asignacion)
                          ?.estudiante?.perfil?.nombre_completo}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.value === "overview" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {tab.content}
                    </div>
                    <aside className="space-y-6">
                      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-800 tracking-tight">
                            Fechas importantes
                          </h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div>
                            <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 block">
                              Fecha de creación
                            </Label>
                            <div className="flex items-center gap-2 text-slate-900 font-medium">
                              <div className="w-2 h-2 rounded-full bg-purple-400" />
                              {formatDate(caso.fecha_creacion)}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <CountdownTimer
                              fechaVencimiento={caso.fecha_vencimiento_estudiante}
                              label="Estudiante"
                              estado={caso.estado}
                            />
                            <CountdownTimer
                              fechaVencimiento={caso.fecha_vencimiento_asesor}
                              label="Asesor"
                              estado={caso.estado}
                            />
                          </div>
                        </div>
                      </Card>

                      {sidebarExtra}

                      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                        <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <h3 className="font-bold text-amber-800 tracking-tight">
                            Llamados de Atención
                          </h3>
                        </div>
                        <div className="p-6">
                          <LlamadosList idCaso={idCaso} />
                        </div>
                      </Card>

                      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-slate-800 tracking-tight">
                            Historial del Caso
                          </h3>
                        </div>
                        <div className="p-6">
                          <CasoAuditoria idCaso={idCaso} />
                        </div>
                      </Card>
                    </aside>
                  </div>
                ) : (
                  tab.content
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
