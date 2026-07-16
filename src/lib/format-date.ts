export const formatDate = (dateString: string) => {
  const dateOnly = dateString.split("T")[0]; // "2026-07-14"
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
