import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = _request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: doc } = await supabaseAdmin
    .from("documentos_caso")
    .select("*")
    .eq("id", id)
    .single();

  if (!doc) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Solo admin, pro_apoyo o el que subio
  const { data: roleData } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
  const role = (roleData?.user?.app_metadata as any)?.user_role ?? "";

  if (doc.id_usuario !== user.id && role !== "admin" && role !== "pro_apoyo") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

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
