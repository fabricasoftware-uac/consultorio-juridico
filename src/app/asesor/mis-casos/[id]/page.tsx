"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Navbar } from "app/asesor/components/NavBarAsesor";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { getContratoByUsuarioId } from "../../../../../supabase/queries/getContratoByUsuarioId";
import {
  Asesor,
  Caso,
  ContratoLaboral,
  Demandado,
  Estudiante,
  Usuario,
} from "app/types/database";
import { Textarea } from "@/components/ui/textarea";
import { insertAuditEvent } from "../../../../../supabase/queries/auditoriaCasos";
import { toast } from "sonner";
import { cleanData, sumarDiasHabiles } from "@/lib/utils";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  AlertTriangle, Notebook, FileText, CheckCircle2, Users,
} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseDetailShell, TabConfig } from "@/components/casos-juridicos/case-detail-shell";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ContractInfo } from "@/components/casos-juridicos/contract-info";
import { EquipoCaso } from "@/components/casos-juridicos/equipo-caso";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { CerrarCasoAsesor } from "@/components/casos-juridicos/cerrar-caso-asesor";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";
import { SectionCard } from "@/components/casos-juridicos/shared-ui";
import { HistorialCorrecciones } from "@/components/casos-juridicos/historial-correcciones";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [demandado, setDemandado] = useState<Demandado>();
  const [caso, setCaso] = useState<Caso>();
  const [contrato, setContrato] = useState<ContratoLaboral | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMotivoModalOpen, setIsMotivoModalOpen] = useState(false);
  const [motivoCorreccionInput, setMotivoCorreccionInput] = useState("");
  const [ultimoEstudiante, setUltimoEstudiante] = useState<Estudiante>();
  const [ultimoAsesor, setUltimoAsesor] = useState<Asesor>();
  const id_caso = id;

  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(null);

  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] = useState<Demandado | null>(null);

  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);

  const [isSavingClasificacion, setIsSavingClasificacion] = useState(false);
  const [isSolicitandoAjustes, setIsSolicitandoAjustes] = useState(false);
  const [pretension, setPretension] = useState("");

  async function traerDatos() {
    try {
      setError("");
      const [casoFetch, demandadoFetch] = await Promise.all([
        getCasoById(id_caso),
        getDemandadoByCasoId(id_caso),
      ]);

      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      // Precarga la pretensión existente para no perderla al aprobar.
      setPretension((prev) => prev || casoFetch.tipo_proceso || "");

      const lastEstudiante =
        casoFetch.estudiantes_casos?.find(e => !e.fecha_fin_asignacion)?.estudiante;
      if (lastEstudiante) setUltimoEstudiante(lastEstudiante);

      const lastAsesor =
        casoFetch.asesores_casos?.find(a => !a.fecha_fin_asignacion)?.asesor;
      if (lastAsesor) setUltimoAsesor(lastAsesor);

      if (demandadoFetch) setDemandado(demandadoFetch);

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

  const handleClasificarCaso = async (clasificacion: string) => {
    try {
      setIsSavingClasificacion(true);
      const pretensionLimpia = pretension.trim();
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          clasificacion: clasificacion,
          estado: "activo",
          fecha_vencimiento_asesor: null,
          // Solo se escribe si el asesor puso algo: un campo vacío no debe
          // borrar una pretensión ya registrada.
          ...(pretensionLimpia ? { tipo_proceso: pretensionLimpia } : {}),
        })
        .eq("id_caso", id_caso);

      if (errorCaso) throw errorCaso;

      await insertAuditEvent(
        id_caso,
        "aprobacion",
        `El asesor aprobó el caso con clasificación "${clasificacion}".`,
        { clasificacion },
      );

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
    if (!motivoCorreccionInput.trim()) {
      toast.error("Debe ingresar un motivo para solicitar ajustes");
      return;
    }
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

      // La accion DEBE seguir siendo "correccion": trg_auditoria_notificar solo
      // notifica las acciones de su lista blanca ('entrevista', 'aprobacion',
      // 'correccion', 'observacion'). Un nombre nuevo deja al estudiante sin
      // aviso en silencio. El motivo va en metadata, que es lo que varia.
      await insertAuditEvent(
        id_caso,
        "correccion",
        "El asesor solicitó ajustes al estudiante. El caso requiere correcciones.",
        { motivo: motivoCorreccionInput.trim() },
      );

      await traerDatos();
      setIsMotivoModalOpen(false);
      setMotivoCorreccionInput("");
      toast.success("Caso devuelto al estudiante para corrección");
    } catch (err) {
      console.error(err);
      toast.error("Error al devolver el caso");
    } finally {
      setIsSolicitandoAjustes(false);
    }
  };

  // Client editing
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

  // Defendant editing
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

  // Case info editing
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

  const refetch = useCallback(() => { traerDatos(); }, [id_caso]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id_caso, refetch);

  const tabs: TabConfig[] = [
    {
      value: "overview",
      content: (
        <>
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

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-800">Documentos</h3>
            </div>
            <div className="p-6">
              <DocumentosCaso idCaso={id_caso} estado={caso?.estado ?? ""} />
            </div>
          </Card>

          <SectionCard
            title="Información adicional"
            icon={Notebook}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Resumen de los hechos:
                </span>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed font-sans">
                    {caso?.resumen_hechos || "No hay resumen de los hechos registrado."}
                  </p>
                </div>
              </div>

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
          canEdit={true}
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
          canEdit={true}
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
    <>
      <CaseDetailShell
        caso={caso}
        loading={loading}
        error={error}
        idCaso={id_caso}
        navbar={<Navbar />}
        backHref="/asesor/mis-casos"
        backLabel="Volver a mis casos"
        statusBadge={caso ? getStatusBadge(caso.estado) : null}
        tabs={tabs}
        headerActions={
          caso && (
            <div className="flex flex-col gap-2 lg:min-w-[260px]">
              <BotonesEntrevista idCaso={id_caso} caso={caso} demandado={demandado || null} />
              <CerrarCasoAsesor
                idCaso={id_caso}
                estado={caso.estado}
                clasificacion={caso.clasificacion}
                onRefresh={traerDatos}
              />
            </div>
          )
        }
        banner={
          <>
            {caso?.estado === "pendiente_aprobacion" && (
              <Card className="p-6 bg-amber-50 border-amber-200 space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-amber-900">
                      Aprobar y Clasificar Caso
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      Este caso está pendiente de su revisión. Por favor determine si
                      el caso debe continuar su trámite o si quedará registrado
                      únicamente como asesoría. Al seleccionarlo se aprobará
                      inmediatamente.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
                    <Button
                      onClick={() => setIsMotivoModalOpen(true)}
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

                {/* La pretensión se define aquí: es el momento en que el asesor
                    tiene el criterio jurídico para nombrarla. */}
                <div className="border-t border-amber-200 pt-4 space-y-1.5">
                  <Label className="text-sm font-bold text-amber-900">
                    Pretensión o motivo del caso
                  </Label>
                  <p className="text-xs text-amber-700">
                    Qué pretende el solicitante. Se guarda al aprobar.
                  </p>
                  <Input
                    value={pretension}
                    onChange={(e) => setPretension(e.target.value)}
                    placeholder="Ej: cuota alimentaria, despido injustificado..."
                    disabled={isSavingClasificacion}
                    className="bg-white border-amber-300 h-10 max-w-md"
                  />
                </div>
              </Card>
            )}

            {caso?.estado === "activo" && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">
                      Opciones del Caso Activo
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      El caso se encuentra activo. Si necesita que los estudiantes
                      ajusten información clave (como el resumen de los hechos),
                      puede solicitar una corrección.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsMotivoModalOpen(true)}
                    variant="outline"
                    className="w-full sm:w-auto bg-white border-orange-300 text-orange-700 hover:bg-orange-100"
                    disabled={isSolicitandoAjustes}
                  >
                    Solicitar ajustes
                  </Button>
                </div>
              </Card>
            )}
          </>
        }
        sidebarTop={
          <>
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

            {caso?.estado === "activo" && (
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
                        {caso.clasificacion === "en_tramite"
                          ? "Continúa el proceso"
                          : "Queda como asesoría"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        }
        sidebarExtra={
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-800 tracking-tight">Actividades</h3>
            </div>
            <div className="p-6">
              <ActividadesCaso idCaso={id_caso} />
            </div>
          </Card>
        }
      />

      {/* Modal para solicitar correcciones */}
      <Dialog open={isMotivoModalOpen} onOpenChange={setIsMotivoModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Correcciones al Estudiante</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-slate-500">
              Describa las correcciones necesarias que el estudiante debe realizar en
              el caso (ej. mejorar el resumen de los hechos, aclarar fechas, etc).
            </p>
            <Textarea
              value={motivoCorreccionInput}
              onChange={(e) => setMotivoCorreccionInput(e.target.value)}
              placeholder="Escribe el motivo aquí..."
              className="min-h-[120px] bg-white text-sm"
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMotivoModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSolicitarAjustes}
              disabled={isSolicitandoAjustes || !motivoCorreccionInput.trim()}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isSolicitandoAjustes ? "Guardando..." : "Solicitar ajustes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
