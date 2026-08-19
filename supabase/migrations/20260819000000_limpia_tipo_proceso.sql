-- ============================================================================
-- Limpia el marcador "No creado" de tipo_proceso — Agosto 2026
--
-- insertCasoNuevo guardaba el literal 'No creado' cuando el campo venía vacío,
-- así que todo caso nacía con un texto que parecía un dato real: aparecía tal
-- cual en el detalle del caso y en las exportaciones a Excel.
--
-- El campo pasa a llamarse "Pretensión o motivo" en la interfaz y lo llena el
-- asesor al clasificar el caso. Mientras no lo haga, debe estar vacío: la UI ya
-- muestra "No especificado" cuando es NULL.
--
-- Se limpian también las variantes que se han visto escritas a mano.
-- ============================================================================

UPDATE public.casos
SET tipo_proceso = NULL
WHERE tipo_proceso IS NOT NULL
  AND lower(btrim(tipo_proceso)) IN (
    'no creado',
    'no especificado',
    'sin especificar',
    'n/a',
    'na',
    '-',
    ''
  );

COMMENT ON COLUMN public.casos.tipo_proceso IS
  'Pretensión o motivo del caso (ej. "cuota alimentaria", "despido injustificado"). La define el asesor al clasificar. NULL mientras no se haya definido.';
