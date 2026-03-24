import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  CreditCard,
  Users,
  UserCheck,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Caso, Usuario } from "app/types/database";
import { insertUsuarioNuevo } from "../../../../../supabase/queries/insertUsuarioNuevo";
import { insertCasoNuevo } from "../../../../../supabase/queries/insertCasoNuevo";
import { insertEstudiantesCasos } from "../../../../../supabase/queries/insertEstudiantesCasos";
import { insertAsesoresCasos } from "../../../../../supabase/queries/insertAsesoresCasos";
import { cn } from "@/components/ui/utils";

interface ResumenCasoProps {
  caso: Caso;
  usuario: Usuario;
  onNuevoCaso: () => void;
}

export function ResumenCaso({ caso, usuario, onNuevoCaso }: ResumenCasoProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [casoInsertar, setCasoInsertar] = useState<Caso>(caso);
  const [usuarioInsertar, setUsuarioInsertar] = useState<Usuario>(usuario);

  const handleConfirmacion = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    insertData();
  };

  const insertData = async () => {
    setIsLoading(true);
    try {
      const usuarioData = await insertUsuarioNuevo(usuario);

      const id_usuario = usuarioData?.[0]?.id_usuario;
      if (!id_usuario) {
        throw new Error("No se obtuvo el id_usuario del usuario insertado");
      }
      const casoData = await insertCasoNuevo(caso, id_usuario);

      const id_estudiante = caso.estudiantes_casos?.[0]?.estudiante?.id_perfil;
      const id_caso = casoData?.[0]?.id_caso;
      const id_asesor = caso.asesores_casos?.[0]?.asesor?.id_perfil;

      if (id_caso && id_estudiante) {
        await insertEstudiantesCasos(id_caso.toString(), id_estudiante);
        if (id_asesor) {
          await insertAsesoresCasos(id_caso.toString(), id_asesor);
        }
      } else {
        console.error("Faltan IDs para vincular estudiante al caso.");
      }
      setDialogOpen(true);
      toast.success("Caso creado exitosamente");
    } catch (error: any) {
      console.error("Error al insertar el usuario:", error);
      let msg = "Ocurrió un error inesperado al registrar el caso.";

      if (error.code === "23505") {
        if (error.message.includes("usuarios_cedula_key")) {
          msg = "Error: Ya existe un usuario registrado con esta cédula.";
        } else {
          msg = "Error: Ya existe un registro con estos datos únicos.";
        }
      } else if (error.message) {
        msg = error.message;
      }

      setErrorMessage(msg);
      setErrorDialogOpen(true);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNuevoCaso = () => {
    setDialogOpen(false);
    onNuevoCaso();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Resumen completo del caso */}
      <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
        <div className="h-1.5 w-full bg-linear-to-r from-blue-400 to-indigo-500" />
        <CardHeader className="border-b border-slate-100 bg-slate-50/30 pb-6 pt-8 px-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl shadow-inner shadow-white/20">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Resumen de Registro</CardTitle>
              <CardDescription className="text-sm">
                Verifique los datos antes de finalizar el registro del caso.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 space-y-10">
          {/* Sección Usuario */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <User className="w-4 h-4" /> Usuario Solicitante
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Nombre Completo
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {caso.usuarios.nombre_completo}
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Cédula / Documento
                </span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  {caso.usuarios.cedula}
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Sexo
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  {caso.usuarios.sexo === "M"
                    ? "Masculino"
                    : caso.usuarios.sexo === "F"
                      ? "Femenino"
                      : "Otro"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 sm:col-span-2 lg:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Correo Electrónico
                </span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {caso.usuarios.correo || "No registrado"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Teléfono
                </span>
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {caso.usuarios.telefono}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Asignaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Users className="w-4 h-4" /> Estudiante Asignado
              </h3>
              {caso.estudiantes_casos && caso.estudiantes_casos.length > 0 ? (
                <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-12 h-12 text-blue-600" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div>
                      <p className="text-lg font-bold text-blue-900">
                        {
                          caso.estudiantes_casos[0].estudiante.perfil
                            .nombre_completo
                        }
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          {caso.estudiantes_casos[0].estudiante.semestre}º
                          Semestre
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white/50 text-blue-600 border-blue-200 flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />{" "}
                          {caso.estudiantes_casos[0].estudiante.turno}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 py-8">
                  <Users className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm italic">Sin estudiante asignado</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <UserCheck className="w-4 h-4" /> Asesor de Apoyo
              </h3>
              {caso.asesores_casos && caso.asesores_casos.length > 0 ? (
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserCheck className="w-12 h-12 text-indigo-600" />
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div>
                      <p className="text-lg font-bold text-indigo-900">
                        {caso.asesores_casos[0]?.asesor.perfil.nombre_completo}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 capitalize">
                          {caso.asesores_casos[0]?.asesor.area}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-white/50 text-indigo-600 border-indigo-200"
                        >
                          {caso.asesores_casos[0]?.asesor.turno}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 py-8">
                  <UserCheck className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm italic">
                    No se asignó un asesor (Opcional)
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Información del caso */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Calendar className="w-4 h-4" /> Detalles del Caso
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="p-2.5 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Fecha de Registro
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date().toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="p-2.5 bg-white rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Estado Inicial
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <p className="text-sm font-bold text-yellow-700">
                      En proceso
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {caso.observaciones && (
              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                  <MessageSquare className="w-4 h-4" />
                  <span>Observaciones</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-blue-200 pl-4 py-1">
                  "{caso.observaciones}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón de acción */}
      <div className="pt-4 flex justify-end">
        <Button
          onClick={handleConfirmacion}
          disabled={isLoading}
          className="w-full sm:w-auto min-w-[250px] h-14 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-1 text-lg font-bold rounded-2xl group"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Procesando...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6" />
              Registrar Caso
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Datos registrados exitosamente
            </DialogTitle>
            <DialogDescription>
              Los datos se han registrado correctamente en el sistema. Puedes
              crear uno nuevo o cerrar esta ventana.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center items-center">
            <Button
              onClick={handleNuevoCaso}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de error */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="sm:max-w-md border-red-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-6 w-6 text-red-600" />
              Error al registrar los datos
            </DialogTitle>
            <DialogDescription className="text-slate-700 font-medium py-2">
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center items-center">
            <Button
              onClick={() => setErrorDialogOpen(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
