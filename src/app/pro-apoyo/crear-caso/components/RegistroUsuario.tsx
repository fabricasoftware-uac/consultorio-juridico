import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Usuario } from "app/types/database";

interface RegistroUsuarioProps {
  onContinuar: (usuario: Usuario) => void;
  datosIniciales?: Usuario | null;
  onBack: () => void;
}

export function RegistroUsuario({
  onContinuar,
  datosIniciales,
  onBack,
}: RegistroUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>(
    datosIniciales || {
      nombre_completo: "",
      sexo: "",
      cedula: "",
      telefono: "",
      correo: "",
      enfoque_diverso: null,
      caracterizacion_lgbtiq: null,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      caracterizacion_lgbtiq:
        formData.enfoque_diverso === true
          ? formData.caracterizacion_lgbtiq || null
          : null,
    };
    onContinuar(payload);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (campo: keyof Usuario, valor: string) => {
    const soloDigitos = campo === "cedula" || campo === "telefono";
    setFormData((prev) => ({
      ...prev,
      [campo]: soloDigitos ? valor.replace(/\D/g, "") : valor,
    }));
  };

  const handleEnfoqueChange = (valor: string) => {
    if (valor === "true") {
      setFormData((prev) => ({ ...prev, enfoque_diverso: true }));
    } else {
      setFormData((prev) => ({
        ...prev,
        enfoque_diverso: valor === "false" ? false : null,
        caracterizacion_lgbtiq: null,
      }));
    }
  };
  const isFormValid = () => {
    if (!formData) return false;
    return (
      formData.nombre_completo.trim() !== "" &&
      formData.sexo !== "" &&
      formData.cedula.trim() !== ""
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link
        href={"/pro-apoyo/inicio"}
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-white/50 px-4 py-2 rounded-xl border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al inicio
      </Link>

      <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
        <div className="h-1 w-full bg-linear-to-r from-blue-400 to-indigo-500" />
        <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-6 pt-8 px-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-inner shadow-white/20">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Registro de Usuario</CardTitle>
              <CardDescription className="text-sm">
                Complete la información básica del usuario que solicita la
                asesoría jurídica.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
              <div className="space-y-2 relative">
                <Label
                  htmlFor="nombreCompleto"
                  className="text-slate-700 font-semibold flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Nombre completo *
                </Label>
                <Input
                  id="nombreCompleto"
                  placeholder="Ingrese su nombre completo"
                  value={formData.nombre_completo}
                  onChange={(e) =>
                    handleChange("nombre_completo", e.target.value)
                  }
                  className="bg-white border-slate-200 focus-visible:ring-blue-500/30 h-11"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="sexo"
                    className="text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Sexo *
                  </Label>
                  <Select
                    value={formData.sexo}
                    onValueChange={(value) => handleChange("sexo", value)}
                    required
                  >
                    <SelectTrigger
                      id="tipoDocumento"
                      className="bg-white border-slate-200 h-11"
                    >
                      <SelectValue placeholder="Seleccione el sexo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                        <SelectItem value="FEMENINO">Femenino</SelectItem>
                        <SelectItem value="INTERSEXUAL">Intersexual</SelectItem>
                        <SelectItem value="PREFIERO_NO_RESPONDER">
                          Prefiero no responder
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="numeroDocumento"
                    className="text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" /> Número de
                    documento *
                  </Label>
                  <Input
                    id="numeroDocumento"
                    placeholder="Ej: 12345678"
                    value={formData.cedula || ""}
                    onChange={(e) => handleChange("cedula", e.target.value)}
                    className="bg-white border-slate-200 focus-visible:ring-blue-500/30 h-11"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="telefono"
                    className="text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-slate-400" /> Teléfono (Opcional)
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: 300 1234567"
                    value={formData.telefono || ""}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    className="bg-white border-slate-200 focus-visible:ring-blue-500/30 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="correoElectronico"
                    className="text-slate-700 font-semibold flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-400" /> Correo
                    electrónico (Opcional)
                  </Label>
                  <Input
                    id="correoElectronico"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={formData.correo || ""}
                    onChange={(e) => handleChange("correo", e.target.value)}
                    className="bg-white border-slate-200 focus-visible:ring-blue-500/30 h-11"
                  />
                </div>
              </div>
            </div>

            {/* Caracterización con enfoque diferencial */}
            <div className="mt-8 p-6 bg-blue-50/30 rounded-2xl border border-blue-100 space-y-5">
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  Caracterización con enfoque diferencial
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Información voluntaria del usuario: Estos datos se solicitan
                  únicamente para fines de caracterización poblacional y para
                  garantizar un enfoque diferencial en la prestación del
                  servicio. Pregunte al usuario si desea responder.
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">
                  ¿Se reconoce como parte de una población con orientación
                  sexual o identidad de género diversa?
                </Label>
                <Select
                  value={
                    formData.enfoque_diverso === true
                      ? "true"
                      : formData.enfoque_diverso === false
                        ? "false"
                        : ""
                  }
                  onValueChange={handleEnfoqueChange}
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

              {formData.enfoque_diverso === true && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">
                    Si desea indicarlo, ¿cómo se identifica?
                  </Label>
                  <Select
                    value={formData.caracterizacion_lgbtiq || ""}
                    onValueChange={(value) =>
                      handleChange(
                        "caracterizacion_lgbtiq",
                        value === "" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger className="bg-white border-slate-200 h-11">
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GAY">Gay</SelectItem>
                      <SelectItem value="LESBIANA">Lesbiana</SelectItem>
                      <SelectItem value="BISEXUAL">Bisexual</SelectItem>
                      <SelectItem value="HOMBRE_TRANS">
                        Hombre trans
                      </SelectItem>
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

            <div className="pt-8 flex justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto min-w-[200px] h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-base font-medium rounded-xl"
                disabled={!isFormValid()}
              >
                Continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
