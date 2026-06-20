"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, MessageSquare, Send, CheckCircle2, UserCheck, AlertTriangle, FileText, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotificaciones } from "@/lib/hooks/useNotificaciones";
import type { Notificacion } from "@/lib/hooks/useNotificaciones";

const ICONOS: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  asignacion_estudiante: { icon: UserCheck, color: "text-blue-600", bg: "bg-blue-100" },
  asignacion_asesor: { icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100" },
  entrevista: { icon: Send, color: "text-green-600", bg: "bg-green-100" },
  aprobacion: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  correccion: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" },
  observacion: { icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-100" },
};

function tiempoRelativo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Ahora";
  if (min < 60) return `Hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Hace ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `Hace ${d}d`;
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function NotificacionItem({ n, onLeer }: { n: Notificacion; onLeer: (id: number) => void }) {
  const config = ICONOS[n.tipo] ?? { icon: FileText, color: "text-slate-600", bg: "bg-slate-100" };
  const Icon = config.icon;

  return (
    <div className={`flex gap-3 p-3 rounded-lg transition-colors ${!n.leida ? "bg-blue-50/50" : "hover:bg-slate-50"}`}>
      <div className={`p-1.5 rounded-full ${config.bg} mt-0.5 shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-800">{n.titulo}</p>
        <p className="text-[11px] text-slate-500 truncate">{n.mensaje}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{tiempoRelativo(n.created_at)}</p>
      </div>
      {!n.leida && (
        <button
          onClick={() => onLeer(n.id)}
          className="shrink-0 p-1 rounded hover:bg-blue-100 text-blue-500"
          title="Marcar como leída"
        >
          <CheckCheck className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function CampanitaNotificaciones() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { noLeidas, notificaciones, loading, muted, toggleMute, cargarLista, marcarLeida, marcarTodasLeidas } = useNotificaciones();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggle = () => {
    if (!open) cargarLista();
    setOpen(!open);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {noLeidas > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
            {noLeidas > 99 ? "99+" : noLeidas}
          </span>
        )}
      </button>

      {open && (
        <Card className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] overflow-hidden shadow-xl border-slate-200 rounded-2xl z-50">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Notificaciones</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                title={muted ? "Activar sonido" : "Silenciar"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              {noLeidas > 0 && (
                <Button variant="ghost" size="sm" onClick={marcarTodasLeidas} className="text-xs text-blue-600 h-7">
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />
                  Leer todas
                </Button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto max-h-[60vh] p-2 space-y-0.5">
            {loading && notificaciones.length === 0 ? (
              <div className="space-y-2 p-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-200 rounded w-3/4" />
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notificaciones.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No hay notificaciones</p>
            ) : (
              notificaciones.map((n) => (
                <NotificacionItem key={n.id} n={n} onLeer={marcarLeida} />
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
