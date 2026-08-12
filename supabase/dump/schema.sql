


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_permission" AS ENUM (
    'casos.delete',
    'usuarios.delete',
    'estudiantes.delete',
    'asesores.delete',
    'contratos_laborales.delete',
    'estudiantes_casos.delete',
    'asesores_casos.delete',
    'demandados.delete',
    'perfiles.delete',
    'casos.update',
    'usuarios.update',
    'estudiantes.update',
    'asesores.update',
    'contratos_laborales.update',
    'estudiantes_casos.update',
    'asesores_casos.update',
    'demandados.update',
    'perfiles.update',
    'casos.create',
    'usuarios.create',
    'estudiantes.create',
    'asesores.create',
    'contratos_laborales.create',
    'estudiantes_casos.create',
    'asesores_casos.create',
    'demandados.create',
    'perfiles.insert',
    'casos.read',
    'usuarios.read',
    'estudiantes.read',
    'asesores.read',
    'contratos_laborales.read',
    'estudiantes_casos.read',
    'asesores_casos.read',
    'demandados.read',
    'perfiles.read',
    'casos_asignados.read',
    'casos_asignados.update',
    'perfiles_roles.read'
);


ALTER TYPE "public"."app_permission" OWNER TO "postgres";


CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'pro_apoyo',
    'estudiante',
    'asesor'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."area_enum" AS ENUM (
    'laboral',
    'familia',
    'penal',
    'civil',
    'otros',
    'civil_familia',
    'publica',
    'no_asignada',
    'conciliacion',
    'privado'
);


ALTER TYPE "public"."area_enum" OWNER TO "postgres";


CREATE TYPE "public"."caracterizacion_lgbtiq_enum" AS ENUM (
    'GAY',
    'LESBIANA',
    'BISEXUAL',
    'HOMBRE_TRANS',
    'MUJER_TRANS',
    'NO_BINARIO',
    'OTRA',
    'PREFIERO_NO_RESPONDER'
);


ALTER TYPE "public"."caracterizacion_lgbtiq_enum" OWNER TO "postgres";


CREATE TYPE "public"."clasificacion_enum" AS ENUM (
    'en_tramite',
    'solo_asesoria'
);


ALTER TYPE "public"."clasificacion_enum" OWNER TO "postgres";


CREATE TYPE "public"."estado_civil_enum" AS ENUM (
    'soltero',
    'casado',
    'unión libre',
    'otro',
    'viudo',
    'divorciado'
);


ALTER TYPE "public"."estado_civil_enum" OWNER TO "postgres";


CREATE TYPE "public"."estado_enum" AS ENUM (
    'aprobado',
    'en_proceso',
    'pendiente_aprobacion',
    'cerrado',
    'archivado',
    'requiere_ajustes',
    'en_correccion',
    'activo'
);


ALTER TYPE "public"."estado_enum" OWNER TO "postgres";


CREATE TYPE "public"."jornada_enum" AS ENUM (
    'diurna',
    'nocturna',
    'mixto'
);


ALTER TYPE "public"."jornada_enum" OWNER TO "postgres";


CREATE TYPE "public"."notification_status" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SENT',
    'FAILED'
);


ALTER TYPE "public"."notification_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'ESTUDIANTE_ASIGNADO',
    'ASESOR_ASIGNADO'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."sexo_enum" AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'INTERSEXUAL',
    'PREFIERO_NO_RESPONDER',
    'OTRO'
);


ALTER TYPE "public"."sexo_enum" OWNER TO "postgres";


CREATE TYPE "public"."situacion_laboral_enum" AS ENUM (
    'independiente',
    'dependiente',
    'desempleado',
    'otro'
);


ALTER TYPE "public"."situacion_laboral_enum" OWNER TO "postgres";


CREATE TYPE "public"."tipo_contrato_enum" AS ENUM (
    'escrito',
    'verbal',
    'prestacion_servicios',
    'otro'
);


ALTER TYPE "public"."tipo_contrato_enum" OWNER TO "postgres";


CREATE TYPE "public"."turno_enum" AS ENUM (
    '9-11',
    '2-4',
    '4-6'
);


ALTER TYPE "public"."turno_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;
$$;


ALTER FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."caso_admite_documentos"("p_id_caso" integer) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.casos c
    WHERE c.id_caso = p_id_caso
      AND c.estado NOT IN ('cerrado', 'archivado')
  );
$$;


