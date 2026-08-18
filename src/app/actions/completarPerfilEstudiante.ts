"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/supabase-server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { esCorreoInstitucional } from "@/lib/roles";
import type { JornadaEnum } from "../types/database";

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface CompletarPerfilInput {
  cedula: string;
  telefono: string;
  semestre: number;
  jornada: JornadaEnum;
  horarios: { turno: string; dia: string }[];
}

const JORNADAS: JornadaEnum[] = ["diurna", "nocturna", "mixto"];

/**
 * Cierra el registro de un estudiante que entró por Google.
 *
 * El id del usuario NUNCA llega desde el cliente: se toma de la sesión. Las
 * escrituras van con `supabaseAdmin` porque `estudiantes` no tiene política de
 * self-insert y `horarios` restringe el INSERT a admin/pro_apoyo.
 */
export async function completarPerfilEstudiante(
  input: CompletarPerfilInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Tu sesión expiró. Vuelve a ingresar." };
  }

  if (!esCorreoInstitucional(user.email)) {
    return {
      success: false,
      error: "Debes ingresar con tu correo institucional @uniautonoma.edu.co.",
    };
  }

  const cedula = input.cedula?.trim() ?? "";
  const telefono = input.telefono?.trim() ?? "";

  if (!cedula || !telefono) {
    return { success: false, error: "El documento y el teléfono son obligatorios." };
  }
  if (!/^\d+$/.test(cedula)) {
    return { success: false, error: "El número de documento solo puede tener dígitos." };
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

  const { data: rol } = await supabaseAdmin
    .from("perfiles_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (rol?.role !== "estudiante") {
    return { success: false, error: "Este formulario es solo para estudiantes." };
  }

  // Idempotencia: si ya existe la fila, el perfil ya estaba completo.
  const { data: yaExiste } = await supabaseAdmin
    .from("estudiantes")
    .select("id_perfil")
    .eq("id_perfil", user.id)
    .maybeSingle();

  if (yaExiste) {
    return { success: false, error: "Tu perfil ya fue completado." };
  }

  const { error: perfilError } = await supabaseAdmin
    .from("perfiles")
    .update({ cedula, telefono })
    .eq("id", user.id);

  if (perfilError) {
    console.error("Error al actualizar el perfil:", perfilError);
    return { success: false, error: "No se pudieron guardar tus datos personales." };
  }

  const { error: estudianteError } = await supabaseAdmin
    .from("estudiantes")
    .insert({
      id_perfil: user.id,
      semestre: input.semestre,
      jornada: input.jornada,
    });

  if (estudianteError) {
    console.error("Error al insertar el estudiante:", estudianteError);
    return { success: false, error: "No se pudieron guardar tus datos académicos." };
  }

  // Mismo patrón que saveHorarios(): se reemplazan por completo.
  await supabaseAdmin.from("horarios").delete().eq("id_perfil", user.id);
  const { error: horariosError } = await supabaseAdmin.from("horarios").insert(
    horarios.map((h) => ({ id_perfil: user.id, turno: h.turno, dia: h.dia })),
  );

  if (horariosError) {
    console.error("Error al guardar los horarios:", horariosError);
    return { success: false, error: "No se pudieron guardar tus horarios." };
  }

  revalidatePath("/admin/estudiantes");
  return { success: true, message: "Perfil completado. ¡Bienvenido!" };
}
