"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export const DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
export const TURNOS_CLASICOS = ["9-11", "2-4", "4-6"];

interface Props {
  onAdd: (h: { turno: string; dia: string }) => void;
  disabled?: boolean;
}

export function HorarioAdder({ onAdd, disabled }: Props) {
  const [dia, setDia] = useState("");
  const [turno, setTurno] = useState("");

  const agregar = () => {
    if (!dia || !turno) return;
    onAdd({ dia, turno });
    setTurno("");
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <Select value={dia} onValueChange={setDia} disabled={disabled}>
        <SelectTrigger className="h-8 text-xs w-24">
          <SelectValue placeholder="Dia" />
        </SelectTrigger>
        <SelectContent>
          {DIAS.map((d) => (
            <SelectItem key={d} value={d}>
              {d.substring(0, 3)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={turno} onValueChange={setTurno} disabled={disabled}>
        <SelectTrigger className="h-8 text-xs w-24">
          <SelectValue placeholder="Turno" />
        </SelectTrigger>
        <SelectContent>
          {TURNOS_CLASICOS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Otro..."
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        disabled={disabled}
        className="h-8 text-xs w-20"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8"
        onClick={agregar}
        disabled={disabled || !dia || !turno}
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
