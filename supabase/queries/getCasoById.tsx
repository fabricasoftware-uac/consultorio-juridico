import { supabase } from "@/lib/supabase/supabase-client";
import type { Caso } from "../../src/app/types/database";

export async function getCasoById(id_caso: string): Promise<Caso> {
  const { data, error } = await supabase
    .from("casos")
    .select(
      `
      id_caso,
      id_usuario,
      tipo_proceso,
      resumen_hechos,
      observaciones,
      observaciones_estudiante,
      fecha_creacion,
      fecha_cierre,
      fecha_entrega_entrevista,
      fecha_vencimiento_estudiante,
      fecha_vencimiento_asesor,
      estado,
      area,
      clasificacion,
      usuarios (
        id_usuario,
        nombre_completo,
        sexo,
        cedula,
        telefono,
        edad,
        contacto_familiar,
        estado_civil,
        estrato,
        direccion,
        correo,
        tipo_vivienda,
        situacion_laboral,
        otros_ingresos,
        valor_otros_ingresos,
        concepto_otros_ingresos,
        tiene_contrato,
        tiene_representado,
        tipo_documento,
        fecha_expedicion_doc,
        ciudad_expedicion,
        fecha_nacimiento,
        nacionalidad,
        identidad_genero,
        orientacion_sexual,
        escolaridad,
        grupo_etnico,
        barrio,
        zona,
        tenencia_vivienda,
        comuna,
        tiene_sisben,
        personas_cargo,
        rango_salarial,
        servicios_publicos,
        sabe_leer,
        discapacidad,
        condicion_actual,
        enfoque_diverso,
        caracterizacion_lgbtiq
      ),
      estudiantes_casos (
        fecha_asignacion,
        fecha_fin_asignacion,
        estudiante:estudiantes!estudiantes_casos_id_estudiante_fkey (
          id_perfil,
          semestre,
          jornada,
          turno,
          perfil:perfiles!estudiantes_id_perfil_fkey (
            nombre_completo,
            correo,
            telefono,
            cedula
          )
        )
      ):estudiantes_casos(order:fecha_asignacion.asc),
      asesores_casos (
        fecha_asignacion,
        fecha_fin_asignacion,
        asesor:asesores!asesores_casos_id_asesor_fkey (
          id_perfil,
          area,
          turno,
          perfil:perfiles!asesores_id_perfil_fkey (
            nombre_completo,
            correo,
            telefono,
            cedula
          )
        )
      ):asesores_casos(order:fecha_asignacion.asc)
    `,
    )
    .eq("id_caso", id_caso)
    .single(); //devuelve un solo registro, no un array

  if (error) {
    console.error("Error al traer el caso:", error);
    return Promise.reject(error);
  }

  return data as unknown as Caso;
}
