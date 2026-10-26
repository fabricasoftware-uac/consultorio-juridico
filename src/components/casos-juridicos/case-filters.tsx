"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, FilterX, AlertTriangle } from "lucide-react";
import { cn } from "@/components/ui/utils";

const AREA_OPTIONS = [
  { value: "todos", label: "Todas las áreas" },
  { value: "no_asignada", label: "No asignada" },
  { value: "laboral", label: "Derecho Laboral" },
  { value: "civil_familia", label: "Derecho Civil y familiar" },
  { value: "penal", label: "Derecho Penal" },
  { value: "publica", label: "Derecho Público" },
  { value: "otros", label: "Otros" },
] as const;

const STATUS_OPTIONS = [
  { value: "todos", label: "Todos los estados" },
  { value: "en_proceso", label: "En proceso" },
  { value: "pendiente_aprobacion", label: "Pendiente de aprobación" },
  { value: "en_correccion", label: "En corrección" },
  { value: "activo", label: "Activo" },
  { value: "cerrado", label: "Cerrado" },
  { value: "archivado", label: "Archivado" },
] as const;

const CLASS_OPTIONS = [
  { value: "todos", label: "Todas las clasificaciones" },
  { value: "en_tramite", label: "En trámite" },
  { value: "solo_asesoria", label: "Solo asesoría" },
] as const;

const SORT_OPTIONS = [
  { value: "ultima_mod", label: "Última modificación" },
  { value: "recientes", label: "Más recientes (creación)" },
  { value: "antiguos", label: "Más antiguos (creación)" },
] as const;

export interface CaseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  areaFilter: string;
  onAreaChange: (value: string) => void;
  dateSort: string;
  onDateSortChange: (value: string) => void;
  classFilter?: string;
  onClassChange?: (value: string) => void;
  studentFilter?: string;
  onStudentChange?: (value: string) => void;
  studentsList?: string[];
  advisorFilter?: string;
  onAdvisorChange?: (value: string) => void;
  advisorsList?: string[];
  onClear: () => void;
  loading?: boolean;
  searchPlaceholder?: string;
  reasignacionFilter?: boolean;
  onReasignacionChange?: (checked: boolean) => void;
  conteoReasignacion?: number;
  children?: React.ReactNode;
}

export function CaseFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  areaFilter,
  onAreaChange,
  dateSort,
  onDateSortChange,
  classFilter,
  onClassChange,
  studentFilter,
  onStudentChange,
  studentsList,
  advisorFilter,
  onAdvisorChange,
  advisorsList,
  reasignacionFilter,
  onReasignacionChange,
  conteoReasignacion,
  onClear,
  loading,
  searchPlaceholder = "Solicitante, documento o N° caso...",
  children,
}: CaseFiltersProps) {
  return (
    <Card className="bg-white border-none shadow-sm shadow-slate-200/50 p-5 mb-8 rounded-2xl">
      <div className="flex flex-col lg:flex-row gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              disabled={loading}
              className="pl-9 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-colors rounded-xl"
            />
          </div>
        </div>

        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Estado
          </label>
          <Select
            value={statusFilter}
            onValueChange={onStatusChange}
            disabled={loading}
          >
            <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Área
          </label>
          <Select
            value={areaFilter}
            onValueChange={onAreaChange}
            disabled={loading}
          >
            <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              {AREA_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {studentsList && onStudentChange && (
          <div className="w-full lg:w-48 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estudiante
            </label>
            <Select
              value={studentFilter || "todos"}
              onValueChange={onStudentChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl truncate">
                <SelectValue placeholder="Todos los estudiantes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estudiantes</SelectItem>
                {[...new Set(studentsList)]
                  .filter(Boolean)
                  .sort((a, b) => a.localeCompare(b))
                  .map((student) => (
                    <SelectItem key={student} value={student}>
                      {student}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {advisorsList && onAdvisorChange && (
          <div className="w-full lg:w-48 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Asesor
            </label>
            <Select
              value={advisorFilter || "todos"}
              onValueChange={onAdvisorChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl truncate">
                <SelectValue placeholder="Todos los asesores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los asesores</SelectItem>
                {[...new Set(advisorsList)]
                  .filter(Boolean)
                  .sort((a, b) => a.localeCompare(b))
                  .map((advisor) => (
                    <SelectItem key={advisor} value={advisor}>
                      {advisor}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {classFilter !== undefined && onClassChange && (
          <div className="w-full lg:w-48 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Clasificación
            </label>
            <Select
              value={classFilter}
              onValueChange={onClassChange}
              disabled={loading}
            >
              <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
                <SelectValue placeholder="Clasificación" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ordenar por
          </label>
          <Select
            value={dateSort}
            onValueChange={onDateSortChange}
            disabled={loading}
          >
            <SelectTrigger className="bg-slate-50 border-transparent focus:bg-white transition-colors rounded-xl">
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {children}

        {onReasignacionChange && (
          <Button
            type="button"
            variant={reasignacionFilter ? "default" : "outline"}
            onClick={() => onReasignacionChange(!reasignacionFilter)}
            disabled={loading}
            className={cn(
              "w-full lg:w-auto shrink-0 rounded-xl h-10 text-xs font-semibold transition-all flex items-center justify-center gap-2",
              reasignacionFilter
                ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-xs"
                : "bg-amber-50/90 hover:bg-amber-100 text-amber-800 border-amber-300"
            )}
            title="Filtrar casos con practicante inactivo o sin turnos registrados"
          >
            <AlertTriangle className={cn("w-4 h-4 shrink-0", reasignacionFilter ? "text-white" : "text-amber-600")} />
            <span>Requieren reasignación (Practicante inactivo)</span>
            {conteoReasignacion !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  reasignacionFilter
                    ? "bg-amber-800 text-white"
                    : "bg-amber-200 text-amber-900"
                )}
              >
                {conteoReasignacion}
              </span>
            )}
          </Button>
        )}

        <Button
          onClick={onClear}
          variant="outline"
          className="w-full md:w-auto shrink-0 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
          disabled={loading}
        >
          <FilterX className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
      </div>
    </Card>
  );
}