ALTER FUNCTION "public"."caso_admite_documentos"("p_id_caso" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE
    AS $$
  declare
    claims jsonb;
    user_role public.app_role;
  begin
    -- Fetch the user role in the perfiles_roles table
    select role into user_role from public.perfiles_roles where user_id = (event->>'user_id')::uuid;

    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;


ALTER FUNCTION "public"."custom_access_token_hook"("event" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enqueue_assignment_notification"("p_id_caso" integer, "p_id_usuario" "uuid", "p_tipo" "public"."notification_type", "p_source" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.notificaciones_pendientes
    (id_caso, id_usuario, tipo_notificacion, source)
  VALUES (p_id_caso, p_id_usuario, p_tipo, p_source)
  ON CONFLICT (id_caso, id_usuario, tipo_notificacion)
  DO NOTHING;
END;
$$;


ALTER FUNCTION "public"."enqueue_assignment_notification"("p_id_caso" integer, "p_id_usuario" "uuid", "p_tipo" "public"."notification_type", "p_source" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.estudiantes_casos WHERE id_estudiante = uid AND id_caso = caso_id
    UNION ALL
    SELECT 1 FROM public.asesores_casos WHERE id_asesor = uid AND id_caso = caso_id
  );
END;
$$;


ALTER FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generar_llamados_atencion"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  IF EXTRACT(DOW FROM now()) IN (0, 6) THEN
    RETURN 0;
  END IF;

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ec.id_estudiante, 'estudiante',
    'El estudiante ha excedido el plazo de 3 dias habiles para la entrega del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante IS NOT NULL
    AND c.fecha_vencimiento_estudiante <= now()
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT c.id_caso, ac.id_asesor, 'asesor',
    'El asesor ha excedido el plazo de 2 dias habiles para la aprobacion del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor IS NOT NULL
    AND c.fecha_vencimiento_asesor <= now()
    AND ac.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor' AND la.resuelto = false
    )
  ON CONFLICT (id_caso, tipo) WHERE resuelto = false DO NOTHING;

  RETURN 1;
END;
$$;


ALTER FUNCTION "public"."generar_llamados_atencion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."guardar_entrevista"("p_id_caso" integer, "p_usuario_id" "uuid", "p_caso" "jsonb", "p_usuario" "jsonb", "p_demandado" "jsonb" DEFAULT NULL::"jsonb", "p_contrato" "jsonb" DEFAULT NULL::"jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
    v_id_usuario uuid;
BEGIN
    -- Obtener id_usuario del caso (cliente real, para usuarios/contrato)
    SELECT id_usuario INTO v_id_usuario FROM public.casos WHERE id_caso = p_id_caso;

    -- Asegurar que el estudiante autenticado exista en perfiles para la FK de auditoria_casos
    -- p_usuario_id viene de auth.uid() del estudiante, que SI existe en auth.users
    -- v_id_usuario es gen_random_uuid() del cliente, NO existe en auth.users
    IF NOT EXISTS (SELECT 1 FROM public.perfiles WHERE id = p_usuario_id) THEN
        INSERT INTO public.perfiles (id, activo) VALUES (p_usuario_id, true);
    END IF;

    -- 1. Actualizar caso
    UPDATE public.casos SET
        area = (NULLIF(p_caso->>'area', ''))::public.area_enum,
        resumen_hechos = NULLIF(p_caso->>'resumen_hechos', ''),
        observaciones_estudiante = NULLIF(p_caso->>'observaciones_estudiante', ''),
        estado = 'pendiente_aprobacion',
        fecha_vencimiento_asesor = public.sumar_dias_habiles(now(), 2),
        fecha_entrega_entrevista = now(),
        fecha_vencimiento_estudiante = NULL
    WHERE id_caso = p_id_caso;

    -- 2. Actualizar usuarios (cliente, v_id_usuario) con todo el formulario sociodemografico
    UPDATE public.usuarios SET
        correo = NULLIF(p_usuario->>'correo', ''),
        edad = NULLIF(p_usuario->>'edad', '')::int,
        contacto_familiar = NULLIF(p_usuario->>'contacto_familiar', ''),
        estado_civil = (NULLIF(p_usuario->>'estado_civil', ''))::public.estado_civil_enum,
        estrato = NULLIF(p_usuario->>'estrato', '')::int,
        direccion = NULLIF(p_usuario->>'direccion', ''),
        tipo_vivienda = NULLIF(p_usuario->>'tipo_vivienda', ''),
        tiene_representado = NULLIF(p_usuario->>'tiene_representado', '')::boolean,
        situacion_laboral = (NULLIF(p_usuario->>'situacion_laboral', ''))::public.situacion_laboral_enum,
        otros_ingresos = NULLIF(p_usuario->>'otros_ingresos', '')::boolean,
        valor_otros_ingresos = NULLIF(p_usuario->>'valor_otros_ingresos', '')::numeric,
        concepto_otros_ingresos = NULLIF(p_usuario->>'concepto_otros_ingresos', ''),
        tiene_contrato = NULLIF(p_usuario->>'tiene_contrato', '')::boolean,
        tipo_documento = NULLIF(p_usuario->>'tipo_documento', ''),
        fecha_expedicion_doc = NULLIF(p_usuario->>'fecha_expedicion_doc', '')::date,
        ciudad_expedicion = NULLIF(p_usuario->>'ciudad_expedicion', ''),
        fecha_nacimiento = NULLIF(p_usuario->>'fecha_nacimiento', '')::date,
        nacionalidad = NULLIF(p_usuario->>'nacionalidad', ''),
        identidad_genero = NULLIF(p_usuario->>'identidad_genero', ''),
        orientacion_sexual = NULLIF(p_usuario->>'orientacion_sexual', ''),
        escolaridad = NULLIF(p_usuario->>'escolaridad', ''),
        grupo_etnico = NULLIF(p_usuario->>'grupo_etnico', ''),
        barrio = NULLIF(p_usuario->>'barrio', ''),
        zona = NULLIF(p_usuario->>'zona', ''),
        tenencia_vivienda = NULLIF(p_usuario->>'tenencia_vivienda', ''),
        comuna = NULLIF(p_usuario->>'comuna', ''),
        tiene_sisben = NULLIF(p_usuario->>'tiene_sisben', '')::boolean,
        personas_cargo = NULLIF(p_usuario->>'personas_cargo', '')::int,
        rango_salarial = NULLIF(p_usuario->>'rango_salarial', ''),
        servicios_publicos = NULLIF(p_usuario->>'servicios_publicos', ''),
        sabe_leer = NULLIF(p_usuario->>'sabe_leer', '')::boolean,
        discapacidad = NULLIF(p_usuario->>'discapacidad', ''),
        condicion_actual = NULLIF(p_usuario->>'condicion_actual', ''),
        enfoque_diverso = NULLIF(p_usuario->>'enfoque_diverso', '')::boolean,
        caracterizacion_lgbtiq = (NULLIF(p_usuario->>'caracterizacion_lgbtiq', ''))::public.caracterizacion_lgbtiq_enum
    WHERE id_usuario = v_id_usuario;

    -- 3. Insertar / actualizar demandado
    IF p_demandado IS NOT NULL AND NULLIF(p_demandado->>'nombre_completo', '') IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.demandados WHERE id_caso = p_id_caso) THEN
            UPDATE public.demandados SET
                nombre_completo = p_demandado->>'nombre_completo',
                documento = NULLIF(p_demandado->>'documento', ''),
                celular = NULLIF(p_demandado->>'celular', ''),
                lugar_residencia = NULLIF(p_demandado->>'lugar_residencia', ''),
                correo = NULLIF(p_demandado->>'correo', '')
            WHERE id_caso = p_id_caso;
        ELSE
            INSERT INTO public.demandados (
                id_caso, nombre_completo, documento, celular, lugar_residencia, correo
            ) VALUES (
                p_id_caso,
                p_demandado->>'nombre_completo',
                NULLIF(p_demandado->>'documento', ''),
                NULLIF(p_demandado->>'celular', ''),
                NULLIF(p_demandado->>'lugar_residencia', ''),
                NULLIF(p_demandado->>'correo', '')
            );
        END IF;
    END IF;

    -- 4. Insertar / actualizar contrato laboral (del cliente, v_id_usuario)
    IF p_contrato IS NOT NULL AND NULLIF(p_contrato->>'tipo_contrato', '') IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.contratos_laborales WHERE id_usuario = v_id_usuario) THEN
            UPDATE public.contratos_laborales SET
                tipo_contrato = (NULLIF(p_contrato->>'tipo_contrato', ''))::public.tipo_contrato_enum,
                representante_legal = NULLIF(p_contrato->>'representante_legal', ''),
                direccion_empresa = NULLIF(p_contrato->>'direccion_empresa', ''),
                correo_patrono = NULLIF(p_contrato->>'correo_patrono', ''),
                fecha_inicio = NULLIF(p_contrato->>'fecha_inicio', '')::date,
                fecha_fin = NULLIF(p_contrato->>'fecha_fin', '')::date,
                continua = COALESCE(NULLIF(p_contrato->>'continua', '')::boolean, false),
                salario_inicial = NULLIF(p_contrato->>'salario_inicial', '')::numeric,
                salario_actual = NULLIF(p_contrato->>'salario_actual', '')::numeric
            WHERE id_usuario = v_id_usuario;
        ELSE
            INSERT INTO public.contratos_laborales (
                id_usuario, tipo_contrato, representante_legal, direccion_empresa,
                correo_patrono, fecha_inicio, fecha_fin, continua,
                salario_inicial, salario_actual
            ) VALUES (
                v_id_usuario,
                (NULLIF(p_contrato->>'tipo_contrato', ''))::public.tipo_contrato_enum,
                NULLIF(p_contrato->>'representante_legal', ''),
                NULLIF(p_contrato->>'direccion_empresa', ''),
                NULLIF(p_contrato->>'correo_patrono', ''),
                NULLIF(p_contrato->>'fecha_inicio', '')::date,
                NULLIF(p_contrato->>'fecha_fin', '')::date,
                COALESCE(NULLIF(p_contrato->>'continua', '')::boolean, false),
                NULLIF(p_contrato->>'salario_inicial', '')::numeric,
                NULLIF(p_contrato->>'salario_actual', '')::numeric
            );
        END IF;
    END IF;

    -- 5. Auto-resolver llamados de atencion del estudiante
    UPDATE public.llamados_atencion
    SET resuelto = true,
        fecha_resolucion = now()
    WHERE id_caso = p_id_caso
      AND tipo = 'estudiante'
      AND resuelto = false;

    -- 6. Insert auditoria con id_usuario del estudiante (p_usuario_id, garantiza FK a perfiles)
    INSERT INTO public.auditoria_casos (
        id_caso, id_usuario, accion, descripcion, metadata, created_at
    ) VALUES (
        p_id_caso,
        p_usuario_id,
        'entrevista',
        'El estudiante completó la entrevista y envió el caso para aprobación del asesor.',
        NULL,
        now()
    );
