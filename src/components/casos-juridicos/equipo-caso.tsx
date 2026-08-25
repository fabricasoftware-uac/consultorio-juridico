"use client";

import { StudentInfo } from "@/components/casos-juridicos/student-info";
import { AdvisorInfo } from "@/components/casos-juridicos/advisor-info";
import type { Caso } from "app/types/database";

/**
 * Pestaña "Equipo": estudiantes y asesores del caso.
 *
 * Antes esto estaba partido por rol: pro-apoyo y asesor veían una pestaña
 * "Datos estudiante" (solo estudiantes), el estudiante veía "Asesor" (solo
 * asesores) y admin no veía ninguna de las dos. Son las dos mitades de lo
 * mismo, así que se muestran juntas y todos los roles ven el equipo completo.
 */
export function EquipoCaso({ caso }: { caso: Caso | undefined }) {
  const estudiantes = caso?.estudiantes_casos?.map((ec) => ec.estudiante) ?? [];
  const asesores = caso?.asesores_casos?.map((ac) => ac.asesor) ?? [];

  return (
    <div className="space-y-6">
      <StudentInfo students={estudiantes} isEditing={false} onDataChange={() => {}} />
      <AdvisorInfo advisors={asesores} />
    </div>
  );
}
