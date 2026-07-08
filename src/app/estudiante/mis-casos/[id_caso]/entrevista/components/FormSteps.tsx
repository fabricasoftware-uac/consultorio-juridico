import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, MapPin, Briefcase, FileText, Scale, CheckCircle } from "lucide-react";
import { Caso } from "app/types/database";

function toggleMulti(list: string, item: string): string {
  const arr = list?.split(",").filter(Boolean) ?? [];
  return arr.includes(item) ? arr.filter((x) => x !== item).join(",") : [...arr, item].join(",");
}

export interface StepProps {
  formData: any;
  handleInputChange: (field: any, value: any) => void;
  caso?: Caso;
  currentUserId?: string | null;
}

const CARD = "border-slate-200 shadow-sm rounded-2xl";
const INP = "bg-white border-slate-200 rounded-lg h-10 text-sm";
const INP_DISABLED = "bg-slate-50 border-slate-200 rounded-lg h-10 text-sm text-slate-500";
const SEL = "bg-white border-slate-200 rounded-lg h-10 text-sm";
const LABEL = "text-xs font-medium text-slate-600";
const SECTION = "text-[11px] font-bold text-slate-400 uppercase tracking-wider";

// ─── STEP 1 ──────────────────────────────────────────────────────────────────

export function Step1InfoEntrevista({ caso, currentUserId }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-blue-100 rounded-xl"><CalendarDays className="h-5 w-5 text-blue-600" /></div>
          Información de la Entrevista
        </CardTitle>
        <CardDescription>Datos básicos de la entrevista legal</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className={LABEL}>Fecha creación</Label>
          <Input className={INP_DISABLED} type="date" value={caso?.fecha_creacion ? new Date(caso.fecha_creacion).toISOString().split("T")[0] : ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Nombre del Entrevistador</Label>
          <Input className={INP_DISABLED} value={caso?.estudiantes_casos?.[0]?.estudiante?.perfil?.nombre_completo || "No asignado"} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Celular Entrevistador</Label>
          <Input className={INP_DISABLED} value={caso?.estudiantes_casos?.find((ec) => ec.estudiante?.id_perfil === currentUserId)?.estudiante?.perfil?.telefono || caso?.estudiantes_casos?.[0]?.estudiante?.perfil?.telefono || "No asignado"} disabled />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── STEP 2 ──────────────────────────────────────────────────────────────────

export function Step2InfoSolicitante({ formData, handleInputChange, caso }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-blue-100 rounded-xl"><User className="h-5 w-5 text-blue-600" /></div>
          Información del Solicitante
        </CardTitle>
        <CardDescription>Datos personales, identificación, identidad y vivienda</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── Datos personales ── */}
        <div className="md:col-span-2 mb-1">
          <Separator className="mb-3" />
          <p className={SECTION}>Datos personales</p>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className={LABEL}>Nombre Completo</Label>
          <Input className={INP_DISABLED} value={caso?.usuarios.nombre_completo || ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Sexo</Label>
          <Input className={INP_DISABLED} value={caso?.usuarios.sexo?.replace(/_/g, " ") || ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Edad *</Label>
          <Input className={INP} type="number" min={0} value={formData.edad || ""} onChange={(e) => handleInputChange("edad", e.target.value)} placeholder="Edad" />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Cédula</Label>
          <Input className={INP_DISABLED} value={caso?.usuarios.cedula || ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Teléfono</Label>
          <Input className={INP_DISABLED} value={caso?.usuarios.telefono || ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Correo electrónico</Label>
          <Input className={INP_DISABLED} value={caso?.usuarios.correo || ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Contacto familiar</Label>
          <Input className={INP} value={formData.contacto_familiar || ""} onChange={(e) => handleInputChange("contacto_familiar", e.target.value)} placeholder="Nombre y teléfono" />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Estado Civil *</Label>
          <Select value={formData.estado_civil || ""} onValueChange={(v) => handleInputChange("estado_civil", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{["soltero","casado","union libre","viudo","divorciado","otro"].map(o=><SelectItem key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1).replace("_"," ")}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Estrato *</Label>
          <Select value={formData.estrato || ""} onValueChange={(v) => handleInputChange("estrato", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{[1,2,3,4,5,6].map(n=><SelectItem key={n} value={String(n)}>Estrato {n}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className={LABEL}>Dirección *</Label>
          <Input className={INP} value={formData.direccion || ""} onChange={(e) => handleInputChange("direccion", e.target.value)} placeholder="Dirección completa" />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Tipo de vivienda *</Label>
          <Select value={formData.tipo_vivienda || ""} onValueChange={(v) => handleInputChange("tipo_vivienda", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{["propia","arrendada","familiar","otra"].map(o=><SelectItem key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        {/* ── Documento de Identidad ── */}
        <div className="md:col-span-2 mt-4 mb-1">
          <Separator className="mb-3" />
          <p className={SECTION}>Documento de Identidad</p>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Tipo de documento</Label>
          <Select value={formData.tipo_documento || "CC"} onValueChange={(v) => handleInputChange("tipo_documento", v)}>
            <SelectTrigger className={SEL}><SelectValue /></SelectTrigger>
            <SelectContent>{["CC - Cédula","CE - Extranjería","PEP","NUIP"].map(o=>{const [v]=o.split(" - ");return<SelectItem key={v} value={v}>{o}</SelectItem>})}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Fecha de expedición</Label>
          <Input className={INP} type="date" value={formData.fecha_expedicion_doc || ""} onChange={(e) => handleInputChange("fecha_expedicion_doc", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Ciudad de expedición</Label>
          <Input className={INP} value={formData.ciudad_expedicion || ""} onChange={(e) => handleInputChange("ciudad_expedicion", e.target.value)} placeholder="Ej: Popayán" />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Fecha de nacimiento</Label>
          <Input className={INP} type="date" value={formData.fecha_nacimiento || ""} onChange={(e) => handleInputChange("fecha_nacimiento", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Nacionalidad</Label>
          <Input className={INP} value={formData.nacionalidad || ""} onChange={(e) => handleInputChange("nacionalidad", e.target.value)} placeholder="Ej: Colombiana" />
        </div>

        {/* ── Sociodemográficos ── */}
        <div className="md:col-span-2 mt-4 mb-1">
          <Separator className="mb-3" />
          <p className={SECTION}>Datos Sociodemográficos</p>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Escolaridad</Label>
          <Select value={formData.escolaridad || ""} onValueChange={(v) => handleInputChange("escolaridad", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{["Primaria completa","Bachillerato incompleto","Bachillerato completo","Técnico","Tecnólogo","Profesional","Pregrado","Posgrado","Ninguno","No informa"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Grupo étnico</Label>
          <Select value={formData.grupo_etnico || ""} onValueChange={(v) => handleInputChange("grupo_etnico", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{["Indígena","Rom","Raizal","Palenquero","Mestizo","Comunidad negra","Afrocolombiano","Prefiero no decirlo","No informa","Otro"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardContent>

      {/* ── Caracterización ── */}
      {caso?.usuarios?.enfoque_diverso != null ? (
        <div className="px-6 pb-6">
          <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 text-sm text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">Caracterización registrada</p>
            <p>Enfoque diverso: <strong>{caso.usuarios.enfoque_diverso === true ? "Sí" : "No"}</strong></p>
            {caso.usuarios.caracterizacion_lgbtiq && <p>Se identifica como: <strong>{caso.usuarios.caracterizacion_lgbtiq.replace(/_/g, " ")}</strong></p>}
            <p className="text-xs text-slate-400 mt-1">Registrado durante la recepción del caso.</p>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Caracterización con enfoque diferencial</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Información voluntaria del usuario. Estos datos se solicitan únicamente para fines de caracterización poblacional.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">¿Se reconoce como parte de una población con orientación sexual o identidad de género diversa?</Label>
              <Select value={formData.enfoque_diverso === true ? "true" : formData.enfoque_diverso === false ? "false" : ""} onValueChange={(val) => {
                if (val === "true") handleInputChange("enfoque_diverso", true);
                else { handleInputChange("enfoque_diverso", val === "false" ? false : null); handleInputChange("caracterizacion_lgbtiq", null); }
              }}>
                <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione una opción" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="null">Prefiero no responder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.enfoque_diverso === true && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className={LABEL}>Identidad de género</Label>
                  <Select value={formData.identidad_genero || ""} onValueChange={(v) => handleInputChange("identidad_genero", v || null)}>
                    <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{["Femenino","Masculino","No binario","Diverso","Género fluido","Queer","Transexual","Pangénero","Cisgénero","Agénero","Bigénero","Prefiero no decirlo","Otro"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className={LABEL}>Orientación sexual</Label>
                  <Select value={formData.orientacion_sexual || ""} onValueChange={(v) => handleInputChange("orientacion_sexual", v || null)}>
                    <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
                    <SelectContent>{["Heterosexual","Homosexual","Bisexual","Pansexual","Asexual","Queer","Prefiero no decirlo","Otro"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Vivienda y más ── */}
      <div className="px-6 pb-6 space-y-4">
        <Separator />
        <p className={SECTION}>Vivienda y Ubicación</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className={LABEL}>Barrio</Label><Input className={INP} value={formData.barrio || ""} onChange={(e) => handleInputChange("barrio", e.target.value)} placeholder="Ej: Centro" /></div>
          <div className="space-y-1.5"><Label className={LABEL}>Zona</Label><Select value={formData.zona || ""} onValueChange={(v) => handleInputChange("zona", v)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent><SelectItem value="Rural">Rural</SelectItem><SelectItem value="Urbana">Urbana</SelectItem><SelectItem value="No informa">No informa</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label className={LABEL}>Tenencia de vivienda</Label><Select value={formData.tenencia_vivienda || ""} onValueChange={(v) => handleInputChange("tenencia_vivienda", v)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{["Propia","Alquilada","Familiar","Invasión","Otra","No informa"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label className={LABEL}>Comuna / Localidad</Label><Input className={INP} value={formData.comuna || ""} onChange={(e) => handleInputChange("comuna", e.target.value)} placeholder="Ej: Comuna 1" /></div>
          <div className="space-y-1.5"><Label className={LABEL}>¿Tiene SISBEN?</Label><Select value={formData.tiene_sisben === true ? "si" : formData.tiene_sisben === false ? "no" : ""} onValueChange={(v) => handleInputChange("tiene_sisben", v === "si" ? true : v === "no" ? false : null)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent><SelectItem value="si">Sí</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></div>
        </div>

        <Separator className="mt-4" />
        <p className={SECTION}>Condición y Discapacidad</p>
        <div className="space-y-1.5"><Label className={LABEL}>Condición actual</Label>
          <div className="flex flex-wrap gap-1.5">{["Madre comunitaria activa","Adulto mayor","Persona en situación de calle","Mujer rural","Extranjero","Víctima del conflicto armado","Migrante","Reincorporado","Defensor(a) DDHH","Víctima de desplazamiento","Mujer en estado de embarazo","Madre cabeza de familia","Padre cabeza de familia","Población LGTBIQ+","Prefiero no decirlo"].map(item=><Badge key={item} variant={(formData.condicion_actual||"").includes(item)?"default":"outline"} className="cursor-pointer text-xs" onClick={()=>handleInputChange("condicion_actual",toggleMulti(formData.condicion_actual||"",item))}>{item}</Badge>)}</div></div>
        <div className="space-y-1.5"><Label className={LABEL}>¿Alguna discapacidad?</Label>
          <div className="flex flex-wrap gap-1.5">{["Cognitiva","Física","Psicosocial","De nacimiento","Visual","Persona no verbal","Ninguna"].map(item=><Badge key={item} variant={(formData.discapacidad||"").includes(item)?"default":"outline"} className="cursor-pointer text-xs" onClick={()=>handleInputChange("discapacidad",toggleMulti(formData.discapacidad||"",item))}>{item}</Badge>)}</div></div>

        <Separator className="mt-4" />
        <p className={SECTION}>Servicios Públicos</p>
        <div className="flex flex-wrap gap-1.5">{["Energía eléctrica","Acueducto","Alcantarillado"].map(item=><Badge key={item} variant={(formData.servicios_publicos||"").includes(item)?"default":"outline"} className="cursor-pointer text-xs" onClick={()=>handleInputChange("servicios_publicos",toggleMulti(formData.servicios_publicos||"",item))}>{item}</Badge>)}</div>
      </div>
    </Card>
  );
}

// ─── STEP 3 ──────────────────────────────────────────────────────────────────

export function Step3QuienSolicita({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-blue-100 rounded-xl"><Scale className="h-5 w-5 text-blue-600" /></div>
          ¿Quién solicita el servicio?
        </CardTitle>
        <CardDescription>¿Es solicitante o es representante de otra persona?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          <Label className={LABEL}>Seleccione una opción *</Label>
          <Select value={formData.tiene_representado || ""} onValueChange={(v) => handleInputChange("tiene_representado", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent><SelectItem value="true">A nombre propio</SelectItem><SelectItem value="false">Representante</SelectItem></SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── STEP 4 ──────────────────────────────────────────────────────────────────

export function Step4InfoLaboral({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-blue-100 rounded-xl"><Briefcase className="h-5 w-5 text-blue-600" /></div>
          Información Laboral y Financiera
        </CardTitle>
        <CardDescription>Detalles sobre empleo e ingresos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className={LABEL}>Situación Laboral *</Label>
          <Select value={formData.situacion_laboral || ""} onValueChange={(v) => handleInputChange("situacion_laboral", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger>
            <SelectContent>{["dependiente","independiente","desempleado","otro"].map(o=><SelectItem key={o} value={o}>{o==="dependiente"?"Trabajador Dependiente":o==="independiente"?"Trabajador Independiente":o==="desempleado"?"No tiene empleo":"Otro"}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="tieneOtrosIngresos" checked={formData.otros_ingresos} onCheckedChange={(c: boolean) => handleInputChange("otros_ingresos", c)} />
          <Label htmlFor="tieneOtrosIngresos" className={LABEL}>Tiene otros ingresos</Label>
        </div>
        {formData.otros_ingresos && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div className="space-y-1.5"><Label className={LABEL}>Valor mensual</Label><Input className={INP} type="number" value={formData.valor_otros_ingresos || ""} onChange={(e) => handleInputChange("valor_otros_ingresos", e.target.value)} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Concepto</Label><Input className={INP} value={formData.concepto_otros_ingresos || ""} onChange={(e) => handleInputChange("concepto_otros_ingresos", e.target.value)} placeholder="Ej: Arriendos" /></div>
          </div>
        )}
      </CardContent>

      {/* ── Socioeconómico ── */}
      <div className="px-6 pb-6 space-y-4">
        <Separator />
        <p className={SECTION}>Información Socioeconómica</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className={LABEL}>Rango salarial</Label><Select value={formData.rango_salarial || ""} onValueChange={(v) => handleInputChange("rango_salarial", v)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{["Menos de un salario mínimo","Un salario mínimo","Entre 1 y 2 salarios","Entre 2 y 3 salarios","Más de 3 salarios","No informa"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label className={LABEL}>Personas a cargo</Label><Input className={INP} type="number" min="0" value={formData.personas_cargo ?? ""} onChange={(e) => handleInputChange("personas_cargo", e.target.value)} placeholder="0" /></div>
        </div>
        <div className="space-y-1.5"><Label className={LABEL}>¿Sabe leer y escribir?</Label><Select value={formData.sabe_leer === true ? "si" : formData.sabe_leer === false ? "no" : ""} onValueChange={(v) => handleInputChange("sabe_leer", v === "si" ? true : v === "no" ? false : null)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent><SelectItem value="si">Sí</SelectItem><SelectItem value="no">No</SelectItem></SelectContent></Select></div>
      </div>
    </Card>
  );
}

// ─── STEP 5 ──────────────────────────────────────────────────────────────────

export function Step5DatosAccionado({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-amber-100 rounded-xl"><MapPin className="h-5 w-5 text-amber-600" /></div>
          Datos del Accionado
        </CardTitle>
        <CardDescription>Información del accionado o demandado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
          <Checkbox id="sinDemandado" checked={formData.sinDemandado} onCheckedChange={(c: boolean) => handleInputChange("sinDemandado", c)} />
          <Label htmlFor="sinDemandado" className={LABEL}>No hay accionado / No aplica</Label>
        </div>
        {!formData.sinDemandado && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2"><Label className={LABEL}>Nombres Completos *</Label><Input className={INP} value={formData.nombreDemandado || ""} onChange={(e) => handleInputChange("nombreDemandado", e.target.value)} placeholder="Nombre completo del accionado" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Identificación</Label><Input className={INP} value={formData.documentoDemandado || ""} onChange={(e) => handleInputChange("documentoDemandado", e.target.value)} placeholder="Número de identificación" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Celular</Label><Input className={INP} type="tel" value={formData.celularDemandado || ""} onChange={(e) => handleInputChange("celularDemandado", e.target.value)} placeholder="Número de celular" /></div>
            <div className="space-y-1.5 md:col-span-2"><Label className={LABEL}>Lugar de Residencia</Label><Input className={INP} value={formData.lugarResidenciaDemandado || ""} onChange={(e) => handleInputChange("lugarResidenciaDemandado", e.target.value)} placeholder="Dirección de residencia" /></div>
            <div className="space-y-1.5 md:col-span-2"><Label className={LABEL}>Correo Electrónico</Label><Input className={INP} type="email" value={formData.correoDemandado || ""} onChange={(e) => handleInputChange("correoDemandado", e.target.value)} placeholder="correo@ejemplo.com" /></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── STEP 6 ──────────────────────────────────────────────────────────────────

export function Step6InfoContrato({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-indigo-100 rounded-xl"><FileText className="h-5 w-5 text-indigo-600" /></div>
          Contrato Laboral
        </CardTitle>
        <CardDescription>Detalles del contrato y empleador (opcional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className={LABEL}>¿Tiene Contrato Laboral?</Label>
          <RadioGroup value={formData.tiene_contrato ? "si" : "no"} onValueChange={(v) => handleInputChange("tiene_contrato", v === "si")} className="flex space-x-6 mt-2">
            <div className="flex items-center space-x-2"><RadioGroupItem value="si" id="tieneContratoSi" /><Label htmlFor="tieneContratoSi" className={LABEL}>Sí</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="tieneContratoNo" /><Label htmlFor="tieneContratoNo" className={LABEL}>No</Label></div>
          </RadioGroup>
        </div>
      </CardContent>
      {formData.tiene_contrato && (
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-1.5"><Label className={LABEL}>Tipo de Contrato</Label><Select value={formData.tipoContrato || ""} onValueChange={(v) => handleInputChange("tipoContrato", v)}><SelectTrigger className={SEL}><SelectValue placeholder="Seleccione" /></SelectTrigger><SelectContent>{["escrito","verbal","prestacion_servicios","otro"].map(o=><SelectItem key={o} value={o}>{o==="prestacion_servicios"?"Prestación de Servicios":o.charAt(0).toUpperCase()+o.slice(1)}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className={LABEL}>Representante Legal / Patrono</Label><Input className={INP} value={formData.nombreRepresentanteLegal || ""} onChange={(e) => handleInputChange("nombreRepresentanteLegal", e.target.value)} placeholder="Nombre del empleador" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Correo Empleador</Label><Input className={INP} type="email" value={formData.correoEmpleador || ""} onChange={(e) => handleInputChange("correoEmpleador", e.target.value)} placeholder="correo@empresa.com" /></div>
            <div className="space-y-1.5 md:col-span-2"><Label className={LABEL}>Dirección Empresa</Label><Input className={INP} value={formData.direccionEmpresa || ""} onChange={(e) => handleInputChange("direccionEmpresa", e.target.value)} placeholder="Dirección de la empresa" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Fecha Inicio</Label><Input className={INP} type="date" value={formData.fechaInicio || ""} onChange={(e) => handleInputChange("fechaInicio", e.target.value)} /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Fecha Terminación</Label><Input className={INP} type="date" value={formData.fechaTerminacion || ""} onChange={(e) => handleInputChange("fechaTerminacion", e.target.value)} /></div>
            <div className="flex items-center space-x-2 pt-4"><Checkbox id="continuaContrato" checked={formData.continuaContrato} onCheckedChange={(c: boolean) => handleInputChange("continuaContrato", c)} /><Label htmlFor="continuaContrato" className={LABEL}>¿Continúa el Contrato?</Label></div>
            <div className="space-y-1.5"><Label className={LABEL}>Salario Inicial</Label><Input className={INP} type="number" value={formData.salarioInicial || ""} onChange={(e) => handleInputChange("salarioInicial", e.target.value)} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className={LABEL}>Salario Actual</Label><Input className={INP} type="number" value={formData.salarioActual || ""} onChange={(e) => handleInputChange("salarioActual", e.target.value)} placeholder="0" /></div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ─── STEP 7 ──────────────────────────────────────────────────────────────────

export function Step7DetallesCaso({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-green-100 rounded-xl"><FileText className="h-5 w-5 text-green-600" /></div>
          Detalles del Caso
        </CardTitle>
        <CardDescription>Información adicional sobre el caso legal</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className={LABEL}>Área *</Label>
          <Select value={formData.area || ""} onValueChange={(v) => handleInputChange("area", v)}>
            <SelectTrigger className={SEL}><SelectValue placeholder="Seleccione el área" /></SelectTrigger>
            <SelectContent>{["no_asignada","laboral","civil_familia","penal","publica","conciliacion","privado","otros"].map(o=><SelectItem key={o} value={o}>{o.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Hechos Jurídicamente Relevantes</Label>
          <Textarea value={formData.resumen_hechos || ""} onChange={(e) => handleInputChange("resumen_hechos", e.target.value)} placeholder="Describa los hechos relevantes del caso..." rows={4} className="bg-white border-slate-200 rounded-lg resize-none text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className={LABEL}>Observaciones del Estudiante</Label>
          <Textarea value={formData.observaciones_estudiante || ""} onChange={(e) => handleInputChange("observaciones_estudiante", e.target.value)} placeholder="Observaciones o dudas para el asesor..." rows={3} className="bg-white border-slate-200 rounded-lg text-sm" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── STEP 8 ──────────────────────────────────────────────────────────────────

export function Step8Firmas({ formData, handleInputChange }: StepProps) {
  return (
    <Card className={CARD}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-emerald-100 rounded-xl"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
          Firmas y Autorización
        </CardTitle>
        <CardDescription>Confirmación y firma del solicitante</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className={LABEL}>C.C. del Solicitante para Firma *</Label>
          <Input className={INP} value={formData.cedulaSolicitante || ""} onChange={(e) => handleInputChange("cedulaSolicitante", e.target.value)} placeholder="Número de cédula para confirmación" />
        </div>
        <Separator />
        <div className="flex items-center space-x-2">
          <Checkbox id="firmasSolicitante" checked={formData.firmasSolicitante} onCheckedChange={(c: boolean) => handleInputChange("firmasSolicitante", c)} />
          <Label htmlFor="firmasSolicitante" className="text-sm text-slate-600">Confirmo que toda la información proporcionada es veraz y autorizo el procesamiento de estos datos para los fines legales correspondientes *</Label>
        </div>
      </CardContent>
    </Card>
  );
}
