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