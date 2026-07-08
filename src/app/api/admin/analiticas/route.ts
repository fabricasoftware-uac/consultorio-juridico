import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET(request: NextRequest) {
  // La pagina /admin/* ya esta protegida por middleware.
  // Si llego aqui, el usuario esta autenticado como admin/pro_apoyo.
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const periodo = new URL(request.url).searchParams.get("periodo") || undefined;

  try {
    const [usuarios, casos, estudiantes, asesores, llamados, demandados, contratos] = await Promise.all([
      supabaseAdmin.from("usuarios").select("*").then(r => r.data ?? []),
      supabaseAdmin.from("casos").select("*, usuarios!inner(*)").then(r => r.data ?? []),
      supabaseAdmin.from("estudiantes").select("*, perfil:perfiles(*)").then(r => r.data ?? []),
      supabaseAdmin.from("asesores").select("*, perfil:perfiles(*)").then(r => r.data ?? []),
      supabaseAdmin.from("llamados_atencion").select("*").then(r => r.data ?? []),
      supabaseAdmin.from("demandados").select("*").then(r => r.data ?? []),
      supabaseAdmin.from("contratos_laborales").select("*").then(r => r.data ?? []),
    ]);

    // Filtrar casos por periodo si se especifica
    const casosFiltrados = periodo ? casos.filter((c: any) => c.periodo === periodo) : casos;
    const casosIds = new Set(casosFiltrados.map((c: any) => c.id_caso));
    const llamadosFiltrados = periodo ? llamados.filter((l: any) => casosIds.has(l.id_caso)) : llamados;
    const demandadosFiltrados = periodo ? demandados.filter((d: any) => casosIds.has(d.id_caso)) : demandados;
    const contratosFiltrados = periodo
      ? contratos.filter((ct: any) => casosIds.has(ct.id_caso || ct.id_usuario && casosFiltrados.some((c: any) => c.id_usuario === ct.id_usuario)))
      : contratos;

    // Agregaciones
    const conteo = (arr: any[], fn: (item: any) => boolean) => arr.filter(fn).length;

    const metricas = {
      totalUsuarios: usuarios.length,
      totalCasos: casosFiltrados.length,
      casosPorEstado: {
        en_proceso: conteo(casosFiltrados, (c) => c.estado === "en_proceso"),
        pendiente_aprobacion: conteo(casosFiltrados, (c) => c.estado === "pendiente_aprobacion"),
        en_correccion: conteo(casosFiltrados, (c) => c.estado === "en_correccion"),
        aprobado: conteo(casosFiltrados, (c) => c.estado === "activo"),
        cerrado: conteo(casosFiltrados, (c) => c.estado === "cerrado"),
        archivado: conteo(casosFiltrados, (c) => c.estado === "archivado"),
      },
      casosPorArea: agruparConteo(casosFiltrados, "area"),
      casosPorPeriodo: agruparConteo(casos, "periodo"),
      casosPorMes: agruparPorMes(casosFiltrados),
      casosPorClasificacion: agruparConteo(casosFiltrados, "clasificacion"),

      // Demográficos
      sexo: agruparConteo(usuarios, "sexo"),
      edadRangos: agruparRangosEdad(usuarios),
      estrato: agruparConteo(usuarios, "estrato"),
      estadoCivil: agruparConteo(usuarios, "estado_civil"),
      tipoVivienda: agruparConteo(usuarios, "tipo_vivienda"),
      situacionLaboral: agruparConteo(usuarios, "situacion_laboral"),

      // Diversidad
      enfoqueDiverso: agruparEnfoque(usuarios),
      caracterizacionLgbtiq: agruparConteo(usuarios.filter((u) => u.enfoque_diverso === true), "caracterizacion_lgbtiq"),

      // Estudiantes
      totalEstudiantes: estudiantes.length,
      cargaEstudiantes: estudiantes.map((e: any) => ({
        nombre: e.perfil?.nombre_completo || "Sin nombre",
        semestre: e.semestre,
        jornada: e.jornada,
        dia: e.dia,
        carga: e.total_casos ?? 0,
      })).sort((a: any, b: any) => b.carga - a.carga),

      // Asesores
      totalAsesores: asesores.length,
      cargaAsesores: asesores.map((a: any) => ({
        nombre: a.perfil?.nombre_completo || "Sin nombre",
        area: a.area,
        turno: a.turno,
        dia: a.dia,
        carga: a.total_casos ?? 0,
      })).sort((a: any, b: any) => b.carga - a.carga),

      // Llamados
      totalLlamados: llamadosFiltrados.length,
      llamadosPorTipo: {
        estudiante: conteo(llamadosFiltrados, (l) => l.tipo === "estudiante"),
        asesor: conteo(llamadosFiltrados, (l) => l.tipo === "asesor"),
      },
      llamadosResueltos: conteo(llamadosFiltrados, (l) => l.resuelto),
      llamadosPendientes: conteo(llamadosFiltrados, (l) => !l.resuelto),

      // Demandados y contratos
      totalDemandados: demandadosFiltrados.length,
      totalContratos: contratosFiltrados.length,
      contratosPorTipo: agruparConteo(contratosFiltrados, "tipo_contrato"),

      // Periodos disponibles
      periodos: [...new Set(casos.map((c: any) => c.periodo).filter(Boolean))].sort().reverse(),
    };

    return NextResponse.json(metricas);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

function agruparConteo(arr: any[], campo: string) {
  const map: Record<string, number> = {};
  arr.forEach((item) => {
    const val = String(item[campo] ?? "Sin dato").replace(/_/g, " ");
    map[val] = (map[val] || 0) + 1;
  });
  return Object.entries(map).map(([k, v]) => ({ label: k, value: v })).sort((a, b) => b.value - a.value);
}

function agruparRangosEdad(usuarios: any[]) {
  const rangos = [
    { label: "18-25", min: 18, max: 25 },
    { label: "26-35", min: 26, max: 35 },
    { label: "36-45", min: 36, max: 45 },
    { label: "46-55", min: 46, max: 55 },
    { label: "56+", min: 56, max: 999 },
  ];
  return rangos.map((r) => ({
    label: r.label,
    value: usuarios.filter((u) => u.edad && u.edad >= r.min && u.edad <= r.max).length,
  }));
}

function agruparEnfoque(usuarios: any[]) {
  return {
    si: usuarios.filter((u) => u.enfoque_diverso === true).length,
    no: usuarios.filter((u) => u.enfoque_diverso === false).length,
    noResponde: usuarios.filter((u) => u.enfoque_diverso === null).length,
  };
}

function agruparPorMes(casos: any[]) {
  const map: Record<string, number> = {};
  casos.forEach((c) => {
    if (!c.fecha_creacion) return;
    const d = new Date(c.fecha_creacion);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map).map(([k, v]) => ({ label: k, value: v })).sort((a, b) => a.label.localeCompare(b.label));
}