END;
$$;


ALTER FUNCTION "public"."guardar_entrevista"("p_id_caso" integer, "p_usuario_id" "uuid", "p_caso" "jsonb", "p_usuario" "jsonb", "p_demandado" "jsonb", "p_contrato" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.perfiles (id, nombre_completo, correo, cedula, telefono)
  values (new.id, 
  new.raw_user_meta_data ->> 'nombre_completo', 
  new.email, 
  new.raw_user_meta_data ->> 'cedula', 
  new.raw_user_meta_data ->> 'telefono');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notificar_usuarios_caso"("p_id_caso" integer, "p_id_autor" "uuid", "p_tipo" "text", "p_titulo" "text", "p_mensaje" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Notificar a estudiantes asignados
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, p_id_caso, p_tipo, p_titulo, p_mensaje
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = p_id_caso
    AND ec.id_estudiante != p_id_autor
    AND ec.fecha_fin_asignacion IS NULL;

  -- Notificar a asesores asignados
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, p_id_caso, p_tipo, p_titulo, p_mensaje
  FROM public.asesores_casos ac
  WHERE ac.id_caso = p_id_caso
    AND ac.id_asesor != p_id_autor
    AND ac.fecha_fin_asignacion IS NULL;
END;
$$;


ALTER FUNCTION "public"."notificar_usuarios_caso"("p_id_caso" integer, "p_id_autor" "uuid", "p_tipo" "text", "p_titulo" "text", "p_mensaje" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."pop_notificaciones_pendientes"("p_limit" integer DEFAULT 10) RETURNS TABLE("id" bigint, "id_caso" integer, "id_usuario" "uuid", "tipo_notificacion" "public"."notification_type", "source" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  RETURN QUERY
  WITH seleccionadas AS (
    SELECT np.id
    FROM public.notificaciones_pendientes np
    WHERE np.status = 'PENDING'
    ORDER BY np.id
    LIMIT p_limit
    FOR UPDATE OF np SKIP LOCKED
  )
  UPDATE public.notificaciones_pendientes np
  SET status = 'PROCESSING'
  FROM seleccionadas s
  WHERE np.id = s.id
  RETURNING
    np.id,
    np.id_caso,
    np.id_usuario,
    np.tipo_notificacion,
    np.source;
END;
$$;


ALTER FUNCTION "public"."pop_notificaciones_pendientes"("p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  v_rol  public.app_role := (auth.jwt() ->> 'user_role')::public.app_role;
  v_rows INTEGER;
BEGIN
  -- v_rol IS NULL debe rechazarse explicitamente: `NULL NOT IN (...)` evalua a NULL
  -- y un IF sobre NULL no entra, dejando pasar a un llamador sin claim de rol.
  IF v_rol IS NULL OR v_rol NOT IN ('asesor', 'pro_apoyo', 'admin') THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;
  IF v_rol = 'asesor' AND NOT public.estaAsignado(auth.uid(), p_id_caso) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, p_id_caso, 'documentos_faltantes',
    'Faltan documentos',
    'El caso #' || p_id_caso::TEXT || ' no tiene documentos adjuntos. Cargalos desde el detalle del caso.'
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = p_id_caso
    AND ec.fecha_fin_asignacion IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.notificaciones_usuario n
      WHERE n.id_usuario = ec.id_estudiante
        AND n.id_caso    = p_id_caso
        AND n.tipo       = 'documentos_faltantes'
        AND n.created_at > now() - INTERVAL '24 hours'
    );

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows;
END;
$$;


ALTER FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_ultima_modificacion_direct"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Solo actualiza si ultima_modificacion no fue cambiada explícitamente
  -- (por ejemplo, por el trigger de auditoría o por código de la app)
  IF NEW.ultima_modificacion IS NOT DISTINCT FROM OLD.ultima_modificacion THEN
    NEW.ultima_modificacion = NOW();
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_ultima_modificacion_direct"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_ultima_modificacion_from_audit"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE public.casos
  SET ultima_modificacion = NEW.created_at
  WHERE id_caso = NEW.id_caso
    AND (ultima_modificacion IS NULL OR NEW.created_at > ultima_modificacion);
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_ultima_modificacion_from_audit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_ultima_modificacion_on_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.ultima_modificacion IS NULL THEN
        NEW.ultima_modificacion = NOW();
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_ultima_modificacion_on_insert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sumar_dias_habiles"("start_date" timestamp with time zone, "num_days" integer) RETURNS timestamp with time zone
    LANGUAGE "plpgsql" IMMUTABLE
    SET "search_path" TO ''
    AS $$
DECLARE
  current_date_var DATE := start_date::DATE;
  days_added INTEGER := 0;
BEGIN
  WHILE days_added < num_days LOOP
    current_date_var := current_date_var + INTERVAL '1 day';
    IF EXTRACT(DOW FROM current_date_var) NOT IN (0, 6) THEN
      days_added := days_added + 1;
    END IF;
  END LOOP;
  RETURN current_date_var + (start_date::TIME);
END;
$$;


ALTER FUNCTION "public"."sumar_dias_habiles"("start_date" timestamp with time zone, "num_days" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_actividad_notificar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, NEW.id_caso, 'actividad_registrada',
    'Nueva actividad', 'Se registro una nueva actividad en el caso #' || NEW.id_caso::TEXT
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = NEW.id_caso AND ec.id_estudiante != NEW.id_usuario AND ec.fecha_fin_asignacion IS NULL;
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, NEW.id_caso, 'actividad_registrada',
    'Nueva actividad', 'Se registro una nueva actividad en el caso #' || NEW.id_caso::TEXT
  FROM public.asesores_casos ac
  WHERE ac.id_caso = NEW.id_caso AND ac.id_asesor != NEW.id_usuario AND ac.fecha_fin_asignacion IS NULL;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_actividad_notificar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_asesores_casos_notify"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  PERFORM public.enqueue_assignment_notification(
    NEW.id_caso,
    NEW.id_asesor,
    'ASESOR_ASIGNADO',
    'trigger:asesores_casos'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_asesores_casos_notify"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_asignacion_asesor_notificar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Notificacion
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_asesor, NEW.id_caso, 'asignacion_asesor',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  -- Auditoria
  INSERT INTO public.auditoria_casos
    (id_caso, id_usuario, accion, descripcion)
  VALUES (
    NEW.id_caso, NEW.id_asesor, 'asignacion',
    'Asesor asignado al caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_asignacion_asesor_notificar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_asignacion_estudiante_notificar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Notificacion
  INSERT INTO public.notificaciones_usuario
    (id_usuario, id_caso, tipo, titulo, mensaje)
  VALUES (
    NEW.id_estudiante, NEW.id_caso, 'asignacion_estudiante',
    'Caso asignado',
    'Se te ha asignado el caso #' || NEW.id_caso::TEXT
  );
  -- Auditoria
  INSERT INTO public.auditoria_casos
    (id_caso, id_usuario, accion, descripcion)
  VALUES (
    NEW.id_caso, NEW.id_estudiante, 'asignacion',
    'Estudiante asignado al caso #' || NEW.id_caso::TEXT
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_asignacion_estudiante_notificar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_auditoria_notificar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
DECLARE
  v_titulo TEXT;
  v_mensaje TEXT;
BEGIN
  -- Solo procesar eventos relevantes
  IF NEW.accion NOT IN ('entrevista', 'aprobacion', 'correccion', 'observacion') THEN
    RETURN NEW;
  END IF;

  CASE NEW.accion
    WHEN 'entrevista' THEN
      v_titulo := 'Entrevista completada';
      v_mensaje := 'El estudiante completo la entrevista del caso #' || NEW.id_caso::TEXT;
    WHEN 'aprobacion' THEN
      v_titulo := 'Caso aprobado';
      v_mensaje := 'El asesor aprobo el caso #' || NEW.id_caso::TEXT;
    WHEN 'correccion' THEN
      v_titulo := 'Ajustes solicitados';
      v_mensaje := 'El asesor solicito ajustes en el caso #' || NEW.id_caso::TEXT;
    WHEN 'observacion' THEN
      v_titulo := 'Nueva observacion';
      v_mensaje := 'Hay una nueva observacion en el caso #' || NEW.id_caso::TEXT;
  END CASE;

  PERFORM public.notificar_usuarios_caso(
    NEW.id_caso, NEW.id_usuario, NEW.accion, v_titulo, v_mensaje
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_auditoria_notificar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_documento_notificar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  -- Notificar a estudiantes y asesores del caso (excepto quien subio)
  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ec.id_estudiante, NEW.id_caso, 'documento_subido',
    'Documento subido',
    'Se subio un nuevo documento al caso #' || NEW.id_caso::TEXT
  FROM public.estudiantes_casos ec
  WHERE ec.id_caso = NEW.id_caso AND ec.id_estudiante != NEW.id_usuario AND ec.fecha_fin_asignacion IS NULL;

  INSERT INTO public.notificaciones_usuario (id_usuario, id_caso, tipo, titulo, mensaje)
  SELECT ac.id_asesor, NEW.id_caso, 'documento_subido',
    'Documento subido',
    'Se subio un nuevo documento al caso #' || NEW.id_caso::TEXT
  FROM public.asesores_casos ac
  WHERE ac.id_caso = NEW.id_caso AND ac.id_asesor != NEW.id_usuario AND ac.fecha_fin_asignacion IS NULL;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_documento_notificar"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trg_estudiantes_casos_notify"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
BEGIN
  PERFORM public.enqueue_assignment_notification(
    NEW.id_caso,
    NEW.id_estudiante,
    'ESTUDIANTE_ASIGNADO',
    'trigger:estudiantes_casos'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trg_estudiantes_casos_notify"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."actividades_caso" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "titulo" "text" NOT NULL,
    "descripcion" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."actividades_caso" OWNER TO "postgres";


ALTER TABLE "public"."actividades_caso" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."actividades_caso_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."asesores" (
    "id_perfil" "uuid" NOT NULL,
    "turno" "public"."turno_enum",
    "area" "public"."area_enum",
    "dia" "text",
    "horario" "jsonb"
);


ALTER TABLE "public"."asesores" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."asesores_casos" (
    "id_asesor" "uuid" NOT NULL,
    "id_caso" integer NOT NULL,
    "fecha_asignacion" "date",
    "fecha_fin_asignacion" "date"
);


ALTER TABLE "public"."asesores_casos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."auditoria_casos" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "accion" "text" NOT NULL,
    "descripcion" "text" NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."auditoria_casos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."auditoria_casos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."auditoria_casos_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."auditoria_casos_id_seq" OWNED BY "public"."auditoria_casos"."id";



CREATE TABLE IF NOT EXISTS "public"."casos" (
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "resumen_hechos" "text",
    "observaciones" "text",
    "fecha_creacion" "date" DEFAULT CURRENT_DATE NOT NULL,
    "estado" "public"."estado_enum" DEFAULT 'pendiente_aprobacion'::"public"."estado_enum" NOT NULL,
    "fecha_cierre" "date",
    "area" "public"."area_enum" NOT NULL,
    "tipo_proceso" "text",
    "observaciones_estudiante" "text",
    "clasificacion" "public"."clasificacion_enum",
    "fecha_vencimiento_estudiante" timestamp with time zone,
    "fecha_vencimiento_asesor" timestamp with time zone,
    "periodo" "text",
    "fecha_entrega_entrevista" timestamp with time zone,
    "ultima_modificacion" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."casos" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."casos_id_caso_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."casos_id_caso_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."casos_id_caso_seq" OWNED BY "public"."casos"."id_caso";



CREATE TABLE IF NOT EXISTS "public"."contratos_laborales" (
    "id_contrato" integer NOT NULL,
    "id_usuario" "uuid",
    "tipo_contrato" "public"."tipo_contrato_enum",
    "representante_legal" character varying(100),
    "correo_patrono" character varying(100),
    "direccion_empresa" character varying(100),
    "fecha_inicio" "date",
    "fecha_fin" "date",
    "continua" boolean,
    "salario_inicial" numeric(10,2),
    "salario_actual" numeric(10,2)
);


ALTER TABLE "public"."contratos_laborales" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."contratos_laborales_id_contrato_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contratos_laborales_id_contrato_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contratos_laborales_id_contrato_seq" OWNED BY "public"."contratos_laborales"."id_contrato";



CREATE TABLE IF NOT EXISTS "public"."demandados" (
    "id_demandado" integer NOT NULL,
    "id_caso" integer,
    "nombre_completo" character varying(100) NOT NULL,
    "documento" character varying(45),
    "celular" character varying(45),
    "lugar_residencia" character varying(100),
    "correo" character varying(100)
);


ALTER TABLE "public"."demandados" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."demandados_id_demandado_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."demandados_id_demandado_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."demandados_id_demandado_seq" OWNED BY "public"."demandados"."id_demandado";



CREATE TABLE IF NOT EXISTS "public"."documentos_caso" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "storage_path" "text" NOT NULL,
    "nombre_original" "text" NOT NULL,
    "tipo" "text",
    "mime_type" "text",
    "tamano" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone,
    "estado" "text" DEFAULT 'activo'::"text" NOT NULL,
    "estado_doc" "text" DEFAULT 'pendiente'::"text" NOT NULL,
    CONSTRAINT "documentos_caso_estado_check" CHECK (("estado" = ANY (ARRAY['activo'::"text", 'archivado'::"text"]))),
    CONSTRAINT "documentos_caso_estado_doc_check" CHECK (("estado_doc" = ANY (ARRAY['pendiente'::"text", 'aprobado'::"text", 'rechazado'::"text"])))
);


ALTER TABLE "public"."documentos_caso" OWNER TO "postgres";


ALTER TABLE "public"."documentos_caso" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."documentos_caso_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."estudiantes" (
    "id_perfil" "uuid" NOT NULL,
    "semestre" integer,
    "jornada" "public"."jornada_enum",
    "turno" "public"."turno_enum",
    "dia" "text"
);


ALTER TABLE "public"."estudiantes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estudiantes_casos" (
    "id_estudiante" "uuid" NOT NULL,
    "id_caso" integer NOT NULL,
    "fecha_asignacion" "date",
    "fecha_fin_asignacion" "date"
);


ALTER TABLE "public"."estudiantes_casos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."horarios" (
    "id" bigint NOT NULL,
    "id_perfil" "uuid" NOT NULL,
    "turno" "text" NOT NULL,
    "dia" "text" NOT NULL
);


ALTER TABLE "public"."horarios" OWNER TO "postgres";


ALTER TABLE "public"."horarios" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."horarios_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."llamados_atencion" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "motivo" "text" NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "leido" boolean DEFAULT false NOT NULL,
    "resuelto" boolean DEFAULT false NOT NULL,
    "fecha_resolucion" timestamp with time zone,
    "resuelto_por" "uuid",
    CONSTRAINT "llamados_atencion_tipo_check" CHECK (("tipo" = ANY (ARRAY['estudiante'::"text", 'asesor'::"text"])))
);


ALTER TABLE "public"."llamados_atencion" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."llamados_atencion_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."llamados_atencion_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."llamados_atencion_id_seq" OWNED BY "public"."llamados_atencion"."id";



CREATE TABLE IF NOT EXISTS "public"."notificaciones_pendientes" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "tipo_notificacion" "public"."notification_type" NOT NULL,
    "canal" "text" DEFAULT 'email'::"text" NOT NULL,
    "source" "text" NOT NULL,
    "status" "public"."notification_status" DEFAULT 'PENDING'::"public"."notification_status" NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sent_at" timestamp with time zone
);


ALTER TABLE "public"."notificaciones_pendientes" OWNER TO "postgres";


ALTER TABLE "public"."notificaciones_pendientes" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."notificaciones_pendientes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notificaciones_usuario" (
    "id" bigint NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "id_caso" integer,
    "tipo" "text" NOT NULL,
    "titulo" "text" NOT NULL,
    "mensaje" "text" NOT NULL,
    "leida" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "read_at" timestamp with time zone
);


ALTER TABLE "public"."notificaciones_usuario" OWNER TO "postgres";


ALTER TABLE "public"."notificaciones_usuario" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."notificaciones_usuario_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."perfiles" (
    "id" "uuid" NOT NULL,
    "nombre_completo" "text",
    "correo" "text",
    "cedula" "text",
    "telefono" "text",
    "activo" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."perfiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfiles_roles" (
    "id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL
);


ALTER TABLE "public"."perfiles_roles" OWNER TO "postgres";


COMMENT ON TABLE "public"."perfiles_roles" IS 'roles asignados a cada usuario.';



ALTER TABLE "public"."perfiles_roles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."perfiles_roles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


COMMENT ON TABLE "public"."role_permissions" IS 'permisos asignados a cada rol.';



ALTER TABLE "public"."role_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."role_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."usuarios" (
    "id_usuario" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre_completo" character varying(100) NOT NULL,
    "sexo" "public"."sexo_enum",
    "cedula" character varying(45),
    "telefono" character varying(45),
    "edad" integer,
    "contacto_familiar" character varying(100),
    "estado_civil" "public"."estado_civil_enum",
    "estrato" integer,
    "direccion" character varying(100),
    "correo" character varying(100),
    "tipo_vivienda" character varying(50),
    "situacion_laboral" "public"."situacion_laboral_enum",
    "otros_ingresos" boolean,
    "valor_otros_ingresos" numeric(10,2),
    "concepto_otros_ingresos" character varying(100),
    "tiene_contrato" boolean,
    "tiene_representado" boolean,
    "enfoque_diverso" boolean,
    "caracterizacion_lgbtiq" "public"."caracterizacion_lgbtiq_enum",
    "tipo_documento" "text" DEFAULT 'CC'::"text",
    "fecha_expedicion_doc" "date",
    "ciudad_expedicion" "text",
    "fecha_nacimiento" "date",
    "nacionalidad" "text",
    "identidad_genero" "text",
    "orientacion_sexual" "text",
    "escolaridad" "text",
    "grupo_etnico" "text",
    "barrio" "text",
    "zona" "text",
    "tenencia_vivienda" "text",
    "comuna" "text",
    "tiene_sisben" boolean,
    "personas_cargo" integer,
    "rango_salarial" "text",
    "servicios_publicos" "text",
    "sabe_leer" boolean,
    "discapacidad" "text",
    "condicion_actual" "text"
);


ALTER TABLE "public"."usuarios" OWNER TO "postgres";


ALTER TABLE ONLY "public"."auditoria_casos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."auditoria_casos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."casos" ALTER COLUMN "id_caso" SET DEFAULT "nextval"('"public"."casos_id_caso_seq"'::"regclass");



ALTER TABLE ONLY "public"."contratos_laborales" ALTER COLUMN "id_contrato" SET DEFAULT "nextval"('"public"."contratos_laborales_id_contrato_seq"'::"regclass");



ALTER TABLE ONLY "public"."demandados" ALTER COLUMN "id_demandado" SET DEFAULT "nextval"('"public"."demandados_id_demandado_seq"'::"regclass");



ALTER TABLE ONLY "public"."llamados_atencion" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."llamados_atencion_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."actividades_caso"
    ADD CONSTRAINT "actividades_caso_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."asesores_casos"
    ADD CONSTRAINT "asesores_casos_pkey" PRIMARY KEY ("id_asesor", "id_caso");



ALTER TABLE ONLY "public"."asesores"
    ADD CONSTRAINT "asesores_pkey" PRIMARY KEY ("id_perfil");



ALTER TABLE ONLY "public"."auditoria_casos"
    ADD CONSTRAINT "auditoria_casos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."casos"
    ADD CONSTRAINT "casos_pkey" PRIMARY KEY ("id_caso");



ALTER TABLE ONLY "public"."contratos_laborales"
    ADD CONSTRAINT "contratos_laborales_pkey" PRIMARY KEY ("id_contrato");



ALTER TABLE ONLY "public"."demandados"
    ADD CONSTRAINT "demandados_pkey" PRIMARY KEY ("id_demandado");



ALTER TABLE ONLY "public"."documentos_caso"
    ADD CONSTRAINT "documentos_caso_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documentos_caso"
    ADD CONSTRAINT "documentos_caso_storage_path_key" UNIQUE ("storage_path");



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_pkey" PRIMARY KEY ("id_estudiante", "id_caso");



ALTER TABLE ONLY "public"."estudiantes"
    ADD CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_perfil");



ALTER TABLE ONLY "public"."horarios"
    ADD CONSTRAINT "horarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."llamados_atencion"
    ADD CONSTRAINT "llamados_atencion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notificaciones_pendientes"
    ADD CONSTRAINT "notificaciones_pendientes_id_caso_id_usuario_tipo_notificac_key" UNIQUE ("id_caso", "id_usuario", "tipo_notificacion");



ALTER TABLE ONLY "public"."notificaciones_pendientes"
    ADD CONSTRAINT "notificaciones_pendientes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notificaciones_usuario"
    ADD CONSTRAINT "notificaciones_usuario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles_roles"
    ADD CONSTRAINT "perfiles_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfiles_roles"
    ADD CONSTRAINT "perfiles_roles_user_id_role_key" UNIQUE ("user_id", "role");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_permission_key" UNIQUE ("role", "permission");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_cedula_key" UNIQUE ("cedula");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario");



CREATE INDEX "idx_actividades_caso" ON "public"."actividades_caso" USING "btree" ("id_caso", "created_at" DESC);



CREATE INDEX "idx_auditoria_caso" ON "public"."auditoria_casos" USING "btree" ("id_caso", "created_at" DESC);



CREATE INDEX "idx_casos_ultima_modificacion" ON "public"."casos" USING "btree" ("ultima_modificacion" DESC);



CREATE INDEX "idx_casos_vencimiento_asesor" ON "public"."casos" USING "btree" ("fecha_vencimiento_asesor") WHERE ("fecha_vencimiento_asesor" IS NOT NULL);



CREATE INDEX "idx_casos_vencimiento_estudiante" ON "public"."casos" USING "btree" ("fecha_vencimiento_estudiante") WHERE ("fecha_vencimiento_estudiante" IS NOT NULL);



CREATE INDEX "idx_documentos_caso" ON "public"."documentos_caso" USING "btree" ("id_caso", "created_at" DESC);



CREATE INDEX "idx_horarios_perfil" ON "public"."horarios" USING "btree" ("id_perfil");



CREATE INDEX "idx_llamados_id_caso" ON "public"."llamados_atencion" USING "btree" ("id_caso");



CREATE INDEX "idx_llamados_id_usuario" ON "public"."llamados_atencion" USING "btree" ("id_usuario");



CREATE INDEX "idx_notif_usuario_leida" ON "public"."notificaciones_usuario" USING "btree" ("id_usuario", "leida");



CREATE INDEX "idx_notificaciones_pending" ON "public"."notificaciones_pendientes" USING "btree" ("id") WHERE ("status" = 'PENDING'::"public"."notification_status");



CREATE UNIQUE INDEX "llamados_atencion_activo_key" ON "public"."llamados_atencion" USING "btree" ("id_caso", "tipo") WHERE ("resuelto" = false);



CREATE OR REPLACE TRIGGER "trg_actividad_notificar" AFTER INSERT ON "public"."actividades_caso" FOR EACH ROW EXECUTE FUNCTION "public"."trg_actividad_notificar"();



CREATE OR REPLACE TRIGGER "trg_asesores_casos_notify" AFTER INSERT ON "public"."asesores_casos" FOR EACH ROW EXECUTE FUNCTION "public"."trg_asesores_casos_notify"();



CREATE OR REPLACE TRIGGER "trg_asignacion_asesor_notificar" AFTER INSERT ON "public"."asesores_casos" FOR EACH ROW EXECUTE FUNCTION "public"."trg_asignacion_asesor_notificar"();



CREATE OR REPLACE TRIGGER "trg_asignacion_estudiante_notificar" AFTER INSERT ON "public"."estudiantes_casos" FOR EACH ROW EXECUTE FUNCTION "public"."trg_asignacion_estudiante_notificar"();



CREATE OR REPLACE TRIGGER "trg_audit_update_ultima_modificacion" AFTER INSERT ON "public"."auditoria_casos" FOR EACH ROW EXECUTE FUNCTION "public"."set_ultima_modificacion_from_audit"();



CREATE OR REPLACE TRIGGER "trg_auditoria_notificar" AFTER INSERT ON "public"."auditoria_casos" FOR EACH ROW EXECUTE FUNCTION "public"."trg_auditoria_notificar"();



CREATE OR REPLACE TRIGGER "trg_casos_insert_ultima_modificacion" BEFORE INSERT ON "public"."casos" FOR EACH ROW EXECUTE FUNCTION "public"."set_ultima_modificacion_on_insert"();



CREATE OR REPLACE TRIGGER "trg_casos_update_ultima_modificacion" BEFORE UPDATE ON "public"."casos" FOR EACH ROW EXECUTE FUNCTION "public"."set_ultima_modificacion_direct"();



CREATE OR REPLACE TRIGGER "trg_documento_notificar" AFTER INSERT ON "public"."documentos_caso" FOR EACH ROW EXECUTE FUNCTION "public"."trg_documento_notificar"();



CREATE OR REPLACE TRIGGER "trg_estudiantes_casos_notify" AFTER INSERT ON "public"."estudiantes_casos" FOR EACH ROW EXECUTE FUNCTION "public"."trg_estudiantes_casos_notify"();



ALTER TABLE ONLY "public"."actividades_caso"
    ADD CONSTRAINT "actividades_caso_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."asesores_casos"
    ADD CONSTRAINT "asesores_casos_id_asesor_fkey" FOREIGN KEY ("id_asesor") REFERENCES "public"."asesores"("id_perfil");



ALTER TABLE ONLY "public"."asesores_casos"
    ADD CONSTRAINT "asesores_casos_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso");



ALTER TABLE ONLY "public"."asesores"
    ADD CONSTRAINT "asesores_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."auditoria_casos"
    ADD CONSTRAINT "auditoria_casos_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."casos"
    ADD CONSTRAINT "casos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario");



ALTER TABLE ONLY "public"."contratos_laborales"
    ADD CONSTRAINT "contratos_laborales_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id_usuario");



