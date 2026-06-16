"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { getLlamadosByCaso } from "../../../supabase/queries/getLlamadosByCaso";
import type { LlamadoAtencion } from "../../../supabase/queries/getLlamadosByCaso";

interface LlamadosListProps {
  idCaso: string;
}

export function LlamadosList({ idCaso }: LlamadosListProps) {
  const [llamados, setLlamados] = useState<LlamadoAtencion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLlamadosByCaso(idCaso).then((data) => {
      setLlamados(data);
      setLoading(false);
    });
  }, [idCaso]);

  if (loading) {
    return (
      <Card className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <p className="text-slate-400 text-sm italic">Cargando...</p>
      </Card>
    );
  }

  if (llamados.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
        <p className="text-slate-500 text-sm font-medium">
          No hay llamados de atención registrados para este caso.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {llamados.map((llamado) => (
        <Card
          key={llamado.id}
          className="p-5 border-slate-200 shadow-sm rounded-xl overflow-hidden"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  llamado.tipo === "estudiante"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      llamado.tipo === "estudiante"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-purple-50 text-purple-700 border-purple-200"
                    }
                  >
                    {llamado.tipo === "estudiante" ? "Estudiante" : "Asesor"}
                  </Badge>
                  {llamado.leido ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Leído
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pendiente
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-700">{llamado.motivo}</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {new Date(llamado.fecha_creacion).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
