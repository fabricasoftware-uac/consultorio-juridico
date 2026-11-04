"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { createClient } from "@/lib/supabase/supabase-server";
import {
  sumarDiasHabiles,
  validarCambioEstadoAdmin,
  calcularPlazosCambioEstado,
} from "@/lib/utils";
import type { EstadoEnum } from "app/types/database";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function cambiarEstadoCasoAdmin(
  idCaso: number,
  nuevoEstado: EstadoEnum,
  motivo: string,
): Promise<ActionResult> {
  try {
    const validacion = validarCambioEstadoAdmin({
      idCaso,
      nuevoEstado,
      motivo,
    });
    if (!validacion.valido) {
      return { success: false, error: validacion.error! };
    }

    // Obtener sesión del usuario autenticado (administrador)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "No autorizado. Inicie sesión nuevamente.",
      };
    }

    // Verificar que el usuario tenga rol de administrador
    const { data: rolData } = await supabaseAdmin
      .from("perfiles_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (rolData?.role !== "admin") {
      return {
        success: false,
        error: "No tienes permisos de administrador para cambiar el estado de este caso.",
      };
    }

    // Obtener caso actual
    const { data: casoActual, error: casoError } = await supabaseAdmin
      .from("casos")
      .select("id_caso, estado, fecha_vencimiento_estudiante, fecha_vencimiento_asesor, fecha_cierre")
      .eq("id_caso", idCaso)
      .single();

    if (casoError || !casoActual) {
      return {
        success: false,
        error: "No se encontró el caso especificado.",
      };
    }

    const motivoLimpio = motivo.trim();
    const updateData: Record<string, any> = {
      estado: nuevoEstado,
      ultima_modificacion: new Date().toISOString(),
      ...calcularPlazosCambioEstado(nuevoEstado),
    };

    // Actualizar casos
    const { error: updateError } = await supabaseAdmin
      .from("casos")
      .update(updateData)
      .eq("id_caso", idCaso);

    if (updateError) {
      console.error("Error al actualizar el estado del caso:", updateError);
      return {
        success: false,
        error: "Error al actualizar el estado del caso.",
      };
    }

    // Auto-resolver llamados de atención pendientes si el caso se cierra o archiva
    if (nuevoEstado === "cerrado" || nuevoEstado === "archivado") {
      await supabaseAdmin
        .from("llamados_atencion")
        .update({
          resuelto: true,
          fecha_resolucion: new Date().toISOString(),
          motivo_resolucion: `Caso ${nuevoEstado} por administrador`,
        })
        .eq("id_caso", idCaso)
        .eq("resuelto", false);
    }

    // Registrar en auditoria_casos
    const { error: auditError } = await supabaseAdmin
      .from("auditoria_casos")
      .insert({
        id_caso: idCaso,
        id_usuario: user.id,
        accion: "cambio_estado_admin",
        descripcion: `El administrador cambió el estado del caso a "${nuevoEstado}". Motivo: ${motivoLimpio}`,
        metadata: {
          estado_anterior: casoActual.estado,
          nuevo_estado: nuevoEstado,
          motivo: motivoLimpio,
        },
      });

    if (auditError) {
      console.error("Error al registrar evento de auditoría:", auditError);
      // No bloqueamos la acción si la auditoría fallase, pero lo logueamos
    }

    revalidatePath("/admin/todos-los-casos");
    revalidatePath(`/admin/todos-los-casos/${idCaso}`);
    revalidatePath("/pro-apoyo/gestionar-caso");
    revalidatePath(`/pro-apoyo/gestionar-caso/${idCaso}`);
    revalidatePath("/asesor/mis-casos");
    revalidatePath(`/asesor/mis-casos/${idCaso}`);
    revalidatePath("/estudiante/mis-casos");
    revalidatePath(`/estudiante/mis-casos/${idCaso}`);

    return {
      success: true,
      message: `El estado del caso se actualizó a "${nuevoEstado}" correctamente.`,
    };
  } catch (error: any) {
    console.error("Error en cambiarEstadoCasoAdmin:", error);
    return {
      success: false,
      error: error?.message || "Ocurrió un error inesperado al cambiar el estado.",
    };
  }
}

