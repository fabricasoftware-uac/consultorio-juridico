import React from "react";
import { User, Phone, Mail, MapPin, Smile, DollarSign, Shield, FileText, Heart, Building, BookOpen, Briefcase } from "lucide-react";
import { InfoField, SectionCard } from "./shared-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit3, Check } from "lucide-react";

interface ClientInfoProps {
  usuarios: any;
  isEditing: boolean;
  editedData: any;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: string, value: any) => void;
  canEdit?: boolean;
}

export const ClientInfo = ({
  usuarios,
  isEditing,
  editedData,
  onEdit,
  onSave,
  onCancel,
  onChange,
  canEdit = true,
}: ClientInfoProps) => {
  const headerActions = canEdit ? (
    !isEditing ? (
      <Button
        onClick={onEdit}
        size="sm"
        variant="ghost"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
      >
        <Edit3 className="w-4 h-4 mr-2" />
        Modificar
      </Button>
    ) : (
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          <Check className="w-4 h-4 mr-2" />
          Guardar
        </Button>
        <Button
          onClick={onCancel}
          size="sm"
          variant="ghost"
          className="text-slate-600 hover:bg-slate-100 font-semibold"
        >
          Cancelar
        </Button>
      </div>
    )
  ) : null;

  return (
    <div className="space-y-6">
      {/* Personal Data */}
      <SectionCard
        title="Datos personales"
        icon={User}
        headerActions={headerActions}
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InfoField
              label="Nombre completo"
              value={usuarios?.nombre_completo}
            />
            <InfoField
              label="Sexo"
              value={usuarios?.sexo?.replace(/_/g, " ") || "N/A"}
            />
            <InfoField label="Cédula" value={usuarios?.cedula} />
            <InfoField
              label="Edad"
              value={usuarios?.edad ? `${usuarios.edad} años` : "N/A"}
            />
            <InfoField
              label="Estado civil"
              value={usuarios?.estado_civil}
              valueClassName="capitalize"
            />
            <InfoField
              label="Estrato"
              value={usuarios?.estrato ? `Estrato ${usuarios.estrato}` : "N/A"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">
                Nombre completo
              </Label>
              <Input
                value={editedData?.nombre_completo || ""}
                onChange={(e) => onChange("nombre_completo", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Sexo</Label>
              <Select
                value={editedData?.sexo}
                onValueChange={(val) => onChange("sexo", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MASCULINO">Masculino</SelectItem>
                  <SelectItem value="FEMENINO">Femenino</SelectItem>
                  <SelectItem value="INTERSEXUAL">Intersexual</SelectItem>
                  <SelectItem value="PREFIERO_NO_RESPONDER">Prefiero no responder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Cédula</Label>
              <Input
                value={editedData?.cedula || ""}
                onChange={(e) => onChange("cedula", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Edad</Label>
              <Input
                type="number"
                value={editedData?.edad || ""}
                onChange={(e) => onChange("edad", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Estado civil</Label>
              <Select
                value={editedData?.estado_civil || ""}
                onValueChange={(val) => onChange("estado_civil", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soltero">Soltero</SelectItem>
                  <SelectItem value="casado">Casado</SelectItem>
                  <SelectItem value="union libre">Union Libre</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Estrato</Label>
              <Select
                value={editedData?.estrato?.toString() || ""}
                onValueChange={(val) => onChange("estrato", parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estrato" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5", "6"].map((s) => (
                    <SelectItem key={s} value={s}>
                      Estrato {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Contact Information */}
      <SectionCard
        title="Información de contacto"
        icon={Phone}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <InfoField
                label="Teléfono"
                value={usuarios?.telefono}
                icon={Phone}
              />
              <InfoField
                label="Correo electrónico"
                value={usuarios?.correo}
                icon={Mail}
                valueClassName="text-blue-600"
              />
            </div>
            <div className="space-y-4">
              <InfoField
                label="Dirección"
                value={usuarios?.direccion}
                icon={MapPin}
              />
              <InfoField
                label="Contacto familiar"
                value={usuarios?.contacto_familiar}
                icon={Smile}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Teléfono</Label>
                <Input
                  value={editedData?.telefono || ""}
                  onChange={(e) => onChange("telefono", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Correo electrónico
                </Label>
                <Input
                  value={editedData?.correo || ""}
                  onChange={(e) => onChange("correo", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">Dirección</Label>
                <Input
                  value={editedData?.direccion || ""}
                  onChange={(e) => onChange("direccion", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Contacto familiar
                </Label>
                <Input
                  value={editedData?.contacto_familiar || ""}
                  onChange={(e) =>
                    onChange("contacto_familiar", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Labor & Financial Info */}
      <SectionCard
        title="Información laboral y financiera"
        icon={DollarSign}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <InfoField
                label="Situación laboral"
                value={
                  usuarios?.situacion_laboral === "dependiente"
                    ? "Dependiente (Empleado)"
                    : usuarios?.situacion_laboral === "desempleado"
                      ? "Desempleado"
                      : usuarios?.situacion_laboral === "independiente"
                        ? "Independiente"
                        : usuarios?.situacion_laboral === "otro"
                          ? "Otro"
                          : "N/A"
                }
                valueClassName="text-lg font-semibold"
              />
              <InfoField
                label="¿Tiene otros ingresos?"
                value={usuarios?.otros_ingresos ? "Sí" : "No"}
              />
            </div>
            {usuarios?.otros_ingresos && (
              <div className="space-y-6 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <InfoField
                  label="Valor otros ingresos"
                  value={`$${usuarios?.valor_otros_ingresos || "0"}`}
                  valueClassName="text-emerald-900 font-bold text-xl"
                />
                <InfoField
                  label="Concepto"
                  value={usuarios?.concepto_otros_ingresos}
                  valueClassName="text-emerald-800"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Situación laboral
                </Label>
                <Select
                  value={editedData?.situacion_laboral || ""}
                  onValueChange={(val) => onChange("situacion_laboral", val)}
                >
                  <SelectTrigger className="border-slate-200">
                    <SelectValue placeholder="Seleccionar situación" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { value: "dependiente", label: "Dependiente (Empleado)" },
                      { value: "desempleado", label: "Desempleado" },
                      { value: "independiente", label: "Independiente" },
                      {
                        value: "otro",
                        label: "Otro / Pensionado / Estudiante",
                      },
                    ].map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="edit_otros_ingresos"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={editedData?.otros_ingresos || false}
                  onChange={(e) => onChange("otros_ingresos", e.target.checked)}
                />
                <Label
                  htmlFor="edit_otros_ingresos"
                  className="text-slate-700 font-semibold cursor-pointer"
                >
                  Tiene otros ingresos adicionales
                </Label>
              </div>
            </div>

            {editedData?.otros_ingresos && (
              <div className="space-y-5 p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100">
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-bold">
                    Valor mensual
                  </Label>
                  <Input
                    type="number"
                    value={editedData?.valor_otros_ingresos || ""}
                    onChange={(e) =>
                      onChange("valor_otros_ingresos", e.target.value)
                    }
                    className="border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-emerald-800 font-bold">Concepto</Label>
                  <Input
                    value={editedData?.concepto_otros_ingresos || ""}
                    onChange={(e) =>
                      onChange("concepto_otros_ingresos", e.target.value)
                    }
                    className="border-emerald-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="Ej: Arriendos, ventas..."
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* Caracterización con enfoque diferencial */}
      <SectionCard
        title="Caracterización con enfoque diferencial"
        icon={Shield}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
      >
        {!isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ¿Se reconoce como parte de una población diversa?
              </Label>
              <p className="text-base font-semibold text-slate-800 mt-1">
                {usuarios?.enfoque_diverso === true
                  ? "Sí"
                  : usuarios?.enfoque_diverso === false
                    ? "No"
                    : "Prefirió no responder"}
              </p>
            </div>
            {usuarios?.enfoque_diverso === true &&
              usuarios?.caracterizacion_lgbtiq && (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Se identifica como
                  </Label>
                  <p className="text-base font-semibold text-slate-800 mt-1">
                    {usuarios.caracterizacion_lgbtiq.replace(/_/g, " ")}
                  </p>
                </div>
              )}
            <p className="text-xs text-slate-400 italic">
              Información voluntaria proporcionada por el usuario.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">
                ¿Se reconoce como parte de una población con orientación sexual
                o identidad de género diversa?
              </Label>
              <Select
                value={
                  editedData?.enfoque_diverso === true
                    ? "true"
                    : editedData?.enfoque_diverso === false
                      ? "false"
                      : ""
                }
                onValueChange={(val) => {
                  if (val === "true") {
                    onChange("enfoque_diverso", true);
                  } else {
                    onChange(
                      "enfoque_diverso",
                      val === "false" ? false : null,
                    );
                    onChange("caracterizacion_lgbtiq", null);
                  }
                }}
              >
                <SelectTrigger className="bg-white border-slate-200 h-11">
                  <SelectValue placeholder="Seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="null">Prefiero no responder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editedData?.enfoque_diverso === true && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  Si desea indicarlo, ¿cómo se identifica?
                </Label>
                <Select
                  value={editedData?.caracterizacion_lgbtiq || ""}
                  onValueChange={(val) =>
                    onChange("caracterizacion_lgbtiq", val || null)
                  }
                >
                  <SelectTrigger className="bg-white border-slate-200 h-11">
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GAY">Gay</SelectItem>
                    <SelectItem value="LESBIANA">Lesbiana</SelectItem>
                    <SelectItem value="BISEXUAL">Bisexual</SelectItem>
                    <SelectItem value="HOMBRE_TRANS">Hombre trans</SelectItem>
                    <SelectItem value="MUJER_TRANS">Mujer trans</SelectItem>
                    <SelectItem value="NO_BINARIO">No binario</SelectItem>
                    <SelectItem value="OTRA">Otra</SelectItem>
                    <SelectItem value="PREFIERO_NO_RESPONDER">
                      Prefiero no responder
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* Información adicional del usuario */}
      <SectionCard
        title="Información adicional del usuario"
        icon={BookOpen}
        iconBgColor="bg-violet-100"
        iconColor="text-violet-600"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InfoField label="Tipo de documento" value={usuarios?.tipo_documento} />
            <InfoField label="Fecha de expedición" value={usuarios?.fecha_expedicion_doc} />
            <InfoField label="Ciudad de expedición" value={usuarios?.ciudad_expedicion} />
            <InfoField label="Fecha de nacimiento" value={usuarios?.fecha_nacimiento} />
            <InfoField label="Nacionalidad" value={usuarios?.nacionalidad} />
            <InfoField label="Identidad de género" value={usuarios?.identidad_genero} />
            <InfoField label="Orientación sexual" value={usuarios?.orientacion_sexual} />
            <InfoField label="Escolaridad" value={usuarios?.escolaridad} />
            <InfoField label="Grupo étnico" value={usuarios?.grupo_etnico} />
            <InfoField label="Barrio" value={usuarios?.barrio} />
            <InfoField label="Zona" value={usuarios?.zona} />
            <InfoField label="Tenencia de vivienda" value={usuarios?.tenencia_vivienda} />
            <InfoField label="Comuna" value={usuarios?.comuna} />
            <InfoField label="Tiene SISBEN" value={usuarios?.tiene_sisben != null ? (usuarios.tiene_sisben ? "Sí" : "No") : "N/A"} />
            <InfoField label="Personas a cargo" value={usuarios?.personas_cargo} />
            <InfoField label="Rango salarial" value={usuarios?.rango_salarial} />
            <InfoField label="Servicios públicos" value={usuarios?.servicios_publicos} />
            <InfoField label="Sabe leer" value={usuarios?.sabe_leer != null ? (usuarios.sabe_leer ? "Sí" : "No") : "N/A"} />
            <InfoField label="Discapacidad" value={usuarios?.discapacidad} />
            <InfoField label="Condición actual" value={usuarios?.condicion_actual} />
            <InfoField label="¿A nombre propio?" value={usuarios?.tiene_representado != null ? (usuarios.tiene_representado ? "Representante" : "Sí") : "N/A"} />
            <InfoField label="¿Tiene contrato?" value={usuarios?.tiene_contrato != null ? (usuarios.tiene_contrato ? "Sí" : "No") : "N/A"} />
            <InfoField label="Tipo de vivienda" value={usuarios?.tipo_vivienda} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Tipo de documento</Label>
              <Select value={editedData?.tipo_documento || ""} onValueChange={(val) => onChange("tipo_documento", val)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">CC - Cédula</SelectItem>
                  <SelectItem value="CE">CE - Extranjería</SelectItem>
                  <SelectItem value="PEP">PEP</SelectItem>
                  <SelectItem value="NUIP">NUIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Fecha de expedición</Label>
              <Input type="date" value={editedData?.fecha_expedicion_doc || ""} onChange={(e) => onChange("fecha_expedicion_doc", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Ciudad de expedición</Label>
              <Input value={editedData?.ciudad_expedicion || ""} onChange={(e) => onChange("ciudad_expedicion", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Fecha de nacimiento</Label>
              <Input type="date" value={editedData?.fecha_nacimiento || ""} onChange={(e) => onChange("fecha_nacimiento", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Nacionalidad</Label>
              <Input value={editedData?.nacionalidad || ""} onChange={(e) => onChange("nacionalidad", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Identidad de género</Label>
              <Select value={editedData?.identidad_genero || ""} onValueChange={(val) => onChange("identidad_genero", val || null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Femenino","Masculino","No binario","Diverso","Género fluido","Queer","Transexual","Pangénero","Cisgénero","Agénero","Bigénero","Prefiero no decirlo","Otro"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Orientación sexual</Label>
              <Select value={editedData?.orientacion_sexual || ""} onValueChange={(val) => onChange("orientacion_sexual", val || null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Heterosexual","Homosexual","Bisexual","Pansexual","Asexual","Queer","Prefiero no decirlo","Otro"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Escolaridad</Label>
              <Select value={editedData?.escolaridad || ""} onValueChange={(val) => onChange("escolaridad", val)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Primaria completa","Bachillerato incompleto","Bachillerato completo","Técnico","Tecnólogo","Profesional","Pregrado","Posgrado","Ninguno","No informa"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Grupo étnico</Label>
              <Select value={editedData?.grupo_etnico || ""} onValueChange={(val) => onChange("grupo_etnico", val)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Indígena","Rom","Raizal","Palenquero","Mestizo","Comunidad negra","Afrocolombiano","Prefiero no decirlo","No informa","Otro"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Barrio</Label>
              <Input value={editedData?.barrio || ""} onChange={(e) => onChange("barrio", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Zona</Label>
              <Select value={editedData?.zona || ""} onValueChange={(val) => onChange("zona", val)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rural">Rural</SelectItem>
                  <SelectItem value="Urbana">Urbana</SelectItem>
                  <SelectItem value="No informa">No informa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Tenencia de vivienda</Label>
              <Select value={editedData?.tenencia_vivienda || ""} onValueChange={(val) => onChange("tenencia_vivienda", val)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Propia","Alquilada","Familiar","Invasión","Otra","No informa"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Comuna</Label>
              <Input value={editedData?.comuna || ""} onChange={(e) => onChange("comuna", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Tiene SISBEN</Label>
              <Select value={editedData?.tiene_sisben === true ? "si" : editedData?.tiene_sisben === false ? "no" : ""} onValueChange={(val) => onChange("tiene_sisben", val === "si" ? true : val === "no" ? false : null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Personas a cargo</Label>
              <Input type="number" value={editedData?.personas_cargo || ""} onChange={(e) => onChange("personas_cargo", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Rango salarial</Label>
              <Select value={editedData?.rango_salarial || ""} onValueChange={(val) => onChange("rango_salarial", val)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  {["Menos de un salario mínimo","Un salario mínimo","Entre 1 y 2 salarios","Entre 2 y 3 salarios","Más de 3 salarios","No informa"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Servicios públicos</Label>
              <Input value={editedData?.servicios_publicos || ""} onChange={(e) => onChange("servicios_publicos", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Sabe leer</Label>
              <Select value={editedData?.sabe_leer === true ? "si" : editedData?.sabe_leer === false ? "no" : ""} onValueChange={(val) => onChange("sabe_leer", val === "si" ? true : val === "no" ? false : null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Discapacidad</Label>
              <Input value={editedData?.discapacidad || ""} onChange={(e) => onChange("discapacidad", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Condición actual</Label>
              <Input value={editedData?.condicion_actual || ""} onChange={(e) => onChange("condicion_actual", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">¿A nombre propio?</Label>
              <Select value={editedData?.tiene_representado === false ? "true" : editedData?.tiene_representado === true ? "false" : ""} onValueChange={(val) => onChange("tiene_representado", val === "true" ? false : val === "false" ? true : null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">Representante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">¿Tiene contrato?</Label>
              <Select value={editedData?.tiene_contrato === true ? "true" : editedData?.tiene_contrato === false ? "false" : ""} onValueChange={(val) => onChange("tiene_contrato", val === "true" ? true : val === "false" ? false : null)}>
                <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-bold">Tipo de vivienda</Label>
              <Select value={editedData?.tipo_vivienda || ""} onValueChange={(val) => onChange("tipo_vivienda", val)}>
                <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="propia">Propia</SelectItem>
                  <SelectItem value="arrendada">Arrendada</SelectItem>
                  <SelectItem value="familiar">Familiar</SelectItem>
                  <SelectItem value="otra">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};
