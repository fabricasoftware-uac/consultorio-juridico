import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { getEmailProvider } from "@/lib/email";

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 10;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  // Permitir CRON_SECRET (cron de respaldo) o sesion de Supabase (frontend)
  const autorizado =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    (await validarSesion(authHeader));

  if (!autorizado) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = getEmailProvider();
  let processed = 0;
  let sent = 0;
  let failed = 0;

  try {
    // 1. Tomar un lote de pendientes con FOR UPDATE SKIP LOCKED
    const { data: batch, error: popError } = await supabaseAdmin.rpc(
      "pop_notificaciones_pendientes",
      { p_limit: BATCH_SIZE },
    );

    if (popError) {
      console.error("Error al obtener lote de notificaciones:", popError);
      return NextResponse.json({ error: popError.message }, { status: 500 });
    }

    if (!batch || batch.length === 0) {
      return NextResponse.json({ processed: 0, sent: 0, failed: 0 });
    }

    // NEXT_PUBLIC_* se incrusta en tiempo de BUILD: si no estaba definida al
    // construir, queda horneada como undefined y los correos salen apuntando a
    // localhost. SITE_URL se lee en runtime y sirve de escape; VERCEL_URL cubre
    // los previews automáticamente.
    const siteUrl =
      process.env.SITE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
      "http://localhost:3000";

    if (siteUrl.includes("localhost") && process.env.NODE_ENV === "production") {
      console.error(
        "[enviar-notificaciones] SITE_URL apunta a localhost en producción: " +
          "los enlaces de los correos no van a funcionar. Define SITE_URL.",
      );
    }

    for (const notif of batch) {
      processed++;

      try {
        // 2. Obtener correo del destinatario
        const { data: perfil } = await supabaseAdmin
          .from("perfiles")
          .select("correo, nombre_completo")
          .eq("id", notif.id_usuario)
          .single();

        if (!perfil?.correo) {
          await markFailed(notif.id, "Destinatario sin correo");
          failed++;
          continue;
        }

        // 3. Obtener datos del caso + usuario
        const { data: caso } = await supabaseAdmin
          .from("casos")
          .select("id_caso, usuarios!inner(id_usuario, nombre_completo, telefono, correo, sexo)")
          .eq("id_caso", notif.id_caso)
          .single();

        const c = caso as any;
        const u = c?.usuarios || {};
        const cliente = u.nombre_completo || "N/A";
        const telefono = u.telefono || "No registrado";
        const correoCliente = u.correo || "No registrado";
        const sexo = u.sexo?.replace(/_/g, " ") || "No especificado";

        // 4. Determinar URL segun rol
        const ruta =
          notif.tipo_notificacion === "ESTUDIANTE_ASIGNADO"
            ? `/estudiante/mis-casos/${notif.id_caso}`
            : `/asesor/mis-casos/${notif.id_caso}`;

        const url = `${siteUrl}${ruta}`;
        const rol =
          notif.tipo_notificacion === "ESTUDIANTE_ASIGNADO"
            ? "estudiante"
            : "asesor";

        // 5. Construir y enviar email
        const asunto = `Se te ha asignado el caso #${notif.id_caso} - Consultorio Jurídico UAC`;
        const html = buildEmailHtml({
          nombre: perfil.nombre_completo || "Usuario",
          idCaso: notif.id_caso,
          cliente,
          telefono,
          correoCliente,
          sexo,
          url,
          baseUrl: siteUrl,
        });

        const result = await email.send({
          to: perfil.correo,
          subject: asunto,
          html,
        });

        if (result.success) {
          await markSent(notif.id);
          sent++;
        } else {
          await handleRetry(notif.id, result.error || "Error al enviar");
          failed++;
        }
      } catch (err: any) {
        await handleRetry(notif.id, err.message ?? "Error inesperado");
        failed++;
      }
    }

    return NextResponse.json({ processed, sent, failed });
  } catch (err: any) {
    console.error("Error en cron de notificaciones:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

async function markSent(id: number) {
  await supabaseAdmin
    .from("notificaciones_pendientes")
    .update({ status: "SENT", sent_at: new Date().toISOString() })
    .eq("id", id);
}

async function markFailed(id: number, error: string) {
  await supabaseAdmin
    .from("notificaciones_pendientes")
    .update({
      status: "FAILED",
      last_error: error,
      attempts: MAX_ATTEMPTS,
    })
    .eq("id", id);
}

async function handleRetry(id: number, error: string) {
  const { data: n } = await supabaseAdmin
    .from("notificaciones_pendientes")
    .select("attempts")
    .eq("id", id)
    .single();

  const attempts = (n as any)?.attempts ?? 0;

  if (attempts + 1 >= MAX_ATTEMPTS) {
    await supabaseAdmin
      .from("notificaciones_pendientes")
      .update({
        status: "FAILED",
        last_error: error,
        attempts: attempts + 1,
      })
      .eq("id", id);
  } else {
    await supabaseAdmin
      .from("notificaciones_pendientes")
      .update({
        status: "PENDING",
        last_error: error,
        attempts: attempts + 1,
      })
      .eq("id", id);
  }
}

function buildEmailHtml({
  nombre,
  idCaso,
  cliente,
  telefono,
  correoCliente,
  sexo,
  url,
  baseUrl,
}: {
  nombre: string;
  idCaso: number;
  cliente: string;
  telefono: string;
  correoCliente: string;
  sexo: string;
  url: string;
  baseUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;">
  <div style="background:#ffffff;padding:24px;border-radius:8px 8px 0 0;text-align:center;border-bottom:3px solid #1e40af;">
    <img src="${baseUrl}/autonoma.png" alt="UAC" style="height:60px;margin-bottom:8px;" />
    <h1 style="color:#1e3a5f;margin:0;font-size:20px;">Consultorio Jurídico</h1>
    <p style="color:#64748b;margin:4px 0 0;font-size:13px;">Corporación Universitaria Autónoma del Cauca</p>
  </div>
  <div style="border:1px solid #e2e8f0;padding:24px;border-radius:0 0 8px 8px;">
    <p style="color:#1e293b;font-size:16px;">Hola <strong>${nombre}</strong>,</p>
    <p style="color:#475569;font-size:14px;line-height:1.5;">
      Se te ha asignado un nuevo caso en el Consultorio Jurídico. A continuación, los detalles:
    </p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#64748b;">Caso</td>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;font-weight:600;">#${idCaso}</td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:13px;color:#64748b;">Cliente</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:13px;font-weight:600;">${cliente}</td>
      </tr>
      <tr>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#64748b;">Teléfono</td>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;font-weight:600;">${telefono}</td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:13px;color:#64748b;">Correo</td>
        <td style="padding:8px;border:1px solid #e2e8f0;font-size:13px;font-weight:600;">${correoCliente}</td>
      </tr>
      <tr>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;color:#64748b;">Sexo</td>
        <td style="padding:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;font-weight:600;text-transform:capitalize;">${sexo}</td>
      </tr>
    </table>
    <a href="${url}" style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">Ver caso en el sistema</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
      Este es un mensaje automático del Consultorio Jurídico. Por favor no responder.
    </p>
  </div>
</body>
</html>`;
}

async function validarSesion(authHeader: string | null): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabaseAdmin.auth.getUser(token);
  return !!data.user;
}
