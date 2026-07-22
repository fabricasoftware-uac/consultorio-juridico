"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Navbar } from "app/asesor/components/NavBarAsesor";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import {
  Asesor,
  Caso,
  Demandado,
  Estudiante,
  Usuario,
} from "app/types/database";
import { Textarea } from "@/components/ui/textarea";
import { updateObservaciones } from "../../../../../supabase/queries/updateObservaciones";
import { insertAuditEvent } from "../../../../../supabase/queries/auditoriaCasos";
import { toast } from "sonner";
import { cleanData, sumarDiasHabiles } from "@/lib/utils";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  AlertTriangle,
  Pencil,
  Save,
  X,
  Notebook,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { CerrarCasoAsesor } from "@/components/casos-juridicos/cerrar-caso-asesor";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";
import { StudentInfo } from "@/components/casos-juridicos/student-info";
import { SectionCard } from "@/components/casos-juridicos/shared-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users } from "lucide-react";
import { formatDate } from "@/lib/format-date";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [demandado, setDemandado] = useState<Demandado>();
  const [caso, setCaso] = useState<Caso>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [ultimoEstudiante, setUltimoEstudiante] = useState<Estudiante>();
  const [ultimoAsesor, setUltimoAsesor] = useState<Asesor>();
  const [activeTab, setActiveTab] = useState("overview");
  const id_caso = id;

  const [isEditing, setIsEditing] = useState(false);
  const [editObservaciones, setEditObservaciones] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(
    null,
  );

  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] =
    useState<Demandado | null>(null);

  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);

  async function traerDatos() {
    try {
      setError("");
      setLoading(true);
      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);

      const lastEstudiante =
        casoFetch.estudiantes_casos?.[casoFetch.estudiantes_casos.length - 1]
          ?.estudiante;
      if (lastEstudiante) setUltimoEstudiante(lastEstudiante);

      const lastAsesor =
        casoFetch.asesores_casos?.[casoFetch.asesores_casos.length - 1]?.asesor;
      if (lastAsesor) setUltimoAsesor(lastAsesor);

      if (demandadoFetch) {
        setDemandado(demandadoFetch);
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateObservaciones = async () => {
    try {
      setIsSaving(true);
      await updateObservaciones(id_caso, editObservaciones);
      setCaso((prev) =>
        prev ? { ...prev, observaciones: editObservaciones } : prev,
      );
      setIsEditing(false);
      toast.success("Observaciones actualizadas correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar las observaciones");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setEditObservaciones(caso?.observaciones || "");
    setIsEditing(true);
  };

  // Clasificación Rápida de Casos
  const [isSavingClasificacion, setIsSavingClasificacion] = useState(false);
  const [isSolicitandoAjustes, setIsSolicitandoAjustes] = useState(false);

  const handleClasificarCaso = async (clasificacion: string) => {
    try {
      setIsSavingClasificacion(true);
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          clasificacion: clasificacion,
          estado: "activo",
          fecha_vencimiento_asesor: null,
        })
        .eq("id_caso", id_caso);

      if (errorCaso) {
        throw errorCaso;
      }

      await insertAuditEvent(
        id_caso,
        "aprobacion",
        `El asesor aprobó el caso con clasificación "${clasificacion}".`,
        { clasificacion },
      );

      // Auto-resolver llamado de atencion del asesor si existe
      await supabase
        .from("llamados_atencion")
        .update({ resuelto: true, fecha_resolucion: new Date().toISOString() })
        .eq("id_caso", id_caso)
        .eq("tipo", "asesor")
        .eq("resuelto", false);

      await traerDatos();
      toast.success("Caso clasificado y aprobado exitosamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al clasificar el caso");
    } finally {
      setIsSavingClasificacion(false);
    }
  };

  const handleSolicitarAjustes = async () => {
    try {
      setIsSolicitandoAjustes(true);
      const { error } = await supabase
        .from("casos")
        .update({
          estado: "en_correccion",
          fecha_vencimiento_estudiante: sumarDiasHabiles(new Date(), 3).toISOString(),
          fecha_vencimiento_asesor: null,
        })
        .eq("id_caso", id_caso);
      if (error) throw error;

      await supabase
        .from("llamados_atencion")
        .update({ resuelto: true, fecha_resolucion: new Date().toISOString() })
        .eq("id_caso", id_caso)
        .eq("tipo", "asesor")
        .eq("resuelto", false);

      await insertAuditEvent(
        id_caso,
        "correccion",
        "El asesor solicitó ajustes al estudiante. El caso requiere correcciones.",
      );
      await traerDatos();
      toast.success("Caso devuelto al estudiante para corrección");
    } catch (err) {
      console.error(err);
      toast.error("Error al devolver el caso");
    } finally {
      setIsSolicitandoAjustes(false);
    }
  };

  // Client editing functions
  const handleEditClient = () => {
    setEditedClientData(caso?.usuarios || null);
    setIsEditingClient(true);
  };

  const handleSaveClient = async () => {
    if (editedClientData) {
      setIsEditingClient(false);
      setEditedClientData(null);
      const limpio = cleanData(editedClientData);
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
    }
  };

  const handleCancelClientEdit = () => {
    setIsEditingClient(false);
    setEditedClientData(null);
  };

  const handleClientDataChange = (field: string, value: string | boolean) => {
    if (editedClientData) {
      setEditedClientData({
        ...editedClientData,
        [field]: value,
      });
    }
  };

  // Defendant editing functions
  const handleEditDefendant = () => {
    setEditedDefendantData(demandado || null);
    setIsEditingDefendant(true);
  };

  const handleSaveDefendant = async () => {
    if (editedDefendantData) {
      setIsEditingDefendant(false);
      setEditedDefendantData(null);
      const limpio = cleanData(editedDefendantData);

      try {
        const { data, error } = await supabase
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
    }
  };

  const handleCancelDefendantEdit = () => {
    setIsEditingDefendant(false);
    setEditedDefendantData(null);
  };

  const handleDefendantDataChange = (field: string, value: string) => {
    if (editedDefendantData) {
      setEditedDefendantData({
        ...editedDefendantData,
        [field]: value,
      });
    }
  };

  // Case information editing functions
  const handleEditCaseInfo = () => {
    if (!caso) return;
    setEditedCaseData({
      area: caso.area,
      tipo_proceso: caso?.tipo_proceso,
      resumen_hechos: caso?.resumen_hechos,
      estado: caso?.estado,
      observaciones: caso?.observaciones,
      clasificacion: caso?.clasificacion,
      // Conservar las referencias no editables
      estudiantes_casos: caso?.estudiantes_casos,
      asesores_casos: caso?.asesores_casos,
      fecha_creacion: caso?.fecha_creacion,
      fecha_cierre: caso?.fecha_cierre,
      usuarios: caso?.usuarios,
      id_caso: caso?.id_caso,
      id_usuario: caso?.id_usuario,
    });
    setIsEditingCaseInfo(true);
  };

  const handleSaveCaseInfo = async () => {
    if (editedCaseData) {
      setIsEditingCaseInfo(false);
      setEditedCaseData(null);
      const limpio = cleanData(editedCaseData);
      try {
        const { error: errorCaso } = await supabase
          .from("casos")
        .update({
          area: limpio.area,
          tipo_proceso: limpio.tipo_proceso,
            estado: limpio.estado,
            clasificacion: limpio.clasificacion,
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
    }
  };

  const handleCancelCaseEdit = () => {
    setIsEditingCaseInfo(false);
    setEditedCaseData(null);
  };

  const handleCaseDataChange = (field: string, value: string | boolean) => {
    if (editedCaseData) {
      setEditedCaseData({
        ...editedCaseData,
        [field]: value,
      });
    }
  };

  const refetch = useCallback(() => {
    traerDatos();
  }, [id_caso]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useRealtimeCaso(id_caso, refetch);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">
          Cargando detalles del caso...
        </p>
      </div>
    );
  }
  if (!caso) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <p className="text-gray-600 font-medium">
          El caso no pudo ser encontrado.
        </p>
        <Link href="/asesor/mis-casos">
          <Button variant="outline">Volver a mis casos</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/asesor/mis-casos"
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors cursor-pointer hover:underline"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver a mis casos
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {caso?.id_caso}
                  </h1>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {caso && getStatusBadge(caso?.estado)}
                  </div>
                </div>
                <p className="text-lg text-slate-500 font-medium">
                  Usuario:{" "}
                  <span className="font-semibold">
                    {caso?.usuarios?.nombre_completo || "N/A"}
                  </span>
                </p>
                <div className="flex items-center mt-4 p-2 px-3 bg-blue-50/50 rounded-lg w-fit">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mr-3">
                    Estudiante asignado:
                  </span>
                  <span className="text-sm font-semibold text-blue-700">
                    {ultimoEstudiante?.perfil?.nombre_completo || "Sin asignar"}
                  </span>
                </div>
              </div>
              <div className="mt-3 lg:mt-0 lg:min-w-[260px] flex flex-col gap-2">
                <BotonesEntrevista idCaso={id_caso} caso={caso} demandado={demandado || null} />
                <CerrarCasoAsesor idCaso={id_caso} estado={caso.estado} clasificacion={caso.clasificacion} onRefresh={traerDatos} />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="supervision">Datos estudiante</TabsTrigger>
              <TabsTrigger value="client">Usuario</TabsTrigger>
              <TabsTrigger value="defendant">Accionado</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {caso.estado === "pendiente_aprobacion" && (
                <Card className="p-6 bg-amber-50 border-amber-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-amber-900">
                        Aprobar y Clasificar Caso
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">
                        Este caso está pendiente de su revisión. Por favor
                        determine si el caso debe continuar su trámite o si
                        quedará registrado únicamente como asesoría. Al
                        seleccionarlo se aprobará inmediatamente.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                      <Button
                        onClick={handleSolicitarAjustes}
                        variant="outline"
                        className="w-full sm:w-auto bg-white border-orange-300 text-orange-700 hover:bg-orange-100"
                        disabled={isSolicitandoAjustes}
                      >
                        Solicitar ajustes
                      </Button>
                      <Button
                        onClick={() => handleClasificarCaso("solo_asesoria")}
                        variant="outline"
                        className="w-full sm:w-auto bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
                        disabled={isSavingClasificacion}
                      >
                        Solo asesoría
                      </Button>
                      <Button
                        onClick={() => handleClasificarCaso("en_tramite")}
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
                        disabled={isSavingClasificacion}
                      >
                        Aprobar y continuar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Case Info */}
                  <CaseInfoTab
                    caseData={isEditingCaseInfo ? editedCaseData : caso}
                    isEditing={isEditingCaseInfo}
                    editedData={editedCaseData}
                    onEdit={handleEditCaseInfo}
                    onSave={handleSaveCaseInfo}
                    onCancel={handleCancelCaseEdit}
                    onChange={handleCaseDataChange}
                    getStatusBadge={getStatusBadge}
                    canEdit={true}
                  />

                  <SectionCard
                    title="Información adicional"
                    icon={Notebook}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                  >
                    <div className="space-y-6">
                      {/* Resumen de los hechos */}
                      <div className="space-y-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Resumen de los hechos:
                        </span>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-sm text-slate-700 leading-relaxed font-sans">
                            {caso.resumen_hechos ||
                              "No hay resumen de los hechos registrado."}
                          </p>
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div className="space-y-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Observaciones
                        </span>
                        <ObservacionesChat
                          idCaso={id_caso}
                          observaciones={caso?.observaciones}
                          observacionesEstudiante={caso?.observaciones_estudiante}
                        />
                      </div>
                    </div>
                    </SectionCard>

                  {/* Historial + Documentos */}
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
                      <div className="p-6"><DocumentosCaso idCaso={id_caso} estado={caso.estado} /></div>
                    </Card>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Fechas importantes */}
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
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2 block">
                          Fecha de creación
                        </span>
                        <div className="flex items-center gap-2 text-slate-900 font-medium">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                          {formatDate(caso.fecha_creacion)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {caso.estado !== "en_proceso" && (
                        <CountdownTimer
                          fechaVencimiento={caso.fecha_vencimiento_asesor}
                          label="Aprobación"
                          estado={caso.estado}
                        />
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-slate-800">Equipo asignado</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Estudiante</span>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          {ultimoEstudiante?.perfil?.nombre_completo || "Sin asignar"}
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-xs font-bold text-slate-500 uppercase">Asesor</span>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          {ultimoAsesor?.perfil?.nombre_completo || "Sin asignar"}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Estado del caso */}
                  {caso.estado === "activo" && (
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3 font-semibold text-green-800">
                        <Users className="w-5 h-5" />
                        Aprobación del Asesor
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-green-700">
                          <CheckCircle2 className="w-5 h-5" />
                          <div>
                            <p className="font-semibold">Caso Aprobado</p>
                            <p className="text-sm opacity-80">
                              {caso.clasificacion === "en_tramite" ? (
                                "Continúa el proceso"
                              ) : (
                                "Queda como asesoría"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Llamados de Atención */}
                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-amber-800 tracking-tight">
                        Llamados de Atención
                      </h3>
                    </div>
                    <div className="p-6">
                      <LlamadosList idCaso={id_caso} />
                    </div>
                  </Card>
                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <h3 className="font-bold text-slate-800 tracking-tight">Actividades</h3>
                    </div>
                    <div className="p-6"><ActividadesCaso idCaso={id_caso} /></div>
                  </Card>



                </div>
              </div>
            </TabsContent>

            {/* Student Data Tab */}
            <TabsContent value="supervision" className="space-y-6">
              <StudentInfo
                students={
                  caso?.estudiantes_casos?.map((ec) => ec.estudiante) || []
                }
                isEditing={false}
                onDataChange={() => {}}
              />
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              <ClientInfo
                usuarios={isEditingClient ? editedClientData : caso?.usuarios}
                isEditing={isEditingClient}
                editedData={editedClientData}
                onEdit={handleEditClient}
                onSave={handleSaveClient}
                onCancel={handleCancelClientEdit}
                onChange={handleClientDataChange}
                canEdit={true}
              />
            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <DefendantInfo
                defendantData={
                  isEditingDefendant ? editedDefendantData : demandado
                }
                isEditing={isEditingDefendant}
                editedData={editedDefendantData}
                onEdit={handleEditDefendant}
                onSave={handleSaveDefendant}
                onCancel={handleCancelDefendantEdit}
                onChange={handleDefendantDataChange}
                canEdit={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
