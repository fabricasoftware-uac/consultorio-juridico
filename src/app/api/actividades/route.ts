import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET(request: NextRequest) {
  const idCaso = new URL(request.url).searchParams.get("id_caso");
  if (!idCaso) return NextResponse.json({ error: "id_caso required" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("actividades_caso")
    .select("*")
    .eq("id_caso", idCaso)
    .order("created_at", { ascending: false });

  return NextResponse.json({ actividades: data ?? [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id_caso, id_usuario, titulo, descripcion } = body;
  if (!id_caso || !id_usuario || !titulo) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("actividades_caso")
    .insert({ id_caso, id_usuario, titulo, descripcion: descripcion || "" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ actividad: data });
}
