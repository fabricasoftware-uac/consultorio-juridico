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

/**
 * Ruta al detalle de un caso según el rol. Cada rol tiene su propio prefijo y
 * segmento, y no se pueden derivar del nombre del rol:
 *   pro_apoyo -> /pro-apoyo/gestionar-caso (guion, y no es "mis-casos")
 *   admin     -> /admin/todos-los-casos
 *
 * Existía la suposición `/${role}/mis-casos/${id}` en PaginaNotificaciones, que
 * producía 404 para admin y pro_apoyo.
 */
const CASO_DETALLE: Record<string, (id: string | number) => string> = {
  admin: (id) => `/admin/todos-los-casos/${id}`,
  asesor: (id) => `/asesor/mis-casos/${id}`,
  estudiante: (id) => `/estudiante/mis-casos/${id}`,
  pro_apoyo: (id) => `/pro-apoyo/gestionar-caso/${id}`,
};

export function rutaDetalleCaso(
  role: string | null | undefined,
  idCaso: string | number | null | undefined,
): string | null {
  if (!role || idCaso == null) return null;
  return CASO_DETALLE[role]?.(idCaso) ?? null;
}
