import { supabase } from "@/lib/supabase/supabase-client";
import { matchesSearch } from "@/lib/search";

export type TipoLlamado = "estudiante" | "asesor";

export interface PerfilInfractor {
  id: string;
  nombre_completo: string | null;
  correo: string | null;
  cedula: string | null;
  telefono: string | null;
}

export interface ClienteCaso {
  nombre_completo: string | null;
  cedula: string | null;
}

export interface CasoLlamado {
  id_caso: number;
  area: string;
  estado: string;
  fecha_creacion: string;
  usuarios: ClienteCaso | null;
}

export interface LlamadoAtencionAdmin {
  id: number;
  id_caso: number;
  id_usuario: string;
  tipo: TipoLlamado;
  motivo: string;
  fecha_creacion: string;
  leido: boolean;
  resuelto: boolean;
  fecha_resolucion: string | null;
  resuelto_por: string | null;
  motivo_resolucion: string | null;
  perfil: PerfilInfractor | null;
  caso: CasoLlamado | null;
}

export interface GroupedInfractor {
  id_usuario: string;
  nombre: string;
  cedula: string | null;
  correo: string | null;
  telefono: string | null;
  tipo: TipoLlamado;
  areas: string[];
  totalPendientes: number;
  totalResueltos: number;
  totalCasosAfectados: number;
  llamados: LlamadoAtencionAdmin[];
}

export interface GetLlamadosAdminFilters {
  resuelto?: boolean;
  tipo?: TipoLlamado;
  idCaso?: number;
}

export const LLAMADOS_ADMIN_SELECT = `
  id,
  id_caso,
  id_usuario,
  tipo,
  motivo,
  fecha_creacion,
  leido,
  resuelto,
  fecha_resolucion,
  resuelto_por,
  motivo_resolucion,
  perfil:perfiles (
    id,
    nombre_completo,
    correo,
    cedula,
    telefono
  ),
  caso:casos (
    id_caso,
    area,
    estado,
    fecha_creacion,
    usuarios (
      nombre_completo,
      cedula
    )
  )
`;

export function mapLlamadoAdmin(item: any): LlamadoAtencionAdmin {
  const rawPerfil = Array.isArray(item.perfil) ? item.perfil[0] : item.perfil;
  const rawCaso = Array.isArray(item.caso) ? item.caso[0] : item.caso;
  const rawUsuarios = rawCaso?.usuarios
    ? Array.isArray(rawCaso.usuarios)
      ? rawCaso.usuarios[0]
      : rawCaso.usuarios
    : null;

  return {
    id: item.id,
    id_caso: item.id_caso,
    id_usuario: item.id_usuario,
    tipo: item.tipo,
    motivo: item.motivo,
    fecha_creacion: item.fecha_creacion,
    leido: Boolean(item.leido),
    resuelto: Boolean(item.resuelto),
    fecha_resolucion: item.fecha_resolucion ?? null,
    resuelto_por: item.resuelto_por ?? null,
    motivo_resolucion: item.motivo_resolucion ?? null,
    perfil: rawPerfil
      ? {
          id: rawPerfil.id,
          nombre_completo: rawPerfil.nombre_completo ?? null,
          correo: rawPerfil.correo ?? null,
          cedula: rawPerfil.cedula ?? null,
          telefono: rawPerfil.telefono ?? null,
        }
      : null,
    caso: rawCaso
      ? {
          id_caso: rawCaso.id_caso,
          area: rawCaso.area,
          estado: rawCaso.estado,
          fecha_creacion: rawCaso.fecha_creacion,
          usuarios: rawUsuarios
            ? {
                nombre_completo: rawUsuarios.nombre_completo ?? null,
                cedula: rawUsuarios.cedula ?? null,
              }
            : null,
        }
      : null,
  };
}

/**
 * Consulta los llamados de atención para la vista administrativa, embebiendo la información
 * del usuario infractor (perfiles) y la información del caso y su cliente (casos + usuarios).
 */
export async function getLlamadosAdmin(
  filters?: GetLlamadosAdminFilters,
): Promise<LlamadoAtencionAdmin[]> {
  let query = supabase
    .from("llamados_atencion")
    .select(LLAMADOS_ADMIN_SELECT)
    .order("fecha_creacion", { ascending: false });

  if (filters?.resuelto !== undefined) {
    query = query.eq("resuelto", filters.resuelto);
  }

  if (filters?.tipo !== undefined) {
    query = query.eq("tipo", filters.tipo);
  }

  if (filters?.idCaso !== undefined) {
    query = query.eq("id_caso", filters.idCaso);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener llamados de atención (admin):", error);
    return [];
  }

  if (!data) return [];

  return data.map(mapLlamadoAdmin);
}

/**
 * Resuelve un llamado de atención registrando el usuario resolutor (auth.uid()),
 * la fecha actual y opcionalmente el motivo o justificación de resolución.
 */
