"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { getEstudiantes } from "../../../supabase/queries/getEstudiantes";
import { getAsesores } from "../../../supabase/queries/getAsesores";
import { insertEstudiantesCasos } from "../../../supabase/queries/insertEstudiantesCasos";
import { insertAsesoresCasos } from "../../../supabase/queries/insertAsesoresCasos";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";
import { Search, UserPlus, Users } from "lucide-react";
import type { Estudiante, Asesor } from "app/types/database";

interface Props {
  idCaso: string;
  type: "estudiante" | "asesor";
  currentName?: string;
  onRefresh: () => void;
}

export function AdminReasignarEquipo({ idCaso, type, currentName, onRefresh }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<(Estudiante | Asesor)[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [diaFilter, setDiaFilter] = useState("todos");
  const [jornadaFilter, setJornadaFilter] = useState("todos");

  const [historial, setHistorial] = useState<{ nombre: string; desde: string; hasta: string | null }[]>([]);

  useEffect(() => {
    if (open) {
      if (type === "estudiante") {
        getEstudiantes(true).then((r) => setItems(r ?? []));
      } else {
        getAsesores(true).then((r) => setItems(r ?? []));
      }
      // Cargar historial
      cargarHistorial();
    } else {
      setSelectedId("");
      setSearch("");
      setDiaFilter("todos");
      setJornadaFilter("todos");
    }
  }, [open, type]);

  const cargarHistorial = async () => {
    const tabla = type === "estudiante" ? "estudiantes_casos" : "asesores_casos";
    const colId = type === "estudiante" ? "id_estudiante" : "id_asesor";
    const joinTabla = type === "estudiante" ? "estudiantes" : "asesores";
    const joinFk = type === "estudiante" ? "estudiantes_casos_id_estudiante_fkey" : "asesores_casos_id_asesor_fkey";
    const perfilFk = type === "estudiante" ? "estudiantes_id_perfil_fkey" : "asesores_id_perfil_fkey";
    const { data } = await supabase
      .from(tabla)
      .select(`fecha_asignacion, fecha_fin_asignacion, ${type}:${joinTabla}!${joinFk}(perfil:perfiles!${perfilFk}(nombre_completo))`)
      .eq("id_caso", idCaso)
      .order("fecha_asignacion", { ascending: false });
    if (data) {
      setHistorial(data.map((h: any) => ({
        nombre: h[type]?.perfil?.nombre_completo || "Desconocido",
        desde: h.fecha_asignacion || "",
        hasta: h.fecha_fin_asignacion || null,
      })));
    }
  };

  const filtrados = items
    .filter((item) => {
      const perfil = "perfil" in item ? item.perfil : (item as Asesor).perfil;
      const term = search.toLowerCase();
      const matchSearch = !term || perfil?.nombre_completo?.toLowerCase().includes(term) || perfil?.cedula?.toLowerCase().includes(term);
      const matchDia = diaFilter === "todos" || item.dia?.toLowerCase() === diaFilter.toLowerCase();
      const matchJornada = jornadaFilter === "todos" || ("jornada" in item ? item.jornada?.toLowerCase() === jornadaFilter.toLowerCase() : true);
      return matchSearch && matchDia && matchJornada;
    })
    .sort((a, b) => ((a as any).total_casos ?? 0) - ((b as any).total_casos ?? 0));

  const dias = [...new Set(items.map((i) => i.dia).filter(Boolean))];

  const handleReassign = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const now = new Date().toISOString();
      if (type === "estudiante") {
        await supabase.from("estudiantes_casos").update({ fecha_fin_asignacion: now }).eq("id_caso", idCaso).is("fecha_fin_asignacion", null);
        await insertEstudiantesCasos(idCaso, selectedId);
      } else {
        await supabase.from("asesores_casos").update({ fecha_fin_asignacion: now }).eq("id_caso", idCaso).is("fecha_fin_asignacion", null);
        await insertAsesoresCasos(idCaso, selectedId);
      }
      setOpen(false);
      onRefresh();
      toast.success(`${type === "estudiante" ? "Estudiante" : "Asesor"} reasignado exitosamente`);
    } catch (e) {
      console.error(e);
      toast.error("Error al reasignar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            {type === "estudiante" ? "Estudiante" : "Asesor"} actual
          </Label>
          <p className="text-sm font-semibold text-slate-800 mt-0.5">{currentName || "No asignado"}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><UserPlus className="w-4 h-4 mr-1" />Reasignar</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Reasignar {type === "estudiante" ? "Estudiante" : "Asesor"}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input placeholder="Buscar por nombre o cédula..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              {dias.length > 0 && (
                <Select value={diaFilter} onValueChange={setDiaFilter}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Día" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los días</SelectItem>
                    {dias.map((d) => <SelectItem key={d!} value={d!}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
              {type === "estudiante" && (
                <Select value={jornadaFilter} onValueChange={setJornadaFilter}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Jornada" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="diurna">Diurna</SelectItem>
                    <SelectItem value="nocturna">Nocturna</SelectItem>
                    <SelectItem value="mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[50vh] border rounded-xl">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b">
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Nombre</th>
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden sm:table-cell">Cédula</th>
                    {type === "estudiante" && (
                      <>
                        <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Sem</th>
                        <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase hidden md:table-cell">Jornada</th>
                      </>
                    )}
                    <th className="text-left p-3 text-[11px] font-bold text-slate-500 uppercase">Día</th>
                    <th className="text-center p-3 text-[11px] font-bold text-slate-500 uppercase">Carga</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((item) => {
                    const perfil = "perfil" in item ? item.perfil : (item as Asesor).perfil;
                    const id = item.id_perfil?.toString() ?? (item as Asesor).id_perfil?.toString();
                    const casos = (item as any).total_casos ?? 0;
                    const max = 5;
                    return (
                      <tr
                        key={id}
                        className={`border-b cursor-pointer transition-colors ${selectedId === id ? "bg-blue-50 border-blue-200" : "hover:bg-slate-50"}`}
                        onClick={() => setSelectedId(id!)}
                      >
                        <td className="p-3 font-medium text-slate-800 text-xs">{perfil?.nombre_completo}</td>
                        <td className="p-3 text-slate-500 text-xs hidden sm:table-cell">{perfil?.cedula || "—"}</td>
                        {type === "estudiante" && (
                          <>
                            <td className="p-3 text-slate-500 text-xs hidden md:table-cell">{(item as Estudiante).semestre}°</td>
                            <td className="p-3 text-slate-500 text-xs capitalize hidden md:table-cell">{(item as Estudiante).jornada}</td>
                          </>
                        )}
                        <td className="p-3 text-slate-500 text-xs">{item.dia || "—"}</td>
                        <td className="p-3 text-center">
                          <Badge variant={casos >= max ? "destructive" : "secondary"} className={`text-[10px] h-5 ${casos === 0 ? "bg-green-100 text-green-700" : casos < max ? "bg-blue-100 text-blue-700" : ""}`}>
                            {casos}/{max}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {historial.length > 0 && (
              <div className="mt-3 border-t pt-3">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                  Historial de asignaciones
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {historial.map((h, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-500 py-1 border-b border-slate-50 last:border-0">
                      <span className="font-medium text-slate-700">{h.nombre}</span>
                      <span>
                        {h.desde ? new Date(h.desde).toLocaleDateString("es-CO") : "—"}
                        {h.hasta ? ` → ${new Date(h.hasta).toLocaleDateString("es-CO")}` : " (actual)"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleReassign} disabled={!selectedId || loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Reasignando..." : "Confirmar Reasignación"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
