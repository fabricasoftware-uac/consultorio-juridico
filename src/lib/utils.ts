const AREA_LABELS: Record<string, string> = {
  no_asignada: "No asignada",
  laboral: "Derecho Laboral",
  civil_familia: "Derecho Civil y familiar",
  penal: "Derecho Penal",
  publica: "Derecho Público",
  otros: "Otros",
};

export function cleanData(data: any) {
  const cleaned = { ...data };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === "") {
      cleaned[key] = null;
    }
  });
  return cleaned;
}

export function formatArea(area: string | null | undefined): string {
  if (!area) return "";
  return AREA_LABELS[area] ?? area.replace(/_/g, " ");
}

export function sumarDiasHabiles(fecha: Date, dias: number): Date {
  const result = new Date(fecha);
  let added = 0;
  while (added < dias) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}
/**
 * `perfiles.nombre_completo` acepta NULL: un usuario que entra por Google antes
 * de que su perfil se complete puede no tener nombre todavía. Usar este helper
 * para mostrarlo evita renderizar vacío y evita reventar al encadenar métodos.
 */
export function nombreMostrado(nombre: string | null | undefined): string {
  return nombre?.trim() || "Sin nombre";
}

/**
 * Compara nombres de día ignorando tildes y mayúsculas. Necesario porque el
 * día actual se calcula como "Miércoles"/"Sábado" pero en `horarios` se
 * almacenan sin tilde ("Miercoles"/"Sabado").
 */
export function mismoDia(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  const norm = (s: string | null | undefined) =>
    (s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  const na = norm(a);
  return na !== "" && na === norm(b);
}

// --- Sincronización de horarios ---
export interface HorarioDiaInfo {
  activo?: boolean;
  turno?: string;
}
export type HorarioSemanaInput = Record<string, HorarioDiaInfo>;

export interface FilaHorario {
  id_perfil: string;
  dia: string;
  turno: string;
}

/**
 * Convierte un objeto HorarioSemana en un arreglo de filas para la tabla public.horarios.
 * Filtra únicamente los días marcados como activos y con un turno definido,
 * capitalizando el nombre del día para mantener consistencia relacional.
 */
export function horarioSemanaAFilas(
  idPerfil: string,
  horario: HorarioSemanaInput | null | undefined,
): FilaHorario[] {
  const filas: FilaHorario[] = [];
  if (!horario || typeof horario !== "object") return filas;

  for (const [dia, info] of Object.entries(horario)) {
    if (info && info.activo && info.turno) {
      const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1);
      filas.push({
        id_perfil: idPerfil,
        dia: diaCapitalizado,
        turno: info.turno,
      });
    }
  }
  return filas;
}

// --- Cambio de estado de casos por Admin ---
export const ESTADOS_VALIDOS_CASO = [
  "en_proceso",
  "pendiente_aprobacion",
  "en_correccion",
  "activo",
  "cerrado",
  "archivado",
] as const;

export type EstadoCaso = (typeof ESTADOS_VALIDOS_CASO)[number];

export interface ValidacionCambioEstadoResult {
  valido: boolean;
  error?: string;
}

/**
 * Valida los parámetros requeridos para el cambio de estado administrativo de un caso.
 * Exige identificador de caso válido, nuevo estado permitido y motivo/justificación obligatoria.
 */
export function validarCambioEstadoAdmin(params: {
  idCaso: number | string | null | undefined;
  nuevoEstado: string | null | undefined;
  motivo: string | null | undefined;
}): ValidacionCambioEstadoResult {
  const numId = Number(params.idCaso);
  if (!params.idCaso || isNaN(numId) || numId <= 0) {
    return { valido: false, error: "Identificador de caso inválido." };
  }

  if (!params.motivo || !params.motivo.trim()) {
    return {
      valido: false,
      error: "Debe ingresar un motivo o justificación para el cambio de estado.",
    };
  }

  if (!ESTADOS_VALIDOS_CASO.includes(params.nuevoEstado as EstadoCaso)) {
    return {
      valido: false,
      error: `El estado "${params.nuevoEstado}" no es válido.`,
    };
  }

  return { valido: true };
}

export interface PlazosCambioEstado {
  fecha_vencimiento_estudiante?: string | null;
  fecha_vencimiento_asesor?: string | null;
  fecha_cierre?: string | null;
}

/**
 * Calcula los plazos y fechas resultantes según la transición de estado del caso:
 * - 'en_correccion': asigna 3 días hábiles al estudiante y limpia vencimiento de asesor.
 * - 'activo': limpia vencimiento de asesor.
 * - 'cerrado' / 'archivado': fija fecha de cierre actual y limpia vencimientos pendientes.
 */
export function calcularPlazosCambioEstado(
  nuevoEstado: EstadoCaso | string,
  fechaBase: Date = new Date(),
): PlazosCambioEstado {
  const plazos: PlazosCambioEstado = {};

  if (nuevoEstado === "en_correccion") {
    plazos.fecha_vencimiento_estudiante = sumarDiasHabiles(fechaBase, 3).toISOString();
    plazos.fecha_vencimiento_asesor = null;
  } else if (nuevoEstado === "activo") {
    plazos.fecha_vencimiento_asesor = null;
  } else if (nuevoEstado === "cerrado" || nuevoEstado === "archivado") {
    plazos.fecha_cierre = fechaBase.toISOString();
    plazos.fecha_vencimiento_estudiante = null;
    plazos.fecha_vencimiento_asesor = null;
  }

  return plazos;
}
