"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/supabase-server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { validarPeriodoAcademico } from "@/lib/transicion-semestral";
import type { JornadaEnum } from "../types/database";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface DatosEstudianteTransicion {
  semestre: number | null;
  jornada: JornadaEnum | null;
  telefono: string;
  cedula: string;
  horarios: { dia: string; turno: string }[];
}

export interface VerificacionTransicionResult {
  requiereActualizacion: boolean;
  periodoActivo: string;
  datosEstudiante: DatosEstudianteTransicion | null;
}

export interface ActualizarSemestreInput {
  semestre: number;
  jornada: JornadaEnum;
  telefono: string;
  horarios: { dia: string; turno: string }[];
}

const JORNADAS: JornadaEnum[] = ["diurna", "nocturna", "mixto"];

/**
 * Obtiene el período académico activo configurado en el sistema.
 * Retorna '2026-2' como fallback si la tabla no existe o la clave no está definida.
 */
export async function getPeriodoActivo(): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from("configuracion_sistema")
      .select("valor")
      .eq("clave", "periodo_activo")
      .maybeSingle();

    if (error || !data?.valor) {
      return "2026-2";
    }

    return data.valor;
  } catch (err) {
    console.error("Error al consultar periodo_activo:", err);
    return "2026-2";
  }
}

/**
 * Establece un nuevo período académico activo.
 * Solo ejecutable por usuarios con rol 'admin'.
 */
