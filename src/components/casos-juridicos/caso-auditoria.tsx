"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserCheck,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { getAuditEventsByCaso } from "../../../supabase/queries/auditoriaCasos";
import type { AuditEvent } from "../../../supabase/queries/auditoriaCasos";

const ACCION_ICON: Record<string, { icon: typeof FileText; color: string; bg: string }> = {
  creacion: { icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
  entrevista: { icon: Send, color: "text-green-600", bg: "bg-green-100" },
  observacion: { icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-100" },
  cambio_estado: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" },
  aprobacion: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  correccion: { icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100" },
};

interface CasoAuditoriaProps {
  idCaso: string;
}

export function CasoAuditoria({ idCaso }: CasoAuditoriaProps) {
  const [eventos, setEventos] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = () => {
    getAuditEventsByCaso(idCaso).then((data) => {
      setEventos(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    cargar();
  }, [idCaso]);

  useEffect(() => {
    const channel = supabase
      .channel(`historial-${idCaso}`)
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

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm italic">
        Cargando historial...
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 text-sm font-medium">
          No hay eventos registrados en el historial del caso.
        </p>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200" />
      <div className="space-y-0">
        {eventos.map((evento, i) => {
          const config = ACCION_ICON[evento.accion] ?? {
            icon: Clock,
            color: "text-slate-600",
            bg: "bg-slate-100",
          };
          const Icon = config.icon;

          return (
            <div key={evento.id} className="flex gap-4 pb-6 relative">
              <div className={`p-2 rounded-full ${config.bg} z-10`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {evento.descripcion}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {new Date(evento.created_at).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