export async function solicitarCierreCasoAdmin(
  idCaso: number,
  observaciones: string,
): Promise<ActionResult> {
  try {
    const observacionesLimpias = observaciones?.trim();
    if (!observacionesLimpias) {
      return {
        success: false,
        error: "Las observaciones son obligatorias para solicitar el cierre del caso.",
      };
    }

    if (!idCaso || typeof idCaso !== "number" || idCaso <= 0) {
      return {
        success: false,
        error: "El identificador del caso no es válido.",
      };
    }

    // 2. Validar sesión del usuario autenticado con createClient()
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "No autorizado. Inicie sesión nuevamente.",
      };
    }

    // 3. Validar con supabaseAdmin que el usuario tenga rol 'admin' en perfiles_roles
    const { data: rolData, error: rolError } = await supabaseAdmin
      .from("perfiles_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (rolError || rolData?.role !== "admin") {
      return {
        success: false,
        error: "No tienes permisos de administrador para realizar esta acción.",
      };
    }

    // 5. Consultar casos para verificar que el caso exista y esté en estado 'activo'
    const { data: casoActual, error: casoError } = await supabaseAdmin
      .from("casos")
      .select("id_caso, estado")
      .eq("id_caso", idCaso)
      .maybeSingle();

    if (casoError || !casoActual) {
      return {
        success: false,
        error: "No se encontró el caso especificado.",
      };
    }

    if (casoActual.estado !== "activo") {
      return {
        success: false,
        error:
          casoActual.estado === "cerrado"
            ? "El caso ya se encuentra cerrado."
            : `El caso no se encuentra activo (estado actual: "${casoActual.estado}"). Solo se puede solicitar el cierre de casos activos.`,
      };
    }

    // 6. Consultar asesores_casos para obtener el asesor asignado actualmente (id_caso = idCaso AND fecha_fin_asignacion IS NULL)
    const { data: asesorAsignado, error: asesorError } = await supabaseAdmin
      .from("asesores_casos")
      .select("id_asesor")
      .eq("id_caso", idCaso)
      .is("fecha_fin_asignacion", null)
      .maybeSingle();

    if (asesorError || !asesorAsignado?.id_asesor) {
      return {
        success: false,
        error: "El caso no tiene un asesor activo asignado.",
      };
    }

    const idAsesor = asesorAsignado.id_asesor;

    // 7. Insertar en auditoria_casos
    const { error: auditError } = await supabaseAdmin
      .from("auditoria_casos")
      .insert({
        id_caso: idCaso,
        id_usuario: user.id,
        accion: "solicitud_cierre_admin",
        descripcion: `El administrador solicitó al asesor cerrar el caso #${idCaso}. Observación: ${observacionesLimpias}`,
        metadata: {
          motivo: observacionesLimpias,
          id_asesor: idAsesor,
        },
      });

    if (auditError) {
      console.error("Error al registrar auditoría de solicitud de cierre:", auditError);
      return {
        success: false,
        error: "Error al registrar la solicitud de cierre en la auditoría.",
      };
    }

    // 8. Insertar en notificaciones_usuario
    const { error: notifError } = await supabaseAdmin
      .from("notificaciones_usuario")
      .insert({
        id_usuario: idAsesor,
        id_caso: idCaso,
        tipo: "solicitud_cierre_admin",
        titulo: `Solicitud de cierre - Caso #${idCaso}`,
        mensaje: observacionesLimpias,
      });

    if (notifError) {
      console.error("Error al registrar notificación para el asesor:", notifError);
      return {
        success: false,
        error: "Error al registrar la notificación de cierre para el asesor.",
      };
    }

    // 9. Revalidar los paths relevantes
    revalidatePath("/admin/todos-los-casos");
    revalidatePath(`/admin/todos-los-casos/${idCaso}`);
    revalidatePath("/asesor/mis-casos");
    revalidatePath(`/asesor/mis-casos/${idCaso}`);

    // 10. Retornar éxito
    return {
      success: true,
      message: "Solicitud de cierre enviada al asesor exitosamente.",
    };
  } catch (error: any) {
    console.error("Error en solicitarCierreCasoAdmin:", error);
    return {
      success: false,
      error: error?.message || "Ocurrió un error inesperado al solicitar el cierre del caso.",
    };
  }
}
