"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { getStatusBadge } from "@/components/ui/status-badge";
import { formatArea } from "@/lib/utils";
import { formatDate } from "@/lib/format-date";
import { Spinner } from "@/components/ui/spinner";
import { matchesSearch } from "@/lib/search";
import { CaseFilters } from "@/components/casos-juridicos/case-filters";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function TodosLosCasosPage() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [studentFilter, setStudentFilter] = useState("todos");
  const [advisorFilter, setAdvisorFilter] = useState("todos");
  const [dateSort, setDateSort] = useState("ultima_mod");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    getCasos().then((data) => {
      setCasos(data ?? []);
      setLoading(false);
    });
  }, []);

  const periodos = useMemo(
    () => [...new Set(casos.map((c) => c.periodo).filter(Boolean))].sort().reverse(),
    [casos],
  );

  const uniqueStudents = useMemo(() => {
    const names = casos.flatMap(
      (c) =>
        c.estudiantes_casos
          ?.filter((ec) => !ec.fecha_fin_asignacion)
          .map((ec) => ec.estudiante?.perfil?.nombre_completo)
          .filter(Boolean) as string[] || [],
    );
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [casos]);

  const uniqueAdvisors = useMemo(() => {
    const names = casos.flatMap(
      (c) =>
        c.asesores_casos
          ?.filter((ac) => !ac.fecha_fin_asignacion)
          .map((ac) => ac.asesor?.perfil?.nombre_completo)
          .filter(Boolean) as string[] || [],
    );
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [casos]);

  const filtrados = useMemo(() => {
    return casos.filter((c) => {
      const usuario = Array.isArray(c.usuarios) ? c.usuarios[0] : c.usuarios;

      const matchSearch = matchesSearch(
        searchTerm,
        usuario?.nombre_completo,
        usuario?.cedula,
        c.id_caso,
      );
      const matchStatus = statusFilter === "todos" || c.estado === statusFilter;
      const matchArea = areaFilter === "todos" || c.area === areaFilter;
      const matchPeriodo = periodoFilter === "todos" || c.periodo === periodoFilter;
      const matchStudent =
        studentFilter === "todos" ||
        c.estudiantes_casos?.some(
          (ec) =>
            !ec.fecha_fin_asignacion &&
            ec.estudiante?.perfil?.nombre_completo === studentFilter,
        );
      const matchAdvisor =
        advisorFilter === "todos" ||
        c.asesores_casos?.some(
          (ac) =>
            !ac.fecha_fin_asignacion &&
            ac.asesor?.perfil?.nombre_completo === advisorFilter,
        );

      return (
        matchSearch &&
        matchStatus &&
        matchArea &&
        matchPeriodo &&
        matchStudent &&
        matchAdvisor
      );
    });
  }, [
    casos,
    searchTerm,
    statusFilter,
    areaFilter,
    periodoFilter,
    studentFilter,
    advisorFilter,
  ]);

  const sorted = useMemo(() => {
    return [...filtrados].sort((a, b) => {
      if (dateSort === "ultima_mod") {
        const modA = a.ultima_modificacion ? new Date(a.ultima_modificacion).getTime() : 0;
        const modB = b.ultima_modificacion ? new Date(b.ultima_modificacion).getTime() : 0;
        return modB - modA;
      }
      const dateA = new Date(a.fecha_creacion).getTime();
      const dateB = new Date(b.fecha_creacion).getTime();
      return dateSort === "recientes" ? dateB - dateA : dateA - dateB;
    });
  }, [filtrados, dateSort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginados = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    statusFilter,
    areaFilter,
    periodoFilter,
    studentFilter,
    advisorFilter,
    dateSort,
  ]);

  const limpiar = () => {
    setSearchTerm("");
    setStatusFilter("todos");
    setAreaFilter("todos");
    setPeriodoFilter("todos");
    setStudentFilter("todos");
    setAdvisorFilter("todos");
    setDateSort("ultima_mod");
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Spinner className="h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
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
        <CaseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          areaFilter={areaFilter}
          onAreaChange={setAreaFilter}
          studentFilter={studentFilter}
          onStudentChange={setStudentFilter}
          studentsList={uniqueStudents}
          advisorFilter={advisorFilter}
          onAdvisorChange={setAdvisorFilter}
          advisorsList={uniqueAdvisors}
          dateSort={dateSort}
          onDateSortChange={setDateSort}
          loading={loading}
          onClear={limpiar}
        >
          {periodos.length > 0 && (
            <div className="w-full lg:w-40 space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Período
              </label>
              <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
                <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los períodos</SelectItem>
                  {periodos.map((p) => (
                    <SelectItem key={p} value={p!}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CaseFilters>

        {/* Table */}
        <Card className="bg-white border-none shadow-sm rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">#</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Solicitante</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Cédula</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Área</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Estado</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden lg:table-cell">Estudiante</th>
                  <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden lg:table-cell">Período</th>
                  <th className="text-right p-3 text-[11px] font-bold text-slate-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody>
                {paginados.map((c) => {
                  const usuario = Array.isArray(c.usuarios) ? c.usuarios[0] : c.usuarios;
                  const estudianteActivo = c.estudiantes_casos?.find(
                    (e) => !e.fecha_fin_asignacion,
                  )?.estudiante;
                  return (
                    <tr key={c.id_caso} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-xs text-slate-500">#{c.id_caso}</td>
                      <td className="p-3 font-medium text-slate-800">{usuario?.nombre_completo || "N/A"}</td>
                      <td className="p-3 text-slate-600 hidden md:table-cell">{usuario?.cedula || "—"}</td>
                      <td className="p-3 text-slate-600 text-xs">{formatArea(c.area)}</td>
                      <td className="p-3">{getStatusBadge(c.estado)}</td>
                      <td className="p-3 text-slate-600 text-xs hidden lg:table-cell">
                        {estudianteActivo?.perfil?.nombre_completo || "—"}
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
                  );
                })}
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
    </div>
  );
}
