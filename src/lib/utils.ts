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
