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
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart,
} from "recharts";
import { Download, Users, FolderOpen, Bell, AlertTriangle, TrendingUp } from "lucide-react";

// ============================================================
// PALETA DE COLORES (estilo Tremor/Supabase)
// ============================================================
const PALETTE = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#a855f7", // purple-500
];

// ============================================================
// TOOLTIP PERSONALIZADO
// ============================================================
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg shadow-slate-200/50">
      {label && <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-600">{entry.name}:</span>
          <span className="font-bold text-slate-800">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-lg shadow-slate-200/50">
      <p className="text-sm font-bold text-slate-800">{payload[0].payload.label.replace(/_/g, " ")}</p>
      <p className="text-xs text-slate-500 mt-0.5">{payload[0].value.toLocaleString()} casos</p>
    </div>
  );
}

// ============================================================
// ESTILOS COMUNES
// ============================================================
const chartCardClass = "bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300";
const titleClass = "text-sm font-semibold text-slate-700 mb-5 tracking-tight";
const gridStyle = { stroke: "#f1f5f9", strokeDasharray: "3 3" };
const axisStyle = { fontSize: 11, fill: "#94a3b8", fontWeight: 500 };
const radius: [number, number, number, number] = [6, 6, 0, 0];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
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
    setLoading(true);
    fetchData(`/api/admin/analiticas${p}`).then((d) => { setData(d); setLoading(false); });
  }, [periodo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Spinner className="h-10 w-10 text-blue-600" /></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Analíticas</h1>
            <p className="text-sm text-slate-500 mt-1">Datos agregados del Consultorio Jurídico</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-44 border-slate-200 rounded-xl bg-white">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los períodos</SelectItem>
                {data.periodos?.map((p: string) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={async () => {
              const p = periodo === "todos" ? "" : `&periodo=${periodo}`;
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;
              const res = await fetch(`/api/admin/exportar?tipo=casos${p}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "casos.xlsx"; a.click(); URL.revokeObjectURL(url);
            }}>
              <Download className="w-4 h-4 mr-1.5" />Exportar Excel
            </Button>
          </div>
        </div>

        {/* CARDS DE RESUMEN */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={<FolderOpen className="w-5 h-5" />} label="Total Casos" value={data.totalCasos} color="blue" trend="+12%" />
          <MetricCard icon={<Users className="w-5 h-5" />} label="Total Usuarios" value={data.totalUsuarios} color="emerald" />
          <MetricCard icon={<Bell className="w-5 h-5" />} label="Llamados Pend." value={data.llamadosPendientes} color="amber" />
          <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="En Corrección" value={data.casosPorEstado?.en_correccion || 0} color="red" />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Casos por Estado */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Casos por Estado</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={Object.entries(data.casosPorEstado || {}).map(([k, v]) => ({ name: k.replace(/_/g, " "), value: v }))}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
                  animationBegin={0} animationDuration={800} animationEasing="ease-out"
                >
                  {Object.entries(data.casosPorEstado || {}).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-3">
              {Object.entries(data.casosPorEstado || {}).map(([k, v], i) => (
                <div key={k} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE[i] }} />
                  {k.replace(/_/g, " ")} (                  {(v as number).toLocaleString()})
                </div>
              ))}
            </div>
          </div>

          {/* Casos por Área */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Casos por Área</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.casosPorArea} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" fill="url(#gradArea)" radius={radius} animationBegin={0} animationDuration={600}>
                  {data.casosPorArea?.map((_: any, i: number) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Casos por Mes */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Evolución Mensual</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.casosPorMes} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <defs><linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradLine)" animationBegin={0} animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sexo */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Sexo de Usuarios</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.sexo} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
                  animationBegin={0} animationDuration={800}
                >
                  {data.sexo?.map((_: any, i: number) => <Cell key={i} fill={["#3b82f6", "#ec4899", "#94a3b8"][i] || PALETTE[i]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.sexo?.map((d: any, i: number) => (
                <div key={d.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ["#3b82f6", "#ec4899", "#94a3b8"][i] }} />
                  {d.label} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Estrato */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Estrato Socioeconómico</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.estrato} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={radius} animationBegin={0} animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Edad */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Rangos de Edad</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.edadRangos} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid {...gridStyle} vertical={false} />
                <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<SimpleTooltip />} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="value" fill="#10b981" radius={radius} animationBegin={0} animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Situación Laboral */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Situación Laboral</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.situacionLaboral} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
                  animationBegin={0} animationDuration={800}
                >
                  {data.situacionLaboral?.map((_: any, i: number) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.situacionLaboral?.map((d: any, i: number) => (
                <div key={d.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PALETTE[i] }} />
                  {d.label} ({d.value})
                </div>
              ))}
            </div>
          </div>


          {/* Llamados */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Llamados vs Resueltos</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Resueltos", value: data.llamadosResueltos },
                    { name: "Pendientes", value: data.llamadosPendientes },
                  ]}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
                  animationBegin={0} animationDuration={800}
                >
                  <Cell fill="#10b981" stroke="none" />
                  <Cell fill="#ef4444" stroke="none" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#10b981" }} />Resueltos ({data.llamadosResueltos})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />Pendientes ({data.llamadosPendientes})
              </div>
            </div>
          </div>

          {/* Enfoque Diverso */}
          <div className={chartCardClass}>
            <h3 className={titleClass}>Enfoque Diverso</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Sí", value: data.enfoqueDiverso?.si || 0 },
                    { name: "No", value: data.enfoqueDiverso?.no || 0 },
                    { name: "No responde", value: data.enfoqueDiverso?.noResponde || 0 },
                  ]}
                  dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}
                  animationBegin={0} animationDuration={800}
                >
                  <Cell fill="#8b5cf6" stroke="none" />
                  <Cell fill="#94a3b8" stroke="none" />
                  <Cell fill="#e2e8f0" stroke="none" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#8b5cf6" }} />Sí ({data.enfoqueDiverso?.si || 0})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#94a3b8" }} />No ({data.enfoqueDiverso?.no || 0})
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#e2e8f0" }} />No responde ({data.enfoqueDiverso?.noResponde || 0})
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// COMPONENTE: METRIC CARD
// ============================================================
function MetricCard({ icon, label, value, color, trend }: {
  icon: React.ReactNode; label: string; value: number; color: string;
  trend?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <Card className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>{icon}</div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />{trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value.toLocaleString()}</p>
        <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wide">{label}</p>
      </div>
    </Card>
  );
}
