// Mapas de RBAC compartidos entre el middleware y el callback de OAuth.
// Vivían duplicados en src/lib/supabase/middleware.ts.

export const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/asesor": ["asesor"],
  "/estudiante": ["estudiante"],
  "/pro-apoyo": ["pro_apoyo"],
};

export const ROLE_HOME: Record<string, string> = {
  admin: "/admin/inicio",
  asesor: "/asesor/inicio",
  estudiante: "/estudiante/inicio",
  pro_apoyo: "/pro-apoyo/inicio",
};

/**
 * Único dominio con el que se puede ingresar por Google. La validación real
 * ocurre en el servidor (callback y server action); el parámetro `hd` que se
 * envía a Google es solo una pista de UX y no se puede confiar en él.
 */
export const DOMINIO_INSTITUCIONAL = "@uniautonoma.edu.co";

export function esCorreoInstitucional(correo: string | null | undefined): boolean {
  return !!correo && correo.trim().toLowerCase().endsWith(DOMINIO_INSTITUCIONAL);
}
