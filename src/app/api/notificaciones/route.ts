import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

function getUser(token: string) {
  return supabaseAdmin.auth.getUser(token.replace("Bearer ", ""));
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await getUser(auth);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const soloConteo = url.searchParams.get("solo") === "conteo";

  if (soloConteo) {
    const { count } = await supabaseAdmin
      .from("notificaciones_usuario")
      .select("*", { count: "exact", head: true })
      .eq("id_usuario", user.id)
      .eq("leida", false);

    return NextResponse.json({ no_leidas: count ?? 0 });
  }

  const { data } = await supabaseAdmin
    .from("notificaciones_usuario")
    .select("*")
    .eq("id_usuario", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return NextResponse.json({ notificaciones: data ?? [] });
}

export async function PATCH(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user } } = await getUser(auth);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (body.todas) {
    await supabaseAdmin
      .from("notificaciones_usuario")
      .update({ leida: true, read_at: new Date().toISOString() })
      .eq("id_usuario", user.id)
      .eq("leida", false);

    return NextResponse.json({ success: true });
  }

  if (body.id) {
    await supabaseAdmin
      .from("notificaciones_usuario")
      .update({ leida: true, read_at: new Date().toISOString() })
      .eq("id", body.id)
      .eq("id_usuario", user.id);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Bad request" }, { status: 400 });
}
