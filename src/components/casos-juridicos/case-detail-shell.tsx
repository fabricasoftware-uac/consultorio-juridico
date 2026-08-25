"use client";

import { useState, ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Calendar, AlertTriangle, ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/format-date";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import type { Caso } from "app/types/database";

/**
 * Orden y etiquetas canónicos de las pestañas del detalle de caso.
 *
 * Las cuatro pantallas de rol habían divergido: ningún par tenía el mismo
 * conjunto y el orden tampoco coincidía (el estudiante ponía Correcciones en
 * segundo lugar y el asesor al final). Que el orden y el nombre vivan aquí y no
 * en cada página hace que volver a divergir requiera tocar este archivo: una
 * página solo declara QUÉ pestañas muestra, nunca cómo se llaman ni en qué
 * posición van.
 */
export const ORDEN_PESTANAS = [
  "overview",
  "client",
  "defendant",
  "contract",
  "team",
  "corrections",
] as const;

export type PestanaCaso = (typeof ORDEN_PESTANAS)[number];

export const ETIQUETAS_PESTANAS: Record<PestanaCaso, string> = {
  overview: "Resumen",
  client: "Usuario",
  defendant: "Accionado",
  contract: "Contrato",
  team: "Equipo",
  corrections: "Correcciones",
};

export interface TabConfig {
  value: PestanaCaso;
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
  /** Acciones propias del rol junto al título (botones, avisos). */
  headerActions?: ReactNode;
  /** Bloque a ancho completo sobre las pestañas (paneles de aprobación, alertas). */
  banner?: ReactNode;
  /**
   * Panel del rol al PRINCIPIO de la barra lateral, antes de "Fechas
   * importantes". Para lo accionable: los usuarios reportaron tener que bajar
   * demasiado para llegar a paneles como "Equipo asignado", que estaba de
   * último. Lo que se usa va arriba; lo informativo, debajo.
   */
  sidebarTop?: ReactNode;
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
  headerActions,
  banner,
  sidebarTop,
}: CaseDetailShellProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // El orden lo impone ORDEN_PESTANAS, no el arreglo que pase la página.
  const pestanas = [...tabs].sort(
    (a, b) => ORDEN_PESTANAS.indexOf(a.value) - ORDEN_PESTANAS.indexOf(b.value),
  );

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
              {headerActions && (
                <div className="flex flex-wrap items-center gap-2">{headerActions}</div>
              )}
            </div>
          </div>

          {banner && <div className="mb-6">{banner}</div>}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Seis pestañas no caben en un móvil. El scroll horizontal esconde
                las últimas sin avisar y obliga a arrastrar para descubrirlas,
                así que en pantallas chicas se cambia por un desplegable que
                muestra siempre en qué sección estás y las lista todas de una.
                Desde md hay ancho de sobra y vuelven las pestañas. */}
            <div className="md:hidden mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full bg-white" aria-label="Sección del caso">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pestanas.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {ETIQUETAS_PESTANAS[tab.value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsList className="hidden md:flex w-full flex-nowrap">
              {pestanas.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="shrink-0">
                  {ETIQUETAS_PESTANAS[tab.value]}
                </TabsTrigger>
              ))}
            </TabsList>

            {pestanas.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.value === "overview" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {tab.content}
                    </div>
                    <aside className="space-y-6">
                      {/* Lo accionable del rol va primero: los usuarios se
                          quejaron de bajar demasiado para llegar a paneles como
                          "Equipo asignado", que quedaba de último. */}
                      {sidebarTop}

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
                        {/* Crece sin límite con cada evento del caso y estiraba
                            la página entera. Se acota y hace scroll propio. */}
                        <div className="p-6 max-h-80 overflow-y-auto">
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
