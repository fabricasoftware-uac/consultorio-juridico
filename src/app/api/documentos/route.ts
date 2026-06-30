import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const idCaso = new URL(request.url).searchParams.get("id_caso");
  if (!idCaso) return NextResponse.json({ error: "id_caso required" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("documentos_caso")
    .select("*")
    .eq("id_caso", idCaso)
    .order("created_at", { ascending: false });

  if (!data) return NextResponse.json({ documentos: [] });

  const urlBase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;

  const documentos = await Promise.all(
    data.map(async (doc) => {
      const { data: signed } = await supabaseAdmin
        .storage
        .from("documentos-casos")
        .createSignedUrl(doc.storage_path, 3600);
      return { ...doc, signed_url: signed?.signedUrl ?? null };
    }),
  );

  return NextResponse.json({ documentos });
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: { user } } = await supabaseAdmin.auth.getUser(auth.replace("Bearer ", ""));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const idCaso = formData.get("id_caso") as string | null;

  if (!file || !idCaso) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  // Validar tipo
  const ALLOWED = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/zip"];
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
  }

  // Validar tamano (10 MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Archivo demasiado grande (max 10 MB)" }, { status: 400 });
  }

  // Validar cantidad (max 50 por caso)
  const { count } = await supabaseAdmin
    .from("documentos_caso")
    .select("*", { count: "exact", head: true })
    .eq("id_caso", idCaso);
  if ((count ?? 0) >= 50) {
    return NextResponse.json({ error: "Limite de 50 documentos por caso alcanzado" }, { status: 400 });
  }

  // Generar nombre unico
  const ext = file.name.split(".").pop() || "bin";
  const uuid = crypto.randomUUID();
  const storagePath = `${idCaso}/${uuid}.${ext}`;

  // Subir a storage
  const buffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin
    .storage
    .from("documentos-casos")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Insertar metadatos
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("documentos_caso")
    .insert({
      id_caso: parseInt(idCaso),
      id_usuario: user.id,
      storage_path: storagePath,
      nombre_original: file.name,
      tipo: "documento",
      mime_type: file.type,
      tamano: file.size,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ documento: inserted });
}
