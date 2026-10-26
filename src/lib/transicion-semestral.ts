import type { Caso, Estudiante, EstudianteCaso } from "app/types/database";

/**
 * Obtiene el estudiante activo actualmente asignado al caso.
 */
export function getEstudianteActivoCaso(caso: Caso): Estudiante | null {
  const ec = caso.estudiantes_casos?.find((e: EstudianteCaso) => !e.fecha_fin_asignacion);
  return ec?.estudiante ?? null;
}

export type MotivoReasignacion = "inactivo" | "sin_turnos" | null;

/**
 * Detecta si un caso activo tiene asignado un estudiante que está inactivo
 * (estudianteActivo?.perfil?.activo === false), requiriendo reasignación a otro practicante.
 */
export function verificarCasoRequiereReasignacion(caso: Caso): {
  estudianteActivo: Estudiante | null;
  requiereReasignacion: boolean;
  motivo: MotivoReasignacion;
} {
  // Los casos cerrados o archivados no están activos ni requieren reasignación
  if (caso.estado === "cerrado" || caso.estado === "archivado") {
    return { estudianteActivo: null, requiereReasignacion: false, motivo: null };
  }

  const estudianteActivo = getEstudianteActivoCaso(caso);
  if (!estudianteActivo) {
    return { estudianteActivo: null, requiereReasignacion: false, motivo: null };
  }

  // 1. Perfil inactivo: el practicante fue desvinculado o inactivado (ej: egresado)
  if (estudianteActivo.perfil?.activo === false) {
    return { estudianteActivo, requiereReasignacion: true, motivo: "inactivo" };
  }

  return { estudianteActivo, requiereReasignacion: false, motivo: null };
}

/**
 * Sugiere el siguiente semestre para un estudiante en proceso de transición semestral.
 * Regla:
 * - Si no tiene semestre previo (null, undefined o menor a 1), sugiere 7 por defecto.
 * - Si tiene semestre < 10, sugiere semestre + 1.
 * - Si tiene semestre >= 10, se mantiene con tope en 10.
 */
export function sugerirSiguienteSemestre(semestreActual?: number | null): number {
  if (semestreActual == null || !Number.isInteger(semestreActual) || semestreActual < 1) {
    return 7;
  }
  if (semestreActual < 10) {
    return semestreActual + 1;
  }
  return 10;
}

/**
 * Valida la entrada para la actualización del período académico activo.
 * - Debe ser un string no vacío ni solo espacios.
 * - Formato estándar AAAA-S (ej: 2026-1, 2026-2).
 */
export function validarPeriodoAcademico(periodo: unknown): {
  valido: boolean;
  error?: string;
  periodoNormalizado?: string;
} {
  if (typeof periodo !== "string") {
    return { valido: false, error: "El período académico debe ser una cadena de texto." };
  }

  const limpio = periodo.trim();
  if (!limpio) {
    return { valido: false, error: "El período académico no puede estar vacío." };
  }

  // Formato estándar AAAA-1 o AAAA-2 (ejemplo: 2026-2)
  const regexPeriodo = /^\d{4}-[12]$/;
  if (!regexPeriodo.test(limpio)) {
    return {
      valido: false,
      error: 'El formato del período debe ser "AAAA-1" o "AAAA-2" (ejemplo: 2026-2).',
    };
  }

  return { valido: true, periodoNormalizado: limpio };
}

