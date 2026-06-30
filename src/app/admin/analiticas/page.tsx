"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../components/NavbarAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Download, Users, FolderOpen, Bell, AlertTriangle } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

async function fetchData(endpoint: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${session.access_token}` } });
  return res.json();
}

export default function AnaliticasPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("todos");

  useEffect(() => {
    const p = periodo === "todos" ? "" : `?periodo=${periodo}`;
    fetchData(`/api/admin/analiticas${p}`).then((d) => { setData(d); setLoading(false); });
  }, [periodo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Spinner className="h-10 w-10 text-blue-600" /></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Analíticas</h1>
            <p className="text-sm text-slate-500 mt-1">Datos agregados del Consultorio Jurídico</p>
          </div>
          <div className="flex gap-3 mt-3 sm:mt-0">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Período" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los períodos</SelectItem>
                {data.periodos?.map((p: string) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={async () => {
              const p = periodo === "todos" ? "" : `&periodo=${periodo}`;
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;
              const res = await fetch(`/api/admin/exportar?tipo=casos${p}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "casos.xlsx"; a.click(); URL.revokeObjectURL(url);
            }}>
              <Download className="w-4 h-4 mr-1" />Exportar Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard icon={<FolderOpen className="w-5 h-5" />} label="Total Casos" value={data.totalCasos} color="bg-blue-50 text-blue-600" />
          <SummaryCard icon={<Users className="w-5 h-5" />} label="Total Usuarios" value={data.totalUsuarios} color="bg-emerald-50 text-emerald-600" />
          <SummaryCard icon={<Bell className="w-5 h-5" />} label="Llamados Pend." value={data.llamadosPendientes} color="bg-amber-50 text-amber-600" />
          <SummaryCard icon={<AlertTriangle className="w-5 h-5" />} label="En Corrección" value={data.casosPorEstado?.en_correccion || 0} color="bg-orange-50 text-orange-600" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Casos por Estado">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={Object.entries(data.casosPorEstado || {}).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {Object.entries(data.casosPorEstado || {}).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Casos por Área">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.casosPorArea}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Casos por Mes">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.casosPorMes}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sexo de Usuarios">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={data.sexo} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, value }) => `${label}: ${value}`}>
                {data.sexo?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Estrato Socioeconómico">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.estrato}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Rangos de Edad">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.edadRangos}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Situación Laboral">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={data.situacionLaboral} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={({ label, value }) => `${label}: ${value}`}>
                {data.situacionLaboral?.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Carga de Estudiantes (Top 15)">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.cargaEstudiantes?.slice(0, 15)} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} width={120} /><Tooltip /><Bar dataKey="carga" fill="#3b82f6" radius={[0, 4, 4, 0]} /></BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Llamados vs Resueltos">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={[{ name: "Resueltos", value: data.llamadosResueltos }, { name: "Pendientes", value: data.llamadosPendientes }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#10b981" /><Cell fill="#ef4444" />
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Enfoque Diverso">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart><Pie data={[{ name: "Sí", value: data.enfoqueDiverso?.si || 0 }, { name: "No", value: data.enfoqueDiverso?.no || 0 }, { name: "No responde", value: data.enfoqueDiverso?.noResponde || 0 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#8b5cf6" /><Cell fill="#94a3b8" /><Cell fill="#cbd5e1" />
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <Card className="p-4 border-none shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 border-none shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-4">{title}</h3>
      {children}
    </Card>
  );
}