export async function resolverLlamadoAdmin(
  idLlamado: number,
  motivoResolucion?: string,
): Promise<{ success: boolean; data?: LlamadoAtencionAdmin }> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const errorMsg = authError?.message || "Usuario no autenticado";
    console.error("Error de autenticación al resolver llamado:", errorMsg);
    throw new Error(errorMsg);
  }

  const { data, error } = await supabase
    .from("llamados_atencion")
    .update({
      resuelto: true,
      fecha_resolucion: new Date().toISOString(),
      resuelto_por: user.id,
      motivo_resolucion: motivoResolucion?.trim() || null,
    })
    .eq("id", idLlamado)
    .select(LLAMADOS_ADMIN_SELECT)
    .single();

  if (error) {
    console.error(`Error al resolver el llamado ${idLlamado}:`, error);
    throw new Error(error.message);
  }

  return {
    success: true,
    data: mapLlamadoAdmin(data),
  };
}

/**
 * Agrupa una lista de llamados por usuario infractor según el tipo (asesor o estudiante).
 * Calcula métricas agregadas (total pendientes, total resueltos, casos únicos afectados, áreas)
 * y ordena los grupos por cantidad de pendientes descendente, desempatando por nombre.
 */
export function groupLlamadosByTipo(
  llamados: LlamadoAtencionAdmin[],
  tipo: TipoLlamado,
): GroupedInfractor[] {
  const filtered = llamados.filter((l) => l.tipo === tipo);
  const map = new Map<string, GroupedInfractor>();

  for (const item of filtered) {
    const key = item.id_usuario;
    if (!map.has(key)) {
      map.set(key, {
        id_usuario: key,
        nombre: item.perfil?.nombre_completo || "Sin nombre registrado",
        cedula: item.perfil?.cedula ?? null,
        correo: item.perfil?.correo ?? null,
        telefono: item.perfil?.telefono ?? null,
        tipo,
        areas: [],
        totalPendientes: 0,
        totalResueltos: 0,
        totalCasosAfectados: 0,
        llamados: [],
      });
    }

    const group = map.get(key)!;
    group.llamados.push(item);
    if (item.resuelto) {
      group.totalResueltos++;
    } else {
      group.totalPendientes++;
    }
    if (item.caso?.area && !group.areas.includes(item.caso.area)) {
      group.areas.push(item.caso.area);
    }
  }

  const result = Array.from(map.values()).map((g) => ({
    ...g,
    totalCasosAfectados: new Set(g.llamados.map((l) => l.id_caso)).size,
    llamados: [...g.llamados].sort((a, b) => {
      if (a.resuelto !== b.resuelto) return a.resuelto ? 1 : -1;
      return (
        new Date(b.fecha_creacion).getTime() -
        new Date(a.fecha_creacion).getTime()
      );
    }),
  }));

  // Sort by pending descending, then name ascending
  return result.sort((a, b) => {
    if (b.totalPendientes !== a.totalPendientes) {
      return b.totalPendientes - a.totalPendientes;
    }
    return a.nombre.localeCompare(b.nombre);
  });
}

export interface FilterLlamadosOptions {
  searchQuery?: string | null;
  roleFilter?: string | null;
  statusFilter?: string | null;
}

/**
 * Filtra los llamados de atención para la tabla general aplicando filtros
 * por rol ('todos' | 'asesor' | 'estudiante'), estado ('todos' | 'pendientes' | 'resueltos')
 * y búsqueda con matchesSearch (nombre docente/estudiante, cédula, cliente solicitante, ID caso, motivo).
 */
export function filterLlamadosGenerales(
  llamados: LlamadoAtencionAdmin[],
  filters: FilterLlamadosOptions = {},
): LlamadoAtencionAdmin[] {
  const { searchQuery = "", roleFilter = "todos", statusFilter = "todos" } = filters;
  const q = searchQuery?.trim() || "";

  return llamados.filter((l) => {
    // Role filter
    if (roleFilter && roleFilter !== "todos" && l.tipo !== roleFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === "pendientes" && l.resuelto) return false;
    if (statusFilter === "resueltos" && !l.resuelto) return false;

    // Search query
    if (!q) return true;

    return matchesSearch(
      q,
      l.perfil?.nombre_completo,
      l.perfil?.cedula,
      l.perfil?.correo,
      l.caso?.usuarios?.nombre_completo,
      l.caso?.usuarios?.cedula,
      l.id_caso,
      l.motivo,
      l.motivo_resolucion,
    );
  });
}

/**
 * Aplica la resolución de un llamado en el estado local o como modelo de datos,
 * registrando el usuario resolutor, timestamp y normalizando el motivo de justificación.
 */
export function aplicarResolucionLlamado(
  llamado: LlamadoAtencionAdmin,
  resueltoPor: string,
  motivoResolucion?: string | null,
  fechaResolucion: string = new Date().toISOString(),
): LlamadoAtencionAdmin {
  return {
    ...llamado,
    resuelto: true,
    fecha_resolucion: fechaResolucion,
    resuelto_por: resueltoPor,
    motivo_resolucion: motivoResolucion?.trim() ? motivoResolucion.trim() : null,
  };
}
