"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/supabase-client";
import { Download, Users, User, Briefcase, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    men: 0,
    women: 0,
    totalCases: 0,
    activeCases: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from("usuarios")
          .select("id_usuario, sexo");

        if (usersError) throw usersError;

        const totalUsers = usersData?.length || 0;
        const men =
          usersData?.filter((u) => u.sexo === "M" || u.sexo === "m").length ||
          0;
        const women =
          usersData?.filter((u) => u.sexo === "F" || u.sexo === "f").length ||
          0;

        // Fetch cases
        const { data: casesData, error: casesError } = await supabase
          .from("casos")
          .select("id_caso, estado");

        if (casesError) throw casesError;

        const totalCases = casesData?.length || 0;
        const activeCases =
          casesData?.filter(
            (c) =>
              c.estado === "en_proceso" || c.estado === "pendiente_aprobacion",
          ).length || 0;

        setMetrics({ totalUsers, men, women, totalCases, activeCases });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  const exportData = async () => {
    try {
      // Simple export: fetch all users and cases
      const { data: usersData } = await supabase.from("usuarios").select("*");
      const { data: casesData } = await supabase
        .from("casos")
        .select("*, usuarios(nombre_completo, cedula)");

      let csvContent = "";

      // Users CSV
      csvContent += "=== USUARIOS ===\n";
      if (usersData && usersData.length > 0) {
        const userHeaders = Object.keys(usersData[0]).join(",");
        csvContent += userHeaders + "\n";
        usersData.forEach((user) => {
          const row = Object.values(user)
            .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
            .join(",");
          csvContent += row + "\n";
        });
      }
      console.log(usersData);
      console.log(csvContent);

      csvContent += "\n=== CASOS ===\n";
      if (casesData && casesData.length > 0) {
        const caseHeaders = [
          "ID Caso",
          "Estado",
          "Area",
          "Fecha Creacion",
          "Cliente",
        ];
        csvContent += caseHeaders.join(",") + "\n";
        casesData.forEach((c) => {
          const row = [
            c.id_caso,
            c.estado,
            c.area,
            c.fecha_creacion,
            c.usuarios?.nombre_completo || "Desconocido",
          ]
            .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
            .join(",");
          csvContent += row + "\n";
        });
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reporte_consultorio_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse h-32 bg-slate-100 rounded-2xl w-full mb-8" />
    );
  }

  return (
    <div className="space-y-4 mb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Métricas Generales</h2>
        <Button
          onClick={exportData}
          variant="outline"
          className="gap-2 bg-white"
        >
          <Download className="w-4 h-4" />
          Exportar Datos
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {metrics.totalUsers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
               Usuarios clasificados por genero
            </CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-2xl font-bold text-slate-800">
              <div>
                <span className="text-sm font-normal text-slate-500 mr-2">
                  Hombres:
                </span>
                {metrics.men}
              </div>
              <div>
                <span className="text-sm font-normal text-slate-500 mr-2">
                  Mujeres:
                </span>
                {metrics.women}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Casos
            </CardTitle>
            <Briefcase className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {metrics.totalCases}
            </div>
            <p className="text-xs text-slate-500 mt-1">Casos registrados</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Casos Activos
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {metrics.activeCases}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              En proceso o pendientes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
