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
import { Search, FilterX } from "lucide-react";

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
  { value: "aprobado", label: "Aprobado" },
  { value: "cerrado", label: "Cerrado" },
  { value: "archivado", label: "Archivado" },
] as const;

const CLASS_OPTIONS = [
  { value: "todos", label: "Todas las clasificaciones" },
  { value: "en_tramite", label: "En trámite" },
  { value: "solo_asesoria", label: "Solo asesoría" },
] as const;

const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
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
  classFilter: string;
  onClassChange: (value: string) => void;
  onClear: () => void;
  loading?: boolean;
  searchPlaceholder?: string;
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
  onClear,
  loading,
  searchPlaceholder = "Cliente, documento, área...",
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

        <div className="w-full lg:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Ordenar por fecha
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

        {children}

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
