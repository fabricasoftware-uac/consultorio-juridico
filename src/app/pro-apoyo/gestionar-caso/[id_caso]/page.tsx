"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "app/pro-apoyo/components/NavBarProApoyo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Caso, Demandado, Estudiante, Usuario } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { formatDate } from "@/lib/format-date";
import { cleanData } from "@/lib/utils";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  AlertTriangle,
  Notebook,
  FileText,
  Edit3,
  Check,
  MessageSquare,
  Briefcase,
  Activity,
  ClipboardList,
  ShieldCheck,
  CheckCircle2,
  Users,
  Calendar,
  UserX,
  Mail,
  Phone,
  MapPin,
  IdCard,
  User,
  Heart,
  DollarSign,
  BriefcaseIcon,
  Smile,
} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";
import { AdminReasignarEquipo } from "@/components/casos-juridicos/reasignar-equipo-tabla";
import { toast } from "sonner";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { StudentInfo } from "@/components/casos-juridicos/student-info";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { LlamadosList } from "@/components/casos-juridicos/llamados-list";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { CasoAuditoria } from "@/components/casos-juridicos/caso-auditoria";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { BotonesCerrarArchivar } from "@/components/casos-juridicos/botones-cerrar-archivar";

export default function Page({
  params,
}: {
  params: Promise<{ id_caso: string }>;
}) {
  const { id_caso } = React.use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingStudent, setIsEditingStudent] = useState(false);
  const [editedStudentData, setEditedStudentData] = useState<
    Estudiante[] | null
  >(null);
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(
    null,
  );
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] =
    useState<Demandado | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);
  const [caso, setCaso] = useState<Caso>();

  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function traerDatos() {
    try {
      setLoading(true);
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
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  const refetch = useCallback(() => {
    traerDatos();
  }, [id_caso]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useRealtimeCaso(id_caso, refetch);

  const handleStudentDataChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    if (editedStudentData) {
      const updatedData = [...editedStudentData];
      const fieldParts = field.split(".");

      if (fieldParts.length === 2 && fieldParts[0] === "perfil") {
        updatedData[index] = {
          ...updatedData[index],
          perfil: {
            ...updatedData[index].perfil,
            [fieldParts[1]]: value,
          },
        };
      } else {
        updatedData[index] = {
          ...updatedData[index],
          [field]: value,
        };
      }

      setEditedStudentData(updatedData);
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

  const displayStudentData = isEditingStudent
    ? editedStudentData
    : caso?.estudiantes_casos.map((ec) => ec.estudiante);
  const displayClientData = isEditingClient ? editedClientData : caso?.usuarios;
  const displayDefendantData = isEditingDefendant
    ? editedDefendantData
    : demandado;
  const displayCaseData = isEditingCaseInfo ? editedCaseData : caso;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-500 font-medium">
            Cargando detalles del caso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/pro-apoyo/gestionar-caso"
              className="flex items-center text-blue-600 hover:text-blue-700 hover:underline mb-4 transition-colors duration-200 cursor-pointer"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver a supervisión de casos
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
                  {caso?.usuarios.nombre_completo}
                </p>
                <div className="flex items-center mt-4 p-2 px-3 bg-blue-50/50 rounded-lg w-fit">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mr-3">
                    Estudiante asignado:
                  </span>
                  <span className="text-sm font-semibold text-blue-700">
                    {caso?.estudiantes_casos &&
                    caso.estudiantes_casos.length > 0
                      ? caso.estudiantes_casos[
                          caso.estudiantes_casos.length - 1
                        ].estudiante.perfil.nombre_completo
                      : "Sin asignar"}
                  </span>
                </div>
              </div>
              <div className="mt-3 lg:mt-0 lg:min-w-[260px]">
                <BotonesCerrarArchivar idCaso={id_caso} estado={caso?.estado || ""} clasificacion={caso?.clasificacion} onRefresh={traerDatos} />
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
              {displayCaseData?.estudiantes_casos.length ? (
                <TabsTrigger value="supervision">Datos estudiante</TabsTrigger>
              ) : null}
              <TabsTrigger value="client">Usuario</TabsTrigger>
              <TabsTrigger value="defendant">Accionado</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case Info */}
                <div className="lg:col-span-2 space-y-6">
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
                      <div className="p-2 bg-green-100 rounded-lg text-green-600">
                        <Notebook className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">
                        Resumen de los hechos
                      </h3>
                    </div>

                    <div className="p-6">
                      {!isEditingCaseInfo ? (
                        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 opacity-60" />
                          {displayCaseData?.resumen_hechos ? (
                            <p className="text-slate-700 leading-relaxed pl-3 whitespace-pre-wrap">
                              {displayCaseData?.resumen_hechos}
                            </p>
                          ) : (
                            <p className="text-sm text-center text-slate-500 italic py-4">
                              No hay resumen de los hechos registrado
                            </p>
                          )}
                        </div>
                      ) : (
                        <Textarea
                          value={editedCaseData?.resumen_hechos || ""}
                          onChange={(e) =>
                            handleCaseDataChange(
                              "resumen_hechos",
                              e.target.value,
                            )
                          }
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
                      <h3 className="font-bold text-slate-800 tracking-tight">
                        Observaciones
                      </h3>
                    </div>
                    <div className="p-6">
                      <ObservacionesChat
                        idCaso={id_caso}
                        observaciones={caso?.observaciones}
                        observacionesEstudiante={caso?.observaciones_estudiante}
                      />
                    </div>
                  </Card>

                  {/* Historial + Documentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-slate-800">Historial del Caso</h3>
                      </div>
                      <div className="p-6 max-h-80 overflow-y-auto"><CasoAuditoria idCaso={id_caso} /></div>
                    </Card>
                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-cyan-600" />
                        <h3 className="font-bold text-slate-800">Documentos</h3>
                      </div>
                      <div className="p-6"><DocumentosCaso idCaso={id_caso} /></div>
                    </Card>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
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
                        {caso && (
                          <div className="flex items-center gap-2 text-slate-900 font-medium">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            {formatDate(caso.fecha_creacion)}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <CountdownTimer
                          fechaVencimiento={caso?.fecha_vencimiento_estudiante}
                          label="Estudiante"
                          estado={caso?.estado}
                        />
                        <CountdownTimer
                          fechaVencimiento={caso?.fecha_vencimiento_asesor}
                          label="Asesor"
                          estado={caso?.estado}
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">
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



                  <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-800 tracking-tight">
                        Equipo asignado
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <AdminReasignarEquipo
                        idCaso={id_caso}
                        type="estudiante"
                        currentName={displayCaseData?.estudiantes_casos?.[displayCaseData.estudiantes_casos.length - 1]?.estudiante?.perfil?.nombre_completo}
                        onRefresh={traerDatos}
                      />
                      <div className="border-t border-slate-100 pt-6">
                        <AdminReasignarEquipo
                          idCaso={id_caso}
                          type="asesor"
                          currentName={displayCaseData?.asesores_casos?.[displayCaseData.asesores_casos.length - 1]?.asesor?.perfil?.nombre_completo}
                          onRefresh={traerDatos}
                        />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Student Data Tab */}
            <TabsContent value="supervision" className="space-y-6">
              <StudentInfo
                students={displayStudentData || null}
                isEditing={isEditingStudent}
                onDataChange={handleStudentDataChange}
              />
            </TabsContent>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-6">
              <ClientInfo
                usuarios={displayClientData}
                isEditing={isEditingClient}
                editedData={editedClientData}
                onEdit={handleEditClient}
                onSave={handleSaveClient}
                onCancel={handleCancelClientEdit}
                onChange={handleClientDataChange}
              />
            </TabsContent>

            {/* Defendant Tab */}
            <TabsContent value="defendant" className="space-y-6">
              <DefendantInfo
                defendantData={displayDefendantData}
                isEditing={isEditingDefendant}
                editedData={editedDefendantData}
                onEdit={handleEditDefendant}
                onSave={handleSaveDefendant}
                onCancel={handleCancelDefendantEdit}
                onChange={handleDefendantDataChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
