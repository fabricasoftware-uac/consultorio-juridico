"use client";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  User,
  MapPin,
  Briefcase,
  FileText,
  Scale,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
} from "lucide-react";
import { ProgressIndicator } from "@radix-ui/react-progress";
import { Caso, Demandado } from "app/types/database";
import { getCasoById } from "../../../../../../../supabase/queries/getCasoById";
import { getDemandadoByCasoId } from "../../../../../../../supabase/queries/getDemandadoByCasoId";
import { getContratoByUsuarioId } from "../../../../../../../supabase/queries/getContratoByUsuarioId";
import { guardarEntrevista } from "../../../../../../../supabase/queries/guardarEntrevista";
import { supabase } from "@/lib/supabase/supabase-client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { cleanData } from "@/lib/utils";
import {
  Step1InfoEntrevista,
  Step2InfoSolicitante,
  Step3QuienSolicita,
  Step4InfoLaboral,
  Step5DatosAccionado,
  Step6InfoContrato,
  Step7DetallesCaso,
  Step8Firmas,
} from "./FormSteps";

const STEPS = [
  { id: 1, title: "Información de la Entrevista", icon: CalendarDays },
  { id: 2, title: "Identificación y Datos Personales", icon: User },
  { id: 3, title: "¿Quién solicita el servicio?", icon: Scale },
  { id: 4, title: "Información Laboral y Financiera", icon: Briefcase },
  { id: 5, title: "Vivienda y Ubicación", icon: MapPin },
  { id: 6, title: "Datos del Accionado", icon: FileText },
  { id: 7, title: "Detalles del Caso", icon: FileText },
  { id: 8, title: "Firmas y Autorización", icon: CheckCircle },
];

