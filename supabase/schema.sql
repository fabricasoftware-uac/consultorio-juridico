
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
    'publica'
);


ALTER TYPE "public"."area_enum" OWNER TO "postgres";


CREATE TYPE "public"."clasificacion_enum" AS ENUM (
    'en_tramite',
    'solo_asesoria'
);


ALTER TYPE "public"."clasificacion_enum" OWNER TO "postgres";


CREATE TYPE "public"."estado_civil_enum" AS ENUM (
    'soltero',
    'casado',
    'unión libre',
    'otro'
);


ALTER TYPE "public"."estado_civil_enum" OWNER TO "postgres";


CREATE TYPE "public"."estado_enum" AS ENUM (
    'aprobado',
    'en_proceso',
    'pendiente_aprobacion',
    'cerrado',
    'archivado',
    'requiere_ajustes',
    'en_correccion'
);


ALTER TYPE "public"."estado_enum" OWNER TO "postgres";


CREATE TYPE "public"."jornada_enum" AS ENUM (
    'diurna',
    'nocturna',
    'mixto'
);


ALTER TYPE "public"."jornada_enum" OWNER TO "postgres";


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
DECLARE
  total INTEGER := 0;
  vencidos_actuales INTEGER := 0; -- Variable temporal para solucionar el error
BEGIN
  -- 1. Estudiantes vencidos
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ec.id_estudiante,
    'estudiante',
    'El estudiante ha excedido el plazo de 3 días para la entrega inicial del caso.'
  FROM public.casos c
  JOIN public.estudiantes_casos ec ON ec.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_estudiante <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'estudiante'
    );
  
  -- Captura limpia
  GET DIAGNOSTICS total = ROW_COUNT;

  -- 2. Asesores vencidos
  INSERT INTO public.llamados_atencion (id_caso, id_usuario, tipo, motivo)
  SELECT
    c.id_caso,
    ac.id_asesor,
    'asesor',
    'El asesor ha excedido el plazo de 2 días para la aprobación del caso.'
  FROM public.casos c
  JOIN public.asesores_casos ac ON ac.id_caso = c.id_caso
  WHERE c.fecha_vencimiento_asesor <= now()
    AND c.estado NOT IN ('cerrado', 'archivado')
    AND NOT EXISTS (
      SELECT 1 FROM public.llamados_atencion la
      WHERE la.id_caso = c.id_caso AND la.tipo = 'asesor'
    );
  
  -- Captura limpia en la variable temporal
  GET DIAGNOSTICS vencidos_actuales = ROW_COUNT;
  
  -- Hacemos la suma de manera estándar fuera del GET DIAGNOSTICS
  total := total + vencidos_actuales;

  RETURN total;
END;
$$;


ALTER FUNCTION "public"."generar_llamados_atencion"() OWNER TO "postgres";


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

SET default_tablespace = '';

SET default_table_access_method = "heap";


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
    "fecha_vencimiento_asesor" timestamp with time zone
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


CREATE TABLE IF NOT EXISTS "public"."llamados_atencion" (
    "id" bigint NOT NULL,
    "id_caso" integer NOT NULL,
    "id_usuario" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "motivo" "text" NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "leido" boolean DEFAULT false NOT NULL,
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
    "sexo" character(1),
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
    "tiene_representado" boolean
);


ALTER TABLE "public"."usuarios" OWNER TO "postgres";


ALTER TABLE ONLY "public"."auditoria_casos" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."auditoria_casos_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."casos" ALTER COLUMN "id_caso" SET DEFAULT "nextval"('"public"."casos_id_caso_seq"'::"regclass");



ALTER TABLE ONLY "public"."contratos_laborales" ALTER COLUMN "id_contrato" SET DEFAULT "nextval"('"public"."contratos_laborales_id_contrato_seq"'::"regclass");



ALTER TABLE ONLY "public"."demandados" ALTER COLUMN "id_demandado" SET DEFAULT "nextval"('"public"."demandados_id_demandado_seq"'::"regclass");



