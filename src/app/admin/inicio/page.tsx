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
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "../components/NavbarAdmin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabase-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type LlamadoPendiente = {
  id: number;
  id_caso: number;
  tipo: string;
  motivo: string;
  fecha_creacion: string;
  usuario: string;
  caso_estado: string;
};

export default function AdminPanelPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [llamadosPendientes, setLlamadosPendientes] = useState<LlamadoPendiente[]>([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("es-CO", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      );
    };
    updateTime();

    fetchLlamados();
  }, []);

  async function fetchLlamados() {
    const { data } = await supabase
      .from("llamados_atencion")
      .select("id, id_caso, tipo, motivo, fecha_creacion, casos!inner(estado, usuarios!inner(nombre_completo))")
      .eq("resuelto", false)
      .order("fecha_creacion", { ascending: false })
      .limit(10);

    if (data) {
      setLlamadosPendientes(
        data.map((l: any) => ({
          id: l.id,
          id_caso: l.id_caso,
          tipo: l.tipo,
          motivo: l.motivo,
          fecha_creacion: l.fecha_creacion,
          usuario: l.casos?.usuarios?.nombre_completo ?? "—",
          caso_estado: l.casos?.estado ?? "—",
        })),
      );
    }
  }

  const actions = [
    {
      title: "Gestionar Casos",
      desc: "Ver, filtrar y modificar todos los casos del consultorio por período y estado",
      href: "/admin/todos-los-casos",
      icon: FolderOpen,
      color: "amber",
      btnText: "Ver todos los casos",
    },
    {
      title: "Gestion de Estudiantes",
      desc: "Añadir o modificar informacion de los estudiantes del consultorio",
      href: "/admin/estudiantes",
      icon: GraduationCap,
      color: "blue",
      btnText: "Configurar Estudiante",
    },
    {
      title: "Gestion de Profesionales de apoyo",
      desc: "Añadir o modificar informacion de los profesionales de apoyo jurídico",
      href: "/admin/proapoyo",
      icon: UserPlus,
      color: "emerald",
      btnText: "Añadir Profesional",
    },
    {
      title: "Gestion de Asesores",
      desc: "Añadir o modificar informacion de los docentes asesores",
      href: "/admin/asesores",
      icon: Users,
      color: "purple",
      btnText: "Asignar Asesor",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-slate-50 to-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Calendar className="w-4 h-4 uppercase" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {currentTime}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Bienvenido, Administrador
            </h1>
            <p className="text-slate-500 mt-1">
              Aquí tienes un resumen de la actividad del consultorio jurídico.
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {actions.map((action, i) => {
            const colorStyles = {
              blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-100",
              emerald: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100",
              purple: "bg-purple-500 hover:bg-purple-600 shadow-purple-100",
              amber: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
            };
            const colorSet = action.color as keyof typeof colorStyles;

            return (
              <div
                key={i}
                onClick={() => router.push(action.href)}
                className="group relative cursor-pointer"
              >
                <div
                  className={`absolute inset-0 ${colorStyles[colorSet]} rounded-3xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                <Card className="relative h-full border border-slate-200/60 bg-white/80 backdrop-blur-xl hover:border-slate-300 transition-all duration-300 overflow-hidden shadow-sm">
                  <div
                    className={`h-1.5 w-full ${colorStyles[colorSet].split(" ")[0]}`}
                  />
                  <CardHeader className="pt-8 px-8">
                    <div
                      className={`aspect-square w-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 mb-4`}
                    >
                      <action.icon className="w-7 h-7 text-slate-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                      {action.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500 leading-relaxed text-base">
                      {action.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 pt-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-4 transition-all duration-300">
                      <span>{action.btnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Llamados de Atención Pendientes */}
        {llamadosPendientes.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Llamados de Atencion Pendientes
              </h2>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                {llamadosPendientes.length}
              </Badge>
            </div>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {llamadosPendientes.map((ll) => (
                  <div key={ll.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${ll.tipo === "estudiante" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
                        {ll.tipo === "estudiante" ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/admin/todos-los-casos/${ll.id_caso}`} className="font-semibold text-slate-800 hover:text-blue-600 truncate">
                            Caso #{ll.id_caso} — {ll.usuario}
                          </Link>
                          <Badge variant="outline" className={`text-[10px] h-4 px-1 ${ll.tipo === "estudiante" ? "text-blue-600 bg-blue-50 border-blue-100" : "text-purple-600 bg-purple-50 border-purple-100"}`}>
                            {ll.tipo === "estudiante" ? "Estudiante" : "Asesor"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{ll.motivo}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(ll.fecha_creacion).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <Link href={`/admin/todos-los-casos/${ll.id_caso}`} className="shrink-0">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-600">
                        <ExternalLink className="w-4 h-4 mr-1" /> Ver caso
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
