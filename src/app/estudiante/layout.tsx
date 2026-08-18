import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/supabase-server";

/**
 * Gate de perfil completo.
 *
 * "Perfil incompleto" = no existe fila en `estudiantes` para este usuario. Es
 * el caso de quien acaba de entrar por Google y todavía no envió el formulario
 * de /completar-perfil.
 *
 * Va aquí y no en el middleware porque el middleware tendría que consultar la
 * base en cada request (o llevar un claim en el JWT que queda obsoleto hasta
 * 1 h). Aquí es una sola lectura por PK indexada y siempre fresca; la política
 * `Enable users to view their own data only` ya permite esta consulta con el
 * cliente de sesión.
 */
export default async function EstudianteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: estudiante } = await supabase
    .from("estudiantes")
    .select("id_perfil")
    .eq("id_perfil", user.id)
    .maybeSingle();

  if (!estudiante) {
    redirect("/completar-perfil");
  }

  return <>{children}</>;
}
