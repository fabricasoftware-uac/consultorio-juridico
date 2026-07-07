import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import ExcelJS from "exceljs";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.replace("Bearer ", "") : null;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.user_role !== "admin" && payload.user_role !== "pro_apoyo") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const periodo = new URL(request.url).searchParams.get("periodo") || undefined;
  const tipo = new URL(request.url).searchParams.get("tipo") || "casos";

  try {
    let filas: any[] = [];
    let columnas: string[] = [];

    switch (tipo) {
      case "usuarios": {
        const { data } = await supabaseAdmin.from("usuarios").select("*");
        filas = data ?? [];
        columnas = ["id_usuario", "nombre_completo", "sexo", "cedula", "edad", "estado_civil", "estrato", "direccion", "telefono", "correo", "tipo_vivienda", "situacion_laboral", "enfoque_diverso", "caracterizacion_lgbtiq"];
        break;
      }
      case "estudiantes": {
        const { data } = await supabaseAdmin.from("estudiantes").select("*, perfil:perfiles(nombre_completo, cedula, correo, telefono)");
        filas = data?.map((e: any) => ({ ...e.perfil, semestre: e.semestre, jornada: e.jornada, dia: e.dia, turno: e.turno, carga: e.total_casos })) ?? [];
        columnas = ["nombre_completo", "cedula", "correo", "telefono", "semestre", "jornada", "dia", "turno", "carga"];
        break;
      }
      case "asesores": {
        const { data } = await supabaseAdmin.from("asesores").select("*, perfil:perfiles(nombre_completo, cedula, correo, telefono)");
        filas = data?.map((a: any) => ({ ...a.perfil, area: a.area, turno: a.turno, dia: a.dia, carga: a.total_casos })) ?? [];
        columnas = ["nombre_completo", "cedula", "correo", "telefono", "area", "turno", "dia", "carga"];
        break;
      }
      case "llamados": {
        let q = supabaseAdmin.from("llamados_atencion").select("*");
        const { data } = await q;
        filas = data ?? [];
        columnas = ["id", "id_caso", "tipo", "motivo", "resuelto", "fecha_creacion", "fecha_resolucion"];
        break;
      }
      default: {
        let q = supabaseAdmin.from("casos").select(`
          id_caso, periodo, area, estado, clasificacion, tipo_proceso, fecha_creacion, fecha_cierre, resumen_hechos, observaciones,
          usuarios(nombre_completo, cedula, telefono, correo, sexo, edad, estrato, estado_civil, situacion_laboral, tipo_vivienda, enfoque_diverso, caracterizacion_lgbtiq),
          estudiantes_casos(fecha_asignacion, estudiante:estudiantes(perfil:perfiles(nombre_completo, cedula))),
          asesores_casos(fecha_asignacion, asesor:asesores(perfil:perfiles(nombre_completo)))
        `);
        if (periodo) q = q.eq("periodo", periodo);
        const { data } = await q;
        filas = data?.map((c: any) => {
          const lastEst = c.estudiantes_casos?.[c.estudiantes_casos.length - 1];
          const lastAsr = c.asesores_casos?.[c.asesores_casos.length - 1];
          return {
            id_caso: c.id_caso,
            periodo: c.periodo,
            area: c.area,
            estado: c.estado,
            clasificacion: c.clasificacion,
            tipo_proceso: c.tipo_proceso,
            fecha_creacion: c.fecha_creacion,
            fecha_cierre: c.fecha_cierre,
            cliente: c.usuarios?.nombre_completo,
            cedula_cliente: c.usuarios?.cedula,
            telefono: c.usuarios?.telefono,
            correo: c.usuarios?.correo,
            sexo: c.usuarios?.sexo,
            edad: c.usuarios?.edad,
            estrato: c.usuarios?.estrato,
            estado_civil: c.usuarios?.estado_civil,
            situacion_laboral: c.usuarios?.situacion_laboral,
            tipo_vivienda: c.usuarios?.tipo_vivienda,
            enfoque_diverso: c.usuarios?.enfoque_diverso,
            caracterizacion_lgbtiq: c.usuarios?.caracterizacion_lgbtiq,
            estudiante: lastEst?.estudiante?.perfil?.nombre_completo || "Sin asignar",
            cedula_estudiante: lastEst?.estudiante?.perfil?.cedula || "",
            asesor: lastAsr?.asesor?.perfil?.nombre_completo || "Sin asignar",
            resumen_hechos: c.resumen_hechos,
            observaciones: c.observaciones,
          };
        }) ?? [];
        columnas = Object.keys(filas[0] || {});
        break;
      }
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(tipo);

    // Columnas con anchos
    ws.columns = columnas.map((c) => ({ header: c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()), key: c, width: 22 }));

    // Estilo del header
    const headerRow = ws.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E40AF" } };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 28;

    // Filas con alternancia de colores
    filas.forEach((f, i) => {
      const row = ws.addRow(f);
      if (i % 2 === 1) {
        row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
      }
      row.font = { size: 10 };
    });



    // Bordes en todas las celdas
    const lastRow = filas.length + 1;
    for (let r = 1; r <= lastRow; r++) {
      for (let c = 1; c <= columnas.length; c++) {
        ws.getCell(r, c).border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
      }
    }

    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${tipo}_${periodo || 'todos'}.xlsx"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
