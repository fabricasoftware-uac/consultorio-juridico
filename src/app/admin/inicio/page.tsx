"use client";

import {
  Users,
  UserPlus,
  GraduationCap,
  ArrowRight,
  Calendar,
  FolderOpen,
  AlertTriangle,
  ExternalLink,
  UserCheck,
  BellRing,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getLlamadosAdmin,
  type LlamadoAtencionAdmin,
} from "../../../../supabase/queries/getLlamadosAdmin";
import { supabase } from "@/lib/supabase/supabase-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

interface DashboardStats {
  casosActivos: number;
  casosEnRiesgo: number;
  solicitantesAtendidos: number;
  totalEstudiantes: number;
  totalAsesores: number;
}

export default function AdminPanelPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [llamadosPendientes, setLlamadosPendientes] = useState<
    LlamadoAtencionAdmin[]
  >([]);
  const [stats, setStats] = useState<DashboardStats>({
    casosActivos: 0,
    casosEnRiesgo: 0,
    solicitantesAtendidos: 0,
    totalEstudiantes: 0,
    totalAsesores: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    };
    updateTime();

    async function loadDashboardData() {
      try {
        setLoading(true);
        const [
          llamadosData,
          { count: countCasosActivos },
          { count: countSolicitantes },
          { count: countEstudiantes },
          { count: countAsesores },
        ] = await Promise.all([
          getLlamadosAdmin({ resuelto: false }),
          supabase
            .from("casos")
            .select("*", { count: "exact", head: true })
            .eq("estado", "activo"),
          supabase
            .from("usuarios")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("estudiantes")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("asesores")
            .select("*", { count: "exact", head: true }),
        ]);

        setLlamadosPendientes(llamadosData.slice(0, 6));
        setStats({
          casosActivos: countCasosActivos ?? 0,
          casosEnRiesgo: llamadosData.length,
          solicitantesAtendidos: countSolicitantes ?? 0,
          totalEstudiantes: countEstudiantes ?? 0,
          totalAsesores: countAsesores ?? 0,
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const kpis = [
    {
      title: "Casos Activos",
      value: stats.casosActivos,
      subtitle: "En trámite o asesoría legal en curso",
      icon: FolderOpen,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderHover: "hover:border-blue-300",
      href: "/admin/todos-los-casos",
    },
    {
      title: "Casos en Riesgo / Llamados",
      value: stats.casosEnRiesgo,
      subtitle: "Llamados de atención pendientes",
      icon: AlertTriangle,
      iconColor: stats.casosEnRiesgo > 0 ? "text-amber-600" : "text-slate-500",
      bgColor: stats.casosEnRiesgo > 0 ? "bg-amber-50" : "bg-slate-50",
      badge:
        stats.casosEnRiesgo > 0 ? (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] animate-pulse">
            Requiere atención
          </Badge>
        ) : null,
      borderHover: "hover:border-amber-300",
      href: "/admin/llamados",
    },
    {
      title: "Solicitantes Atendidos",
      value: stats.solicitantesAtendidos,
      subtitle: "Beneficiarios registrados en el sistema",
      icon: UserCheck,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderHover: "hover:border-emerald-300",
      href: "/admin/todos-los-casos",
    },
    {
      title: "Talento Académico",
      value: stats.totalEstudiantes + stats.totalAsesores,
      subtitle: `${stats.totalEstudiantes} estudiantes · ${stats.totalAsesores} asesores`,
      icon: GraduationCap,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderHover: "hover:border-purple-300",
      href: "/admin/estudiantes",
    },
  ];

  const quickActions = [
    {
      title: "Gestionar Casos",
      desc: "Supervisar, cambiar estados, consultar historial y asignar expedientes",
      href: "/admin/todos-los-casos",
      icon: FolderOpen,
      color: "blue",
      btnText: "Ver expedientes",
    },
    {
      title: "Llamados de Atención",
      desc: "Monitorear alertas de vencimiento agrupadas por docente y estudiante",
      href: "/admin/llamados",
      icon: BellRing,
      color: "amber",
      btnText: "Resolver alertas",
      badgeCount: stats.casosEnRiesgo,
    },
    {
      title: "Gestión de Estudiantes",
      desc: "Administrar estudiantes activos, turnos, semestres y jornadas",
      href: "/admin/estudiantes",
      icon: GraduationCap,
      color: "purple",
      btnText: "Configurar estudiantes",
    },
    {
      title: "Gestión de Asesores",
      desc: "Registrar docentes, configurar horarios semanales y áreas de especialidad",
      href: "/admin/asesores",
      icon: Users,
      color: "indigo",
      btnText: "Configurar asesores",
    },
    {
      title: "Profesionales de Apoyo",
      desc: "Administrar personal de apoyo para asignaciones y soporte operativo",
      href: "/admin/proapoyo",
      icon: UserPlus,
      color: "emerald",
      btnText: "Administrar apoyo",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              {currentTime}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Centro de Mando Ejecutivo
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Panel de supervisión general, control operativo y gestión del Consultorio Jurídico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/todos-los-casos">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs">
              <FolderOpen className="w-4 h-4 mr-2" />
              Ver Todos los Casos
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <Link key={idx} href={kpi.href}>
            <Card
              className={`h-full border border-slate-200/80 bg-white shadow-xs hover:shadow-md transition-all duration-200 rounded-2xl cursor-pointer ${kpi.borderHover}`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-2">
                  <div className={`p-3 rounded-2xl ${kpi.bgColor}`}>
                    <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
                  </div>
                  {kpi.badge}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {kpi.title}
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">
                    {loading ? (
                      <Spinner className="w-6 h-6 text-slate-400 inline-block" />
                    ) : (
                      kpi.value
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {kpi.subtitle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Alerta Prioritaria de Llamados de Atención */}
      {stats.casosEnRiesgo > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950">
                  Llamados de Atención Activos ({stats.casosEnRiesgo})
                </h2>
                <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                  Prioridad Alta
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed">
                Existen casos con términos vencidos o inactividad prolongada por parte de estudiantes o asesores que requieren intervención de la coordinación.
              </p>
            </div>
          </div>
          <Link href="/admin/llamados" className="shrink-0 w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs">
              Gestionar Llamados
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}

      {/* Operaciones Frecuentes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Operaciones Frecuentes
          </h2>
          <span className="text-xs text-slate-500">
            Accesos directos de control administrativo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, i) => {
            const colorAccents: Record<string, string> = {
              blue: "hover:border-blue-300 hover:shadow-blue-50/50 group-hover:text-blue-600",
              amber: "hover:border-amber-300 hover:shadow-amber-50/50 group-hover:text-amber-600",
              purple: "hover:border-purple-300 hover:shadow-purple-50/50 group-hover:text-purple-600",
              indigo: "hover:border-indigo-300 hover:shadow-indigo-50/50 group-hover:text-indigo-600",
              emerald: "hover:border-emerald-300 hover:shadow-emerald-50/50 group-hover:text-emerald-600",
            };

            const bgIconAccents: Record<string, string> = {
              blue: "bg-blue-50 text-blue-600",
              amber: "bg-amber-50 text-amber-600",
              purple: "bg-purple-50 text-purple-600",
              indigo: "bg-indigo-50 text-indigo-600",
              emerald: "bg-emerald-50 text-emerald-600",
            };

            return (
              <Card
                key={i}
                onClick={() => router.push(action.href)}
                className={`group cursor-pointer border border-slate-200/80 bg-white shadow-xs transition-all duration-200 rounded-2xl ${colorAccents[action.color]}`}
              >
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${bgIconAccents[action.color]}`}
                    >
                      <action.icon className="w-6 h-6" />
                    </div>
                    {action.badgeCount && action.badgeCount > 0 ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold text-xs">
                        {action.badgeCount} pendientes
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900 mt-3 group-hover:text-blue-700 transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 leading-relaxed mt-1">
                    {action.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                    <span>{action.btnText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Llamados de Atención Pendientes Recientes */}
      {llamadosPendientes.length > 0 && (
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Casos que Requieren Seguimiento Inmediato
                </h2>
                <p className="text-xs text-slate-500">
                  Llamados de atención recientes no resueltos
                </p>
              </div>
            </div>
            <Link
              href="/admin/llamados"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Ver todos agrupados por docente ({stats.casosEnRiesgo}) →
            </Link>
          </div>

          <Card className="border border-slate-200 shadow-xs rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-100">
              {llamadosPendientes.map((ll) => (
                <div
                  key={ll.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        ll.tipo === "estudiante"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {ll.tipo === "estudiante" ? (
                        <GraduationCap className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/admin/todos-los-casos/${ll.id_caso}`}
                          className="font-bold text-sm text-slate-800 hover:text-blue-600 truncate"
                        >
                          Caso #{ll.id_caso} —{" "}
                          {ll.perfil?.nombre_completo || "Sin nombre"}
                        </Link>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold h-4 px-1.5 ${
                            ll.tipo === "estudiante"
                              ? "text-blue-700 bg-blue-50 border-blue-200"
                              : "text-purple-700 bg-purple-50 border-purple-200"
                          }`}
                        >
                          {ll.tipo === "estudiante" ? "Estudiante" : "Asesor"}
                        </Badge>
                        {ll.caso?.usuarios?.nombre_completo && (
                          <span className="text-xs text-slate-400">
                            (Solicitante: {ll.caso.usuarios.nombre_completo})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {ll.motivo}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(ll.fecha_creacion).toLocaleDateString(
                          "es-CO",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/todos-los-casos/${ll.id_caso}`}
                    className="shrink-0"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-slate-700 hover:text-blue-600 h-8 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      Ver caso
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
