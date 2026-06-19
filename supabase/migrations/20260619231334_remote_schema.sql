drop extension if exists "pg_net";

drop policy "auditoria_select_admin" on "public"."auditoria_casos";

drop policy "auditoria_select_asesor" on "public"."auditoria_casos";

drop policy "auditoria_select_estudiante" on "public"."auditoria_casos";

alter table "public"."casos" alter column "estado" drop default;

alter type "public"."estado_enum" rename to "estado_enum__old_version_to_be_dropped";

create type "public"."estado_enum" as enum ('aprobado', 'en_proceso', 'pendiente_aprobacion', 'cerrado', 'archivado', 'requiere_ajustes', 'en_correccion');

alter table "public"."casos" alter column estado type "public"."estado_enum" using estado::text::"public"."estado_enum";

alter table "public"."casos" alter column "estado" set default 'pendiente_aprobacion'::public.estado_enum;

drop type "public"."estado_enum__old_version_to_be_dropped";


  create policy "auditoria_admin_all"
  on "public"."auditoria_casos"
  as permissive
  for select
  to public
using ((((auth.jwt() ->> 'user_role'::text))::public.app_role = ANY (ARRAY['admin'::public.app_role, 'pro_apoyo'::public.app_role])));



  create policy "auditoria_asesor_own"
  on "public"."auditoria_casos"
  as permissive
  for select
  to public
using (((((auth.jwt() ->> 'user_role'::text))::public.app_role = 'asesor'::public.app_role) AND (EXISTS ( SELECT 1
   FROM public.asesores_casos
  WHERE ((asesores_casos.id_asesor = auth.uid()) AND (asesores_casos.id_caso = auditoria_casos.id_caso))))));



  create policy "auditoria_estudiante_own"
  on "public"."auditoria_casos"
  as permissive
  for select
  to public
using (((((auth.jwt() ->> 'user_role'::text))::public.app_role = 'estudiante'::public.app_role) AND (EXISTS ( SELECT 1
   FROM public.estudiantes_casos
  WHERE ((estudiantes_casos.id_estudiante = auth.uid()) AND (estudiantes_casos.id_caso = auditoria_casos.id_caso))))));


CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


