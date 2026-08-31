-- ============================================================================
-- Chequeo previo antes de aplicar a producción las migraciones
--   20260824000000 · 20260825000000 · 20260826000000 · 20260826000001
--
-- SOLO LECTURA: no modifica nada. Ejecutar contra la base de producción y
-- revisar cada bloque antes de hacer `supabase db push`.
--
-- Se ejecuta con:
--   psql "$URL_DE_PRODUCCION" -f scripts/preflight-prod.sql
-- ============================================================================

\echo ''
\echo '=== 1. BLOQUEANTE: casos con MÁS DE UNA asignación vigente ==============='
\echo 'La migración 20260826000001 crea un índice único parcial que exige UNA'
\echo 'sola asignación vigente por caso. Si algo aparece aquí, el push FALLA.'
\echo ''

SELECT 'estudiantes' AS tabla, id_caso, count(*) AS vigentes
FROM public.estudiantes_casos
WHERE fecha_fin_asignacion IS NULL
GROUP BY id_caso HAVING count(*) > 1
UNION ALL
SELECT 'asesores', id_caso, count(*)
FROM public.asesores_casos
WHERE fecha_fin_asignacion IS NULL
GROUP BY id_caso HAVING count(*) > 1
ORDER BY 1, 2;

\echo '--> Vacío = se puede aplicar. Con filas = hay que decidir cuál asignación'
\echo '    conservar en cada caso ANTES de migrar.'

\echo ''
\echo '=== 2. Tamaño de las tablas que se reescriben ============================'
\echo 'Añadir la columna identidad reescribe la tabla y toma un lock exclusivo.'
\echo 'Con unos miles de filas es instantáneo; conviene saber la magnitud.'
\echo ''

SELECT 'estudiantes_casos' AS tabla, count(*) AS filas FROM public.estudiantes_casos
UNION ALL
SELECT 'asesores_casos', count(*) FROM public.asesores_casos;

\echo ''
\echo '=== 3. Impacto de 20260826000000 (estaAsignado) =========================='
\echo 'Personas que PERDERÁN acceso: estuvieron asignadas y se les cerró la'
\echo 'asignación por una reasignación. Es el efecto buscado, pero conviene'
\echo 'saber a cuántas afecta y avisar a la dirección del consultorio.'
\echo ''

SELECT 'estudiantes' AS rol, count(DISTINCT id_estudiante) AS personas, count(*) AS asignaciones_cerradas
FROM public.estudiantes_casos WHERE fecha_fin_asignacion IS NOT NULL
UNION ALL
SELECT 'asesores', count(DISTINCT id_asesor), count(*)
FROM public.asesores_casos WHERE fecha_fin_asignacion IS NOT NULL;

\echo ''
\echo '=== 4. Nadie debe referenciar estas tablas por clave foránea ============='

SELECT conrelid::regclass AS tabla_que_referencia, conname
FROM pg_constraint
WHERE contype = 'f'
  AND confrelid IN ('public.estudiantes_casos'::regclass, 'public.asesores_casos'::regclass);

\echo '--> Vacío = se puede cambiar la llave primaria sin romper nada.'

\echo ''
\echo '=== 5. Vistas que dependan de esas tablas ==============================='

SELECT DISTINCT dn.nspname || '.' || dv.relname AS vista
FROM pg_depend d
JOIN pg_rewrite r ON r.oid = d.objid
JOIN pg_class dv ON dv.oid = r.ev_class
JOIN pg_namespace dn ON dn.oid = dv.relnamespace
JOIN pg_class st ON st.oid = d.refobjid
WHERE st.relname IN ('estudiantes_casos', 'asesores_casos')
  AND dv.relname NOT IN ('estudiantes_casos', 'asesores_casos');

\echo '--> Vacío = ninguna vista se rompe.'

\echo ''
\echo '=== 6. Estado actual del esquema (para comparar después) ================='

SELECT conrelid::regclass AS tabla, conname, pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid IN ('public.estudiantes_casos'::regclass, 'public.asesores_casos'::regclass)
  AND contype = 'p';

SELECT 'casos.documento_verificado ya existe' AS nota
WHERE EXISTS (
  SELECT 1 FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'casos'
    AND column_name = 'documento_verificado'
);

\echo ''
\echo '=== FIN ================================================================='
