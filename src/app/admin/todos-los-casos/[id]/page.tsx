"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "../../components/NavbarAdmin";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { getContratoByUsuarioId } from "../../../../../supabase/queries/getContratoByUsuarioId";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseDetailShell, TabConfig } from "@/components/casos-juridicos/case-detail-shell";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ContractInfo } from "@/components/casos-juridicos/contract-info";
import { EquipoCaso } from "@/components/casos-juridicos/equipo-caso";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { AdminReasignarEquipo } from "@/components/casos-juridicos/reasignar-equipo-tabla";
import { BotonesCerrarArchivar } from "@/components/casos-juridicos/botones-cerrar-archivar";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";
import { HistorialCorrecciones } from "@/components/casos-juridicos/historial-correcciones";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { useCaseEdit } from "@/lib/hooks/useCaseEdit";
import { Users, ClipboardList, FileText } from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
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
        setContrato(await getContratoByUsuarioId(c.usuarios.id_usuario));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => { traerDatos(); }, [id]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id, refetch);

  const edit = useCaseEdit(id, traerDatos);

  const tabs: TabConfig[] = [
    {
      value: "overview",
      content: (
        <>
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
              <FileText className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-800">Documentos</h3>
            </div>
            <div className="p-6">
              <DocumentosCaso idCaso={id} estado={caso?.estado ?? ""} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Resumen de los hechos</h3>
            </div>
            <div className="p-6">
              {!edit.isEditingCaseInfo ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {caso?.resumen_hechos || "No hay resumen registrado"}
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
        </>
      ),
    },
    {
      value: "client",
      content: (
        <ClientInfo
          usuarios={edit.isEditingClient ? edit.editedClientData : caso?.usuarios}
          isEditing={edit.isEditingClient}
          editedData={edit.editedClientData}
          onEdit={() => edit.handleEditClient(caso?.usuarios)}
          onSave={edit.handleSaveClient}
          onCancel={edit.handleCancelClientEdit}
          onChange={edit.handleClientDataChange}
          canEdit
        />
      ),
    },
    {
      value: "defendant",
      content: (
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
      ),
    },
    {
      value: "contract",
      content: (
        <ContractInfo
          contrato={edit.isEditingContract ? edit.editedContractData : contrato}
          isEditing={edit.isEditingContract}
          editedData={edit.editedContractData}
          onEdit={() => edit.handleEditContract(contrato, caso?.usuarios?.id_usuario)}
          onSave={edit.handleSaveContract}
          onCancel={edit.handleCancelContractEdit}
          onChange={edit.handleContractDataChange}
          canEdit
        />
      ),
    },
    { value: "team", content: <EquipoCaso caso={caso} /> },
    { value: "corrections", content: <HistorialCorrecciones idCaso={id} /> },
  ];

  return (
    <CaseDetailShell
      caso={caso}
      loading={loading}
      idCaso={id}
      navbar={<Navbar />}
      backHref="/admin/todos-los-casos"
      backLabel="Volver a todos los casos"
      statusBadge={caso ? getStatusBadge(caso.estado) : null}
      tabs={tabs}
      headerActions={
        caso && (
          <div className="flex flex-col gap-2 lg:min-w-[260px]">
            <BotonesEntrevista idCaso={id} caso={caso} demandado={demandado} />
            <BotonesCerrarArchivar
              idCaso={id}
              estado={caso.estado}
              clasificacion={caso.clasificacion}
              onRefresh={refetch}
            />
          </div>
        )
      }
      sidebarTop={
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Equipo asignado</h3>
          </div>
          <div className="p-6 space-y-6">
            <AdminReasignarEquipo
              idCaso={id}
              type="estudiante"
              currentName={caso?.estudiantes_casos?.find(e => !e.fecha_fin_asignacion)?.estudiante?.perfil?.nombre_completo ?? undefined}
              onRefresh={refetch}
            />
            <div className="border-t border-slate-100 pt-6">
              <AdminReasignarEquipo
                idCaso={id}
                type="asesor"
                currentName={caso?.asesores_casos?.find(a => !a.fecha_fin_asignacion)?.asesor?.perfil?.nombre_completo ?? undefined}
                onRefresh={refetch}
              />
            </div>
          </div>
        </Card>
      }
      sidebarExtra={
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Actividades</h3>
          </div>
          <div className="p-6">
            <ActividadesCaso idCaso={id} />
          </div>
        </Card>
      }
    />
  );
}
