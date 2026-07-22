"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Navbar } from "../../components/NavbarAdmin";
import { Caso, Demandado, Usuario } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate } from "@/lib/format-date";
import { supabase } from "@/lib/supabase/supabase-client";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ContractInfo } from "@/components/casos-juridicos/contract-info";
import { getContratoByUsuarioId } from "../../../../../supabase/queries/getContratoByUsuarioId";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { AdminReasignarEquipo } from "@/components/casos-juridicos/reasignar-equipo-tabla";
import { BotonesCerrarArchivar } from "@/components/casos-juridicos/botones-cerrar-archivar";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { useCaseEdit } from "@/lib/hooks/useCaseEdit";
import { cleanData } from "@/lib/utils";
import { toast } from "sonner";
import {
  Calendar, AlertTriangle, Users, ChevronLeft, ClipboardList,
} from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [contrato, setContrato] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function traerDatos() {
    try {
      const [c, d] = await Promise.all([getCasoById(id), getDemandadoByCasoId(id)]);
      setCaso(c);
      setDemandado(d);
      if (c?.usuarios?.id_usuario) {
        const ct = await getContratoByUsuarioId(c.usuarios.id_usuario);
        setContrato(ct);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => { traerDatos(); }, [id]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id, refetch);

  const edit = useCaseEdit(id, traerDatos);

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
          <Link href="/admin/todos-los-casos" className="flex items-center text-blue-600 hover:underline mb-4">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Volver a todos los casos
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between bg-white p-8 rounded-2xl shadow-sm border mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900">Caso #{caso.id_caso}</h1>
                {getStatusBadge(caso.estado)}
              </div>
              <p className="text-lg text-slate-500">{caso.usuarios?.nombre_completo}</p>
              {caso.periodo && <p className="text-xs text-slate-400 mt-1">Período: {caso.periodo}</p>}
              {caso.estudiantes_casos?.length ? (
                <p className="text-xs text-blue-600 mt-1">
                  Estudiante: {caso.estudiantes_casos[caso.estudiantes_casos.length - 1]?.estudiante?.perfil?.nombre_completo || "—"}
                </p>
              ) : null}
            </div>
            <div className="mt-3 lg:mt-0 lg:min-w-[260px] flex flex-col gap-2">
              <BotonesEntrevista idCaso={id} caso={caso} demandado={demandado} />
              <BotonesCerrarArchivar idCaso={id} estado={caso.estado} clasificacion={caso.clasificacion} onRefresh={refetch} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="client">Usuario</TabsTrigger>
              <TabsTrigger value="defendant">Accionado</TabsTrigger>
              <TabsTrigger value="contract">Contrato</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna principal */}
                <div className="lg:col-span-2 space-y-6">
                  <CaseInfoTab
                    caseData={edit.isEditingCaseInfo ? edit.editedCaseData : caso}
                    isEditing={edit.isEditingCaseInfo}
                    editedData={edit.editedCaseData}
                    onEdit={() => edit.handleEditCaseInfo(caso)}
                    onSave={() => edit.handleSaveCaseInfo()}
                    onCancel={edit.handleCancelCaseEdit}
                    onChange={edit.handleCaseDataChange}
                    getStatusBadge={getStatusBadge}
                    canEdit
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
                      {!edit.isEditingCaseInfo ? (
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {caso.resumen_hechos || "No hay resumen registrado"}
                        </p>
                      ) : (
                        <Textarea
                          value={edit.editedCaseData?.resumen_hechos || ""}
                          onChange={(e) => edit.handleCaseDataChange("resumen_hechos", e.target.value)}
                          placeholder="Descripción detallada de los hechos..."
                          className="min-h-48 border-slate-200 rounded-xl"
                        />
                      )}
                    </div>
                  </Card>

                  {/* Historial + Documentos bajo Observaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-slate-800">Historial del Caso</h3>
                      </div>
                      <div className="p-6 max-h-80 overflow-y-auto"><CasoAuditoria idCaso={id} /></div>
                    </Card>
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                        <Users className="w-5 h-5 text-cyan-600" />
                        <h3 className="font-bold text-slate-800">Documentos</h3>
                      </div>
                      <div className="p-6"><DocumentosCaso idCaso={id} estado={caso.estado} /></div>
                    </Card>
                  </div>
                </div>

                {/* Sidebar compacto */}
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
                        <CountdownTimer fechaVencimiento={caso.fecha_vencimiento_estudiante} label="Estudiante" estado={caso.estado} />
                        <CountdownTimer fechaVencimiento={caso.fecha_vencimiento_asesor} label="Asesor" estado={caso.estado} />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800">Equipo asignado</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <AdminReasignarEquipo
                        idCaso={id} type="estudiante"
                        currentName={caso.estudiantes_casos?.[caso.estudiantes_casos.length - 1]?.estudiante?.perfil?.nombre_completo}
                        onRefresh={refetch}
                      />
                      <div className="border-t border-slate-100 pt-6">
                        <AdminReasignarEquipo
                          idCaso={id} type="asesor"
                          currentName={caso.asesores_casos?.[caso.asesores_casos.length - 1]?.asesor?.perfil?.nombre_completo}
                          onRefresh={refetch}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-amber-50 border-b p-4 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-amber-800">Llamados de Atención</h3>
                    </div>
                    <div className="p-6"><LlamadosList idCaso={id} /></div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <ClipboardList className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800">Actividades</h3>
                    </div>
                    <div className="p-6"><ActividadesCaso idCaso={id} /></div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="client">
              <ClientInfo
                usuarios={edit.isEditingClient ? edit.editedClientData : caso.usuarios}
                isEditing={edit.isEditingClient}
                editedData={edit.editedClientData}
                onEdit={() => edit.handleEditClient(caso.usuarios)}
                onSave={edit.handleSaveClient}
                onCancel={edit.handleCancelClientEdit}
                onChange={edit.handleClientDataChange}
                canEdit
              />
            </TabsContent>

            <TabsContent value="defendant">
              <DefendantInfo
                defendantData={edit.isEditingDefendant ? edit.editedDefendantData : demandado}
                isEditing={edit.isEditingDefendant}
                editedData={edit.editedDefendantData}
                onEdit={() => edit.handleEditDefendant(demandado)}
                onSave={edit.handleSaveDefendant}
                onCancel={edit.handleCancelDefendantEdit}
                onChange={edit.handleDefendantDataChange}
                canEdit
              />
            </TabsContent>

            <TabsContent value="contract">
              <ContractInfo
                contrato={edit.isEditingContract ? edit.editedContractData : contrato}
                isEditing={edit.isEditingContract}
                editedData={edit.editedContractData}
                onEdit={() => edit.handleEditContract(contrato, caso.usuarios?.id_usuario)}
                onSave={edit.handleSaveContract}
                onCancel={edit.handleCancelContractEdit}
                onChange={edit.handleContractDataChange}
                canEdit
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