ALTER TABLE ONLY "public"."demandados"
    ADD CONSTRAINT "demandados_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso");



ALTER TABLE ONLY "public"."documentos_caso"
    ADD CONSTRAINT "documentos_caso_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso");



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "public"."estudiantes"("id_perfil");



ALTER TABLE ONLY "public"."estudiantes"
    ADD CONSTRAINT "estudiantes_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."auditoria_casos"
    ADD CONSTRAINT "fk_auditoria_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."horarios"
    ADD CONSTRAINT "horarios_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."llamados_atencion"
    ADD CONSTRAINT "llamados_atencion_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notificaciones_pendientes"
    ADD CONSTRAINT "notificaciones_pendientes_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notificaciones_usuario"
    ADD CONSTRAINT "notificaciones_usuario_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfiles"
    ADD CONSTRAINT "perfiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfiles_roles"
    ADD CONSTRAINT "perfiles_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfiles_roles"
    ADD CONSTRAINT "perfiles_roles_user_id_fkey_perfiles" FOREIGN KEY ("user_id") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



CREATE POLICY "Allow auth admin to read user roles" ON "public"."perfiles_roles" FOR SELECT TO "supabase_auth_admin" USING (true);



CREATE POLICY "Enable users to update their own data only" ON "public"."asesores" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id_perfil"));



