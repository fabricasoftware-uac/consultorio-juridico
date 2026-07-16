"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Navbar } from "../components/NavbarAdmin";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { getStatusBadge } from "@/components/ui/status-badge";
import { formatArea } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  Search,
  FilterX,
  FileText,
  ExternalLink,
} from "lucide-react";

export default function TodosLosCasosPage() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [dateSort, setDateSort] = useState("ultima_mod");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    getCasos().then((data) => {
      setCasos(data ?? []);
      setLoading(false);
    });
  }, []);

  const periodos = [...new Set(casos.map((c) => c.periodo).filter(Boolean))].sort().reverse();

  const filtrados = casos.filter((c) => {
    const nombre = c.usuarios?.nombre_completo?.toLowerCase() || "";
    const cedula = c.usuarios?.cedula?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || nombre.includes(term) || cedula.includes(term) || `${c.id_caso}`.includes(term);
    const matchStatus = statusFilter === "todos" || c.estado === statusFilter;
    const matchArea = areaFilter === "todos" || c.area === areaFilter;
    const matchPeriodo = periodoFilter === "todos" || c.periodo === periodoFilter;
    return matchSearch && matchStatus && matchArea && matchPeriodo;
  });

  const sorted = [...filtrados].sort((a, b) => {
    if (dateSort === "ultima_mod") {
      const modA = a.ultima_modificacion ? new Date(a.ultima_modificacion).getTime() : 0;
      const modB = b.ultima_modificacion ? new Date(b.ultima_modificacion).getTime() : 0;
      return modB - modA;
    }
    const dateA = new Date(a.fecha_creacion).getTime();
    const dateB = new Date(b.fecha_creacion).getTime();
    return dateSort === "recientes" ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginados = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const limpiar = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setAreaFilter("todos");
    setPeriodoFilter("todos");
    setDateSort("ultima_mod");
    setPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Spinner className="h-10 w-10 text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Link href="/admin/inicio" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al panel
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Todos los Casos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtrados.length} caso{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white border-none shadow-sm p-4 mb-6 rounded-2xl">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Cliente, cédula, #caso..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  className="pl-9 bg-slate-50 border-transparent focus:bg-white rounded-xl"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44 bg-slate-50 border-transparent rounded-xl">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="en_proceso">En proceso</SelectItem>
                <SelectItem value="pendiente_aprobacion">Pendiente aprobación</SelectItem>
                <SelectItem value="en_correccion">En corrección</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
                <SelectItem value="archivado">Archivado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v); setPage(1); }}>
              <SelectTrigger className="w-44 bg-slate-50 border-transparent rounded-xl">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las áreas</SelectItem>
                <SelectItem value="laboral">Laboral</SelectItem>
                <SelectItem value="civil_familia">Civil y Familia</SelectItem>
                <SelectItem value="penal">Penal</SelectItem>
                <SelectItem value="publica">Público</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateSort} onValueChange={(v) => { setDateSort(v); setPage(1); }}>
              <SelectTrigger className="w-48 bg-slate-50 border-transparent rounded-xl">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ultima_mod">Última modificación</SelectItem>
                <SelectItem value="recientes">Más recientes (creación)</SelectItem>
                <SelectItem value="antiguos">Más antiguos (creación)</SelectItem>
              </SelectContent>
            </Select>

            {periodos.length > 0 && (
              <Select value={periodoFilter} onValueChange={(v) => { setPeriodoFilter(v); setPage(1); }}>
                <SelectTrigger className="w-36 bg-slate-50 border-transparent rounded-xl">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los períodos</SelectItem>
                  {periodos.map((p) => (
                    <SelectItem key={p} value={p!}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button variant="outline" onClick={limpiar} className="bg-white rounded-xl">
              <FilterX className="w-4 h-4 mr-2" />Limpiar
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">#</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Cliente</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Cédula</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Área</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Estado</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden lg:table-cell">Estudiante</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden lg:table-cell">Período</th>
                  <th className="text-right p-3 text-[11px] font-bold text-slate-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody>
                {paginados.map((c) => (
                  <tr key={c.id_caso} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-mono text-xs text-slate-500">#{c.id_caso}</td>
                    <td className="p-3 font-medium text-slate-800">{c.usuarios?.nombre_completo || "N/A"}</td>
                    <td className="p-3 text-slate-600 hidden md:table-cell">{c.usuarios?.cedula || "—"}</td>
                    <td className="p-3 text-slate-600 text-xs">{formatArea(c.area)}</td>
                    <td className="p-3">{getStatusBadge(c.estado)}</td>
                    <td className="p-3 text-slate-600 text-xs hidden lg:table-cell">
                      {c.estudiantes_casos?.[c.estudiantes_casos.length - 1]?.estudiante?.perfil?.nombre_completo || "—"}
                    </td>
                    <td className="p-3 text-slate-500 text-xs hidden lg:table-cell">{c.periodo || "—"}</td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/todos-los-casos/${c.id_caso}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-400">No se encontraron casos</p>
          )}
        </Card>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <Pagination>
              <PaginationContent className="bg-white rounded-full border">
                <PaginationItem>
                  <PaginationPrevious
                    className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink onClick={() => setPage(n)} isActive={page === n}
                      className={page === n ? "bg-blue-600 text-white" : ""}>
                      {n}
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
          </div>
        )}
      </main>
    </div>
  );
}
