"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/NavBarEstudiante";
import { Caso } from "app/types/database";
import { getCasos } from "../../../../supabase/queries/getCasos";
import { supabase } from "@/lib/supabase/supabase-client";
import { useRealtimeCasos } from "@/lib/hooks/useRealtimeCasos";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getStatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format-date";
import { formatArea } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { CaseFilters } from "@/components/casos-juridicos/case-filters";
import { CountdownTimer } from "@/components/casos-juridicos/countdown-timer";
import { matchesSearch } from "@/lib/search";
import {
  ArrowLeft,
  Check,
  Search,
  FilterX,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { ModalActualizarSemestre } from "@/components/estudiantes/modal-actualizar-semestre";
import {
  verificarEstudianteRequiereActualizacion,
  type DatosEstudianteTransicion,
} from "app/actions/periodoAcademicoActions";

export default function MisCasosClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [areaFilter, setAreaFilter] = useState("todos");
  const [periodoFilter, setPeriodoFilter] = useState("todos");
  const [advisorFilter, setAdvisorFilter] = useState("todos");
  const [dateSort, setDateSort] = useState("ultima_mod");
  const [classFilter, setClassFilter] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [casos, setCasos] = useState<Caso[] | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [modalActualizarOpen, setModalActualizarOpen] = useState(false);
  const [periodoActivo, setPeriodoActivo] = useState("2026-2");
  const [datosEstudiante, setDatosEstudiante] = useState<DatosEstudianteTransicion | null>(null);
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
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      const uid = user?.id ?? null;
      setCurrentUserId(uid);
      if (uid) {
        try {
          const res = await verificarEstudianteRequiereActualizacion(uid);
          if (res.requiereActualizacion) {
            setPeriodoActivo(res.periodoActivo);
            setDatosEstudiante(res.datosEstudiante);
            setModalActualizarOpen(true);
          }
        } catch (err) {
          console.error("Error al verificar actualización semestral:", err);
        }
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch, setLoading]);

  useRealtimeCasos(refetch);

  // 1. First, filter only cases where the student is current active assignment
  const studentActiveCasos = useMemo(() => {
    return (casos ?? []).filter((caso) => {
      const activeStudent =
        caso.estudiantes_casos?.length
          ? caso.estudiantes_casos.find((e) => !e.fecha_fin_asignacion)?.estudiante
          : null;

      return activeStudent?.id_perfil === currentUserId;
    });
  }, [casos, currentUserId]);

  const uniqueAdvisors = useMemo(() => {
    const names = (studentActiveCasos ?? []).flatMap(
      (c) =>
        c.asesores_casos
          ?.filter((ac) => !ac.fecha_fin_asignacion)
          .map((ac) => ac.asesor?.perfil?.nombre_completo)
          .filter(Boolean) as string[] || [],
    );
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [studentActiveCasos]);

  // 2. Then apply UI filters (search, status, area, advisor, class, periodo)
  const filteredCases = useMemo(() => {
    return studentActiveCasos.filter((caso) => {
      const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;

      // Búsqueda limpia de texto
      const isSearchMatch = matchesSearch(
        searchTerm,
        usuario?.nombre_completo,
        usuario?.cedula,
        caso.id_caso,
      );

      // Estado, área y asesor
      const matchesStatus =
        statusFilter === "todos" || caso.estado === statusFilter;
      const matchesArea = areaFilter === "todos" || caso.area === areaFilter;
      const matchesAdvisor =
        advisorFilter === "todos" ||
        caso.asesores_casos?.some(
          (ac) =>
            !ac.fecha_fin_asignacion &&
            ac.asesor?.perfil?.nombre_completo === advisorFilter,
        );

      // Filters de fecha y clasificación
      const matchesClass =
        classFilter === "todos" || caso.clasificacion === classFilter;
      const matchesPeriodo =
        periodoFilter === "todos" || caso.periodo === periodoFilter;

      return (
        isSearchMatch &&
        matchesStatus &&
        matchesArea &&
        matchesAdvisor &&
        matchesClass &&
        matchesPeriodo
      );
    });
  }, [
    studentActiveCasos,
    searchTerm,
    statusFilter,
    areaFilter,
    advisorFilter,
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

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    areaFilter,
    advisorFilter,
    classFilter,
    periodoFilter,
    dateSort,
  ]);
  // Paginación
  const totalPages = Math.ceil(sortedCases.length / ITEMS_PER_PAGE);
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
            href="/estudiante/inicio"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Mis Casos
            </h1>
            <p className="text-slate-500 mt-1">
              Gestiona y supervisa todos tus casos legales asignados.
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
                  Total Casos Asignados
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {studentActiveCasos.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  En Proceso
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">
                  {
                    studentActiveCasos.filter((c) => c.estado === "en_proceso")
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`border-none shadow-sm shadow-slate-200/50 p-5 rounded-2xl flex flex-col justify-between transition-all ${
              studentActiveCasos.some((c) => c.estado === "en_correccion")
                ? "bg-amber-50/70 border border-amber-200/80 ring-1 ring-amber-300"
                : "bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    studentActiveCasos.some((c) => c.estado === "en_correccion")
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    En Corrección
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">
                    {
                      studentActiveCasos.filter(
                        (c) => c.estado === "en_correccion",
                      ).length
                    }
                  </p>
                </div>
              </div>
              {studentActiveCasos.some((c) => c.estado === "en_correccion") && (
                <Badge className="bg-amber-500 text-white border-transparent text-[10px] font-bold px-2 py-0.5">
                  ¡Atención requerida!
                </Badge>
              )}
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
                  {
                    studentActiveCasos.filter((c) => c.estado === "activo")
                      .length
                  }
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
          advisorFilter={advisorFilter}
          onAdvisorChange={setAdvisorFilter}
          advisorsList={uniqueAdvisors}
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
            setAdvisorFilter("todos");
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {currentCases.map((caso) => {
            const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;
            return (
              <div
                key={caso.id_caso}
                onClick={() => router.push(`/estudiante/mis-casos/${caso.id_caso}`)}
                className="cursor-pointer"
              >
                <Card
                  className="p-6 border-none shadow-sm shadow-slate-200/50 hover:shadow-md hover:shadow-blue-900/5 hover:border-blue-300 transition-all duration-300 bg-white rounded-2xl group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {usuario?.nombre_completo || "Solicitante Sin Nombre"}
                      </h3>
                      <div className="text-sm font-medium text-slate-500 mt-1">
                        {usuario?.cedula
                          ? `C.C. ${usuario.cedula}`
                          : "Sin Documento"}
                        <span className="mx-2 text-slate-300">•</span>
                        Caso <span className="text-slate-700">#{caso.id_caso}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      {getStatusBadge(caso.estado)}
                  {(caso.documentos_caso?.[0]?.count ?? 0) === 0 &&
                    caso.estado !== "cerrado" &&
                    caso.estado !== "archivado" && (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-amber-700 bg-amber-50 border-amber-200 whitespace-nowrap"
                      >
                        Sin documentos
                      </Badge>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6 flex-1">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Área
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatArea(caso.area)}
                  </p>
                </div>

                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Search className="w-3 h-3" /> Asesor Asignado
                  </span>
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {caso.asesores_casos?.length
                      ? caso.asesores_casos.find(a => !a.fecha_fin_asignacion)
                          ?.asesor?.perfil?.nombre_completo
                      : "Sin asignar"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Creado
                  </span>
                  <p className="text-sm font-medium text-slate-600">
                    {formatDate(caso.fecha_creacion)}
                  </p>
                </div>

                {caso.fecha_cierre && (
                  <div className="space-y-1 border-l border-slate-100 pl-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Cierre
                    </span>
                    <p className="text-sm font-medium text-slate-600">
                      {formatDate(caso.fecha_cierre)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-2 mb-3">
                {caso.estado === "en_proceso" && (
                <CountdownTimer
                  fechaVencimiento={caso.fecha_vencimiento_estudiante}
                  label="Entrega"
                  estado={caso.estado}
                />
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-slate-50" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/estudiante/mis-casos/${caso.id_caso}`); }}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-center text-sm shadow-xs cursor-pointer"
                >
                  Ver detalles
                </button>
                {(caso.estado === "en_proceso" ||
                  caso.estado === "en_correccion") && (
                  <button
                    onClick={(e) => { e.stopPropagation(); router.push(`/estudiante/mis-casos/${caso.id_caso}/entrevista`); }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2.5 rounded-xl transition-colors duration-200 text-center text-sm shadow-md shadow-green-600/20 cursor-pointer"
                  >
                    {caso.estado === "en_correccion"
                      ? "Continuar entrevista"
                      : "Ir a entrevista"}
                  </button>
                )}
              </div>
            </Card>
          </div>
          );
        })}
        </div>

        {filteredCases.length === 0 && (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none rounded-2xl mt-4">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No se encontraron casos
            </h3>
            <p className="text-slate-500 max-w-sm mb-6">
              No hay casos que coincidan con los criterios de búsqueda.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("todos");
                setAreaFilter("todos");
                setPeriodoFilter("todos");
                setAdvisorFilter("todos");
                setDateSort("ultima_mod");
                setClassFilter("todos");
              }}
              className="bg-white"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </Card>
        )}

        {/* Pagination Block */}
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

      <ModalActualizarSemestre
        open={modalActualizarOpen}
        periodoActivo={periodoActivo}
        datosEstudiante={datosEstudiante}
        onSuccess={() => {
          setModalActualizarOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
