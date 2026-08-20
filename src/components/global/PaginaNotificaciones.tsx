"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { rutaDetalleCaso } from "@/lib/roles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  FileText,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/supabase-client";
import { useNotificaciones } from "@/lib/hooks/useNotificaciones";
import type { Notificacion } from "@/lib/hooks/useNotificaciones";

const ICONOS: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  asignacion_estudiante: { icon: UserCheck, color: "text-blue-600", bg: "bg-blue-100" },
  asignacion_asesor: { icon: UserCheck, color: "text-purple-600", bg: "bg-purple-100" },
  entrevista: { icon: Send, color: "text-green-600", bg: "bg-green-100" },
  aprobacion: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  correccion: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100" },
  observacion: { icon: MessageSquare, color: "text-yellow-600", bg: "bg-yellow-100" },
  documentos_faltantes: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100" },
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

interface Props {
  role: string;
  backHref: string;
}

export function PaginaNotificaciones({ role, backHref }: Props) {
  const { notificaciones, loading, marcarLeida, marcarTodasLeidas, cargarLista } = useNotificaciones();
  const [filtro, setFiltro] = useState("todas");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  useEffect(() => { cargarLista(); }, [cargarLista]);

  const filtradas = filtro === "no_leidas"
    ? notificaciones.filter((n) => !n.leida)
    : notificaciones;

  const total = filtradas.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  const inicio = (page - 1) * PER_PAGE;
  const paginadas = filtradas.slice(inicio, inicio + PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href={backHref}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
        </div>

        <Tabs value={filtro} onValueChange={(v) => { setFiltro(v); setPage(1); }} className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="no_leidas">No leídas</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading && notificaciones.length === 0 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 border-slate-200 shadow-sm animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : paginadas.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none rounded-2xl">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No hay notificaciones</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {paginadas.map((n) => {
              const config = ICONOS[n.tipo] ?? { icon: FileText, color: "text-slate-600", bg: "bg-slate-100" };
              const Icon = config.icon;
              return (
                <Card
                  key={n.id}
                  className={`p-4 border-slate-200 shadow-sm transition-colors ${!n.leida ? "bg-blue-50/30 border-blue-100" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${config.bg} mt-0.5`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{n.titulo}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{n.mensaje}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{tiempoRelativo(n.created_at)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {!n.leida ? (
                        <Button variant="ghost" size="sm" onClick={() => marcarLeida(n.id)} className="text-blue-600 text-xs h-7">
                          <CheckCheck className="w-3.5 h-3.5 mr-1" />
                          Leída
                        </Button>
                      ) : (
                        <span className="text-[11px] text-green-600 font-medium">Leída</span>
                      )}
                      {/* La ruta NO se puede derivar del nombre del rol:
                          pro_apoyo usa /pro-apoyo/gestionar-caso y admin usa
                          /admin/todos-los-casos. Antes se armaba como
                          `/${role}/mis-casos/...`, que daba 404 en esos dos. */}
                      {rutaDetalleCaso(role, n.id_caso) && (
                        <Link
                          href={rutaDetalleCaso(role, n.id_caso)!}
                          onClick={() => { if (!n.leida) marcarLeida(n.id); }}
                          className="text-[11px] text-blue-600 hover:underline whitespace-nowrap"
                        >
                          Caso #{n.id_caso} <ChevronRight className="w-3 h-3 inline" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Pagination>
              <PaginationContent className="bg-white rounded-full border border-slate-200 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      onClick={() => setPage(num)}
                      isActive={page === num}
                      className={`cursor-pointer rounded-full ${page === num ? "bg-blue-600 text-white hover:bg-blue-700" : ""}`}
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <p className="text-xs text-slate-500">
              {inicio + 1}-{Math.min(inicio + PER_PAGE, total)} de {total}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
