"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  GraduationCap,
  Search,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  Calendar,
  RefreshCw,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import {
  getLlamadosAdmin,
  resolverLlamadoAdmin,
  groupLlamadosByTipo,
  filterLlamadosGenerales,
  type LlamadoAtencionAdmin,
  type TipoLlamado,
  type GroupedInfractor,
} from "../../../../supabase/queries/getLlamadosAdmin";
import { getStatusBadge } from "@/components/ui/status-badge";
import { formatArea } from "@/lib/utils";
import { matchesSearch } from "@/lib/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default function AdminLlamadosPage() {
  const [llamados, setLlamados] = useState<LlamadoAtencionAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Accordion expanded state for grouped views
  const [expandedAsesores, setExpandedAsesores] = useState<Record<string, boolean>>({});
  const [expandedEstudiantes, setExpandedEstudiantes] = useState<Record<string, boolean>>({});

  // Resolution Modal
  const [selectedLlamado, setSelectedLlamado] = useState<LlamadoAtencionAdmin | null>(null);
  const [justificacion, setJustificacion] = useState("");
  const [resolving, setResolving] = useState(false);

  const fetchLlamadosData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await getLlamadosAdmin();
      setLlamados(data);
    } catch (error) {
      console.error("Error al cargar llamados:", error);
      toast.error("Error al cargar los llamados de atención");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLlamadosData();
  }, [fetchLlamadosData]);

  // Quick Metrics
  const totalLlamados = llamados.length;
  const pendientesList = useMemo(() => llamados.filter((l) => !l.resuelto), [llamados]);
  const resueltosList = useMemo(() => llamados.filter((l) => l.resuelto), [llamados]);
  const pendientesCount = pendientesList.length;
  const resueltosCount = resueltosList.length;

  const asesoresConPendientesCount = useMemo(() => {
    const asesoresIds = new Set(
      pendientesList.filter((l) => l.tipo === "asesor").map((l) => l.id_usuario),
    );
    return asesoresIds.size;
  }, [pendientesList]);

  // Grouping function
  const groupLlamados = useCallback(
    (tipo: TipoLlamado): GroupedInfractor[] => groupLlamadosByTipo(llamados, tipo),
    [llamados],
  );

  const asesoresAgrupados = useMemo(() => groupLlamados("asesor"), [groupLlamados]);
  const estudiantesAgrupados = useMemo(() => groupLlamados("estudiante"), [groupLlamados]);

  // Filtered groups by search query
  const asesoresFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return asesoresAgrupados;
    return asesoresAgrupados.filter((g) =>
      matchesSearch(
        searchQuery,
        g.nombre,
        g.cedula,
        g.correo,
        ...g.llamados.flatMap((l) => [
          l.id_caso,
          l.caso?.usuarios?.nombre_completo,
          l.caso?.usuarios?.cedula,
          l.motivo,
        ]),
      ),
    );
  }, [asesoresAgrupados, searchQuery]);

  const estudiantesFiltrados = useMemo(() => {
    if (!searchQuery.trim()) return estudiantesAgrupados;
    return estudiantesAgrupados.filter((g) =>
      matchesSearch(
        searchQuery,
        g.nombre,
        g.cedula,
        g.correo,
        ...g.llamados.flatMap((l) => [
          l.id_caso,
          l.caso?.usuarios?.nombre_completo,
          l.caso?.usuarios?.cedula,
          l.motivo,
        ]),
      ),
    );
  }, [estudiantesAgrupados, searchQuery]);

  // Filtered general list for table
  const llamadosGeneralesFiltrados = useMemo(() => {
    return filterLlamadosGenerales(llamados, {
      searchQuery,
      roleFilter,
      statusFilter,
    });
  }, [llamados, roleFilter, statusFilter, searchQuery]);

  // Handlers for Resolution
  const handleOpenResolver = (llamado: LlamadoAtencionAdmin) => {
    setSelectedLlamado(llamado);
    setJustificacion("");
  };

  const handleConfirmarResolucion = async () => {
    if (!selectedLlamado) return;

    setResolving(true);
    try {
      const res = await resolverLlamadoAdmin(selectedLlamado.id, justificacion);
      if (res.success && res.data) {
        toast.success("Llamado de atención resuelto exitosamente");
        // Update local state directly
        setLlamados((prev) =>
          prev.map((item) => (item.id === selectedLlamado.id ? res.data! : item)),
        );
        setSelectedLlamado(null);
        setJustificacion("");
      } else {
        toast.error("No se pudo resolver el llamado");
      }
    } catch (error: any) {
      console.error("Error al resolver llamado:", error);
      toast.error(error?.message || "Ocurrió un error al resolver el llamado");
    } finally {
      setResolving(false);
    }
  };

  const toggleAsesorExpand = (id: string) => {
    setExpandedAsesores((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleEstudianteExpand = (id: string) => {
    setExpandedEstudiantes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Control y Supervisión Administrativa
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Módulo de Llamados de Atención
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Supervisa alertas automáticas por demoras en revisiones de docentes y entregas de estudiantes practicantes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchLlamadosData(true)}
              disabled={refreshing || loading}
              className="bg-white hover:bg-slate-50 text-slate-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Quick Metrics Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Llamados */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total de Llamados
              </CardTitle>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{totalLlamados}</div>
              <p className="text-xs text-slate-500 mt-1">Registrados en la plataforma</p>
            </CardContent>
          </Card>

          {/* Pendientes */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Llamados Pendientes
              </CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-600">{pendientesCount}</div>
                <p className="text-xs text-slate-500 mt-1">Requieren atención o resolución</p>
              </div>
              <Badge
                variant="outline"
                className={
                  pendientesCount > 0
                    ? "bg-amber-50 text-amber-700 border-amber-300 font-semibold"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }
              >
                {pendientesCount > 0 ? "Alerta Activa" : "Al día"}
              </Badge>
            </CardContent>
          </Card>

          {/* Resueltos */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Llamados Resueltos
              </CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{resueltosCount}</div>
                <p className="text-xs text-slate-500 mt-1">Casos justificados o cerrados</p>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold"
              >
                Resueltos
              </Badge>
            </CardContent>
          </Card>

          {/* Docentes con Pendientes */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">
                Asesores con Retrasos
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Users className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-700">
                  {asesoresConPendientesCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">Docentes con llamados activos</p>
              </div>
              <Badge
                variant="outline"
                className={
                  asesoresConPendientesCount > 0
                    ? "bg-purple-50 text-purple-700 border-purple-300 font-semibold"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }
              >
                {asesoresConPendientesCount} Asesores
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="asesores" className="w-full space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-slate-200/70 p-1 rounded-xl">
              <TabsTrigger
                value="asesores"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-xs px-4"
              >
                <Users className="w-4 h-4 mr-2" />
                Por Docente Asesor ({asesoresAgrupados.length})
              </TabsTrigger>
              <TabsTrigger
                value="estudiantes"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-xs px-4"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Por Estudiante Practicante ({estudiantesAgrupados.length})
              </TabsTrigger>
              <TabsTrigger
                value="tabla"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-xs px-4"
              >
                <Filter className="w-4 h-4 mr-2" />
                Tabla General Filtrable ({totalLlamados})
              </TabsTrigger>
            </TabsList>

            {/* Quick Search for all tabs */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, cédula, solicitante o caso..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-slate-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: POR DOCENTE ASESOR */}
          <TabsContent value="asesores" className="space-y-4 outline-none">
            {loading ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Cargando llamados por asesor...</p>
              </div>
            ) : asesoresFiltrados.length === 0 ? (
              <Card className="p-12 text-center bg-white rounded-xl border-dashed border-slate-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {searchQuery
                    ? "No se encontraron docentes con los criterios de búsqueda"
                    : "No hay llamados de atención para docentes asesores"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {searchQuery
                    ? "Intenta modificar el término de búsqueda o limpiar los filtros."
                    : "Todos los docentes asesores están al día con las revisiones dentro de los plazos establecidos."}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {asesoresFiltrados.map((docente) => {
                  const isExpanded = expandedAsesores[docente.id_usuario] ?? true;

                  return (
                    <Card
                      key={docente.id_usuario}
                      className="border-slate-200 shadow-sm overflow-hidden bg-white hover:border-slate-300 transition-all"
                    >
                      {/* Teacher Header Card */}
                      <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-slate-900">
                                {docente.nombre}
                              </h3>
                              {docente.totalPendientes > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-800 border-amber-300 font-semibold"
                                >
                                  {docente.totalPendientes} Pendiente
                                  {docente.totalPendientes > 1 ? "s" : ""}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50 text-emerald-700 border-emerald-300"
                                >
                                  Todos resueltos
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                              {docente.cedula && <span>C.C. {docente.cedula}</span>}
                              {docente.correo && <span>{docente.correo}</span>}
                              {docente.telefono && <span>Tel: {docente.telefono}</span>}
                            </div>

                            {/* Areas */}
                            {docente.areas.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                <span className="text-[11px] font-medium text-slate-400">
                                  Áreas afectadas:
                                </span>
                                {docente.areas.map((area) => (
                                  <Badge
                                    key={area}
                                    variant="secondary"
                                    className="text-[11px] bg-slate-100 text-slate-700"
                                  >
                                    {formatArea(area)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Summary Badges and Expand Trigger */}
                        <div className="flex items-center gap-3 self-end lg:self-center">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-slate-500">
                              {docente.totalCasosAfectados} caso
                              {docente.totalCasosAfectados > 1 ? "s" : ""} afectado
                              {docente.totalCasosAfectados > 1 ? "s" : ""}
                            </div>
                            <div className="text-xs font-semibold text-emerald-600">
                              {docente.totalResueltos} resuelto
                              {docente.totalResueltos > 1 ? "s" : ""}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAsesorExpand(docente.id_usuario)}
                            className="bg-white text-slate-700 hover:bg-slate-100"
                          >
                            <span>
                              {isExpanded ? "Ocultar casos" : "Ver casos"} (
                              {docente.llamados.length})
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 ml-1.5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Collapsible List of Affected Cases */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100">
                          {docente.llamados.map((llamado) => (
                            <div
                              key={llamado.id}
                              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-2 flex-1 min-w-0">
                                {/* Case Info & Status Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    href={`/admin/todos-los-casos/${llamado.id_caso}`}
                                    className="font-bold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1 group"
                                  >
                                    <span>Caso #{llamado.id_caso}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                                  </Link>

                                  {llamado.caso?.area && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                                    >
                                      {formatArea(llamado.caso.area)}
                                    </Badge>
                                  )}

                                  {llamado.caso?.estado &&
                                    getStatusBadge(llamado.caso.estado)}

                                  {llamado.resuelto ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-50 text-emerald-700 border-emerald-300 font-medium"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Llamado Resuelto
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-50 text-amber-700 border-amber-300 font-medium"
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      Llamado Pendiente
                                    </Badge>
                                  )}
                                </div>

                                {/* Solicitante Info */}
                                <div className="text-xs text-slate-600">
                                  <span className="font-semibold text-slate-700">Solicitante:</span>{" "}
                                  {llamado.caso?.usuarios?.nombre_completo || "No registrado"}{" "}
                                  {llamado.caso?.usuarios?.cedula && (
                                    <span className="text-slate-400">
                                      (C.C. {llamado.caso.usuarios.cedula})
                                    </span>
                                  )}
                                </div>

                                {/* Delay Reason */}
                                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold">Motivo:</span>{" "}
                                    {llamado.motivo}
                                  </div>
                                </div>

                                {/* Dates & Resolution Details */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                                  <span>
                                    Generado: {formatDateTime(llamado.fecha_creacion)}
                                  </span>

                                  {llamado.resuelto && (
                                    <span className="text-emerald-700 font-medium">
                                      Resuelto: {formatDateTime(llamado.fecha_resolucion)}
                                    </span>
                                  )}
                                </div>

                                {llamado.resuelto && llamado.motivo_resolucion && (
                                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold">Justificación:</span>{" "}
                                      {llamado.motivo_resolucion}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action: Resolver */}
                              <div className="shrink-0 flex items-center gap-2">
                                {!llamado.resuelto ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenResolver(llamado)}
                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 font-medium"
                                  >
                                    <Check className="w-4 h-4 mr-1.5" />
                                    Resolver
                                  </Button>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-slate-100 text-slate-600"
                                  >
                                    Atendido
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: POR ESTUDIANTE PRACTICANTE */}
          <TabsContent value="estudiantes" className="space-y-4 outline-none">
            {loading ? (
              <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">
                  Cargando llamados por estudiante practicante...
                </p>
              </div>
            ) : estudiantesFiltrados.length === 0 ? (
              <Card className="p-12 text-center bg-white rounded-xl border-dashed border-slate-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {searchQuery
                    ? "No se encontraron practicantes con los criterios de búsqueda"
                    : "No hay llamados de atención para practicantes"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {searchQuery
                    ? "Intenta modificar el término de búsqueda o limpiar los filtros."
                    : "No se registran demoras pendientes en las entregas iniciales de estudiantes."}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {estudiantesFiltrados.map((estudiante) => {
                  const isExpanded = expandedEstudiantes[estudiante.id_usuario] ?? true;

                  return (
                    <Card
                      key={estudiante.id_usuario}
                      className="border-slate-200 shadow-sm overflow-hidden bg-white hover:border-slate-300 transition-all"
                    >
                      {/* Student Header Card */}
                      <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-slate-900">
                                {estudiante.nombre}
                              </h3>
                              {estudiante.totalPendientes > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-800 border-amber-300 font-semibold"
                                >
                                  {estudiante.totalPendientes} Pendiente
                                  {estudiante.totalPendientes > 1 ? "s" : ""}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50 text-emerald-700 border-emerald-300"
                                >
                                  Todos resueltos
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                              {estudiante.cedula && <span>C.C. {estudiante.cedula}</span>}
                              {estudiante.correo && <span>{estudiante.correo}</span>}
                              {estudiante.telefono && <span>Tel: {estudiante.telefono}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Summary Badges and Expand Trigger */}
                        <div className="flex items-center gap-3 self-end lg:self-center">
                          <div className="text-right hidden sm:block">
                            <div className="text-xs text-slate-500">
                              {estudiante.totalCasosAfectados} caso
                              {estudiante.totalCasosAfectados > 1 ? "s" : ""} afectado
                              {estudiante.totalCasosAfectados > 1 ? "s" : ""}
                            </div>
                            <div className="text-xs font-semibold text-emerald-600">
                              {estudiante.totalResueltos} resuelto
                              {estudiante.totalResueltos > 1 ? "s" : ""}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleEstudianteExpand(estudiante.id_usuario)}
                            className="bg-white text-slate-700 hover:bg-slate-100"
                          >
                            <span>
                              {isExpanded ? "Ocultar casos" : "Ver casos"} (
                              {estudiante.llamados.length})
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 ml-1.5" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1.5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Collapsible List of Cases */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100">
                          {estudiante.llamados.map((llamado) => (
                            <div
                              key={llamado.id}
                              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="space-y-2 flex-1 min-w-0">
                                {/* Case Info & Status Badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    href={`/admin/todos-los-casos/${llamado.id_caso}`}
                                    className="font-bold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1 group"
                                  >
                                    <span>Caso #{llamado.id_caso}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                                  </Link>

                                  {llamado.caso?.area && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                                    >
                                      {formatArea(llamado.caso.area)}
                                    </Badge>
                                  )}

                                  {llamado.caso?.estado &&
                                    getStatusBadge(llamado.caso.estado)}

                                  {llamado.resuelto ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-50 text-emerald-700 border-emerald-300 font-medium"
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Llamado Resuelto
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-50 text-amber-700 border-amber-300 font-medium"
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      Llamado Pendiente
                                    </Badge>
                                  )}
                                </div>

                                {/* Solicitante Info */}
                                <div className="text-xs text-slate-600">
                                  <span className="font-semibold text-slate-700">Solicitante:</span>{" "}
                                  {llamado.caso?.usuarios?.nombre_completo || "No registrado"}{" "}
                                  {llamado.caso?.usuarios?.cedula && (
                                    <span className="text-slate-400">
                                      (C.C. {llamado.caso.usuarios.cedula})
                                    </span>
                                  )}
                                </div>

                                {/* Delay Reason */}
                                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold">Demora en entrega:</span>{" "}
                                    {llamado.motivo}
                                  </div>
                                </div>

                                {/* Dates & Resolution Details */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                                  <span>
                                    Generado: {formatDateTime(llamado.fecha_creacion)}
                                  </span>

                                  {llamado.resuelto && (
                                    <span className="text-emerald-700 font-medium">
                                      Resuelto: {formatDateTime(llamado.fecha_resolucion)}
                                    </span>
                                  )}
                                </div>

                                {llamado.resuelto && llamado.motivo_resolucion && (
                                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900 flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold">Justificación:</span>{" "}
                                      {llamado.motivo_resolucion}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action: Resolver */}
                              <div className="shrink-0 flex items-center gap-2">
                                {!llamado.resuelto ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenResolver(llamado)}
                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 font-medium"
                                  >
                                    <Check className="w-4 h-4 mr-1.5" />
                                    Resolver
                                  </Button>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-slate-100 text-slate-600"
                                  >
                                    Atendido
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 3: TABLA GENERAL FILTRABLE */}
          <TabsContent value="tabla" className="space-y-4 outline-none">
            {/* Filter Bar */}
            <Card className="p-4 border-slate-200 shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span>Filtros rápidos:</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Rol Filter */}
                  <div className="w-full sm:w-48">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Filtrar por rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los roles</SelectItem>
                        <SelectItem value="asesor">Docentes Asesores</SelectItem>
                        <SelectItem value="estudiante">Estudiantes Practicantes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div className="w-full sm:w-44">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white border-slate-200">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="pendientes">Solo Pendientes</SelectItem>
                        <SelectItem value="resueltos">Solo Resueltos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(roleFilter !== "todos" || statusFilter !== "todos" || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRoleFilter("todos");
                        setStatusFilter("todos");
                        setSearchQuery("");
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* General Table */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Cargando llamados...</p>
                </div>
              ) : llamadosGeneralesFiltrados.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    No se encontraron llamados
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    No hay llamados de atención que coincidan con los filtros aplicados.
                  </p>
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 border-b border-slate-200">
                      <TableRow>
                        <TableHead className="w-[110px] font-semibold text-slate-700">
                          Rol
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Persona Infractora
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          N° Caso
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Solicitante
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Estado Caso
                        </TableHead>
                        <TableHead className="min-w-[240px] font-semibold text-slate-700">
                          Motivo Demora
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Fecha
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Estado Llamado
                        </TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">
                          Acción
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-100">
                      {llamadosGeneralesFiltrados.map((ll) => (
                        <TableRow key={ll.id} className="hover:bg-slate-50/70">
                          {/* Rol */}
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-semibold ${
                                ll.tipo === "asesor"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {ll.tipo === "asesor" ? "Asesor" : "Estudiante"}
                            </Badge>
                          </TableCell>

                          {/* Persona Infractora */}
                          <TableCell>
                            <div className="font-semibold text-slate-900">
                              {ll.perfil?.nombre_completo || "Sin nombre"}
                            </div>
                            <div className="text-xs text-slate-400">
                              {ll.perfil?.cedula
                                ? `C.C. ${ll.perfil.cedula}`
                                : ll.perfil?.correo || "—"}
                            </div>
                          </TableCell>

                          {/* Caso */}
                          <TableCell>
                            <Link
                              href={`/admin/todos-los-casos/${ll.id_caso}`}
                              className="font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                            >
                              <span>#{ll.id_caso}</span>
                              <ExternalLink className="w-3 h-3 text-blue-400" />
                            </Link>
                          </TableCell>

                          {/* Solicitante */}
                          <TableCell>
                            <div className="text-sm text-slate-800 font-medium">
                              {ll.caso?.usuarios?.nombre_completo || "—"}
                            </div>
                            {ll.caso?.usuarios?.cedula && (
                              <div className="text-xs text-slate-400">
                                C.C. {ll.caso.usuarios.cedula}
                              </div>
                            )}
                          </TableCell>

                          {/* Estado Caso */}
                          <TableCell>
                            {ll.caso?.estado ? getStatusBadge(ll.caso.estado) : "—"}
                          </TableCell>

                          {/* Motivo */}
                          <TableCell>
                            <div className="text-xs text-slate-700 line-clamp-2 max-w-xs">
                              {ll.motivo}
                            </div>
                            {ll.resuelto && ll.motivo_resolucion && (
                              <div className="text-[11px] text-emerald-700 mt-1 line-clamp-1 italic">
                                Justif: {ll.motivo_resolucion}
                              </div>
                            )}
                          </TableCell>

                          {/* Fecha */}
                          <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                            {formatDateTime(ll.fecha_creacion)}
                          </TableCell>

                          {/* Estado Llamado */}
                          <TableCell>
                            {ll.resuelto ? (
                              <div className="space-y-0.5">
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs font-medium"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Resuelto
                                </Badge>
                                {ll.fecha_resolucion && (
                                  <div className="text-[10px] text-slate-400">
                                    {formatDateTime(ll.fecha_resolucion)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-300 text-xs font-medium"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Pendiente
                              </Badge>
                            )}
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="text-right">
                            {!ll.resuelto ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenResolver(ll)}
                                className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 text-xs h-8 font-medium"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Resolver
                              </Button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Atendido
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Resolución con Justificación */}
        <Dialog
          open={!!selectedLlamado}
          onOpenChange={(open) => {
            if (!open && !resolving) {
              setSelectedLlamado(null);
              setJustificacion("");
            }
          }}
        >
          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Resolver Llamado de Atención
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Confirma la resolución administrativa de esta alerta por demora.
              </DialogDescription>
            </DialogHeader>

            {selectedLlamado && (
              <div className="space-y-4 py-2">
                {/* Infractor and Case Card */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {selectedLlamado.tipo === "asesor"
                        ? "Docente Asesor:"
                        : "Estudiante Practicante:"}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        selectedLlamado.tipo === "asesor"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {selectedLlamado.tipo === "asesor" ? "Asesor" : "Estudiante"}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {selectedLlamado.perfil?.nombre_completo || "Sin nombre registrado"}
                  </div>
                  {selectedLlamado.perfil?.cedula && (
                    <div>C.C. {selectedLlamado.perfil.cedula}</div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Caso Vinculado:</span>
                    <Link
                      href={`/admin/todos-los-casos/${selectedLlamado.id_caso}`}
                      target="_blank"
                      className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      Caso #{selectedLlamado.id_caso}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {selectedLlamado.caso?.usuarios?.nombre_completo && (
                    <div>
                      <span className="font-medium text-slate-500">Solicitante:</span>{" "}
                      {selectedLlamado.caso.usuarios.nombre_completo}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-800">Motivo de alerta:</span>
                    <p className="mt-0.5 text-slate-700 italic">
                      "{selectedLlamado.motivo}"
                    </p>
                  </div>
                </div>

                {/* Justification Textarea */}
                <div className="space-y-1.5">
                  <Label htmlFor="motivo_resolucion" className="text-sm font-semibold text-slate-700">
                    Motivo o justificación de la resolución (opcional)
                  </Label>
                  <Textarea
                    id="motivo_resolucion"
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    placeholder="Ej: Justificación médica, caso reasignado, entrega realizada en reunión o acuerdo en comité docente..."
                    className="min-h-24 bg-white border-slate-200"
                    disabled={resolving}
                  />
                  <p className="text-[11px] text-slate-400">
                    Este motivo quedará registrado en el historial de supervisión del caso.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedLlamado(null);
                  setJustificacion("");
                }}
                disabled={resolving}
                className="text-slate-700"
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmarResolucion}
                disabled={resolving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
              >
                {resolving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Confirmar Resolución
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
