import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/supabase-server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { ROLE_HOME, esCorreoInstitucional } from "@/lib/roles";

/**
 * Callback PKCE del ingreso con Google.
 *
 * Decide a dónde aterriza el usuario:
 *  - dominio no institucional  → se borra el usuario recién creado y vuelve a /
 *  - estudiante sin fila en `estudiantes` → /completar-perfil
 *  - cualquier otro rol → su ROLE_HOME
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const irA = (path: string) => NextResponse.redirect(new URL(path, origin));

  if (!code) {
    return irA("/?error=oauth");
  }

  const supabase = await createClient();

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    console.error("Error al intercambiar el código de OAuth:", exchangeError);
    return irA("/?error=oauth");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return irA("/?error=oauth");
  }

  // El parámetro `hd` que se manda a Google es solo una pista de UX: la
  // validación que cuenta es esta.
  if (!esCorreoInstitucional(user.email)) {
    // Solo se elimina si la cuenta nació de este ingreso con Google. Un usuario
    // preexistente (creado por el admin) nunca debe borrarse por esta vía.
    const esAltaGoogle = user.app_metadata?.provider === "google";
    await supabase.auth.signOut();
    if (esAltaGoogle) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (error) {
        console.error("No se pudo eliminar el usuario de dominio ajeno:", error);
      }
    }
    return irA("/?error=dominio_no_permitido");
  }

  // El trigger handle_new_user asigna el rol dentro de la misma transacción del
  // INSERT en auth.users, así que normalmente el JWT ya viene con user_role.
  const { data: filaRol } = await supabaseAdmin
    .from("perfiles_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  let rol = filaRol?.role as string | undefined;

  // Auto-reparación: una cuenta de Google institucional sin rol es siempre un
  // estudiante. Pasa con usuarios creados antes de que existiera el trigger
  // (que solo dispara en el INSERT, así que reingresar no los arregla) y
  // cubre cualquier diferencia de versión de GoTrue.
  if (!rol && user.app_metadata?.provider === "google") {
    const { error } = await supabaseAdmin
      .from("perfiles_roles")
      .insert({ user_id: user.id, role: "estudiante" });

    if (error) {
      console.error("No se pudo asignar el rol de estudiante:", error);
    } else {
      rol = "estudiante";
      // El token se emitió sin el claim; hay que renovarlo.
      await supabase.auth.refreshSession();
    }
  }

  if (!rol) {
    await supabase.auth.signOut();
    return irA("/?error=sin_rol");
  }

  // El mismo caso deja el perfil sin nombre, porque el trigger viejo solo leía
  // la clave 'nombre_completo' que Google no envía.
  const nombreGoogle =
    (user.user_metadata?.nombre_completo as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined);

  if (nombreGoogle) {
    const { data: perfil } = await supabaseAdmin
      .from("perfiles")
      .select("nombre_completo")
      .eq("id", user.id)
      .maybeSingle();

    if (perfil && !perfil.nombre_completo) {
      await supabaseAdmin
        .from("perfiles")
        .update({ nombre_completo: nombreGoogle })
        .eq("id", user.id);
    }
  }

  // Defensivo: si el claim no alcanzó a incluir el rol, se fuerza un token nuevo
  // para que el middleware no rebote al usuario en la siguiente navegación.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session && !decodificarRol(session.access_token)) {
    await supabase.auth.refreshSession();
  }

  if (rol === "estudiante") {
    const { data: estudiante } = await supabaseAdmin
      .from("estudiantes")
      .select("id_perfil")
      .eq("id_perfil", user.id)
      .maybeSingle();

    return irA(estudiante ? ROLE_HOME.estudiante : "/completar-perfil");
  }

  return irA(ROLE_HOME[rol] ?? "/");
}

function decodificarRol(token: string): string | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).user_role ?? null;
  } catch {
    return null;
  }
}
