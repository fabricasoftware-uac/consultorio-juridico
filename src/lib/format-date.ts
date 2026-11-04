export const formatDate = (dateString: string) => {
  const dateOnly = dateString.split("T")[0]; // "2026-07-14"
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formatea una fecha de actividad reciente de forma relativa y amigable
 * (ej: "Hace 2 horas", "Hace 3 días", o fecha con hora si es más antigua).
 */
export const formatRelativeActivity = (dateStr?: string | null): string => {
  if (!dateStr) return "Sin actividad";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) {
    return "Hace un momento";
  }

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) {
    return "Hace un momento";
  }
  if (diffMin < 60) {
    return diffMin === 1 ? "Hace 1 minuto" : `Hace ${diffMin} minutos`;
  }
  if (diffHours < 24) {
    return diffHours === 1 ? "Hace 1 hora" : `Hace ${diffHours} horas`;
  }
  if (diffDays < 7) {
    return diffDays === 1 ? "Hace 1 día" : `Hace ${diffDays} días`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "Hace 1 semana" : `Hace ${weeks} semanas`;
  }

  const isCurrentYear = date.getFullYear() === now.getFullYear();
  return (
    date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      ...(isCurrentYear ? {} : { year: "numeric" }),
    }) +
    ", " +
    date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
  );
};

/**
 * Retorna la fecha y hora completa en español para tooltips/atributos title.
 */
export const formatFullDateTime = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

