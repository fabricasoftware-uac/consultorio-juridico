"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle, Hourglass } from "lucide-react";
import { cn } from "@/components/ui/utils";

const ESTADOS_TERMINALES = new Set(["aprobado", "cerrado", "archivado"]);

interface CountdownTimerProps {
  fechaVencimiento: string | null | undefined;
  label?: string;
  estado?: string | null;
}

function calcularDiferencia(ms: number) {
  if (ms <= 0) return null;
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  return { d, h, m };
}

export function CountdownTimer({
  fechaVencimiento,
  label,
  estado,
}: CountdownTimerProps) {
  if (estado && ESTADOS_TERMINALES.has(estado)) return null;
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  if (!fechaVencimiento) return null;

  const vencimiento = new Date(fechaVencimiento).getTime();
  const diff = calcularDiferencia(vencimiento - ahora);

  if (!diff) {
    return (
      <div className="flex flex-col gap-1 p-3 rounded-lg border-2 border-red-400 bg-red-50 animate-pulse">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm font-bold text-red-700">
            {label ? `${label}: Vencido` : "Vencido"}
          </span>
        </div>
        <span className="text-[11px] text-red-500 ml-6">
          El plazo ha expirado
        </span>
      </div>
    );
  }

  const esUrgente = diff.d === 0 && diff.h < 6;
  const esProximo = diff.d === 0 && diff.h < 24;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 rounded-lg border",
        esUrgente
          ? "border-orange-300 bg-orange-50"
          : esProximo
            ? "border-amber-300 bg-amber-50"
            : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-center gap-2">
        {esUrgente ? (
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        ) : (
          <Hourglass className="w-4 h-4 text-slate-500" />
        )}
        {label && <span className="text-[11px] font-medium text-slate-500">{label}</span>}
      </div>
      <div className="ml-6">
        {diff.d > 0 ? (
          <span className={cn(
            "text-base font-bold",
            esUrgente ? "text-orange-700" : esProximo ? "text-amber-700" : "text-slate-700",
          )}>
            {diff.d}d {diff.h}h
          </span>
        ) : (
          <span className={cn(
            "text-base font-bold",
            esUrgente ? "text-orange-700" : esProximo ? "text-amber-700" : "text-slate-700",
          )}>
            {diff.h}h {diff.m}m
          </span>
        )}
        <span className={cn(
          "text-[11px] ml-1",
          esUrgente ? "text-orange-500" : "text-slate-400",
        )}>
          restantes
        </span>
      </div>
    </div>
  );
}