CREATE POLICY "Enable users to view their own data only" ON "public"."asesores" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id_perfil"));



CREATE POLICY "Enable users to view their own data only" ON "public"."estudiantes" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id_perfil"));



CREATE POLICY "act_insert" ON "public"."actividades_caso" FOR INSERT WITH CHECK (("public"."estaasignado"("auth"."uid"(), "id_caso") OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))));



CREATE POLICY "act_select" ON "public"."actividades_caso" FOR SELECT USING (("public"."estaasignado"("auth"."uid"(), "id_caso") OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))));



ALTER TABLE "public"."actividades_caso" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow admin to see data" ON "public"."perfiles_roles" FOR SELECT USING ("public"."authorize"('perfiles_roles.read'::"public"."app_permission"));



ALTER TABLE "public"."asesores" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."asesores_casos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "auditoria_admin_all" ON "public"."auditoria_casos" FOR SELECT USING (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "auditoria_asesor_own" ON "public"."auditoria_casos" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'asesor'::"public"."app_role") AND (EXISTS ( SELECT 1
   FROM "public"."asesores_casos"
  WHERE (("asesores_casos"."id_asesor" = "auth"."uid"()) AND ("asesores_casos"."id_caso" = "auditoria_casos"."id_caso"))))));



ALTER TABLE "public"."auditoria_casos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "auditoria_estudiante_own" ON "public"."auditoria_casos" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'estudiante'::"public"."app_role") AND (EXISTS ( SELECT 1
   FROM "public"."estudiantes_casos"
  WHERE (("estudiantes_casos"."id_estudiante" = "auth"."uid"()) AND ("estudiantes_casos"."id_caso" = "auditoria_casos"."id_caso"))))));



