"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "../../components/NavBarProApoyo";
import { Caso, ContratoLaboral, Demandado, Usuario } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { getContratoByUsuarioId } from "../../../../../supabase/queries/getContratoByUsuarioId";
import { supabase } from "@/lib/supabase/supabase-client";
import { cleanData } from "@/lib/utils";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { Notebook, MessageSquare, FileText, Users, ClipboardList } from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";
import { AdminReasignarEquipo } from "@/components/casos-juridicos/reasignar-equipo-tabla";
import { toast } from "sonner";
import { CaseDetailShell, TabConfig } from "@/components/casos-juridicos/case-detail-shell";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ContractInfo } from "@/components/casos-juridicos/contract-info";
import { EquipoCaso } from "@/components/casos-juridicos/equipo-caso";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { HistorialCorrecciones } from "@/components/casos-juridicos/historial-correcciones";
import { ArchivarCasoProApoyo } from "@/components/casos-juridicos/archivar-caso-pro-apoyo";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";

export default function Page({
  params,
}: {
  params: Promise<{ id_caso: string }>;
}) {
  const { id_caso } = React.use(params);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(null);
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] = useState<Demandado | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [contrato, setContrato] = useState<ContratoLaboral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function traerDatos() {
    try {
      setError(null);

      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      setDemandado(demandadoFetch);

      if (casoFetch.usuarios?.id_usuario) {
        setContrato(await getContratoByUsuarioId(casoFetch.usuarios.id_usuario));
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  const refetch = useCallback(() => { traerDatos(); }, [id_caso]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id_caso, refetch);

  // Client editing functions
  const handleEditClient = () => {
    setEditedClientData(caso?.usuarios || null);
    setIsEditingClient(true);
  };

  const handleSaveClient = async () => {
    if (!editedClientData) return;
    setIsEditingClient(false);
    const limpio = cleanData(editedClientData);
    setEditedClientData(null);
    try {
      const { error: errorCaso } = await supabase
        .from("usuarios")
        .update({
          nombre_completo: limpio.nombre_completo,
          sexo: limpio.sexo,
          cedula: limpio.cedula,
          edad: limpio.edad,
          estado_civil: limpio.estado_civil,
          estrato: limpio.estrato,
          telefono: limpio.telefono,
          contacto_familiar: limpio.contacto_familiar,
          correo: limpio.correo,
          tipo_vivienda: limpio.tipo_vivienda,
          direccion: limpio.direccion,
          situacion_laboral: limpio.situacion_laboral,
          valor_otros_ingresos: limpio.valor_otros_ingresos,
          otros_ingresos: limpio.otros_ingresos,
          concepto_otros_ingresos: limpio.concepto_otros_ingresos,
        })
        .eq("id_usuario", caso?.id_usuario);
      if (errorCaso) {
        setError(errorCaso.message);
        throw errorCaso;
      }
      await traerDatos();
      toast.success("Información del cliente actualizada");
    } catch (err) {
      console.error(err);
      setError("Error al guardar los datos del usuario");
    }
  };

  const handleCancelClientEdit = () => {
    setIsEditingClient(false);
    setEditedClientData(null);
  };

  const handleClientDataChange = (field: string, value: string | boolean) => {
    if (editedClientData) {
      setEditedClientData({ ...editedClientData, [field]: value });
    }
  };

  // Defendant editing functions
  const handleEditDefendant = () => {
    setEditedDefendantData(demandado || null);
    setIsEditingDefendant(true);
  };

  const handleSaveDefendant = async () => {
    if (!editedDefendantData) return;
    setIsEditingDefendant(false);
    const limpio = cleanData(editedDefendantData);
    setEditedDefendantData(null);
    try {
      const { error } = await supabase
        .from("demandados")
        .update({
          nombre_completo: limpio.nombre_completo,
          lugar_residencia: limpio.lugar_residencia,
          documento: limpio.documento,
          correo: limpio.correo,
          celular: limpio.celular,
        })
        .eq("id_caso", id_caso)
        .select();

      if (error) {
        setError(error.message);
        throw error;
      }
      await traerDatos();
      toast.success("Información del demandado actualizada");
    } catch (err) {
      console.error(err);
      setError("Error al guardar los datos del demandado");
    }
  };

  const handleCancelDefendantEdit = () => {
    setIsEditingDefendant(false);
    setEditedDefendantData(null);
  };

  const handleDefendantDataChange = (field: string, value: string) => {
    if (editedDefendantData) {
      setEditedDefendantData({ ...editedDefendantData, [field]: value });
    }
  };

  // Case information editing functions
  const handleEditCaseInfo = () => {
    if (!caso) return;
    setEditedCaseData({
      area: caso.area,
      tipo_proceso: caso?.tipo_proceso,
      estudiantes_casos: caso?.estudiantes_casos,
      asesores_casos: caso?.asesores_casos,
      resumen_hechos: caso?.resumen_hechos,
      estado: caso?.estado,
      fecha_creacion: caso?.fecha_creacion,
      fecha_cierre: caso?.fecha_cierre,
      usuarios: caso?.usuarios,
      id_caso: caso?.id_caso,
      id_usuario: caso?.id_usuario,
      observaciones: caso?.observaciones,
    });
    setIsEditingCaseInfo(true);
  };

  const handleSaveCaseInfo = async () => {
    if (!editedCaseData) return;
    setIsEditingCaseInfo(false);
    const limpio = cleanData(editedCaseData);
    setEditedCaseData(null);
    try {
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          area: limpio.area,
          tipo_proceso: limpio.tipo_proceso,
          resumen_hechos: limpio.resumen_hechos,
          estado: limpio.estado,
          observaciones: limpio.observaciones,
        })
        .eq("id_caso", id_caso);
      if (errorCaso) {
        setError(errorCaso.message);
        throw errorCaso;
      }
      await traerDatos();
      toast.success("Información del caso actualizada");
    } catch (err) {
      console.error(err);
      setError("Error al guardar los datos del caso");
    }
  };

  const handleCancelCaseEdit = () => {
    setIsEditingCaseInfo(false);
    setEditedCaseData(null);
  };

  const handleCaseDataChange = (field: string, value: string | boolean) => {
    if (editedCaseData) {
      setEditedCaseData({ ...editedCaseData, [field]: value });
    }
  };

  const displayCaseData = isEditingCaseInfo ? editedCaseData : caso;

  const tabs: TabConfig[] = [
    {
      value: "overview",
      content: (
        <>
          <CaseInfoTab
            caseData={displayCaseData}
            isEditing={isEditingCaseInfo}
            editedData={editedCaseData}
            onEdit={handleEditCaseInfo}
            onSave={handleSaveCaseInfo}
            onCancel={handleCancelCaseEdit}
            onChange={handleCaseDataChange}
            getStatusBadge={getStatusBadge}
          />

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-800">Documentos</h3>
            </div>
            <div className="p-6">
              <DocumentosCaso idCaso={id_caso} estado={caso?.estado ?? ""} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Notebook className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 tracking-tight">
                Resumen de los hechos
              </h3>
            </div>
            <div className="p-6">
              {!isEditingCaseInfo ? (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {displayCaseData?.resumen_hechos || "No hay resumen registrado"}
                </p>
              ) : (
                <Textarea
                  value={editedCaseData?.resumen_hechos || ""}
                  onChange={(e) => handleCaseDataChange("resumen_hechos", e.target.value)}
                  placeholder="Descripción detallada de los hechos del caso..."
                  className="min-h-48 border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl leading-relaxed"
                />
              )}
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 tracking-tight">Observaciones</h3>
            </div>
            <div className="p-6">
              <ObservacionesChat
                idCaso={id_caso}
                observaciones={caso?.observaciones}
                observacionesEstudiante={caso?.observaciones_estudiante}
              />
            </div>
          </Card>
        </>
      ),
    },
    {
      value: "client",
      content: (
        <ClientInfo
          usuarios={isEditingClient ? editedClientData : caso?.usuarios}
          isEditing={isEditingClient}
          editedData={editedClientData}
          onEdit={handleEditClient}
          onSave={handleSaveClient}
          onCancel={handleCancelClientEdit}
          onChange={handleClientDataChange}
          canEdit
        />
      ),
    },
    {
      value: "defendant",
      content: (
        <DefendantInfo
          defendantData={isEditingDefendant ? editedDefendantData : demandado}
          isEditing={isEditingDefendant}
          editedData={editedDefendantData}
          onEdit={handleEditDefendant}
          onSave={handleSaveDefendant}
          onCancel={handleCancelDefendantEdit}
          onChange={handleDefendantDataChange}
          canEdit
        />
      ),
    },
    {
      value: "contract",
      content: (
        <ContractInfo
          contrato={contrato}
          isEditing={false}
          editedData={null}
          onEdit={() => {}}
          onSave={() => {}}
          onCancel={() => {}}
          onChange={() => {}}
        />
      ),
    },
    { value: "team", content: <EquipoCaso caso={caso} /> },
    { value: "corrections", content: <HistorialCorrecciones idCaso={id_caso} /> },
  ];

  return (
    <CaseDetailShell
      caso={caso}
      loading={loading}
      error={error}
      idCaso={id_caso}
      navbar={<Navbar />}
      backHref="/pro-apoyo/gestionar-caso"
      backLabel="Volver a supervisión de casos"
      statusBadge={caso ? getStatusBadge(caso.estado) : null}
      tabs={tabs}
      headerActions={
        caso && (
          <div className="flex flex-col gap-2 lg:min-w-[260px]">
            <BotonesEntrevista idCaso={id_caso} caso={caso} demandado={demandado} />
            <ArchivarCasoProApoyo
              idCaso={id_caso}
              estado={caso.estado || ""}
              onRefresh={traerDatos}
            />
          </div>
        )
      }
      sidebarTop={
        /* Reasignar el equipo es la acción principal del profesional de apoyo en
           esta pantalla y estaba de última en la columna, debajo de Fechas,
           Llamados y Actividades: los usuarios reportaron tener que bajar
           demasiado para encontrarla. */
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 tracking-tight">Equipo asignado</h3>
          </div>
          <div className="p-6 space-y-6">
            <AdminReasignarEquipo
              idCaso={id_caso}
              type="estudiante"
              currentName={displayCaseData?.estudiantes_casos?.find(e => !e.fecha_fin_asignacion)?.estudiante?.perfil?.nombre_completo ?? undefined}
              onRefresh={traerDatos}
            />
            <div className="border-t border-slate-100 pt-6">
              <AdminReasignarEquipo
                idCaso={id_caso}
                type="asesor"
                currentName={displayCaseData?.asesores_casos?.find(a => !a.fecha_fin_asignacion)?.asesor?.perfil?.nombre_completo ?? undefined}
                onRefresh={traerDatos}
              />
            </div>
          </div>
        </Card>
      }
      sidebarExtra={
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 tracking-tight">Actividades</h3>
          </div>
          <div className="p-6">
            <ActividadesCaso idCaso={id_caso} />
          </div>
        </Card>
      }
    />
  );
}
