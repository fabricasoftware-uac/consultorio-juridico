import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente con el JWT del usuario (no service role): así aplican las políticas
 * RLS act_select / act_insert de actividades_caso, que ya restringen el acceso
 * a los asignados al caso (mas admin y pro_apoyo).
 *
 * Esta ruta usaba supabaseAdmin y no validaba el header Authorization, con lo
 * que cualquiera sin credenciales podía leer y escribir actividades de
 * cualquier caso: el middleware no protege /api/* (ver el matcher en
 * src/middleware.ts, que excluye `api/.*`).
 */
function clienteDeUsuario(auth: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: auth } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idCaso = new URL(request.url).searchParams.get("id_caso");
  if (!idCaso) return NextResponse.json({ error: "id_caso required" }, { status: 400 });

  const supabase = clienteDeUsuario(auth);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("actividades_caso")
    .select("*")
    .eq("id_caso", idCaso)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });

  return NextResponse.json({ actividades: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = clienteDeUsuario(auth);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id_caso, titulo, descripcion } = body;
  if (!id_caso || !titulo) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  // El autor sale del token, nunca del cuerpo: antes se aceptaba el id_usuario
  // que mandara el cliente, así que se podía atribuir una actividad a cualquiera.
  const { data, error } = await supabase
    .from("actividades_caso")
    .insert({
      id_caso,
      id_usuario: user.id,
      titulo,
      descripcion: descripcion || "",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 403 });
  return NextResponse.json({ actividad: data });
}