export async function setPeriodoActivo(nuevoPeriodo: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tu sesión expiró. Vuelve a ingresar." };
  }

  const { data: rolData } = await supabaseAdmin
    .from("perfiles_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (rolData?.role !== "admin") {
    return {
      success: false,
      error: "No tienes permisos de administrador para realizar esta acción.",
    };
  }

  const validacion = validarPeriodoAcademico(nuevoPeriodo);
  if (!validacion.valido || !validacion.periodoNormalizado) {
    return { success: false, error: validacion.error ?? "El período académico no es válido." };
  }
  const periodoLimpio = validacion.periodoNormalizado;

  const { error } = await supabaseAdmin
    .from("configuracion_sistema")
    .upsert(
      {
        clave: "periodo_activo",
        valor: periodoLimpio,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clave" },
    );

  if (error) {
    console.error("Error al guardar periodo_activo:", error);
    return { success: false, error: "No se pudo actualizar el período académico." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin/configuracion");
  revalidatePath("/estudiante");

  return {
    success: true,
    message: `Período académico actualizado exitosamente a ${periodoLimpio}.`,
  };
}

/**
 * Verifica si un estudiante requiere actualizar su semestre y disponibilidad
 * para el período académico vigente.
 */
export async function verificarEstudianteRequiereActualizacion(
  userId: string,
): Promise<VerificacionTransicionResult> {
  const periodoActivo = await getPeriodoActivo();

  if (!userId) {
    return {
      requiereActualizacion: false,
      periodoActivo,
      datosEstudiante: null,
    };
  }

  const [estudianteRes, perfilRes, horariosRes] = await Promise.all([
    supabaseAdmin
      .from("estudiantes")
      .select("semestre, jornada, ultimo_periodo_actualizado")
      .eq("id_perfil", userId)
      .maybeSingle(),
    supabaseAdmin
      .from("perfiles")
      .select("telefono, cedula")
      .eq("id", userId)
      .maybeSingle(),
    supabaseAdmin
      .from("horarios")
      .select("dia, turno")
      .eq("id_perfil", userId),
  ]);

  if (estudianteRes.error || !estudianteRes.data) {
    return {
      requiereActualizacion: false,
      periodoActivo,
      datosEstudiante: null,
    };
  }

  const estudiante = estudianteRes.data;
  const perfil = perfilRes.data;
  const horarios = (horariosRes.data ?? []).map((h) => ({
    dia: String(h.dia),
    turno: String(h.turno),
  }));

  const datosEstudiante: DatosEstudianteTransicion = {
    semestre: estudiante.semestre,
    jornada: (estudiante.jornada as JornadaEnum) ?? null,
    telefono: perfil?.telefono ?? "",
    cedula: perfil?.cedula ?? "",
    horarios,
  };

  const requiereActualizacion =
    !estudiante.ultimo_periodo_actualizado ||
    estudiante.ultimo_periodo_actualizado !== periodoActivo;

  return {
    requiereActualizacion,
    periodoActivo,
    datosEstudiante,
  };
}

/**
 * Actualiza la información académica (semestre, jornada, horarios) y de contacto (teléfono)
 * del estudiante autenticado, marcando el período activo como actualizado.
 */
export async function actualizarSemestreEstudianteAction(
  input: ActualizarSemestreInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tu sesión expiró. Vuelve a ingresar." };
  }

  const { data: rol } = await supabaseAdmin
    .from("perfiles_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (rol?.role !== "estudiante") {
    return {
      success: false,
      error: "Esta acción solo está disponible para estudiantes.",
    };
  }

  const telefono = input.telefono?.trim() ?? "";
  if (!telefono) {
    return { success: false, error: "El teléfono es obligatorio." };
  }
  if (!/^\d{7,15}$/.test(telefono)) {
    return { success: false, error: "El teléfono debe tener entre 7 y 15 dígitos." };
  }

  if (!Number.isInteger(input.semestre) || input.semestre < 1 || input.semestre > 10) {
    return { success: false, error: "El semestre debe ser un número entre 1 y 10." };
  }

  if (!JORNADAS.includes(input.jornada)) {
    return { success: false, error: "Selecciona una jornada válida." };
  }

  const horarios = (input.horarios ?? []).filter((h) => h?.turno && h?.dia);
  if (horarios.length === 0) {
    return { success: false, error: "Agrega al menos un horario (día y turno)." };
  }

  const periodoActivo = await getPeriodoActivo();

  // 1. Actualiza teléfono en perfiles
  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .update({ telefono })
    .eq("id", user.id);

  if (perfilError) {
    console.error("Error al actualizar teléfono en el perfil:", perfilError);
    return { success: false, error: "No se pudieron guardar tus datos de contacto." };
  }

  // 2. Actualiza semestre, jornada y ultimo_periodo_actualizado en estudiantes
  const { error: estudianteError } = await supabaseAdmin
    .from("estudiantes")
    .update({
      semestre: input.semestre,
      jornada: input.jornada,
      turno: (horarios[0]?.turno as any) ?? null,
      dia: horarios[0]?.dia ?? null,
      ultimo_periodo_actualizado: periodoActivo,
    })
    .eq("id_perfil", user.id);

  if (estudianteError) {
    console.error("Error al actualizar datos de estudiante:", estudianteError);
    return { success: false, error: "No se pudieron guardar tus datos académicos." };
  }

  // 3. Sincroniza horarios (elimina existentes e inserta nuevos)
  const { error: deleteHorariosError } = await supabaseAdmin
    .from("horarios")
    .delete()
    .eq("id_perfil", user.id);

  if (deleteHorariosError) {
    console.error("Error al limpiar horarios anteriores:", deleteHorariosError);
    return { success: false, error: "No se pudieron actualizar tus horarios." };
  }

  const { error: insertHorariosError } = await supabaseAdmin
    .from("horarios")
    .insert(
      horarios.map((h) => ({
        id_perfil: user.id,
        turno: h.turno,
        dia: h.dia,
      })),
    );

  if (insertHorariosError) {
    console.error("Error al insertar nuevos horarios:", insertHorariosError);
    return { success: false, error: "No se pudieron guardar tus nuevos horarios." };
  }

  revalidatePath("/estudiante");
  revalidatePath("/admin/estudiantes");

  return {
    success: true,
    message: "Semestre y horarios actualizados exitosamente.",
  };
}
