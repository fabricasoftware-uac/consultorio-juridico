/**
 * Utilidades de búsqueda flexible para todos los paneles del sistema.
 * Soporta:
 * - Búsqueda de palabras en cualquier orden (ej: "Pérez Juan" encuentra "Juan Carlos Pérez")
 * - Tolerancia total a tildes/acentos y mayúsculas/minúsculas (ej: "Gomez" encuentra "Gómez")
 * - Tolerancia a errores tipográficos leves (Levenshtein) para nombres y textos
 * - Coincidencia estricta de subcadena para números (cédula, ID de caso)
 * - Búsqueda multi-campo simultánea
 */

/**
 * Normaliza un texto removiendo tildes, diacríticos y convirtiendo a minúsculas.
 */
export function normalizeText(text: string | number | null | undefined): string {
  if (text == null) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Calcula la distancia de Levenshtein entre dos cadenas normalizadas.
 * Optimizado para memoria y con salida rápida si la diferencia de longitud supera el límite.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Optimización: usar solo dos filas en lugar de matriz completa
  let prevRow = Array.from({ length: b.length + 1 }, (_, i) => i);
  let currRow = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    currRow[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1,      // Eliminación
        currRow[j - 1] + 1,  // Inserción
        prevRow[j - 1] + cost // Sustitución
      );
    }
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[b.length];
}

/**
 * Comprueba si una consulta coincide con uno o más campos objetivo.
 *
 * @param query Cadena de búsqueda ingresada por el usuario
 * @param targets Campos del registro a evaluar (nombres, cédula, correo, área, etc.)
 * @returns boolean `true` si todos los términos de la consulta coinciden en los objetivos
 */
export function matchesSearch(
  query: string | null | undefined,
  ...targets: (string | number | null | undefined)[]
): boolean {
  if (!query) return true;
  const trimmedQuery = query.trim();
  if (trimmedQuery === "") return true;

  const normalizedQuery = normalizeText(trimmedQuery);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return true;

  const validTargets = targets.filter((t) => t != null && t !== "");
  if (validTargets.length === 0) return false;

  const combinedNormalized = validTargets
    .map((t) => normalizeText(t))
    .join(" ");
  const targetWords = combinedNormalized.split(/\s+/).filter(Boolean);

  return queryTokens.every((token) => {
    // 1. Coincidencia directa como subcadena en todo el texto concatenado
    if (combinedNormalized.includes(token)) {
      return true;
    }

    // 2. Si el token es solo dígitos (cédula, ID), exigir coincidencia exacta de subcadena
    if (/^\d+$/.test(token)) {
      return false;
    }

    // 3. Si el token es corto (<= 3 letras), buscar si alguna palabra empieza por el token
    if (token.length <= 3) {
      return targetWords.some((word) => word.startsWith(token));
    }

    // 4. Tolerancia difusa (Levenshtein) para palabras con errores tipográficos leves:
    // - Longitud 4 a 6: distancia máx 1 (ej: "camlo" -> "camilo", "gonsales" -> "gonzalez")
    // - Longitud >= 7: distancia máx 2 (ej: "rodriges" -> "rodriguez")
    const maxDistance = token.length >= 7 ? 2 : 1;

    return targetWords.some((word) => {
      // Si la palabra contiene el token como prefijo o subcadena
      if (word.includes(token) || token.includes(word)) return true;

      // Filtrar por longitud para no calcular Levenshtein innecesariamente
      if (Math.abs(word.length - token.length) > maxDistance) return false;

      return levenshteinDistance(token, word) <= maxDistance;
    });
  });
}
