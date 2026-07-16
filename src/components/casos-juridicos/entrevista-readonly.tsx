import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/components/ui/status-badge";
import type { Caso, Demandado, ContratoLaboral } from "app/types/database";
import React from "react";

interface Props {
  caso: Caso;
  demandado: Demandado | null;
  contrato: ContratoLaboral | null;
}

function Field({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === null || value === undefined || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Sí" : "No") : String(value);
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 px-4 py-2.5 items-baseline">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 break-words">{display}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const hasContent = React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    const v = (child.props as { value?: unknown }).value;
    return v !== null && v !== undefined && v !== "";
  });

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {title}
      </h4>
      <div className="bg-slate-50/50 rounded-lg border border-slate-100 divide-y divide-slate-100">
        {hasContent ? children : (
          <p className="px-4 py-3 text-xs text-slate-400 italic">Sin información registrada</p>
        )}
      </div>
    </div>
  );
}

export function EntrevistaReadonly({ caso, demandado, contrato }: Props) {
  const u = caso.usuarios;

  return (
    <div className="space-y-6">
      {/* Estado del caso */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="text-xs font-mono">
          Caso #{caso.id_caso}
        </Badge>
        {getStatusBadge(caso.estado)}
      </div>

      <Section title="Información de la Entrevista">
        <Field label="Fecha de creación" value={caso.fecha_creacion?.split("T")[0]} />
        <Field label="Fecha de entrega" value={caso.fecha_entrega_entrevista?.split("T")[0]} />
        <Field label="Período" value={caso.periodo} />
        <Field label="Nombre completo" value={u.nombre_completo} />
        <Field label="Correo" value={u.correo} />
        <Field label="Teléfono" value={u.telefono} />
        <Field label="Cédula" value={u.cedula} />
        <Field label="Sexo" value={u.sexo} />
      </Section>

      <Section title="Identificación">
        <Field label="Tipo de documento" value={u.tipo_documento} />
        <Field label="Fecha de expedición" value={u.fecha_expedicion_doc} />
        <Field label="Ciudad de expedición" value={u.ciudad_expedicion} />
        <Field label="Fecha de nacimiento" value={u.fecha_nacimiento} />
        <Field label="Nacionalidad" value={u.nacionalidad} />
        <Field label="Edad" value={u.edad} />
        <Field label="Contacto familiar" value={u.contacto_familiar} />
        <Field label="Estado civil" value={u.estado_civil} />
        <Field label="Estrato" value={u.estrato} />
        <Field label="Dirección" value={u.direccion} />
        <Field label="Tipo de vivienda" value={u.tipo_vivienda} />
      </Section>

      <Section title="Identidad y Orientación">
        <Field label="Identidad de género" value={u.identidad_genero} />
        <Field label="Orientación sexual" value={u.orientacion_sexual} />
        <Field label="Enfoque diverso" value={u.enfoque_diverso} />
        <Field label="Caracterización LGBTIQ+" value={u.caracterizacion_lgbtiq} />
      </Section>

      <Section title="Sociodemográfico">
        <Field label="Escolaridad" value={u.escolaridad} />
        <Field label="Grupo étnico" value={u.grupo_etnico} />
        <Field label="Barrio" value={u.barrio} />
        <Field label="Zona" value={u.zona} />
        <Field label="Tenencia de vivienda" value={u.tenencia_vivienda} />
        <Field label="Comuna" value={u.comuna} />
        <Field label="Tiene SISBEN" value={u.tiene_sisben} />
        <Field label="Personas a cargo" value={u.personas_cargo} />
        <Field label="Rango salarial" value={u.rango_salarial} />
        <Field label="Servicios públicos" value={u.servicios_publicos} />
        <Field label="Sabe leer" value={u.sabe_leer} />
        <Field label="Discapacidad" value={u.discapacidad} />
        <Field label="Condición actual" value={u.condicion_actual} />
      </Section>

      <Section title="¿Quién solicita el servicio?">
        <Field label="¿A nombre propio?" value={u.tiene_representado === true ? "Sí" : u.tiene_representado === false ? "Representante" : null} />
      </Section>

      <Section title="Información Laboral y Financiera">
        <Field label="Situación laboral" value={u.situacion_laboral} />
        <Field label="Otros ingresos" value={u.otros_ingresos} />
        <Field label="Valor otros ingresos" value={u.valor_otros_ingresos} />
        <Field label="Concepto otros ingresos" value={u.concepto_otros_ingresos} />
        <Field label="¿Tiene contrato?" value={u.tiene_contrato} />
      </Section>

      <Section title="Datos del Accionado">
        <Field label="Sin demandado" value={demandado ? "No" : "Sí"} />
        <Field label="Nombre" value={demandado?.nombre_completo} />
        <Field label="Documento" value={demandado?.documento} />
        <Field label="Celular" value={demandado?.celular} />
        <Field label="Lugar de residencia" value={demandado?.lugar_residencia} />
        <Field label="Correo" value={demandado?.correo} />
      </Section>

      <Section title="Información del Contrato Laboral">
        <Field label="Tipo de contrato" value={contrato?.tipo_contrato} />
        <Field label="Representante legal" value={contrato?.representante_legal} />
        <Field label="Dirección empresa" value={contrato?.direccion_empresa} />
        <Field label="Correo patrono" value={contrato?.correo_patrono} />
        <Field label="Fecha inicio" value={contrato?.fecha_inicio} />
        <Field label="Fecha fin" value={contrato?.fecha_fin} />
        <Field label="¿Continúa?" value={contrato?.continua} />
        <Field label="Salario inicial" value={contrato?.salario_inicial} />
        <Field label="Salario actual" value={contrato?.salario_actual} />
      </Section>

      <Section title="Detalles del Caso">
        <Field label="Área" value={caso.area} />
        <Field label="Resumen de los hechos" value={caso.resumen_hechos} />
        <Field label="Observaciones del estudiante" value={caso.observaciones_estudiante} />
      </Section>
    </div>
  );
}
