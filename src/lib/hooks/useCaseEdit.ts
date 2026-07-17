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
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [editedContractData, setEditedContractData] = useState<any>(null);

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
          enfoque_diverso: limpio.enfoque_diverso,
          caracterizacion_lgbtiq: limpio.caracterizacion_lgbtiq,
          tipo_documento: limpio.tipo_documento,
          fecha_expedicion_doc: limpio.fecha_expedicion_doc,
          ciudad_expedicion: limpio.ciudad_expedicion,
          fecha_nacimiento: limpio.fecha_nacimiento,
          nacionalidad: limpio.nacionalidad,
          identidad_genero: limpio.identidad_genero,
          orientacion_sexual: limpio.orientacion_sexual,
          escolaridad: limpio.escolaridad,
          grupo_etnico: limpio.grupo_etnico,
          barrio: limpio.barrio,
          zona: limpio.zona,
          tenencia_vivienda: limpio.tenencia_vivienda,
          comuna: limpio.comuna,
          tiene_sisben: limpio.tiene_sisben,
          personas_cargo: limpio.personas_cargo,
          rango_salarial: limpio.rango_salarial,
          servicios_publicos: limpio.servicios_publicos,
          sabe_leer: limpio.sabe_leer,
          discapacidad: limpio.discapacidad,
          condicion_actual: limpio.condicion_actual,
          tiene_representado: limpio.tiene_representado,
          tiene_contrato: limpio.tiene_contrato,
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
      if (defendant) {
        setEditedDefendantData(defendant);
      } else {
        // Si no existe demandado, inicializar objeto vacío para permitir creación
        setEditedDefendantData({
          id_caso: Number(idCaso),
          nombre_completo: "",
          documento: "",
          celular: "",
          lugar_residencia: "",
          correo: "",
        } as Demandado);
      }
      setIsEditingDefendant(true);
    },
    [idCaso],
  );

  const handleSaveDefendant = useCallback(async () => {
    if (!editedDefendantData) return;
    setIsEditingDefendant(false);
    const limpio = cleanData(editedDefendantData);
    try {
      const { data: existing } = await supabase
        .from("demandados")
        .select("id_demandado")
        .eq("id_caso", Number(idCaso))
        .maybeSingle();

      const payload = {
        id_caso: Number(idCaso),
        nombre_completo: limpio.nombre_completo,
        lugar_residencia: limpio.lugar_residencia,
        documento: limpio.documento,
        correo: limpio.correo,
        celular: limpio.celular,
      };

      if (existing) {
        const { error } = await supabase
          .from("demandados")
          .update(payload)
          .eq("id_caso", Number(idCaso));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("demandados").insert(payload);
        if (error) throw error;
      }

      await onRefresh();
      toast.success("Información del demandado guardada");
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
      setEditedDefendantData((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: value };
      });
    },
    [],
  );

  // ── Case Info ───────────────────────────────────────────

  const handleEditCaseInfo = useCallback(
    (fetchCase: Caso | undefined) => {
      if (!fetchCase) return;
      setEditedCaseData({
        area: fetchCase.area,
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

  // ── Contract ─────────────────────────────────────────────

  const handleEditContract = useCallback((contract: any) => {
    setEditedContractData(contract || {});
    setIsEditingContract(true);
  }, []);

  const handleSaveContract = useCallback(async () => {
    if (!editedContractData) return;
    setIsEditingContract(false);
    const limpio = cleanData(editedContractData);
    try {
      const { error } = await supabase
        .from("contratos_laborales")
        .upsert({
          id_usuario: limpio.id_usuario,
          tipo_contrato: limpio.tipo_contrato,
          representante_legal: limpio.representante_legal,
          direccion_empresa: limpio.direccion_empresa,
          correo_patrono: limpio.correo_patrono,
          fecha_inicio: limpio.fecha_inicio,
          fecha_fin: limpio.fecha_fin,
          continua: limpio.continua,
          salario_inicial: limpio.salario_inicial,
          salario_actual: limpio.salario_actual,
        }, { onConflict: "id_usuario" });
      if (error) throw error;
      await onRefresh();
      toast.success("Información del contrato actualizada");
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar los datos del contrato");
    } finally {
      setEditedContractData(null);
    }
  }, [editedContractData, onRefresh]);

  const handleCancelContractEdit = useCallback(() => {
    setIsEditingContract(false);
    setEditedContractData(null);
  }, []);

  const handleContractDataChange = useCallback(
    (field: string, value: string | boolean) => {
      setEditedContractData((prev: any) => (prev ? { ...prev, [field]: value } : prev));
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
    isEditingContract,
    editedContractData,
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
    handleEditContract,
    handleSaveContract,
    handleCancelContractEdit,
    handleContractDataChange,
  };
}
