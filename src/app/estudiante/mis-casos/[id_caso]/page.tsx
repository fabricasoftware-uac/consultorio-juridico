"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "../../components/NavBarEstudiante";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate } from "@/lib/format-date";
import { supabase } from "@/lib/supabase/supabase-client";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { AdvisorInfo } from "@/components/casos-juridicos/advisor-info";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { toast } from "sonner";
import {
  Calendar, AlertTriangle, Users, ChevronLeft, ClipboardList,
  FileText, Send,
} from "lucide-react";
import { sumarDiasHabiles } from "@/lib/utils";

export default function Page({ params }: { params: Promise<{ id_caso: string }> }) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  async function traerDatos() {
    try {
      const [c, d] = await Promise.all([getCasoById(id_caso), getDemandadoByCasoId(id_caso)]);
      setCaso(c);
      setDemandado(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => { traerDatos(); }, [id_caso]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id_caso, refetch);

  const handleReenviar = async () => {
    try {
      setEnviando(true);
      const { error } = await supabase
        .from("casos")
        .update({
          estado: "pendiente_aprobacion",
          fecha_vencimiento_asesor: sumarDiasHabiles(new Date(), 2).toISOString(),
        })
        .eq("id_caso", id_caso);
      if (error) throw error;
      await supabase
        .from("llamados_atencion")
        .update({ resuelto: true, fecha_resolucion: new Date().toISOString() })
        .eq("id_caso", id_caso)
        .eq("tipo", "asesor")
        .eq("resuelto", false);
      await traerDatos();
      toast.success("Caso reenviado para aprobación del asesor");
    } catch (err) {
      console.error(err);
      toast.error("Error al reenviar el caso");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">Caso no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/estudiante/mis-casos" className="flex items-center text-blue-600 hover:underline mb-4">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Volver a mis casos
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between bg-white p-8 rounded-2xl shadow-sm border mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900">Caso #{caso.id_caso}</h1>
                {getStatusBadge(caso.estado)}
                {caso.estado === "en_correccion" && (
                  <Button onClick={handleReenviar} disabled={enviando} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-4 h-4 mr-1" />
                    {enviando ? "Enviando..." : "Reenviar para aprobación"}
                  </Button>
                )}
              </div>
              <p className="text-lg text-slate-500">{caso.usuarios?.nombre_completo}</p>
              {caso.periodo && <p className="text-xs text-slate-400 mt-1">Período: {caso.periodo}</p>}
              {caso.asesores_casos?.length ? (
                <p className="text-xs text-emerald-600 mt-1">
                  Asesor: {caso.asesores_casos[caso.asesores_casos.length - 1]?.asesor?.perfil?.nombre_completo || "—"}
                </p>
              ) : null}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="client">Usuario</TabsTrigger>
              <TabsTrigger value="defendant">Accionado</TabsTrigger>
              <TabsTrigger value="advisor">Asesor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CaseInfoTab
                    caseData={caso}
                    isEditing={false}
                    editedData={null}
                    onEdit={() => {}}
                    onSave={() => {}}
                    onCancel={() => {}}
                    onChange={() => {}}
                    getStatusBadge={getStatusBadge}
                    canEdit={false}
                  />

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-slate-800">Resumen de los hechos</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {caso.resumen_hechos || "No hay resumen registrado"}
                      </p>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800">Observaciones</h3>
                    </div>
                    <div className="p-6">
                      <ObservacionesChat
                        idCaso={id_caso}
                        observaciones={caso.observaciones}
                        observacionesEstudiante={caso.observaciones_estudiante}
                      />
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-slate-800">Historial del Caso</h3>
                      </div>
                      <div className="p-6 max-h-80 overflow-y-auto"><CasoAuditoria idCaso={id_caso} /></div>
                    </Card>
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-600" />
                        <h3 className="font-bold text-slate-800">Documentos</h3>
                      </div>
                      <div className="p-6"><DocumentosCaso idCaso={id_caso} /></div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-slate-800">Fechas importantes</h3>
                    </div>
                    <div className="p-6 space-y-3">
                      <div>
                        <Label className="text-xs font-bold text-slate-500 uppercase">Fecha de creación</Label>
                        <p className="text-slate-900 font-medium">{formatDate(caso.fecha_creacion)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {caso.estado === "en_proceso" && (
                          <CountdownTimer fechaVencimiento={caso.fecha_vencimiento_estudiante} label="Entrega" estado={caso.estado} />
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-amber-50 border-b p-4 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-amber-800">Llamados de Atención</h3>
                    </div>
                    <div className="p-6"><LlamadosList idCaso={id_caso} /></div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800">Actividades</h3>
                    </div>
                    <div className="p-6"><ActividadesCaso idCaso={id_caso} /></div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client">
              <ClientInfo
                usuarios={caso.usuarios}
                isEditing={false}
                editedData={null}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onChange={() => {}}
                canEdit={false}
              />
            </TabsContent>

            <TabsContent value="defendant">
              <DefendantInfo
                defendantData={demandado}
                isEditing={false}
                editedData={null}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onChange={() => {}}
                canEdit={false}
              />
            </TabsContent>

            <TabsContent value="advisor">
              <AdvisorInfo
                advisors={caso.asesores_casos?.map((ac) => ac.asesor) || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
