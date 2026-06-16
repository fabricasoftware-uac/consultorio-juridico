"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/supabase-client";
import { cleanData } from "@/lib/utils";
import { toast } from "sonner";
import type { Caso, Demandado, Usuario } from "app/types/database";

export function useCaseEdit(idCaso: string, onRefresh: () => Promise<void>) {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editedClientData, setEditedClientData] = useState<Usuario | null>(
    null,
  );
  const [isEditingDefendant, setIsEditingDefendant] = useState(false);
  const [editedDefendantData, setEditedDefendantData] =
    useState<Demandado | null>(null);
  const [isEditingCaseInfo, setIsEditingCaseInfo] = useState(false);
  const [editedCaseData, setEditedCaseData] = useState<Caso | null>(null);

  // ── Client ──────────────────────────────────────────────

  const handleEditClient = useCallback((client: Usuario | undefined) => {
    setEditedClientData(client || null);
    setIsEditingClient(true);
  }, []);

  const handleSaveClient = useCallback(async () => {
    if (!editedClientData) return;
    setIsEditingClient(false);
    const limpio = cleanData(editedClientData);
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre_completo: limpio.nombre_completo,
          sexo: limpio.sexo,
          cedula: limpio.cedula,
          edad: limpio.edad,
          estado_civil: limpio.estado_civil,
          estrato: limpio.estrato,
          telefono: limpio.telefono,
          contacto_familiar: limpio.contacto_familiar,
          correo: limpio.correo,
          tipo_vivienda: limpio.tipo_vivienda,
          direccion: limpio.direccion,
          situacion_laboral: limpio.situacion_laboral,
          valor_otros_ingresos: limpio.valor_otros_ingresos,
          otros_ingresos: limpio.otros_ingresos,
          concepto_otros_ingresos: limpio.concepto_otros_ingresos,
        })
        .eq("id_usuario", editedClientData.id_usuario);
      if (error) throw error;
      await onRefresh();
      toast.success("Información del cliente actualizada");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los datos del usuario");
    } finally {
      setEditedClientData(null);
    }
  }, [editedClientData, onRefresh]);

  const handleCancelClientEdit = useCallback(() => {
    setIsEditingClient(false);
    setEditedClientData(null);
  }, []);

  const handleClientDataChange = useCallback(
    (field: string, value: string | boolean) => {
      setEditedClientData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [],
  );

  // ── Defendant ───────────────────────────────────────────

  const handleEditDefendant = useCallback(
    (defendant: Demandado | null | undefined) => {
      setEditedDefendantData(defendant || null);
      setIsEditingDefendant(true);
    },
    [],
  );

  const handleSaveDefendant = useCallback(async () => {
    if (!editedDefendantData) return;
    setIsEditingDefendant(false);
    const limpio = cleanData(editedDefendantData);
    try {
      const { error } = await supabase
        .from("demandados")
        .update({
          nombre_completo: limpio.nombre_completo,
          lugar_residencia: limpio.lugar_residencia,
          documento: limpio.documento,
          correo: limpio.correo,
          celular: limpio.celular,
        })
        .eq("id_caso", idCaso);
      if (error) throw error;
      await onRefresh();
      toast.success("Información del demandado actualizada");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los datos del demandado");
    } finally {
      setEditedDefendantData(null);
    }
  }, [editedDefendantData, idCaso, onRefresh]);

  const handleCancelDefendantEdit = useCallback(() => {
    setIsEditingDefendant(false);
    setEditedDefendantData(null);
  }, []);

  const handleDefendantDataChange = useCallback(
    (field: string, value: string) => {
      setEditedDefendantData((prev) =>
        prev ? { ...prev, [field]: value } : prev,
      );
    },
    [],
  );

  // ── Case Info ───────────────────────────────────────────

  const handleEditCaseInfo = useCallback(
    (fetchCase: Caso | undefined) => {
      if (!fetchCase) return;
      setEditedCaseData({
        area: fetchCase.area,
        aprobacion_asesor: fetchCase.aprobacion_asesor,
        tipo_proceso: fetchCase.tipo_proceso,
        estudiantes_casos: fetchCase.estudiantes_casos,
        asesores_casos: fetchCase.asesores_casos,
        resumen_hechos: fetchCase.resumen_hechos,
        estado: fetchCase.estado,
        fecha_creacion: fetchCase.fecha_creacion,
        fecha_cierre: fetchCase.fecha_cierre,
        usuarios: fetchCase.usuarios,
        id_caso: fetchCase.id_caso,
        id_usuario: fetchCase.id_usuario,
        observaciones: fetchCase.observaciones,
      });
      setIsEditingCaseInfo(true);
    },
    [],
  );

  const handleSaveCaseInfo = useCallback(
    async (extraFields?: Record<string, any>) => {
      if (!editedCaseData) return;
      setIsEditingCaseInfo(false);
      const limpio = cleanData(editedCaseData);
      try {
        const { error } = await supabase
          .from("casos")
          .update({
            area: limpio.area,
            aprobacion_asesor: limpio.aprobacion_asesor,
            tipo_proceso: limpio.tipo_proceso,
            resumen_hechos: limpio.resumen_hechos,
            estado: limpio.estado,
            observaciones: limpio.observaciones,
            ...extraFields,
          })
          .eq("id_caso", idCaso);
        if (error) throw error;
        await onRefresh();
        toast.success("Información del caso actualizada");
      } catch (err) {
        console.error(err);
        toast.error("Error al guardar los datos del caso");
      } finally {
        setEditedCaseData(null);
      }
    },
    [editedCaseData, idCaso, onRefresh],
  );

  const handleCancelCaseEdit = useCallback(() => {
    setIsEditingCaseInfo(false);
    setEditedCaseData(null);
  }, []);

  const handleCaseDataChange = useCallback(
    (field: string, value: string | boolean) => {
      setEditedCaseData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [],
  );

  return {
    isEditingClient,
    editedClientData,
    isEditingDefendant,
    editedDefendantData,
    isEditingCaseInfo,
    editedCaseData,
    handleEditClient,
    handleSaveClient,
    handleCancelClientEdit,
    handleClientDataChange,
    handleEditDefendant,
    handleSaveDefendant,
    handleCancelDefendantEdit,
    handleDefendantDataChange,
    handleEditCaseInfo,
    handleSaveCaseInfo,
    handleCancelCaseEdit,
    handleCaseDataChange,
  };
}
