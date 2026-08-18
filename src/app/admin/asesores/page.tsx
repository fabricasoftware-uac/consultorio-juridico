"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { HorariosEditor } from "@/components/HorariosEditor";
import { Navbar } from "../components/NavbarAdmin";
import { registerAsesor } from "../actions/registerUser";
import {
  toggleUserStatus,
  updateAsesor,
  updateAsesorHorario,
} from "../actions/userActions";
import { getAsesores } from "../../../../supabase/queries/getAsesores";
import type { AreaEnum, TurnoEnum, Asesor } from "../../types/database";
import {
  Users,
  Loader2,
  Pencil,
  Power,
  PowerOff,
  Search,
  Calendar,
  X,
  Plus,
} from "lucide-react";

import {
  ScheduleEditor,
  HorarioDia,
  HorarioSemana,
  horarioPorDefecto,
} from "@/components/ScheduleEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AsesorForm {
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  area: AreaEnum | "";
  horarios: { turno: string; dia: string }[];
}

const EMPTY_FORM: AsesorForm = {
  nombre: "",
  correo: "",
  cedula: "",
  telefono: "",
  area: "",
  horarios: [],
};

export default function AsesoresPage() {
  const [form, setForm] = useState<AsesorForm>(EMPTY_FORM);
  const [asesores, setAsesores] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Edit State
  const [editingAsesor, setEditingAsesor] = useState<Asesor | null>(null);
  const [editForm, setEditForm] = useState<AsesorForm>(EMPTY_FORM);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Schedule Edit State
  const [scheduleAsesor, setScheduleAsesor] = useState<Asesor | null>(null);
  const [scheduleForm, setScheduleForm] =
    useState<HorarioSemana>(horarioPorDefecto);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  async function fetchAsesores() {
    setLoading(true);
    const data = await getAsesores();
    setAsesores(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAsesores();
  }, []);

  const set = (field: keyof AsesorForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setEdit = (field: keyof AsesorForm) => (value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nombre ||
      !form.correo ||
      !form.cedula ||
      !form.telefono ||
      !form.area
    ) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    startTransition(async () => {
      const result = await registerAsesor({
        nombre_completo: form.nombre,
        correo: form.correo,
        cedula: form.cedula,
        telefono: form.telefono,
        area: form.area as AreaEnum,
        horarios: form.horarios,
      });

      if (result.success) {
        toast.success(result.message);
        setForm(EMPTY_FORM);
        fetchAsesores();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleToggleStatus = async (asesor: Asesor) => {
    const result = await toggleUserStatus(
      asesor.id_perfil,
      asesor.perfil.activo,
    );
    if (result.success) {
      toast.success(result.message);
      fetchAsesores();
    } else {
      toast.error(result.error);
    }
  };

  const openEdit = (asesor: Asesor) => {
    setEditingAsesor(asesor);
    setEditForm({
      nombre: asesor.perfil.nombre_completo ?? "",
      correo: asesor.perfil.correo || "",
      cedula: asesor.perfil.cedula || "",
      telefono: asesor.perfil.telefono || "",
      area: asesor.area,
      horarios: [],
    });
    setIsEditOpen(true);
  };

  const openSchedule = (asesor: Asesor) => {
    setScheduleAsesor(asesor);
    if (asesor.horario) {
      setScheduleForm({ ...horarioPorDefecto, ...(asesor.horario as any) });
    } else {
      setScheduleForm(horarioPorDefecto);
    }
    setIsScheduleOpen(true);
  };

  const handleScheduleChange = (
    dia: string,
    field: keyof HorarioDia,
    value: any,
  ) => {
    if (!scheduleAsesor) return;

    const prevInfo = scheduleForm[dia] || horarioPorDefecto[dia];
    const newForm = {
      ...scheduleForm,
      [dia]: {
        ...prevInfo,
        [field]: value,
      },
    };

    setScheduleForm(newForm);

    startTransition(async () => {
      const result = await updateAsesorHorario(
        scheduleAsesor.id_perfil,
        newForm,
      );
      if (result.success) {
        toast.success("Horario guardado automáticamente");
        // Refetch to keep the table data in sync with the modal
        fetchAsesores();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleUpdate = async () => {
    if (!editingAsesor) return;

    startTransition(async () => {
      const result = await updateAsesor(editingAsesor.id_perfil, {
        nombre_completo: editForm.nombre,
        cedula: editForm.cedula,
        telefono: editForm.telefono,
        area: editForm.area,
      });

      if (result.success) {
        toast.success(result.message);
        setIsEditOpen(false);
        fetchAsesores();
      } else {
        toast.error(result.error);
      }
    });
  };

  const filteredAsesores = asesores.filter(
    (a) =>
      a.perfil.nombre_completo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      a.perfil.cedula?.includes(searchTerm) ||
      a.perfil.correo?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Register Form */}
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Registrar</h1>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Nuevo Asesor</CardTitle>
                <CardDescription className="text-xs">
                  Todos los campos son obligatorios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-nombre" className="text-xs">
                      Nombre Completo
                    </Label>
                    <Input
                      id="asesor-nombre"
                      placeholder="Carlos Ramírez Torres"
                      value={form.nombre}
                      onChange={(e) => set("nombre")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="asesor-correo" className="text-xs">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="asesor-correo"
                      type="email"
                      placeholder="asesor@uac.edu.co"
                      value={form.correo}
                      onChange={(e) => set("correo")(e.target.value)}
                      disabled={isPending}
                      className="h-9 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="asesor-cedula" className="text-xs">
                        Cédula
                      </Label>
                      <Input
                        id="asesor-cedula"
                        placeholder="C.C."
                        value={form.cedula}
                        onChange={(e) => set("cedula")(e.target.value)}
                        disabled={isPending}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="asesor-telefono" className="text-xs">
                        Teléfono
                      </Label>
                      <Input
                        id="asesor-telefono"
                        placeholder="300..."
                        value={form.telefono}
                        onChange={(e) => set("telefono")(e.target.value)}
                        disabled={isPending}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Horarios</Label>
                    <div className="flex flex-wrap gap-2">
                      {form.horarios.map((h, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          {h.dia?.substring(0,3)} {h.turno}
                          <button onClick={() => {
                            const next = [...form.horarios]; next.splice(i, 1);
                            setForm({...form, horarios: next});
                          }} className="hover:bg-slate-200 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                        </Badge>
                      ))}
                      {form.horarios.length === 0 && <span className="text-xs text-slate-400">Sin horarios</span>}
                    </div>
                    <HorarioAdder onAdd={(h) => setForm({...form, horarios: [...form.horarios, h]})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Area</Label>
                    <Select value={form.area} onValueChange={set("area")}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Area" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laboral">Laboral</SelectItem>
                        <SelectItem value="civil_familia">Civil y Familia</SelectItem>
                        <SelectItem value="penal">Penal</SelectItem>
                        <SelectItem value="publica">Publico</SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Registrar"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: List & CRUD */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Asesores Registrados
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Buscar asesor..."
                  className="pl-9 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Nombre / Cédula</TableHead>
                      <TableHead>Especialidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-48 text-center text-slate-500"
                        >
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          Cargando asesores...
                        </TableCell>
                      </TableRow>
                    ) : filteredAsesores.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-41 text-center text-slate-500"
                        >
                          No se encontraron asesores.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAsesores.map((asesor) => (
                        <TableRow key={asesor.id_perfil}>
                          <TableCell>
                            <div className="font-medium text-slate-900">
                              {asesor.perfil.nombre_completo}
                            </div>
                            <div className="text-xs text-slate-500">
                              CC: {asesor.perfil.cedula}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm capitalize">
                              {asesor.area}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                asesor.perfil.activo ? "default" : "destructive"
                              }
                            >
                              {asesor.perfil.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => openEdit(asesor)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                onClick={() => openSchedule(asesor)}
                                title="Editar horario"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 ${asesor.perfil.activo ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50" : "text-green-600 hover:text-green-700 hover:bg-green-50"}`}
                                onClick={() => handleToggleStatus(asesor)}
                              >
                                {asesor.perfil.activo ? (
                                  <PowerOff className="h-4 w-4" />
                                ) : (
                                  <Power className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Editar Asesor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-1.5 sm:gap-4">
                <Label htmlFor="edit-nombre" className="text-left sm:text-right">
                  Nombre
                </Label>
                <Input
                  id="edit-nombre"
                  value={editForm.nombre}
                  onChange={(e) => setEdit("nombre")(e.target.value)}
                  className="sm:col-span-3"
                />
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-1.5 sm:gap-4">
                <Label htmlFor="edit-cedula" className="text-left sm:text-right">
                  Cédula
                </Label>
                <Input
                  id="edit-cedula"
                  value={editForm.cedula}
                  onChange={(e) => setEdit("cedula")(e.target.value)}
                  className="sm:col-span-3"
                />
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-1.5 sm:gap-4">
                <Label htmlFor="edit-telefono" className="text-left sm:text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  value={editForm.telefono}
                  onChange={(e) => setEdit("telefono")(e.target.value)}
                  className="sm:col-span-3"
                />
              </div>
              <div className="flex flex-col sm:grid sm:grid-cols-4 items-start sm:items-center gap-1.5 sm:gap-4">
                <Label htmlFor="edit-area" className="text-left sm:text-right">
                  Área
                </Label>
                <div className="sm:col-span-3 w-full">
                  <Select value={editForm.area} onValueChange={setEdit("area")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione área" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laboral">Laboral</SelectItem>
                      <SelectItem value="civil_familia">
                        Civil y Familia
                      </SelectItem>
                      <SelectItem value="penal">Penal</SelectItem>
                      <SelectItem value="publica">Público</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {editingAsesor && <HorariosEditor idPerfil={editingAsesor.id_perfil} />}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleUpdate}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Schedule Dialog */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Editar Horario: {scheduleAsesor?.perfil.nombre_completo}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <ScheduleEditor
                horario={scheduleForm}
                onChangeDia={handleScheduleChange}
              />
            </div>
            <DialogFooter>
              <div className="flex justify-end gap-3 w-full">
                {isPending && (
                  <span className="flex items-center text-sm text-slate-500 mr-2">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Guardando...
                  </span>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsScheduleOpen(false)}
                >
                  Cerrar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function HorarioAdder({ onAdd }: { onAdd: (h: {turno:string,dia:string}) => void }) {
  const [dia, setDia] = useState(""); const [turno, setTurno] = useState("");
  const DIAS = ["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
  return (
    <div className="flex gap-2 items-center mt-2">
      <Select value={dia} onValueChange={setDia}>
        <SelectTrigger className="h-8 text-xs w-24"><SelectValue placeholder="Dia" /></SelectTrigger>
        <SelectContent>{DIAS.map(d=><SelectItem key={d} value={d}>{d.substring(0,3)}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={turno} onValueChange={setTurno}>
        <SelectTrigger className="h-8 text-xs w-24"><SelectValue placeholder="Turno" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="9-11">9-11</SelectItem><SelectItem value="2-4">2-4</SelectItem><SelectItem value="4-6">4-6</SelectItem>
        </SelectContent>
      </Select>
      <Input placeholder="Otro..." value={turno} onChange={e=>setTurno(e.target.value)} className="h-8 text-xs w-20" />
      <Button size="sm" variant="outline" className="h-8" onClick={()=>{if(dia&&turno){onAdd({dia,turno});setTurno("")}}} disabled={!dia||!turno}><Plus className="w-3.5 h-3.5" /></Button>
    </div>
  );
}

