-- ============================================================================
-- Migración: Mejora del ciclo de vida de los llamados de atención
-- Fecha: 17 de Octubre de 2026
--
-- 1. Agrega la columna motivo_resolucion TEXT a public.llamados_atencion.
-- 2. Agrega la FK llamados_atencion_id_usuario_fkey_perfiles hacia perfiles(id).
-- 3. Trigger para autoresolver llamados de tipo asesor al cambiar el estado del
--    caso a 'activo' o 'en_correccion'.
-- 4. Asegura privilegios GRANT y políticas RLS para admin y pro_apoyo.
-- ============================================================================

-- 1. Columna motivo_resolucion
ALTER TABLE public.llamados_atencion
  ADD COLUMN IF NOT EXISTS motivo_resolucion TEXT;

-- 2. Foreign Key segura hacia public.perfiles(id) con ON DELETE CASCADE
DO $$
BEGIN
  ALTER TABLE public.llamados_atencion
    ADD CONSTRAINT llamados_atencion_id_usuario_fkey_perfiles
    FOREIGN KEY (id_usuario)
    REFERENCES public.perfiles(id)
    ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

-- 3. Función y trigger para auto-resolver llamados de atención del asesor
CREATE OR REPLACE FUNCTION public.trg_autoresolver_llamado_asesor_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.estado IN ('activo', 'en_correccion') AND (OLD.estado IS DISTINCT FROM NEW.estado) THEN
    UPDATE public.llamados_atencion
    SET resuelto = true,
        fecha_resolucion = now()
    WHERE id_caso = NEW.id_caso
      AND tipo = 'asesor'
      AND resuelto = false;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_autoresolver_llamado_asesor ON public.casos;

CREATE TRIGGER trg_autoresolver_llamado_asesor
  AFTER UPDATE ON public.casos
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_autoresolver_llamado_asesor_fn();

-- 4. Privilegios GRANT y políticas de seguridad RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.llamados_atencion TO authenticated;
GRANT ALL ON TABLE public.llamados_atencion TO service_role;

DROP POLICY IF EXISTS llamados_admin_all ON public.llamados_atencion;

CREATE POLICY llamados_admin_all ON public.llamados_atencion
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_role')::public.app_role IN ('admin', 'pro_apoyo')
  );
