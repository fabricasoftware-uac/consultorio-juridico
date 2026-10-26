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

type ActionResult =
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
