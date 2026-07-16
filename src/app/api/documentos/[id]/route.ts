import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = auth.replace("Bearer ", "");
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: doc } = await supabaseAdmin
    .from("documentos_caso")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const { data: signed } = await supabaseAdmin
    .storage
    .from("documentos-casos")
    .createSignedUrl(doc.storage_path, 3600);

  return NextResponse.json({ signed_url: signed?.signedUrl ?? null });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Solo admin/pro_apoyo pueden eliminar definitivamente
  const token = auth.replace("Bearer ", "");
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = JSON.parse(atob(token.split(".")[1]));
  const role = payload.user_role ?? "";
  if (role !== "admin" && role !== "pro_apoyo") {
    return NextResponse.json({ error: "Solo el administrador puede eliminar documentos" }, { status: 403 });
  }

  const { data: doc } = await supabaseAdmin
    .from("documentos_caso")
    .select("*")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const { error: storageError } = await supabaseAdmin
    .storage
    .from("documentos-casos")
    .remove([doc.storage_path]);

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  await supabaseAdmin.from("documentos_caso").delete().eq("id", id);

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (body.nombre_original) updates.nombre_original = body.nombre_original;
  if (body.tipo) updates.tipo = body.tipo;
  if (body.estado) updates.estado = body.estado;
  if (body.estado_doc) updates.estado_doc = body.estado_doc;

  const { error } = await supabaseAdmin
    .from("documentos_caso")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
