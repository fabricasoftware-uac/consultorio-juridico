import { Switch } from "@/components/ui/switch";

export type Turno = "9-11" | "2-4" | "4-6";
export type HorarioDia = { activo: boolean; turno: Turno };
export type HorarioSemana = Record<string, HorarioDia>;

export const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const turnosDisponibles: Turno[] = ["9-11", "2-4", "4-6"];

export const horarioPorDefecto: HorarioSemana = diasSemana.reduce(
  (acc, dia) => {
    acc[dia] = { activo: true, turno: "9-11" };
    return acc;
  },
  {} as HorarioSemana,
);

interface ScheduleEditorProps {
  horario: HorarioSemana;
  onChangeDia: (dia: string, field: keyof HorarioDia, value: any) => void;
}

export function ScheduleEditor({ horario, onChangeDia }: ScheduleEditorProps) {
  return (
    <div className="space-y-6">
      <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-sm font-bold text-slate-400 uppercase tracking-wider">
        <div className="col-span-3">Día</div>
        <div className="col-span-4 text-center">Estado</div>
        <div className="col-span-5 text-center">Turno asignado</div>
      </div>

      {diasSemana.map((dia) => {
        const info = horario[dia] || horarioPorDefecto[dia];
        return (
          <div
            key={dia}
            className={`grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-xl transition-all ${
              info.activo
                ? "bg-blue-50/50 border border-blue-200"
                : "bg-slate-50 border border-transparent opacity-60"
            }`}
          >
            <div className="sm:col-span-3 flex items-center justify-between sm:justify-start">
              <span
                className={`font-bold text-xl sm:text-base ${
                  info.activo ? "text-blue-900" : "text-slate-500"
                }`}
              >
                {dia}
              </span>
              <div className="sm:hidden">
                <label
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl shadow-sm border transition-all active:scale-95 ${
                    info.activo
                      ? "bg-blue-700 border-blue-800 text-white"
                      : "bg-white border-slate-300 text-slate-600"
                  }`}
                >
                  <span className="text-sm font-black uppercase tracking-tight select-none">
                    {info.activo ? "Disponible" : "No disponible"}
                  </span>
                  <Switch
                    checked={info.activo}
                    onCheckedChange={(val) => onChangeDia(dia, "activo", val)}
                    className="scale-125 data-[state=checked]:bg-white data-[state=checked]:[&_span]:bg-blue-700 data-[state=unchecked]:bg-slate-200"
                  />
                </label>
              </div>
            </div>

            <div className="sm:col-span-4 hidden sm:flex justify-center">
              <label
                className={`flex items-center gap-4 cursor-pointer p-2 px-4 rounded-full border-2 transition-all active:scale-95 ${
                  info.activo
                    ? "bg-blue-700 border-blue-800 text-white shadow-lg"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                <span className="text-sm font-black uppercase tracking-wide min-w-[100px] text-center select-none">
                  {info.activo ? "Disponible" : "No disponible"}
                </span>
                <Switch
                  checked={info.activo}
                  onCheckedChange={(val) => onChangeDia(dia, "activo", val)}
                  className="scale-150 data-[state=checked]:bg-white data-[state=checked]:[&_span]:bg-blue-700 data-[state=unchecked]:bg-slate-300"
                />
              </label>
            </div>

            <div
              className={`sm:col-span-5 flex flex-wrap gap-2 justify-center transition-all ${
                !info.activo ? "pointer-events-none grayscale" : ""
              }`}
            >
              {turnosDisponibles.map((t) => (
                <button
                  key={t}
                  onClick={() => onChangeDia(dia, "turno", t)}
                  disabled={!info.activo}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all border-2 ${
                    info.turno === t
                      ? "bg-blue-700 border-blue-800 text-white shadow-md scale-105"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-700"
                  } ${!info.activo ? "opacity-30" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
