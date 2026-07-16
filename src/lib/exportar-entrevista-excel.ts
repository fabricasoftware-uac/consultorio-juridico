import type { Caso, Demandado, ContratoLaboral } from "app/types/database";

export async function exportarEntrevistaExcel(
  caso: Caso,
  demandado: Demandado | null,
  contrato: ContratoLaboral | null,
  idCaso: string,
) {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Entrevista");

  const u = caso.usuarios;

  const data = {
    id_caso: idCaso,
    fecha_creacion: caso.fecha_creacion?.split("T")[0] || "",
    fecha_entrega_entrevista: caso.fecha_entrega_entrevista?.split("T")[0] || "",
    periodo: caso.periodo || "",
    estado: caso.estado || "",
    area: caso.area || "",

    nombre_completo: u.nombre_completo || "",
    cedula: u.cedula || "",
    sexo: u.sexo || "",
    correo: u.correo || "",
    telefono: u.telefono || "",
    direccion: u.direccion || "",
    edad: u.edad ?? "",
    contacto_familiar: u.contacto_familiar || "",
    estado_civil: u.estado_civil || "",
    estrato: u.estrato ?? "",
    tipo_vivienda: u.tipo_vivienda || "",

    tipo_documento: u.tipo_documento || "",
    fecha_expedicion_doc: u.fecha_expedicion_doc || "",
    ciudad_expedicion: u.ciudad_expedicion || "",
    fecha_nacimiento: u.fecha_nacimiento || "",
    nacionalidad: u.nacionalidad || "",

    identidad_genero: u.identidad_genero || "",
    orientacion_sexual: u.orientacion_sexual || "",
    enfoque_diverso: u.enfoque_diverso === true ? "Sí" : u.enfoque_diverso === false ? "No" : "",
    caracterizacion_lgbtiq: u.caracterizacion_lgbtiq || "",

    escolaridad: u.escolaridad || "",
    grupo_etnico: u.grupo_etnico || "",
    barrio: u.barrio || "",
    zona: u.zona || "",
    tenencia_vivienda: u.tenencia_vivienda || "",
    comuna: u.comuna || "",
    tiene_sisben: u.tiene_sisben === true ? "Sí" : u.tiene_sisben === false ? "No" : "",
    personas_cargo: u.personas_cargo ?? "",
    rango_salarial: u.rango_salarial || "",
    servicios_publicos: u.servicios_publicos || "",
    sabe_leer: u.sabe_leer === true ? "Sí" : u.sabe_leer === false ? "No" : "",
    discapacidad: u.discapacidad || "",
    condicion_actual: u.condicion_actual || "",

    tiene_representado: u.tiene_representado === true ? "A nombre propio" : u.tiene_representado === false ? "Representante" : "",

    situacion_laboral: u.situacion_laboral || "",
    otros_ingresos: u.otros_ingresos === true ? "Sí" : u.otros_ingresos === false ? "No" : "",
    valor_otros_ingresos: u.valor_otros_ingresos ?? "",
    concepto_otros_ingresos: u.concepto_otros_ingresos || "",
    tiene_contrato: u.tiene_contrato === true ? "Sí" : u.tiene_contrato === false ? "No" : "",

    sin_demandado: demandado ? "No" : "Sí",
    nombre_demandado: demandado?.nombre_completo || "",
    documento_demandado: demandado?.documento || "",
    celular_demandado: demandado?.celular || "",
    lugar_residencia_demandado: demandado?.lugar_residencia || "",
    correo_demandado: demandado?.correo || "",

    tipo_contrato: contrato?.tipo_contrato || "",
    representante_legal: contrato?.representante_legal || "",
    direccion_empresa: contrato?.direccion_empresa || "",
    correo_patrono: contrato?.correo_patrono || "",
    fecha_inicio: contrato?.fecha_inicio || "",
    fecha_fin: contrato?.fecha_fin || "",
    continua_contrato: contrato?.continua === true ? "Sí" : contrato?.continua === false ? "No" : "",
    salario_inicial: contrato?.salario_inicial ?? "",
    salario_actual: contrato?.salario_actual ?? "",

    resumen_hechos: caso.resumen_hechos || "",
    observaciones_estudiante: caso.observaciones_estudiante || "",
  };

  ws.columns = Object.keys(data).map((k) => ({
    header: k,
    key: k,
    width: 30,
  }));

  ws.addRow(data);

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `entrevista_caso_${idCaso}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
