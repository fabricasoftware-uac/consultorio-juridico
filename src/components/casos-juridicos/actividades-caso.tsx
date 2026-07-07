"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ClipboardList, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/supabase-client";

type Actividad = { id: number; id_caso: number; id_usuario: string; titulo: string; descripcion: string; created_at: string };

interface Props { idCaso: string; }

async function api(path: string, options?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const res = await fetch(path, { ...options, headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...options?.headers } });
  return res.json();
}

export function ActividadesCaso({ idCaso }: Props) {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    const data = await api(`/api/actividades?id_caso=${idCaso}`);
    if (data) setActividades(data.actividades ?? []);
    setLoading(false);
  };

  useEffect(() => { cargar(); }, [idCaso]);

  const enviar = async () => {
    if (!titulo.trim()) return;
    setEnviando(true);
    const { data: { user } } = await supabase.auth.getUser();
    await api("/api/actividades", { method: "POST", body: JSON.stringify({ id_caso: Number(idCaso), id_usuario: user?.id, titulo: titulo.trim(), descripcion: desc.trim() }) });
    setTitulo(""); setDesc("");
    toast.success("Actividad registrada");
    cargar();
    setEnviando(false);
  };

  if (loading) return <div className="p-4 text-center text-sm text-slate-400">Cargando...</div>;

  return (
    <div className="space-y-4">
      {actividades.length === 0 ? (
        <div className="p-6 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <ClipboardList className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {actividades.map((a) => (
            <div key={a.id} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-slate-800">{a.titulo}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(a.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {a.descripcion && <p className="text-sm text-slate-600 ml-6">{a.descripcion}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título de la actividad (ej: Solicité cédula al cliente)" className="text-sm" />
        <div className="flex gap-2">
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción (opcional)..." rows={2} className="resize-none text-sm" />
          <Button onClick={enviar} disabled={!titulo.trim() || enviando} size="icon" className="self-end shrink-0 bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