CREATE POLICY "auditoria_insert_all" ON "public"."auditoria_casos" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



ALTER TABLE "public"."casos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contratos_laborales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."demandados" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "doc_delete_admin" ON "public"."documentos_caso" FOR DELETE USING (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "doc_insert_assign" ON "public"."documentos_caso" FOR INSERT WITH CHECK ((("public"."estaasignado"("auth"."uid"(), "id_caso") OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))) AND (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" <> 'estudiante'::"public"."app_role") OR "public"."caso_admite_documentos"("id_caso"))));



CREATE POLICY "doc_select" ON "public"."documentos_caso" FOR SELECT USING (("public"."estaasignado"("auth"."uid"(), "id_caso") OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))));



CREATE POLICY "doc_update_assign" ON "public"."documentos_caso" FOR UPDATE USING (("public"."estaasignado"("auth"."uid"(), "id_caso") OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))));



ALTER TABLE "public"."documentos_caso" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estudiantes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estudiantes_casos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."horarios" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "horarios_delete_admin" ON "public"."horarios" FOR DELETE USING (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "horarios_insert_admin" ON "public"."horarios" FOR INSERT WITH CHECK (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "horarios_select_own" ON "public"."horarios" FOR SELECT USING ((("id_perfil" = "auth"."uid"()) OR ((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"]))));



CREATE POLICY "llamados_admin_all" ON "public"."llamados_atencion" USING (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "llamados_asesor_own" ON "public"."llamados_atencion" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'asesor'::"public"."app_role") AND ("id_usuario" = "auth"."uid"())));



ALTER TABLE "public"."llamados_atencion" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "llamados_estudiante_own" ON "public"."llamados_atencion" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'estudiante'::"public"."app_role") AND ("id_usuario" = "auth"."uid"())));



CREATE POLICY "notif_own_select" ON "public"."notificaciones_usuario" FOR SELECT USING (("id_usuario" = "auth"."uid"()));



CREATE POLICY "notif_own_update" ON "public"."notificaciones_usuario" FOR UPDATE USING (("id_usuario" = "auth"."uid"()));



ALTER TABLE "public"."notificaciones_pendientes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notificaciones_usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfiles_roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "permitir actualizar perfil propio" ON "public"."perfiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "permitir actualizar solo casos asignados" ON "public"."casos" FOR UPDATE USING (("public"."authorize"('casos_asignados.update'::"public"."app_permission") AND "public"."estaasignado"("auth"."uid"(), "id_caso")));



CREATE POLICY "permitir actualizar un asesor" ON "public"."asesores" FOR UPDATE USING ("public"."authorize"('asesores.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un asesor_caso" ON "public"."asesores_casos" FOR UPDATE USING ("public"."authorize"('asesores_casos.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un caso" ON "public"."casos" FOR UPDATE USING ("public"."authorize"('casos.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un contrato laboral" ON "public"."contratos_laborales" FOR UPDATE USING ("public"."authorize"('contratos_laborales.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un demandado" ON "public"."demandados" FOR UPDATE USING ("public"."authorize"('demandados.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un estudiante" ON "public"."estudiantes" FOR UPDATE USING ("public"."authorize"('estudiantes.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un estudiante_caso" ON "public"."estudiantes_casos" FOR UPDATE USING ("public"."authorize"('estudiantes_casos.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un perfil" ON "public"."perfiles" FOR UPDATE USING ("public"."authorize"('perfiles.update'::"public"."app_permission"));



CREATE POLICY "permitir actualizar un usuario" ON "public"."usuarios" FOR UPDATE USING ("public"."authorize"('usuarios.update'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un asesor" ON "public"."asesores" FOR DELETE USING ("public"."authorize"('asesores.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un asesor_caso" ON "public"."asesores_casos" FOR DELETE USING ("public"."authorize"('asesores_casos.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un caso" ON "public"."casos" FOR DELETE USING ("public"."authorize"('casos.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un contrato laboral" ON "public"."contratos_laborales" FOR DELETE USING ("public"."authorize"('contratos_laborales.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un demandado" ON "public"."demandados" FOR DELETE USING ("public"."authorize"('demandados.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un estudiante" ON "public"."estudiantes" FOR DELETE USING ("public"."authorize"('estudiantes.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un estudiante_caso" ON "public"."estudiantes_casos" FOR DELETE USING ("public"."authorize"('estudiantes_casos.delete'::"public"."app_permission"));



CREATE POLICY "permitir eliminar un usuario" ON "public"."usuarios" FOR DELETE USING ("public"."authorize"('usuarios.delete'::"public"."app_permission"));



CREATE POLICY "permitir insertar un asesor" ON "public"."asesores" FOR INSERT WITH CHECK ("public"."authorize"('asesores.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un asesor_caso" ON "public"."asesores_casos" FOR INSERT WITH CHECK ("public"."authorize"('asesores_casos.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un caso" ON "public"."casos" FOR INSERT WITH CHECK ("public"."authorize"('casos.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un contrato laboral" ON "public"."contratos_laborales" FOR INSERT WITH CHECK ("public"."authorize"('contratos_laborales.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un demandado" ON "public"."demandados" FOR INSERT WITH CHECK ("public"."authorize"('demandados.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un estudiante" ON "public"."estudiantes" FOR INSERT WITH CHECK ("public"."authorize"('estudiantes.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un estudiante_caso" ON "public"."estudiantes_casos" FOR INSERT WITH CHECK ("public"."authorize"('estudiantes_casos.create'::"public"."app_permission"));



CREATE POLICY "permitir insertar un perfil" ON "public"."perfiles" FOR INSERT WITH CHECK ("public"."authorize"('perfiles.insert'::"public"."app_permission"));



CREATE POLICY "permitir insertar un usuario" ON "public"."usuarios" FOR INSERT WITH CHECK ("public"."authorize"('usuarios.create'::"public"."app_permission"));



CREATE POLICY "permitir leer su propio rol" ON "public"."perfiles_roles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "permitir ver asesores_casos propios" ON "public"."asesores_casos" FOR SELECT USING (("public"."authorize"('asesores_casos.read'::"public"."app_permission") AND ("id_asesor" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "permitir ver estudiantes_casos propios" ON "public"."estudiantes_casos" FOR SELECT USING (("public"."authorize"('estudiantes_casos.read'::"public"."app_permission") AND ("id_estudiante" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "permitir ver perfil propio" ON "public"."perfiles" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "permitir ver solo casos asignados" ON "public"."casos" FOR SELECT USING (("public"."authorize"('casos_asignados.read'::"public"."app_permission") AND "public"."estaasignado"("auth"."uid"(), "id_caso")));



CREATE POLICY "permitir ver todos los asesores" ON "public"."asesores" FOR SELECT USING ("public"."authorize"('asesores.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los asesores_casos" ON "public"."asesores_casos" FOR SELECT USING ("public"."authorize"('asesores_casos.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los casos" ON "public"."casos" FOR SELECT USING ("public"."authorize"('casos.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los contratos laborales" ON "public"."contratos_laborales" FOR SELECT USING ("public"."authorize"('contratos_laborales.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los demandados" ON "public"."demandados" FOR SELECT USING ("public"."authorize"('demandados.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los estudiantes" ON "public"."estudiantes" FOR SELECT USING ("public"."authorize"('estudiantes.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los estudiantes_casos" ON "public"."estudiantes_casos" FOR SELECT USING ("public"."authorize"('estudiantes_casos.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los perfiles" ON "public"."perfiles" FOR SELECT USING ("public"."authorize"('perfiles.read'::"public"."app_permission"));



CREATE POLICY "permitir ver todos los usuarios" ON "public"."usuarios" FOR SELECT USING ("public"."authorize"('usuarios.read'::"public"."app_permission"));



ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usuarios" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."actividades_caso";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."asesores_casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."auditoria_casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."documentos_caso";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."estudiantes_casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notificaciones_usuario";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";






















































































































































GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";



GRANT ALL ON FUNCTION "public"."caso_admite_documentos"("p_id_caso" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."caso_admite_documentos"("p_id_caso" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."caso_admite_documentos"("p_id_caso" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."enqueue_assignment_notification"("p_id_caso" integer, "p_id_usuario" "uuid", "p_tipo" "public"."notification_type", "p_source" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."enqueue_assignment_notification"("p_id_caso" integer, "p_id_usuario" "uuid", "p_tipo" "public"."notification_type", "p_source" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."enqueue_assignment_notification"("p_id_caso" integer, "p_id_usuario" "uuid", "p_tipo" "public"."notification_type", "p_source" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "anon";
GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."guardar_entrevista"("p_id_caso" integer, "p_usuario_id" "uuid", "p_caso" "jsonb", "p_usuario" "jsonb", "p_demandado" "jsonb", "p_contrato" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."guardar_entrevista"("p_id_caso" integer, "p_usuario_id" "uuid", "p_caso" "jsonb", "p_usuario" "jsonb", "p_demandado" "jsonb", "p_contrato" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."guardar_entrevista"("p_id_caso" integer, "p_usuario_id" "uuid", "p_caso" "jsonb", "p_usuario" "jsonb", "p_demandado" "jsonb", "p_contrato" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."notificar_usuarios_caso"("p_id_caso" integer, "p_id_autor" "uuid", "p_tipo" "text", "p_titulo" "text", "p_mensaje" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."notificar_usuarios_caso"("p_id_caso" integer, "p_id_autor" "uuid", "p_tipo" "text", "p_titulo" "text", "p_mensaje" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."notificar_usuarios_caso"("p_id_caso" integer, "p_id_autor" "uuid", "p_tipo" "text", "p_titulo" "text", "p_mensaje" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."pop_notificaciones_pendientes"("p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."pop_notificaciones_pendientes"("p_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."pop_notificaciones_pendientes"("p_limit" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."recordar_documentos_caso"("p_id_caso" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_direct"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_direct"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_direct"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_from_audit"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_from_audit"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_from_audit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_on_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_on_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_ultima_modificacion_on_insert"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sumar_dias_habiles"("start_date" timestamp with time zone, "num_days" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."sumar_dias_habiles"("start_date" timestamp with time zone, "num_days" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."sumar_dias_habiles"("start_date" timestamp with time zone, "num_days" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_actividad_notificar"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_actividad_notificar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_actividad_notificar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_asesores_casos_notify"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_asesores_casos_notify"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_asesores_casos_notify"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_asignacion_asesor_notificar"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_asignacion_asesor_notificar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_asignacion_asesor_notificar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_asignacion_estudiante_notificar"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_asignacion_estudiante_notificar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_asignacion_estudiante_notificar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_auditoria_notificar"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_auditoria_notificar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_auditoria_notificar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_documento_notificar"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_documento_notificar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_documento_notificar"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trg_estudiantes_casos_notify"() TO "anon";
GRANT ALL ON FUNCTION "public"."trg_estudiantes_casos_notify"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trg_estudiantes_casos_notify"() TO "service_role";


















GRANT ALL ON TABLE "public"."actividades_caso" TO "anon";
GRANT ALL ON TABLE "public"."actividades_caso" TO "authenticated";
GRANT ALL ON TABLE "public"."actividades_caso" TO "service_role";



GRANT ALL ON SEQUENCE "public"."actividades_caso_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."actividades_caso_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."actividades_caso_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."asesores" TO "anon";
GRANT ALL ON TABLE "public"."asesores" TO "authenticated";
GRANT ALL ON TABLE "public"."asesores" TO "service_role";



GRANT ALL ON TABLE "public"."asesores_casos" TO "anon";
GRANT ALL ON TABLE "public"."asesores_casos" TO "authenticated";
GRANT ALL ON TABLE "public"."asesores_casos" TO "service_role";



GRANT ALL ON TABLE "public"."auditoria_casos" TO "anon";
GRANT ALL ON TABLE "public"."auditoria_casos" TO "authenticated";
GRANT ALL ON TABLE "public"."auditoria_casos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."auditoria_casos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."auditoria_casos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."auditoria_casos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."casos" TO "anon";
GRANT ALL ON TABLE "public"."casos" TO "authenticated";
GRANT ALL ON TABLE "public"."casos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."casos_id_caso_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."casos_id_caso_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."casos_id_caso_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contratos_laborales" TO "anon";
GRANT ALL ON TABLE "public"."contratos_laborales" TO "authenticated";
GRANT ALL ON TABLE "public"."contratos_laborales" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contratos_laborales_id_contrato_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contratos_laborales_id_contrato_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contratos_laborales_id_contrato_seq" TO "service_role";



GRANT ALL ON TABLE "public"."demandados" TO "anon";
GRANT ALL ON TABLE "public"."demandados" TO "authenticated";
GRANT ALL ON TABLE "public"."demandados" TO "service_role";



GRANT ALL ON SEQUENCE "public"."demandados_id_demandado_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."demandados_id_demandado_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."demandados_id_demandado_seq" TO "service_role";



GRANT ALL ON TABLE "public"."documentos_caso" TO "anon";
GRANT ALL ON TABLE "public"."documentos_caso" TO "authenticated";
GRANT ALL ON TABLE "public"."documentos_caso" TO "service_role";



GRANT ALL ON SEQUENCE "public"."documentos_caso_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."documentos_caso_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."documentos_caso_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."estudiantes" TO "anon";
GRANT ALL ON TABLE "public"."estudiantes" TO "authenticated";
GRANT ALL ON TABLE "public"."estudiantes" TO "service_role";



GRANT ALL ON TABLE "public"."estudiantes_casos" TO "anon";
GRANT ALL ON TABLE "public"."estudiantes_casos" TO "authenticated";
GRANT ALL ON TABLE "public"."estudiantes_casos" TO "service_role";



GRANT ALL ON TABLE "public"."horarios" TO "anon";
GRANT ALL ON TABLE "public"."horarios" TO "authenticated";
GRANT ALL ON TABLE "public"."horarios" TO "service_role";



GRANT ALL ON SEQUENCE "public"."horarios_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."horarios_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."horarios_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."llamados_atencion" TO "anon";
GRANT ALL ON TABLE "public"."llamados_atencion" TO "authenticated";
GRANT ALL ON TABLE "public"."llamados_atencion" TO "service_role";



GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notificaciones_pendientes" TO "anon";
GRANT ALL ON TABLE "public"."notificaciones_pendientes" TO "authenticated";
GRANT ALL ON TABLE "public"."notificaciones_pendientes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notificaciones_pendientes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notificaciones_pendientes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notificaciones_pendientes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notificaciones_usuario" TO "anon";
GRANT ALL ON TABLE "public"."notificaciones_usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."notificaciones_usuario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notificaciones_usuario_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notificaciones_usuario_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notificaciones_usuario_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."perfiles" TO "anon";
GRANT ALL ON TABLE "public"."perfiles" TO "authenticated";
GRANT ALL ON TABLE "public"."perfiles" TO "service_role";



GRANT ALL ON TABLE "public"."perfiles_roles" TO "service_role";
GRANT ALL ON TABLE "public"."perfiles_roles" TO "supabase_auth_admin";
GRANT SELECT ON TABLE "public"."perfiles_roles" TO "authenticated";



GRANT ALL ON SEQUENCE "public"."perfiles_roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."perfiles_roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."perfiles_roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."usuarios" TO "anon";
GRANT ALL ON TABLE "public"."usuarios" TO "authenticated";
GRANT ALL ON TABLE "public"."usuarios" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































