"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  getObservacionesByCaso,
  insertAuditEvent,
} from "../../../supabase/queries/auditoriaCasos";
import type { ObservacionConAutor } from "../../../supabase/queries/auditoriaCasos";

interface ObservacionesChatProps {
  idCaso: string;
  placeholder?: string;
  observaciones?: string | null;
  observacionesEstudiante?: string | null;
}

export function ObservacionesChat({
  idCaso,
  placeholder = "Escribe una observación...",
  observaciones: obsLegacy,
  observacionesEstudiante,
}: ObservacionesChatProps) {
  const [observaciones, setObservaciones] = useState<ObservacionConAutor[]>([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const cargar = async () => {
    const data = await getObservacionesByCaso(idCaso);
    setObservaciones(data);
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, [idCaso]);

  useEffect(() => {
    const channel = supabase
      .channel(`observaciones-${idCaso}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "auditoria_casos",
          filter: `id_caso=eq.${idCaso}`,
        },
        () => cargar(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [idCaso]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [observaciones]);

  const handleEnviar = async () => {
    if (!texto.trim()) return;
    setEnviando(true);
    await insertAuditEvent(idCaso, "observacion", texto.trim());
    setTexto("");
    await cargar();
    setEnviando(false);
    toast.success("Observación guardada");
  };

  const tieneLegacy = obsLegacy?.trim() || observacionesEstudiante?.trim();
  const tieneNuevas = observaciones.length > 0;

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-slate-400 italic">
        Cargando observaciones...
      </div>
    );
  }

  if (!tieneLegacy && !tieneNuevas) {
    return (
      <div className="p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <MessageSquare className="w-6 h-6 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-400 italic">
          No hay observaciones aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {obsLegacy?.trim() && (
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">
                Profesional (archivo)
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {obsLegacy}
            </p>
          </div>
        )}
        {observacionesEstudiante?.trim() && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Estudiante (archivo)
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {observacionesEstudiante}
            </p>
          </div>
        )}
        {observaciones.map((obs) => (
            <div
              key={obs.id}
              className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {obs.autor_nombre}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(obs.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {obs.descripcion}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="resize-none text-sm border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl"
          />
          <Button
            onClick={handleEnviar}
            disabled={!texto.trim() || enviando}
            className="self-end bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
  );
}
