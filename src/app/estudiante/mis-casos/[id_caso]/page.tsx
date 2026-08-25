"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "../../components/NavBarEstudiante";
import { Caso, Demandado, ContratoLaboral } from "app/types/database";
import { getCasoById } from "../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../supabase/queries/getDemandadoByCasoId";
import { getContratoByUsuarioId } from "../../../../../supabase/queries/getContratoByUsuarioId";
import { insertAuditEvent } from "../../../../../supabase/queries/auditoriaCasos";
import { supabase } from "@/lib/supabase/supabase-client";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseDetailShell, TabConfig } from "@/components/casos-juridicos/case-detail-shell";
import { CaseInfoTab } from "@/components/casos-juridicos/case-info-tab";
import { ClientInfo } from "@/components/casos-juridicos/client-info";
import { DefendantInfo } from "@/components/casos-juridicos/defendant-info";
import { ContractInfo } from "@/components/casos-juridicos/contract-info";
import { EquipoCaso } from "@/components/casos-juridicos/equipo-caso";
import { ActividadesCaso } from "@/components/casos-juridicos/actividades-caso";
import { ObservacionesChat } from "@/components/casos-juridicos/observaciones-chat";
import { DocumentosCaso } from "@/components/casos-juridicos/documentos-caso";
import { BotonesEntrevista } from "@/components/casos-juridicos/botones-entrevista";
import { HistorialCorrecciones } from "@/components/casos-juridicos/historial-correcciones";
import { useRealtimeCaso } from "@/lib/hooks/useRealtimeCaso";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Users, ClipboardList, FileText, Send, Pencil, Check, X, AlertTriangle,
} from "lucide-react";
import { sumarDiasHabiles } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: Promise<{ id_caso: string }> }) {
  const { id_caso } = React.use(params);
  const router = useRouter();
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>(null);
  const [contrato, setContrato] = useState<ContratoLaboral | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [motivoCorreccion, setMotivoCorreccion] = useState<string | null>(null);
  const [isEditingHechos, setIsEditingHechos] = useState(false);
  const [editedHechos, setEditedHechos] = useState("");
  const [editedObservaciones, setEditedObservaciones] = useState("");

  // traerDatos se dispara tambien por realtime (useRealtimeCaso). Sin este ref,
  // cualquier cambio en el caso mientras el estudiante escribe le vacia el
  // textarea con el valor del servidor y pierde lo que llevaba redactado.
  const editandoRef = useRef(false);
  useEffect(() => { editandoRef.current = isEditingHechos; }, [isEditingHechos]);

  async function traerDatos() {
    try {
      const [c, d] = await Promise.all([getCasoById(id_caso), getDemandadoByCasoId(id_caso)]);
      setCaso(c);
      setDemandado(d);
      if (c && !editandoRef.current) {
        setEditedHechos(c.resumen_hechos || "");
        setEditedObservaciones(c.observaciones_estudiante || "");
      }

      if (c?.usuarios?.id_usuario) {
        setContrato(await getContratoByUsuarioId(c.usuarios.id_usuario));
      }

      if (c?.estado === "en_correccion") {
        // maybeSingle: con .single() un caso sin solicitud previa devolvia error
        // PGRST116 en consola. Se aceptan los nombres antiguos de accion por si
        // quedaron filas escritas antes de restaurar 'correccion'.
        const { data } = await supabase
          .from("auditoria_casos")
          .select("metadata, descripcion")
          .eq("id_caso", Number(id_caso))
          .in("accion", ["correccion", "solicitud_correccion_asesor"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data?.metadata?.motivo) {
          setMotivoCorreccion(data.metadata.motivo);
        } else if (data?.descripcion) {
          setMotivoCorreccion(data.descripcion);
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const refetch = useCallback(() => { traerDatos(); }, [id_caso]);
  useEffect(() => { refetch(); }, [refetch]);
  useRealtimeCaso(id_caso, refetch);

  const handleReenviar = async () => {
    try {
      setEnviando(true);

      // Detectar cambios realizados
      const cambios: Record<string, { anterior: string | null; nuevo: string | null }> = {};
      if (caso) {
        if ((caso.resumen_hechos || "") !== editedHechos.trim()) {
          cambios.resumen_hechos = {
            anterior: caso.resumen_hechos || null,
            nuevo: editedHechos.trim() || null,
          };
        }
        if ((caso.observaciones_estudiante || "") !== editedObservaciones.trim()) {
          cambios.observaciones_estudiante = {
            anterior: caso.observaciones_estudiante || null,
            nuevo: editedObservaciones.trim() || null,
          };
        }
      }

      const { error } = await supabase
        .from("casos")
        .update({
          resumen_hechos: editedHechos.trim() || null,
          observaciones_estudiante: editedObservaciones.trim() || null,
          estado: "pendiente_aprobacion",
          fecha_vencimiento_asesor: sumarDiasHabiles(new Date(), 2).toISOString(),
          fecha_vencimiento_estudiante: null,
        })
        .eq("id_caso", id_caso);
      if (error) throw error;

      // La accion debe ser "entrevista" para que trg_auditoria_notificar avise
      // al asesor: su lista blanca es ('entrevista','aprobacion','correccion',
      // 'observacion') y cualquier otro nombre se descarta sin notificar.
      // Que sea una correccion se distingue por metadata.es_correccion.
      await insertAuditEvent(
        id_caso,
        "entrevista",
        "El estudiante aplicó correcciones al caso y lo envió para revisión del asesor.",
        { es_correccion: true, cambios: Object.keys(cambios).length > 0 ? cambios : null },
      );

      await supabase
        .from("llamados_atencion")
        .update({ resuelto: true, fecha_resolucion: new Date().toISOString() })
        .eq("id_caso", id_caso)
        .eq("resuelto", false);

      setIsEditingHechos(false);
      await traerDatos();
      toast.success("Correcciones guardadas y enviadas al asesor para aprobación");
    } catch (err) {
      console.error(err);
      toast.error("Error al reenviar el caso");
    } finally {
      setEnviando(false);
    }
  };

  const tabs: TabConfig[] = [
    {
      value: "overview",
      content: (
        <>
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

          {/* Documentos va arriba, no al final: subir los anexos es la tarea
              principal del estudiante en esta pantalla y quedaba tan abajo que
              los usuarios reportaron no encontrarla. */}
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-slate-800">Documentos</h3>
            </div>
            <div className="p-6">
              {/* El shell no renderiza las pestañas sin caso, pero TS no lo sabe. */}
              <DocumentosCaso idCaso={id_caso} estado={caso?.estado ?? ""} />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="bg-slate-50 border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800">Resumen de los hechos</h3>
              </div>
              {caso?.estado === "en_correccion" && !isEditingHechos && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingHechos(true)}
                  className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Editar hechos
                </Button>
              )}
            </div>
            <div className="p-6">
              {isEditingHechos ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedHechos}
                    onChange={(e) => setEditedHechos(e.target.value)}
                    placeholder="Modifique o complemente el resumen de los hechos..."
                    rows={6}
                    className="bg-white border-slate-300 text-sm font-sans"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedHechos(caso?.resumen_hechos || "");
                        setIsEditingHechos(false);
                      }}
                      disabled={enviando}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleReenviar}
                      disabled={enviando}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {enviando ? "Guardando..." : "Guardar y enviar corrección"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {caso?.resumen_hechos || "No hay resumen registrado"}
                </p>
              )}
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
          usuarios={caso?.usuarios}
          isEditing={false}
          editedData={null}
          onEdit={() => {}}
          onSave={() => {}}
          onCancel={() => {}}
          onChange={() => {}}
          canEdit={false}
        />
      ),
    },
    {
      value: "defendant",
      content: (
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
      idCaso={id_caso}
      navbar={<Navbar />}
      backHref="/estudiante/mis-casos"
      backLabel="Volver a mis casos"
      statusBadge={caso ? getStatusBadge(caso.estado) : null}
      tabs={tabs}
      headerActions={
        caso && (
          <>
            {caso.estado !== "en_proceso" && caso.estado !== "en_correccion" && (
              <BotonesEntrevista idCaso={id_caso} caso={caso} demandado={demandado} />
            )}
            {/* Antes solo existía en la lista de casos: para llenar la
                entrevista había que volver atrás. */}
            {(caso.estado === "en_proceso" || caso.estado === "en_correccion") && (
              <Button
                onClick={() => router.push(`/estudiante/mis-casos/${id_caso}/entrevista`)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                {caso.estado === "en_correccion" ? "Continuar entrevista" : "Ir a entrevista"}
              </Button>
            )}
            {caso.estado === "en_correccion" && (
              <Button
                onClick={handleReenviar}
                disabled={enviando}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-1" />
                {enviando ? "Enviando..." : "Reenviar para aprobación"}
              </Button>
            )}
          </>
        )
      }
      banner={
        caso?.estado === "en_correccion" && motivoCorreccion ? (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-3 shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Ajustes solicitados por el asesor
                </h3>
                <div className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  {motivoCorreccion}
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
      sidebarExtra={
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Actividades</h3>
          </div>
          <div className="p-6">
            <ActividadesCaso idCaso={id_caso} />
          </div>
        </Card>
      }
    />
  );
}