ALTER TABLE ONLY "public"."llamados_atencion" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."llamados_atencion_id_seq"'::"regclass");



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



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_pkey" PRIMARY KEY ("id_estudiante", "id_caso");



ALTER TABLE ONLY "public"."estudiantes"
    ADD CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_perfil");



ALTER TABLE ONLY "public"."llamados_atencion"
    ADD CONSTRAINT "llamados_atencion_id_caso_tipo_key" UNIQUE ("id_caso", "tipo");



ALTER TABLE ONLY "public"."llamados_atencion"
    ADD CONSTRAINT "llamados_atencion_pkey" PRIMARY KEY ("id");



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



CREATE INDEX "idx_auditoria_caso" ON "public"."auditoria_casos" USING "btree" ("id_caso", "created_at" DESC);



CREATE INDEX "idx_casos_vencimiento_asesor" ON "public"."casos" USING "btree" ("fecha_vencimiento_asesor") WHERE ("fecha_vencimiento_asesor" IS NOT NULL);



CREATE INDEX "idx_casos_vencimiento_estudiante" ON "public"."casos" USING "btree" ("fecha_vencimiento_estudiante") WHERE ("fecha_vencimiento_estudiante" IS NOT NULL);



CREATE INDEX "idx_llamados_id_caso" ON "public"."llamados_atencion" USING "btree" ("id_caso");



CREATE INDEX "idx_llamados_id_usuario" ON "public"."llamados_atencion" USING "btree" ("id_usuario");



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



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso");



ALTER TABLE ONLY "public"."estudiantes_casos"
    ADD CONSTRAINT "estudiantes_casos_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "public"."estudiantes"("id_perfil");



ALTER TABLE ONLY "public"."estudiantes"
    ADD CONSTRAINT "estudiantes_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "public"."perfiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."auditoria_casos"
    ADD CONSTRAINT "fk_auditoria_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."perfiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."llamados_atencion"
    ADD CONSTRAINT "llamados_atencion_id_caso_fkey" FOREIGN KEY ("id_caso") REFERENCES "public"."casos"("id_caso") ON DELETE CASCADE;



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


ALTER TABLE "public"."estudiantes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estudiantes_casos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "llamados_admin_all" ON "public"."llamados_atencion" USING (((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = ANY (ARRAY['admin'::"public"."app_role", 'pro_apoyo'::"public"."app_role"])));



CREATE POLICY "llamados_asesor_own" ON "public"."llamados_atencion" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'asesor'::"public"."app_role") AND ("id_usuario" = "auth"."uid"())));



ALTER TABLE "public"."llamados_atencion" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "llamados_estudiante_own" ON "public"."llamados_atencion" FOR SELECT USING ((((("auth"."jwt"() ->> 'user_role'::"text"))::"public"."app_role" = 'estudiante'::"public"."app_role") AND ("id_usuario" = "auth"."uid"())));



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






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."asesores_casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."auditoria_casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."casos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."estudiantes_casos";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";






















































































































































GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";
GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";



REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "service_role";
GRANT ALL ON FUNCTION "public"."custom_access_token_hook"("event" "jsonb") TO "supabase_auth_admin";



GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."estaasignado"("uid" "uuid", "caso_id" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "anon";
GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generar_llamados_atencion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















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



GRANT ALL ON TABLE "public"."estudiantes" TO "anon";
GRANT ALL ON TABLE "public"."estudiantes" TO "authenticated";
GRANT ALL ON TABLE "public"."estudiantes" TO "service_role";



GRANT ALL ON TABLE "public"."estudiantes_casos" TO "anon";
GRANT ALL ON TABLE "public"."estudiantes_casos" TO "authenticated";
GRANT ALL ON TABLE "public"."estudiantes_casos" TO "service_role";



GRANT ALL ON TABLE "public"."llamados_atencion" TO "anon";
GRANT ALL ON TABLE "public"."llamados_atencion" TO "authenticated";
GRANT ALL ON TABLE "public"."llamados_atencion" TO "service_role";



GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."llamados_atencion_id_seq" TO "service_role";



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































