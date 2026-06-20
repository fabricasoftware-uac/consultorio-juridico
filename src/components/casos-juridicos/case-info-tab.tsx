import React from "react";
import {
  FileText,
  Briefcase,
  Activity,
  ClipboardList,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { formatArea } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CaseInfoTabProps {
  caseData: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  canEdit?: boolean;
}

const AREAS = [
  { value: "no_asignada", label: "No asignada" },
  { value: "laboral", label: "Derecho Laboral" },
  { value: "civil_familia", label: "Derecho Civil y familiar" },
  { value: "penal", label: "Derecho Penal" },
  { value: "publica", label: "Derecho Público" },
  { value: "otros", label: "Otros" },
];



export const CaseInfoTab = ({
  caseData,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  getStatusBadge,
  canEdit = true,
}: CaseInfoTabProps) => {
  const headerActions = canEdit ? (
    !isEditing ? (
      <Button
        onClick={onEdit}
        size="sm"
        variant="ghost"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Modificar
      </Button>
    ) : (
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          <Check className="w-4 h-4 mr-2" />
          Guardar
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="outline"
          className="text-slate-600 hover:bg-slate-100 font-semibold"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>
    )
  ) : null;

  return (
    <SectionCard
      title="Información del caso"
      icon={FileText}
      headerActions={headerActions}
    >
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50/30 rounded-xl p-4 border border-blue-100/50">
            <InfoField
              label="Área del caso"
              value={formatArea(caseData?.area)}
              icon={Briefcase}
              valueClassName="text-lg font-semibold text-slate-800"
            />
          </div>

          <div className="bg-purple-50/30 rounded-xl p-4 border border-purple-100/50">
            <div className="flex items-center text-slate-500 mb-2">
              <Activity className="w-4 h-4 mr-2 text-purple-500" />
              <Label className="text-xs font-bold uppercase tracking-wider">
                Estado del caso
              </Label>
            </div>
            <div className="pl-6">
              {caseData && getStatusBadge(caseData.estado)}
            </div>
          </div>

          <div className="bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/50">
            <div className="flex items-center text-slate-500 mb-2">
              <ClipboardList className="w-4 h-4 mr-2 text-emerald-500" />
              <Label className="text-xs font-bold uppercase tracking-wider">
                Clasificación
              </Label>
            </div>
            <p className="pl-6 text-base font-semibold capitalize text-slate-800">
              {caseData?.clasificacion?.replace("_", " ") || "Sin clasificar"}
            </p>
          </div>

          <div className="bg-amber-50/30 rounded-xl p-4 border border-amber-100/50">
            <InfoField
              label="Tipo de proceso"
              value={caseData?.tipo_proceso || "No especificado"}
              icon={ClipboardList}
              valueClassName="text-base font-semibold text-slate-800"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Área del caso
              </Label>
              <Select
                value={editedData?.area || ""}
                onValueChange={(val) => onChange("area", val)}
              >
                <SelectTrigger className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11">
                  <SelectValue placeholder="Seleccionar tipo de caso" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {AREAS.map((area) => (
                    <SelectItem
                      key={area.value}
                      value={area.value}
                      className="focus:bg-blue-50 focus:text-blue-700 capitalize"
                    >
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-500" />
                Clasificación
              </Label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-semibold capitalize text-sm text-slate-700">
                  {editedData?.clasificacion?.replace("_", " ") ||
                    "Sin clasificar"}
                </p>
                {(!editedData?.clasificacion ||
                  editedData?.estado === "pendiente_aprobacion" ||
                  editedData?.estado === "en_proceso") && (
                  <p className="text-xs text-slate-400 mt-2">
                    Se asigna al aprobar el caso desde la vista del asesor.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-amber-500" />
                Tipo de proceso
              </Label>
              <Input
                value={editedData?.tipo_proceso || ""}
                onChange={(e) => onChange("tipo_proceso", e.target.value)}
                placeholder="Ej: Ordinario, Ejecutivo..."
                className="border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg h-11"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                Estado del caso
              </Label>
              <div className="pl-6 pt-1">
                {editedData && getStatusBadge(editedData.estado)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                El estado se gestiona desde los botones de acción en la página
                (aprobar, archivar, cerrar).
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
};
