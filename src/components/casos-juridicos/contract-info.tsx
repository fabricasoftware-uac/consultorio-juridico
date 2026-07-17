import React from "react";
import { FileText } from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Check } from "lucide-react";

interface ContractInfoProps {
  contrato: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  canEdit?: boolean;
}

export const ContractInfo = ({
  contrato,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  canEdit = true,
}: ContractInfoProps) => {
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
          variant="ghost"
          className="text-slate-600 hover:bg-slate-100 font-semibold"
        >
          Cancelar
        </Button>
      </div>
    )
  ) : null;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Información del contrato laboral"
        icon={FileText}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
        headerActions={headerActions}
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InfoField label="Tipo de contrato" value={contrato?.tipo_contrato} />
            <InfoField label="Representante legal" value={contrato?.representante_legal} />
            <InfoField label="Dirección empresa" value={contrato?.direccion_empresa} />
            <InfoField label="Correo patrono" value={contrato?.correo_patrono} />
            <InfoField label="Fecha inicio" value={contrato?.fecha_inicio} />
            <InfoField label="Fecha fin" value={contrato?.fecha_fin} />
            <InfoField label="¿Continúa?" value={contrato?.continua != null ? (contrato.continua ? "Sí" : "No") : "N/A"} />
            <InfoField label="Salario inicial" value={contrato?.salario_inicial} />
            <InfoField label="Salario actual" value={contrato?.salario_actual} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Tipo de contrato</Label>
              <Input value={editedData?.tipo_contrato || ""} onChange={(e) => onChange("tipo_contrato", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Representante legal</Label>
              <Input value={editedData?.representante_legal || ""} onChange={(e) => onChange("representante_legal", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Dirección empresa</Label>
              <Input value={editedData?.direccion_empresa || ""} onChange={(e) => onChange("direccion_empresa", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Correo patrono</Label>
              <Input type="email" value={editedData?.correo_patrono || ""} onChange={(e) => onChange("correo_patrono", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Fecha inicio</Label>
              <Input type="date" value={editedData?.fecha_inicio || ""} onChange={(e) => onChange("fecha_inicio", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Fecha fin</Label>
              <Input type="date" value={editedData?.fecha_fin || ""} onChange={(e) => onChange("fecha_fin", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">¿Continúa?</Label>
              <Select value={editedData?.continua === true ? "true" : editedData?.continua === false ? "false" : ""} onValueChange={(val) => onChange("continua", val === "true" ? true : val === "false" ? false : null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Salario inicial</Label>
              <Input type="number" value={editedData?.salario_inicial || ""} onChange={(e) => onChange("salario_inicial", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Salario actual</Label>
              <Input type="number" value={editedData?.salario_actual || ""} onChange={(e) => onChange("salario_actual", e.target.value)} />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};