export function UserRegistrationForm({ idCaso }: { idCaso: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [caso, setCaso] = useState<Caso>();
  const [demandado, setDemandado] = useState<Demandado | null>();
  const [contrato, setContrato] = useState<import("app/types/database").ContratoLaboral | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  async function traerDatos() {
    try {
      setLoading(true);
      setError("");
      const [
        casoFetch,
        demandadoFetch,
        {
          data: { user },
        },
      ] = await Promise.all([
        getCasoById(idCaso),
        getDemandadoByCasoId(idCaso),
        supabase.auth.getUser(),
      ]);
      setCurrentUserId(user?.id || null);
      if (!casoFetch) {
        setError("Caso no encontrado");
        return;
      }

      setCaso(casoFetch);
      setDemandado(demandadoFetch);

      // Cargar contrato si existe
      if (casoFetch.usuarios?.id_usuario) {
        const contratoFetch = await getContratoByUsuarioId(casoFetch.usuarios.id_usuario);
        setContrato(contratoFetch);
      }
    } catch (err) {
      console.error(err);
      setError("Error al obtener los datos del caso");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    traerDatos();
  }, []);

  useEffect(() => {
    if (!caso?.usuarios) return;
    const u = caso.usuarios;
    setFormData((prev) => ({
      ...prev,
      correo_contacto: prev.correo_contacto || u.correo || "",
      edad: prev.edad || String(u.edad ?? ""),
      contacto_familiar: prev.contacto_familiar || u.contacto_familiar || "",
      estado_civil: prev.estado_civil || u.estado_civil || "",
      estrato: prev.estrato || String(u.estrato ?? ""),
      direccion: prev.direccion || u.direccion || "",
      tipo_vivienda: prev.tipo_vivienda || u.tipo_vivienda || "",
      tiene_representado: prev.tiene_representado || String(u.tiene_representado ?? ""),
      situacion_laboral: prev.situacion_laboral || u.situacion_laboral || "",
      otros_ingresos: prev.otros_ingresos ?? u.otros_ingresos ?? false,
      valor_otros_ingresos: prev.valor_otros_ingresos || String(u.valor_otros_ingresos ?? ""),
      concepto_otros_ingresos: prev.concepto_otros_ingresos || u.concepto_otros_ingresos || "",
      tiene_contrato: prev.tiene_contrato ?? u.tiene_contrato ?? false,
      tipo_documento: prev.tipo_documento || u.tipo_documento || "CC",
      fecha_expedicion_doc: prev.fecha_expedicion_doc || u.fecha_expedicion_doc || "",
      ciudad_expedicion: prev.ciudad_expedicion || u.ciudad_expedicion || "",
      fecha_nacimiento: prev.fecha_nacimiento || u.fecha_nacimiento || "",
      nacionalidad: prev.nacionalidad || u.nacionalidad || "",
      identidad_genero: prev.identidad_genero || u.identidad_genero || null,
      orientacion_sexual: prev.orientacion_sexual || u.orientacion_sexual || null,
      escolaridad: prev.escolaridad || u.escolaridad || "",
      grupo_etnico: prev.grupo_etnico || u.grupo_etnico || "",
      barrio: prev.barrio || u.barrio || "",
      zona: prev.zona || u.zona || "",
      tenencia_vivienda: prev.tenencia_vivienda || u.tenencia_vivienda || "",
      comuna: prev.comuna || u.comuna || "",
      tiene_sisben: prev.tiene_sisben ?? u.tiene_sisben ?? null,
      personas_cargo: prev.personas_cargo ?? u.personas_cargo ?? null,
      rango_salarial: prev.rango_salarial || u.rango_salarial || "",
      servicios_publicos: prev.servicios_publicos || u.servicios_publicos || "",
      sabe_leer: prev.sabe_leer ?? u.sabe_leer ?? null,
      discapacidad: prev.discapacidad || u.discapacidad || "",
      condicion_actual: prev.condicion_actual || u.condicion_actual || "",
      enfoque_diverso: prev.enfoque_diverso ?? u.enfoque_diverso ?? null,
      caracterizacion_lgbtiq: prev.caracterizacion_lgbtiq || u.caracterizacion_lgbtiq || null,
    }));
  }, [caso?.usuarios]);

  useEffect(() => {
    if (!demandado) return;
    setFormData((prev) => ({
      ...prev,
      sinDemandado: false,
      nombreDemandado: prev.nombreDemandado || demandado.nombre_completo || "",
      documentoDemandado: prev.documentoDemandado || demandado.documento || "",
      celularDemandado: prev.celularDemandado || demandado.celular || "",
      lugarResidenciaDemandado: prev.lugarResidenciaDemandado || demandado.lugar_residencia || "",
      correoDemandado: prev.correoDemandado || demandado.correo || "",
    }));
  }, [demandado]);

  useEffect(() => {
    if (!contrato) return;
    setFormData((prev) => ({
      ...prev,
      tipoContrato: prev.tipoContrato || contrato.tipo_contrato || "",
      nombreRepresentanteLegal: prev.nombreRepresentanteLegal || contrato.representante_legal || "",
      direccionEmpresa: prev.direccionEmpresa || contrato.direccion_empresa || "",
      correoEmpleador: prev.correoEmpleador || contrato.correo_patrono || "",
      fechaInicio: prev.fechaInicio || contrato.fecha_inicio || "",
      fechaTerminacion: prev.fechaTerminacion || contrato.fecha_fin || "",
      continuaContrato: prev.continuaContrato || contrato.continua || false,
      salarioInicial: prev.salarioInicial || String(contrato.salario_inicial ?? ""),
      salarioActual: prev.salarioActual || String(contrato.salario_actual ?? ""),
    }));
  }, [contrato]);

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const initialFormData = {
    // Interview Information
    area: "",

    // Informacion Solicitante
    edad: "",
    contacto_familiar: "",
    estado_civil: "",
    estrato: "",
    direccion: "",
    tipo_vivienda: "",
    tiene_representado: "",

    // Informacion Financiera
    situacion_laboral: "",
    otros_ingresos: false,
    valor_otros_ingresos: "",
    concepto_otros_ingresos: "",
    tiene_contrato: false,

    // Defendant Information
    sinDemandado: false,
    nombreDemandado: "",
    documentoDemandado: "",
    celularDemandado: "",
    lugarResidenciaDemandado: "",
    correoDemandado: "",

    // Employment Contract Information
    tipoContrato: "",
    nombreRepresentanteLegal: "",
    direccionEmpresa: "",
    correoEmpleador: "",
    fechaInicio: "",
    fechaTerminacion: "",
    continuaContrato: false,
    salarioInicial: "",
    salarioActual: "",

    // Characterization
    enfoque_diverso: null as boolean | null,
    caracterizacion_lgbtiq: null as string | null,
    correo_contacto: "",

    // Document ID
    tipo_documento: "CC",
    fecha_expedicion_doc: "",
    ciudad_expedicion: "",
    fecha_nacimiento: "",
    nacionalidad: "",

    // Gender & Orientation
    identidad_genero: null as string | null,
    orientacion_sexual: null as string | null,

    // Sociodemographic
    escolaridad: "",
    grupo_etnico: "",
    barrio: "",
    zona: "",
    tenencia_vivienda: "",
    comuna: "",
    tiene_sisben: null as boolean | null,
    personas_cargo: null as number | null,
    rango_salarial: "",
    servicios_publicos: "",
    sabe_leer: null as boolean | null,
    discapacidad: "",
    condicion_actual: "",

    // Case Information
    resumen_hechos: "",
    observaciones_estudiante: "",

    // Signatures
    firmasSolicitante: false,
    cedulaSolicitante: "",
  };

  type FormData = typeof initialFormData;

  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`entrevista_draft_${idCaso}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to restore draft", e);
        }
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `entrevista_draft_${idCaso}`,
        JSON.stringify(formData),
      );
    }
  }, [formData, idCaso]);

  const CAMPOS_SOLO_DIGITOS = new Set([
    "edad",
    "documentoDemandado",
    "celularDemandado",
    "cedulaSolicitante",
    "estrato",
    "valor_otros_ingresos",
    "salarioInicial",
    "salarioActual",
  ]);

  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    const limpio =
      CAMPOS_SOLO_DIGITOS.has(field as string) && typeof value === "string"
        ? (value.replace(/\D/g, "") as FormData[K])
        : value;
    setFormData((prev) => ({
      ...prev,
      [field]: limpio,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return true; // No required fields
      case 2:
        return !!(
          formData.direccion &&
          formData.edad &&
          Number(formData.edad) > 0 &&
          formData.estado_civil &&
          formData.estrato &&
          formData.tipo_vivienda
        );
      case 3:
        return !!formData.tiene_representado;
      case 4:
        return !!formData.situacion_laboral;
      case 5:
        return formData.sinDemandado ? true : !!formData.nombreDemandado;
      case 6:
        return true; // Optional section
      case 7:
        return !!formData.area; // Area is required
      case 8:
        return !!(formData.firmasSolicitante && formData.cedulaSolicitante);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(8)) return;

    try {
      setLoading(true);
      const limpio = cleanData(formData);
      const userId = currentUserId;

      if (!userId) {
        throw new Error("No se encontró la sesión del estudiante");
      }

      // 1. Caso payload
      const casoPayload = {
        area: limpio.area,
        resumen_hechos: limpio.resumen_hechos,
        observaciones_estudiante: limpio.observaciones_estudiante,
      };

      // 2. Usuario payload
      const usuarioPayload = {
        correo: limpio.correo_contacto,
        edad: limpio.edad,
        contacto_familiar: limpio.contacto_familiar,
        estado_civil: limpio.estado_civil,
        estrato: limpio.estrato,
        direccion: limpio.direccion,
        tipo_vivienda: limpio.tipo_vivienda,
        tiene_representado: limpio.tiene_representado,
        situacion_laboral: limpio.situacion_laboral,
        otros_ingresos: limpio.otros_ingresos,
        valor_otros_ingresos: limpio.valor_otros_ingresos,
        concepto_otros_ingresos: limpio.concepto_otros_ingresos,
        tiene_contrato: limpio.tiene_contrato,
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
        enfoque_diverso: limpio.enfoque_diverso,
        caracterizacion_lgbtiq: limpio.caracterizacion_lgbtiq,
      };

      // 3. Demandado payload (opcional)
      const tieneDemandado = !limpio.sinDemandado && limpio.nombreDemandado;
      const demandadoPayload = tieneDemandado
        ? {
            nombre_completo: limpio.nombreDemandado,
            documento: limpio.documentoDemandado,
            celular: limpio.celularDemandado,
            lugar_residencia: limpio.lugarResidenciaDemandado,
            correo: limpio.correoDemandado,
          }
        : null;

      // 4. Contrato payload (opcional)
      const tieneContratoDatos = limpio.tiene_contrato && limpio.tipoContrato;
      const contratoPayload = tieneContratoDatos
        ? {
            tipo_contrato: limpio.tipoContrato,
            representante_legal: limpio.nombreRepresentanteLegal,
            direccion_empresa: limpio.direccionEmpresa,
            correo_patrono: limpio.correoEmpleador,
            fecha_inicio: limpio.fechaInicio,
            fecha_fin: limpio.fechaTerminacion,
            continua: limpio.continuaContrato,
            salario_inicial: limpio.salarioInicial,
            salario_actual: limpio.salarioActual,
          }
        : null;

      // 5. Llamada atomica RPC: todo o nada
      await guardarEntrevista({
        idCaso: Number(idCaso),
        usuarioId: userId,
        caso: casoPayload,
        usuario: usuarioPayload,
        demandado: demandadoPayload,
        contrato: contratoPayload,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem(`entrevista_draft_${idCaso}`);
      }
      toast.success("Entrevista completada exitosamente");
      router.push(`/estudiante/mis-casos`);
      clearForm();
    } catch (err: any) {
      console.error("❌ Error durante la actualización:", err);
      toast.error(err.message || "Ocurrió un error al guardar la entrevista. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };




  const progress = (currentStep / STEPS.length) * 100;
  const currentStepData = STEPS.find((step) => step.id === currentStep);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1InfoEntrevista
            caso={caso}
            currentUserId={currentUserId}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <Step2InfoSolicitante
            caso={caso}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <Step3QuienSolicita
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <Step4InfoLaboral
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <Step5DatosAccionado
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <Step6InfoContrato
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <Step7DetallesCaso
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 8:
        return (
          <Step8Firmas
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">
          Cargando formulario...
        </p>
      </div>
    );
  }

  if (error && !caso) {
    return (
      <Card className="p-4 sm:p-8 text-center border-red-200 bg-red-50">
        <p className="text-red-600 font-medium">{error}</p>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mt-4"
        >
          Volver
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Progress Bar Container */}
      <div className="backdrop-blur-md bg-white/70 border border-white/20 p-4 sm:p-6 rounded-2xl shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscripción de Caso
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Paso {currentStep} de {STEPS.length}
            </p>
          </div>
          <div className="text-left sm:text-right flex items-center gap-3">
            <Button variant="outline" size="sm" className="text-xs" onClick={async () => {
              const ExcelJS = (await import("exceljs")).default;
              const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet("Entrevista");
              ws.columns = Object.keys(formData).map(k=>({header:k,key:k,width:25}));
              ws.addRow(formData);
              const buf = await wb.xlsx.writeBuffer();
              const blob = new Blob([buf]); const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `entrevista_${idCaso}.xlsx`; a.click(); URL.revokeObjectURL(url);
              toast.success("Formulario exportado a Excel");
            }}>
              <Download className="w-3.5 h-3.5 mr-1" />Exportar
            </Button>
            <span className="text-2xl font-black text-blue-600">
              {Math.round(progress)}%
            </span>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
              Completado
            </p>
          </div>
        </div>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
          <div
            className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Title Integrated */}
        {currentStepData && (
          <div className="flex items-center gap-3 mt-6 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="p-2 bg-blue-600 rounded-lg shadow-blue-200 shadow-lg">
              <currentStepData.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 leading-none">
                {currentStepData.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Por favor, complete la información requerida en esta sección.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!validateStep(8)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              Enviar Formulario
            </Button>
          )}
        </div>
      </form>

      {/* Step Indicators */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200">
          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isDisabled = step.id > currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (!isDisabled) setCurrentStep(step.id);
                }}
                disabled={isDisabled}
                className={`
                  relative group transition-all duration-300 flex items-center justify-center
                  ${isCurrent ? "w-10" : "w-3"} h-3 rounded-full
                  ${isCurrent ? "bg-blue-600 shadow-md shadow-blue-200" : isCompleted ? "bg-green-500" : "bg-slate-300"}
                  ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}
                `}
                aria-label={`Ir al paso ${step.id}: ${step.title}`}
              >
                {isCurrent && (
                  <span className="text-[8px] font-black text-white uppercase tracking-tighter">
                    {step.id}
                  </span>
                )}
                {/* Tooltip on hover */}
                {!isDisabled && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {step.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
