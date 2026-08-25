"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase-client";
import { Card } from "@/components/ui/card";
import { AlertTriangle, PencilLine } from "lucide-react";
import { formatDate } from "@/lib/format-date";

interface HistorialCorreccionesProps {
  idCaso: string;
}

type Cambio = { anterior: string | null; nuevo: string | null };

/**
 * El metadata de auditoría ha tenido tres formas y en la base conviven las tres:
 *   1. antigua:    { campo: { anterior, nuevo } }
 *   2. intermedia: { es_correccion, cambios }            -- cambios puede ser null
 *   3. actual:     { es_correccion, cambios, documento_verificado }
 *
 * Detectar la forma por `es_correccion` y no por `metadata.cambios` es lo que
 * importa: con `metadata?.cambios ?? metadata`, un `cambios: null` (envío sin
 * cambios detectados) caía al metadata completo y se acababa leyendo
 * `.anterior` sobre null.
 */
function extraerCambios(metadata: any): Record<string, Cambio> {
  if (!metadata || typeof metadata !== "object") return {};

  const fuente = "es_correccion" in metadata ? metadata.cambios : metadata;
  if (!fuente || typeof fuente !== "object") return {};

  // Solo las entradas con forma {anterior, nuevo}: así una bandera suelta o un
  // campo nuevo en el metadata no vuelve a romper el render.
  return Object.fromEntries(
    Object.entries(fuente).filter(
      ([, v]) => !!v && typeof v === "object" && ("anterior" in v || "nuevo" in v),
    ),
  ) as Record<string, Cambio>;
}

export function HistorialCorrecciones({ idCaso }: HistorialCorreccionesProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        // 'correccion' y 'entrevista' son los nombres canonicos (los unicos que
        // notifica trg_auditoria_notificar). Los otros dos existieron un tiempo
        // y se siguen leyendo para no perder el historial ya escrito.
        const { data, error } = await supabase
          .from("auditoria_casos")
          .select("*, perfiles(nombre_completo)")
          .eq("id_caso", Number(idCaso))
          .in("accion", [
            "correccion",
            "entrevista",
            "solicitud_correccion_asesor",
            "edicion_estudiante_correccion",
          ])
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error al traer historial de correcciones:", error);
          return;
        }

        // Un envio inicial de entrevista no es una correccion: solo entran los
        // que el estudiante mando estando el caso en_correccion.
        setHistory(
          (data ?? []).filter(
            (r) => r.accion !== "entrevista" || r.metadata?.es_correccion === true,
          ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [idCaso]);

  // Radix desmonta el TabsContent inactivo, asi que este componente se vuelve a
  // montar y a consultar cada vez que se entra a la pestaña. El estado de carga
  // era un <p> de una linea que saltaba de golpe a tarjetas completas: de ahi el
  // parpadeo. El esqueleto ocupa un alto parecido al contenido real y sigue el
  // mismo patron que PaginaNotificaciones.
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="overflow-hidden border-slate-200 animate-pulse">
            <div className="p-4 border-b bg-slate-50 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50 border-slate-200 border-dashed">
        <p className="text-slate-500">No hay correcciones registradas para este caso.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {history.map((record) => {
        const isSolicitud = record.accion === "solicitud_correccion_asesor" || record.accion === "correccion";
        const autor = record.perfiles?.nombre_completo || "Usuario";
        const cambios = extraerCambios(record.metadata);
        const tieneCambios = Object.keys(cambios).length > 0;

        return (
          <Card key={record.id} className="overflow-hidden border-slate-200">
            <div className={`p-4 border-b ${isSolicitud ? "bg-orange-50 border-orange-100" : "bg-blue-50 border-blue-100"}`}>
              <div className="flex items-center gap-2">
                {isSolicitud ? <AlertTriangle className="h-5 w-5 text-orange-600" /> : <PencilLine className="h-5 w-5 text-blue-600" />}
                <div>
                  <h3 className={`font-bold ${isSolicitud ? "text-orange-900" : "text-blue-900"}`}>
                    {isSolicitud ? "Solicitud de Corrección" : "Correcciones Enviadas"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Por {autor} el {formatDate(record.created_at)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {isSolicitud && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Motivo:</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {record.metadata?.motivo || record.descripcion || "El asesor solicitó ajustes al caso."}
                  </p>
                </div>
              )}

              {!isSolicitud && tieneCambios && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Cambios realizados:</h4>
                  <div className="space-y-4">
                    {Object.entries(cambios).map(([campo, cambio]: [string, any]) => (
                      <div key={campo} className="border border-slate-100 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 font-medium text-xs text-slate-600 capitalize">
                          {campo.replace(/_/g, " ")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          <div className="p-3 bg-red-50/30">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 block">Anterior</span>
                            <p className="text-sm text-slate-600 line-through whitespace-pre-wrap">{cambio.anterior || "(Vacío)"}</p>
                          </div>
                          <div className="p-3 bg-emerald-50/30">
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1 block">Nuevo</span>
                            <p className="text-sm text-slate-800 whitespace-pre-wrap">{cambio.nuevo || "(Vacío)"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!isSolicitud && !tieneCambios && (
                <p className="text-sm text-slate-500 italic">No se detectaron cambios en los campos principales.</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
