import { FileText, Users, ClipboardCheck, Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: "registro" | "asignacion" | "resumen";
}

const steps = [
  { id: "registro", title: "Registro", description: "Información del usuario", icon: FileText },
  { id: "asignacion", title: "Asignación", description: "Estudiante y asesor", icon: Users },
  { id: "resumen", title: "Resumen", description: "Confirmación del caso", icon: ClipboardCheck },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto py-4">
      {/* Steps */}
      <div className="relative flex items-center justify-between">
        {/* Línea de fondo */}
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-200 rounded-full" />

        {/* Línea activa con gradiente */}
        <div
          className="absolute top-5 left-4 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: currentIndex === 0 ? "0%" : currentIndex === 1 ? "50%" : "100%" }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
              {/* Círculo */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-500 shadow-sm
                  ${isCompleted
                    ? "bg-emerald-500 scale-100 shadow-emerald-200"
                    : isCurrent
                      ? "bg-blue-600 scale-110 shadow-blue-200"
                      : "bg-white border-2 border-slate-200"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
                ) : (
                  <Icon
                    className={`h-5 w-5 transition-colors ${isCurrent ? "text-white" : "text-slate-400"}`}
                  />
                )}
              </div>

              {/* Etiquetas */}
              <div className="mt-3 text-center">
                <p
                  className={`
                    text-xs font-bold transition-colors tracking-tight
                    ${isCompleted ? "text-emerald-600" : isCurrent ? "text-blue-600" : "text-slate-400"}
                  `}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
