"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "../components/NavBarAsesor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  ArrowLeft,
  Check,
  Search,
  FilterX,
  FileText,
  Clock,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { getStatusBadge } from "@/components/ui/status-badge";
import { CaseFilters } from "@/components/casos-juridicos/case-filters";
import { formatArea } from "@/lib/utils";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { useRealtimeCasos } from "@/lib/hooks/useRealtimeCasos";
import { matchesSearch } from "@/lib/search";

export default function Asesor() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [studentFilter, setStudentFilter] = useState("todos");
  const [dateSort, setDateSort] = useState("ultima_mod");
  const [classFilter, setClassFilter] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [casos, setCasos] = useState<Caso[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;
  const router = useRouter();

  const refetch = useCallback(async () => {
    try {
      const data = await getCasos();
      setCasos(data ?? []);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch, setLoading]);

  useRealtimeCasos(refetch);

  // 1. First, filter only cases where the advisor is current active assignment
  const advisorActiveCasos = useMemo(() => {
    return (casos ?? []).filter((caso) => {
      const activeAsesor =
        caso.asesores_casos?.length
          ? caso.asesores_casos.find((a) => !a.fecha_fin_asignacion)?.asesor
          : null;

      return activeAsesor?.id_perfil === currentUserId;
    });
  }, [casos, currentUserId]);

  const uniqueStudents = useMemo(() => {
    const names = (advisorActiveCasos ?? []).flatMap(
      (c) =>
        c.estudiantes_casos
          ?.filter((ec) => !ec.fecha_fin_asignacion)
          .map((ec) => ec.estudiante?.perfil?.nombre_completo)
          .filter(Boolean) as string[] || [],
    );
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [advisorActiveCasos]);

  // 2. Then apply UI filters (search, status, area, student, class, periodo)
  const filteredCases = useMemo(() => {
    return advisorActiveCasos.filter((caso) => {
      const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;

      const isSearchMatch = matchesSearch(
        searchTerm,
        usuario?.nombre_completo,
        usuario?.cedula,
        caso.id_caso,
      );

      const matchesStatus =
        statusFilter === "todos" || caso.estado === statusFilter;
      const matchesArea =
        areaFilter === "todos" || caso.area === areaFilter;
      const matchesStudent =
        studentFilter === "todos" ||
        caso.estudiantes_casos?.some(
          (ec) =>
            !ec.fecha_fin_asignacion &&
            ec.estudiante?.perfil?.nombre_completo === studentFilter,
        );
      const matchesClass =
        classFilter === "todos" || caso.clasificacion === classFilter;
      const matchesPeriodo =
        periodoFilter === "todos" || caso.periodo === periodoFilter;

      return (
        isSearchMatch &&
        matchesStatus &&
        matchesArea &&
        matchesStudent &&
        matchesClass &&
        matchesPeriodo
      );
    });
  }, [
    advisorActiveCasos,
    searchTerm,
    statusFilter,
    areaFilter,
    studentFilter,
    classFilter,
    periodoFilter,
  ]);

  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (dateSort === "ultima_mod") {
        const modA = a.ultima_modificacion ? new Date(a.ultima_modificacion).getTime() : 0;
        const modB = b.ultima_modificacion ? new Date(b.ultima_modificacion).getTime() : 0;
        return modB - modA;
      }
      const dateA = new Date(a.fecha_creacion).getTime();
      const dateB = new Date(b.fecha_creacion).getTime();
      const diff = dateB - dateA;
      return diff !== 0
        ? (dateSort === "recientes" ? diff : -diff)
        : ((b.id_caso ?? 0) - (a.id_caso ?? 0));
    });
  }, [filteredCases, dateSort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    areaFilter,
    studentFilter,
    classFilter,
    periodoFilter,
    dateSort,
  ]);

  const totalCount = advisorActiveCasos?.length ?? 0;
  const pendingApprovalCount =
    advisorActiveCasos?.filter((c) => c.estado === "pendiente_aprobacion")
      .length ?? 0;
  const enCorreccionCount =
    advisorActiveCasos?.filter((c) => c.estado === "en_correccion").length ?? 0;
  const approvedCount =
    advisorActiveCasos?.filter((c) => c.estado === "activo").length ?? 0;

  // Pagination state
  const totalPages = Math.ceil(sortedCases?.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCases = sortedCases.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <Spinner className="h-10 w-10 text-blue-600 mb-4" />
          <p className="mt-4 text-slate-500 font-medium">
            Cargando tus casos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <Link
            href="/asesor/inicio"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Mis Casos Asignados
            </h1>
            <p className="text-slate-500 mt-1">
              Gestiona y aprueba los casos bajo tu supervisión como docente
              asesor.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Supervisados
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {totalCount}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between transition-all ${
              pendingApprovalCount > 0
                ? "bg-amber-50/70 border border-amber-200/80 ring-1 ring-amber-300"
                : "bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    pendingApprovalCount > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Pendientes de Aprobación
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">
                    {pendingApprovalCount}
                  </p>
                </div>
              </div>
              {pendingApprovalCount > 0 && (
                <Badge className="bg-amber-500 text-white border-transparent text-[10px] font-bold px-2 py-0.5">
                  ¡Requiere revisión!
                </Badge>
              )}
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  En Corrección
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {enCorreccionCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Activos
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {approvedCount}
                </p>
              </div>
            </div>
          </Card>
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
          dateSort={dateSort}
          onDateSortChange={setDateSort}
          classFilter={classFilter}
          onClassChange={setClassFilter}
          loading={loading}
          onClear={() => {
            setSearchTerm("");
            setStatusFilter("todos");
            setAreaFilter("todos");
            setPeriodoFilter("todos");
            setStudentFilter("todos");
            setDateSort("ultima_mod");
            setClassFilter("todos");
          }}
        >
          <div className="w-full lg:w-40 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Período
            </label>
            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {[...new Set((casos ?? []).map((c) => c.periodo).filter(Boolean))].sort().reverse().map((p) => (
                  <SelectItem key={p} value={p!}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CaseFilters>

        {/* Case List Grid */}
        {currentCases?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none rounded-2xl mt-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No se encontraron casos
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Intenta ajustar los filtros de búsqueda para encontrar lo que
              necesitas.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("todos");
                setAreaFilter("todos");
                setPeriodoFilter("todos");
                setStudentFilter("todos");
                setDateSort("ultima_mod");
                setClassFilter("todos");
              }}
              className="bg-white"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {currentCases?.map((caso) => {
              const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;
              return (
                <div
                  key={caso.id_caso}
                  onClick={() => router.push(`/asesor/mis-casos/${caso.id_caso}`)}
                  className="cursor-pointer"
                >
                  <Card
                    className="p-6 border-none shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-blue-900/5 hover:border-blue-300 transition-all duration-300 bg-white rounded-2xl group flex flex-col h-full"
                  >
                  <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-400">
                        Caso #{caso.id_caso}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {usuario?.nombre_completo || "Solicitante Sin Nombre"}
                      </h3>
                      <div className="text-sm font-medium text-slate-500">
                        {usuario?.cedula
                          ? `C.C. ${usuario.cedula}`
                          : "Sin Documento"}
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(caso.estado)}</div>
                  </div>

                <div className="space-y-3 mb-6 flex-1">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Área
                    </span>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatArea(caso.area)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Estudiante
                      </span>
                      {caso.estudiantes_casos?.length ? (
                        <p className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-full">
                          {caso.estudiantes_casos?.find(e => !e.fecha_fin_asignacion)
                            ?.estudiante?.perfil?.nombre_completo ||
                            "Sin asignar"}
                        </p>
                      ) : (
                        <p className="text-sm italic text-slate-400">
                          Sin asignar
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Pretensión
                      </span>
                      <p
                        className={
                          caso.tipo_proceso
                            ? "text-sm font-semibold text-slate-800 truncate"
                            : "text-sm italic text-slate-400 truncate"
                        }
                      >
                        {caso.tipo_proceso || "Por definir"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Resumen
                    </span>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {caso.resumen_hechos ?? (
                        <span className="italic opacity-70">
                          No hay resumen redactado.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                {caso.estado !== "en_proceso" && (
                <CountdownTimer
                  fechaVencimiento={caso.fecha_vencimiento_asesor}
                  label="Aprobación"
                  estado={caso.estado}
                />
                )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/asesor/mis-casos/${caso.id_caso}`); }}
                    className="flex w-full items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-sm shadow-xs cursor-pointer"
                  >
                    Ver detalles
                  </button>
                </div>
              </Card>
              </div>
            );
          })}
          </div>
        )}

        {/* Pagination */}
        {filteredCases.length > 0 && totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <Pagination>
              <PaginationContent className="bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50 text-slate-400"
                        : "cursor-pointer text-slate-700"
                    }
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className={`cursor-pointer rounded-full ${currentPage === pageNumber ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-700 hover:bg-slate-100"}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <span className="px-4 text-slate-400">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50 text-slate-400"
                        : "cursor-pointer text-slate-700"
                    }
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Mostrando {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredCases.length)} de{" "}
              {filteredCases.length} casos
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
