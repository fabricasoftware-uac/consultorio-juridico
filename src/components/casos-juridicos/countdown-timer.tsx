"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface CountdownTimerProps {
  fechaVencimiento: string | null | undefined;
  label?: string;
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
}: CountdownTimerProps) {
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
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
        <AlertTriangle className="w-3.5 h-3.5" />
        {label ? `${label}: Vencido` : "Vencido"}
      </div>
    );
  }

  const esUrgente = diff.d === 0 && diff.h < 6;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border",
        esUrgente
          ? "text-orange-700 bg-orange-50 border-orange-200"
          : "text-slate-600 bg-slate-50 border-slate-200",
      )}
    >
      <Clock className="w-3.5 h-3.5" />
      {label && <span className="text-[10px] text-slate-500">{label}:</span>}
      {diff.d > 0 && (
        <span>
          {diff.d}d {diff.h}h
        </span>
      )}
      {diff.d === 0 && (
        <span>
          {diff.h}h {diff.m}m
        </span>
      )}
    </div>
  );
}
