-- ============================================================================
-- Repite la migración de datos 'aprobado' -> 'activo' — Agosto 2026
--
-- Complemento de 20260820000000. La original (20260427000001) corrió antes de
-- que remote_schema recreara el tipo; en una base reconstruida desde cero el
-- valor 'activo' no existía en ese punto, así que cualquier caso quedó en
-- 'aprobado'.
--
-- Va en archivo separado: Postgres no permite usar un valor de enum en la misma
-- transacción en que se agrega.
--
-- Idempotente: si no hay filas en 'aprobado', no hace nada.
-- ============================================================================

UPDATE public.casos SET estado = 'activo' WHERE estado = 'aprobado';
