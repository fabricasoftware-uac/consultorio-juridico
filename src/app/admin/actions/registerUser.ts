"use server";

import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

// ─── Shared types ────────────────────────────────────────────────────────────

type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

// ─── Register Estudiante ─────────────────────────────────────────────────────

export interface RegisterEstudianteInput {
  nombre_completo: string;
  correo: string;
  cedula: string;
  telefono: string;
  semestre: number;
  jornada: "diurna" | "nocturna" | "mixto";
  horarios: { turno: string; dia: string }[];
}

export async function registerEstudiante(
  input: RegisterEstudianteInput,
): Promise<ActionResult> {
  // 1. Create auth user (this triggers handle_new_user → inserts into perfiles)
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: input.correo,
      password: generateTempPassword(),
      email_confirm: true,
      user_metadata: {
        nombre_completo: input.nombre_completo,
        cedula: input.cedula,
        telefono: input.telefono,
        correo: input.correo,
      },
    });

  if (authError || !authData.user) {
    console.error("Error creating auth user:", authError);
    return {
      success: false,
      error: authError?.message ?? "Error al crear el usuario autenticado.",
    };
  }

  const userId = authData.user.id;

  // 2. Assign role
  const { error: roleError } = await supabaseAdmin
    .from("perfiles_roles")
    .insert({ user_id: userId, role: "estudiante" });

  if (roleError) {
    console.error("Error assigning role:", roleError);
    // Rollback: delete the auth user
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { success: false, error: "Error al asignar el rol de estudiante." };
  }

  // 3. Insert into estudiantes table
  const { error: estudianteError } = await supabaseAdmin
    .from("estudiantes")
    .insert({
      id_perfil: userId,
      semestre: input.semestre,
      jornada: input.jornada,
    });

  if (estudianteError) {
    console.error("Error inserting estudiante:", estudianteError);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return {
      success: false,
      error: "Error al registrar los datos del estudiante.",
    };
  }

  // 4. Guardar horarios
  if (input.horarios.length > 0) {
    await supabaseAdmin.from("horarios").insert(
      input.horarios.map((h) => ({ id_perfil: userId, turno: h.turno, dia: h.dia })),
    );
  }

  return {
    success: true,
    message: `Estudiante ${input.nombre_completo} registrado exitosamente.`,
  };
}

// ─── Register Asesor ──────────────────────────────────────────────────────────

export interface RegisterAsesorInput {
  nombre_completo: string;
  correo: string;
  cedula: string;
  telefono: string;
  area: "no_asignada" | "laboral" | "civil_familia" | "penal" | "publica" | "otros";
  horarios: { turno: string; dia: string }[];
}

export async function registerAsesor(
  input: RegisterAsesorInput,
): Promise<ActionResult> {
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: input.correo,
      password: generateTempPassword(),
      email_confirm: true,
      user_metadata: {
        nombre_completo: input.nombre_completo,
        cedula: input.cedula,
        telefono: input.telefono,
        correo: input.correo,
      },
    });

  if (authError || !authData.user) {
    console.error("Error creating auth user:", authError);
    return {
      success: false,
      error: authError?.message ?? "Error al crear el usuario autenticado.",
    };
  }

  const userId = authData.user.id;

  const { error: roleError } = await supabaseAdmin
    .from("perfiles_roles")
    .insert({ user_id: userId, role: "asesor" });

  if (roleError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return { success: false, error: "Error al asignar el rol de asesor." };
  }

  const { error: asesorError } = await supabaseAdmin.from("asesores").insert({
    id_perfil: userId,
    area: input.area,
  });

  if (asesorError) {
    console.error("Error inserting asesor:", asesorError);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return {
      success: false,
      error: "Error al registrar los datos del asesor.",
    };
  }

  // Guardar horarios
  if (input.horarios.length > 0) {
    await supabaseAdmin.from("horarios").insert(
      input.horarios.map((h) => ({ id_perfil: userId, turno: h.turno, dia: h.dia })),
    );
  }

  return {
    success: true,
    message: `Asesor ${input.nombre_completo} registrado exitosamente.`,
  };
}

// ─── Register Profesional de Apoyo ───────────────────────────────────────────

export interface RegisterProApoyoInput {
  nombre_completo: string;
  correo: string;
  cedula: string;
  telefono: string;
}

export async function registerProApoyo(
  input: RegisterProApoyoInput,
): Promise<ActionResult> {
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: input.correo,
      password: generateTempPassword(),
      email_confirm: true,
      user_metadata: {
        nombre_completo: input.nombre_completo,
        cedula: input.cedula,
        telefono: input.telefono,
        correo: input.correo,
      },
    });

  if (authError || !authData.user) {
    console.error("Error creating auth user:", authError);
    return {
      success: false,
      error: authError?.message ?? "Error al crear el usuario autenticado.",
    };
  }

  const userId = authData.user.id;

  const { error: roleError } = await supabaseAdmin
    .from("perfiles_roles")
    .insert({ user_id: userId, role: "pro_apoyo" });

  if (roleError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return {
      success: false,
      error: "Error al asignar el rol de profesional de apoyo.",
    };
  }

  // Profesionales de apoyo only have a perfil — no extra role-specific table
  return {
    success: true,
    message: `Profesional de apoyo ${input.nombre_completo} registrado exitosamente.`,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generates a secure temporary password. The user should reset it via email.
 * Format: Temp + 8 random alphanumeric chars + !
 */
function generateTempPassword(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const random = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return `Temp${random}!`;
}
