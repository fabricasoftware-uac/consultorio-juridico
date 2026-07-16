"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getHorarios, saveHorarios } from "../../supabase/queries/getHorarios";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const TURNOS_CLASICOS = ["9-11", "2-4", "4-6"];
const DIAS = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

interface Props {
  idPerfil: string;
}

export function HorariosEditor({ idPerfil }: Props) {
  const [horarios, setHorarios] = useState<{ turno: string; dia: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevoDia, setNuevoDia] = useState("");
  const [nuevoTurno, setNuevoTurno] = useState("");

  useEffect(() => {
    getHorarios(idPerfil).then((data) => {
      setHorarios(data.map((h) => ({ turno: h.turno, dia: h.dia })));
      setLoading(false);
    });
  }, [idPerfil]);

  const agregar = () => {
    if (!nuevoDia || !nuevoTurno) return;
    if (horarios.some((h) => h.dia === nuevoDia && h.turno === nuevoTurno)) return;
    setHorarios([...horarios, { dia: nuevoDia, turno: nuevoTurno }]);
    setNuevoTurno("");
  };

  const quitar = (idx: number) => {
    setHorarios(horarios.filter((_, i) => i !== idx));
  };

  const guardar = async () => {
    await saveHorarios(idPerfil, horarios);
    toast.success("Horarios guardados");
  };

  if (loading) return null;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-bold">Horarios</Label>

      {horarios.length === 0 ? (
        <p className="text-xs text-slate-400">Sin horarios definidos</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {horarios.map((h, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pr-1">
              {h.dia.substring(0, 3)} {h.turno}
              <button onClick={() => quitar(i)} className="hover:bg-slate-200 rounded-full p-0.5 cursor-pointer"><X className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Select value={nuevoDia} onValueChange={setNuevoDia}>
          <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Día" /></SelectTrigger>
          <SelectContent>{DIAS.map((d) => <SelectItem key={d} value={d}>{d.substring(0,3)}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={nuevoTurno} onValueChange={setNuevoTurno}>
          <SelectTrigger className="h-8 text-xs w-24"><SelectValue placeholder="Turno" /></SelectTrigger>
          <SelectContent>
            {TURNOS_CLASICOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          placeholder="Otro turno..."
          value={nuevoTurno}
          onChange={(e) => setNuevoTurno(e.target.value)}
          className="h-8 text-xs w-24"
        />
        <Button size="sm" variant="outline" className="h-8" onClick={agregar} disabled={!nuevoDia || !nuevoTurno}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <Button size="sm" onClick={guardar} className="w-full h-7 text-xs">Guardar horarios</Button>
    </div>
  );
}
