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