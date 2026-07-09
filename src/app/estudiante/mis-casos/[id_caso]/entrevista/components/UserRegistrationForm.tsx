"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { insertAuditEvent } from "../../../../../../../supabase/queries/auditoriaCasos";
import { supabase } from "@/lib/supabase/supabase-client";
import { Switch } from "@/components/ui/switch";
import { Tienne } from "next/font/google";
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
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    if (caso?.usuarios.correo && !formData.correo_contacto) {
      setFormData((prev) => ({ ...prev, correo_contacto: caso.usuarios.correo }));
    }
  }, [caso?.usuarios.correo]);

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
    const limpio = cleanData(formData);
    if (!validateStep(8)) return;

    try {
      //Actualizar caso
      const { error: errorCaso } = await supabase
        .from("casos")
        .update({
          area: limpio.area,
          resumen_hechos: limpio.resumen_hechos,
          observaciones_estudiante: limpio.observaciones_estudiante,
          estado: "pendiente_aprobacion",
          fecha_vencimiento_asesor: new Date(
            Date.now() + 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        })
        .eq("id_caso", idCaso);

      if (errorCaso)
        throw new Error(`Error actualizando caso: ${errorCaso.message}`);

      if (limpio.correo_contacto && caso?.usuarios.id_usuario) {
        await supabase
          .from("usuarios")
          .update({ correo: limpio.correo_contacto })
          .eq("id_usuario", caso.usuarios.id_usuario);
      }

      // Auto-resolver llamado de atencion del estudiante si existe
      await supabase
        .from("llamados_atencion")
        .update({ resuelto: true, fecha_resolucion: new Date().toISOString() })
        .eq("id_caso", idCaso)
        .eq("tipo", "estudiante")
        .eq("resuelto", false);

      await insertAuditEvent(
        idCaso,
        "entrevista",
        "El estudiante completó la entrevista y envió el caso para aprobación del asesor.",
      );
      if (typeof window !== "undefined") {
        localStorage.removeItem(`entrevista_draft_${idCaso}`);
      }
      toast.success("Entrevista completada exitosamente");
      router.push(`/estudiante/mis-casos`);
      clearForm();
    } catch (err) {
      console.error("❌ Error durante la actualización:", err);
      alert(`Ocurrió un error: ${(err as Error).message}`);
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
      <Card className="p-8 text-center border-red-200 bg-red-50">
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
      <div className="backdrop-blur-md bg-white/70 border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Inscripción de Caso
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              Paso {currentStep} de {STEPS.length}
            </p>
          </div>
          <div className="text-right flex items-center gap-3">
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {successMessage.includes("✅")
                ? "Actualización Exitosa"
                : "Error"}
            </DialogTitle>
            <DialogDescription className="text-center">
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
