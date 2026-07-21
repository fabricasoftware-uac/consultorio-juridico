"use client";

import React, { useEffect, useState } from "react";
import { Navbar as StudentNavbar } from "../estudiante/components/NavBarEstudiante";
import { Navbar as AdvisorNavbar } from "../asesor/components/NavBarAsesor";
import { Navbar as ProApoyoNavbar } from "../pro-apoyo/components/NavBarProApoyo";
import { Navbar as AdminNavbar } from "../admin/components/NavbarAdmin";
import {
  HelpCircle,
  Phone,
  Mail,
  Info,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Users,
  Briefcase,
  ArrowRight,
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Archive,
  Upload,
  Search,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase/supabase-client";

const Navbars: Record<string, React.ComponentType> = {
  estudiante: StudentNavbar,
  asesor: AdvisorNavbar,
  pro_apoyo: ProApoyoNavbar,
  admin: AdminNavbar,
};

const RolLabels: Record<string, string> = {
  estudiante: "Estudiante",
  asesor: "Asesor",
  pro_apoyo: "Profesional de Apoyo",
  admin: "Administrador",
};

const RolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  estudiante: GraduationCap,
  asesor: Users,
  pro_apoyo: Briefcase,
  admin: ShieldCheck,
};

export default function CentroAyuda() {
  const [role, setRole] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("rol");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        try {
          const payload = JSON.parse(atob(session.access_token.split(".")[1]));
          setRole(payload.user_role ?? null);
        } catch {
          setRole(null);
        }
      }
    });
  }, []);

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const Navbar = Navbars[role] ?? (() => null);
  const RolIcon = RolIcons[role] ?? HelpCircle;
  const rolLabel = RolLabels[role] ?? "Usuario";

  const estadosInfo = [
    {
      estado: "En proceso",
      grad: "from-blue-500 to-blue-600",
      descripcion: "El caso está abierto y el estudiante debe completar la entrevista. Es la fase inicial de recolección de datos del solicitante.",
      icon: ClipboardList,
    },
    {
      estado: "Pendiente de aprobación",
      grad: "from-yellow-500 to-amber-600",
      descripcion: "El estudiante envió la entrevista. El asesor debe revisar, clasificar y aprobar el caso para que continúe su trámite.",
      icon: Clock,
    },
    {
      estado: "En corrección",
      grad: "from-orange-500 to-orange-600",
      descripcion: "El asesor encontró información incorrecta o incompleta. El estudiante debe corregir los datos y reenviar la entrevista.",
      icon: XCircle,
    },
    {
      estado: "Activo",
      grad: "from-green-500 to-emerald-600",
      descripcion: "El caso está aprobado y en trámite jurídico. Los documentos pueden subirse y revisarse. Es la fase de trabajo real del caso.",
      icon: CheckCircle2,
    },
    {
      estado: "Cerrado",
      grad: "from-slate-500 to-slate-600",
      descripcion: "El asesor certificó que el caso está completo y cerró el proceso jurídico. Pendiente del visto bueno final del profesional de apoyo.",
      icon: BadgeCheck,
    },
    {
      estado: "Archivado",
      grad: "from-violet-500 to-violet-600",
      descripcion: "El profesional de apoyo dio el visto bueno final. El caso se archivó definitivamente y finalizó su ciclo de vida.",
      icon: Archive,
    },
  ];

  const faqsEstudiante = [
    {
      q: "¿Cómo completo la entrevista del caso?",
      a: "Ve a Mis Casos → selecciona el caso en estado 'En proceso' → haz clic en 'Ir a entrevista'. Completa los 8 pasos del formulario. Puedes guardar tu progreso (se almacena en el navegador) y continuar después. Al finalizar, confirma con la cédula del solicitante y envía.",
    },
    {
      q: "¿Qué pasa si el asesor pide correcciones?",
      a: "El caso pasará a estado 'En corrección'. Aparecerá un botón 'Continuar entrevista' en Mis Casos. Revisa las observaciones del asesor, corrige los datos necesarios y haz clic en 'Reenviar para aprobación'. El plazo de corrección es de 48 horas.",
    },
    {
      q: "¿Puedo modificar datos del solicitante como el correo?",
      a: "Sí. Durante la entrevista, el campo de correo electrónico del solicitante es editable. Los demás datos personales del solicitante (nombre, cédula, teléfono) vienen del registro inicial y no se modifican en la entrevista.",
    },
    {
      q: "¿Cómo subo documentos al caso?",
      a: "En los detalles del caso, sección 'Documentos', haz clic en 'Subir documento'. Formatos permitidos: PDF, Word, Excel, imágenes (JPG/PNG) y ZIP. Límite: 25 MB por archivo, máximo 50 archivos por caso.",
    },
    {
      q: "¿Qué son las observaciones y cómo las uso?",
      a: "La sección de Observaciones es un chat interno donde puedes comunicarte con el asesor. Escribe preguntas, notas o aclaraciones. El asesor verá tus mensajes en tiempo real y puede responder.",
    },
    {
      q: "¿Qué significan las fechas de vencimiento?",
      a: "Cada caso tiene un plazo límite para completar la entrevista (countdown 'Entrega'). Si se vence, el sistema puede generar un llamado de atención. Cumple los plazos para evitar penalizaciones.",
    },
  ];

  const faqsAsesor = [
    {
      q: "¿Cómo apruebo y clasifico un caso?",
      a: "Cuando un caso está en 'Pendiente de aprobación', revisa la entrevista completa. Tienes dos opciones: 'Solo asesoría' (el caso no continúa a trámite formal) o 'Aprobar y continuar' (el caso pasa a estado Activo). Si hay errores, usa 'Solicitar ajustes' para devolverlo al estudiante.",
    },
    {
      q: "¿Qué significa cada clasificación de caso?",
      a: "'En trámite': el caso requiere proceso jurídico formal con documentos. 'Solo asesoría': se brindó orientación legal pero no hay trámite formal (no requiere documentos para cerrar).",
    },
    {
      q: "¿Cómo apruebo o rechazo documentos?",
      a: "En la sección 'Documentos', cada archivo tiene un menú de 3 puntos (⋮) con opciones 'Aprobar' y 'Rechazar'. Los documentos aprobados muestran un badge verde. Para cerrar un caso 'En trámite', todos los documentos deben estar aprobados.",
    },
    {
      q: "¿Cómo cierro un caso?",
      a: "Usa el botón 'Cerrar caso' en la cabecera del detalle del caso. Si la clasificación es 'Solo asesoría', se cierra directamente. Si es 'En trámite', necesitas tener todos los documentos aprobados primero. El caso pasará a estado 'Cerrado' y quedará listo para que el profesional de apoyo lo archive.",
    },
    {
      q: "¿Puedo editar los datos del caso o del solicitante?",
      a: "Sí, tienes permisos de edición en la pestaña 'Usuario' y en la información del caso. También puedes editar los datos del accionado/demandado en la pestaña correspondiente.",
    },
    {
      q: "¿Cómo veo el historial completo del caso?",
      a: "En la sección 'Resumen' del detalle del caso, encontrarás la tarjeta 'Historial del Caso' que muestra todas las acciones registradas: creación, asignaciones, cambios de estado, aprobaciones y observaciones.",
    },
  ];

  const faqsProApoyo = [
    {
      q: "¿Cómo creo un nuevo caso?",
      a: "Ve a 'Crear Caso' en la barra de navegación. Completa el formulario con los datos del solicitante y asigna un estudiante y un asesor. El caso se crea en estado 'En proceso' y el estudiante recibirá la notificación para iniciar la entrevista.",
    },
    {
      q: "¿Qué datos necesito para registrar un solicitante?",
      a: "Nombre completo, cédula, teléfono, correo electrónico, dirección y el área del derecho a la que corresponde el caso. También puedes indicar si pertenece a una población con enfoque diferencial.",
    },
    {
      q: "¿Cómo reasigno un estudiante o asesor?",
      a: "En el detalle del caso, sidebar 'Equipo asignado', usa el botón de reasignar. Puedes buscar por nombre, filtrar por día y jornada, y ver la carga de casos de cada candidato antes de asignar.",
    },
    {
      q: "¿Cuándo y cómo archivo un caso?",
      a: "Cuando el asesor cierra el caso (estado 'Cerrado'), aparece el botón 'Archivar caso' en el detalle. Al hacer clic se abre un modal de confirmación. El caso se archiva definitivamente y finaliza su ciclo de vida.",
    },
    {
      q: "¿Cómo elimino un documento subido por error?",
      a: "Solo administradores y Pro-Apoyo pueden eliminar documentos. En el menú de 3 puntos (⋮) de cada documento, selecciona 'Eliminar'. Esta acción es permanente.",
    },
    {
      q: "¿Qué son los llamados de atención?",
      a: "Son alertas automáticas que el sistema genera cuando un estudiante o asesor excede los plazos de entrega. Aparecen en el sidebar del detalle del caso y pueden ser resueltos al completar la acción pendiente.",
    },
  ];

  const faqsAdmin = [
    {
      q: "¿Cómo administro los usuarios del sistema?",
      a: "En las secciones Estudiantes, Asesores y Profesionales de Apoyo puedes registrar, editar, activar/desactivar y eliminar usuarios. Cada formulario de registro solicita los datos específicos de cada rol.",
    },
    {
      q: "¿Cómo reasigno un estudiante o asesor a un caso?",
      a: "En el detalle de cualquier caso, el sidebar 'Equipo asignado' muestra el estudiante y asesor actuales con un botón para reasignar. Puedes buscar candidatos por nombre y ver su carga actual de casos.",
    },
    {
      q: "¿Cómo reviso el historial de cambios de un caso?",
      a: "Cada caso tiene un 'Historial del Caso' que registra automáticamente todas las acciones: creación, asignaciones, cambios de estado, aprobaciones y observaciones. También puedes auditar el sistema completo desde la vista de administrador.",
    },
    {
      q: "¿Cómo exporto información de casos?",
      a: "En la sección 'Todos los casos' puedes filtrar por estado, área y período. Los datos pueden consultarse directamente desde la interfaz o exportarse desde las herramientas administrativas.",
    },
  ];

  const generalFaqs = [
    {
      q: "¿Quién puede ver la información de un caso?",
      a: "Solo el estudiante asignado, el asesor del área, el equipo de Pro-Apoyo y los administradores del sistema. Toda la información está protegida por políticas de acceso basadas en roles (RBAC).",
    },
    {
      q: "¿Cómo funcionan las notificaciones en tiempo real?",
      a: "Cuando se asigna un caso, se sube un documento, se aprueba/rechaza, o se escribe una observación, los demás usuarios del caso reciben una notificación instantánea en el ícono de campana superior. Si no ves cambios inmediatos, recarga la página.",
    },
    {
      q: "¿Cómo filtro y busco casos?",
      a: "En la lista de casos puedes filtrar por estado, área, período y clasificación. También puedes buscar por nombre del solicitante, cédula o número de caso. Los resultados se ordenan por fecha (más recientes primero).",
    },
    {
      q: "¿Qué hago si veo datos incorrectos que no puedo editar?",
      a: "Contacta al equipo de Pro-Apoyo. Ellos pueden modificar datos estructurales del caso y del solicitante. Si eres estudiante, solo puedes editar el correo electrónico del solicitante durante la entrevista.",
    },
  ];

  const rolFaqs: Record<string, { q: string; a: string }[]> = {
    estudiante: faqsEstudiante,
    asesor: faqsAsesor,
    pro_apoyo: faqsProApoyo,
    admin: faqsAdmin,
  };

  const currentFaqs = rolFaqs[role] ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-100 rounded-2xl mb-4">
            <HelpCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Centro de Ayuda</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bienvenido, <span className="font-semibold text-slate-800">{rolLabel}</span>. Aquí encuentras guías e información sobre el funcionamiento del Consultorio Jurídico.
          </p>
        </div>

        {/* Flujo de Estados */}
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm mb-8">
          <div className="bg-blue-50 border-b border-blue-100 p-5 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Flujo de un Caso</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">En proceso</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Pendiente aprobación</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Activo</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">Cerrado</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">Archivado</span>
            </div>
            <div className="flex justify-center mt-3">
              <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full font-medium border border-orange-200">
                ↺ En corrección — el asesor pide ajustes y el caso vuelve a "Pendiente aprobación"
              </span>
            </div>
          </div>
        </Card>

        {/* Estados */}
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm mb-8">
          <div className="bg-slate-50 border-b p-5 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Info className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Estados del Caso</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {estadosInfo.map(({ estado, grad, descripcion, icon: Icon }) => (
              <div key={estado} className="p-5 flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 bg-linear-to-br ${grad} text-white mt-0.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-0.5">{estado}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* FAQs del rol */}
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm mb-8">
          <div className="bg-slate-50 border-b p-5 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RolIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Guía para {rolLabel}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {role === "estudiante" && "Entrevistas, documentos, plazos y observaciones"}
                {role === "asesor" && "Aprobación, clasificación, documentos y cierre de casos"}
                {role === "pro_apoyo" && "Creación, asignación, supervisión y cierre de casos"}
                {role === "admin" && "Gestión de usuarios, asignaciones y auditoría del sistema"}
              </p>
            </div>
          </div>
          <div className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {currentFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`r-${i}`} className="border-b border-slate-100 last:border-0 py-2">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-700">{faq.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pl-14 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>

        {/* Preguntas generales */}
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm mb-8">
          <div className="bg-slate-50 border-b p-5 flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Información General</h2>
          </div>
          <div className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {generalFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`g-${i}`} className="border-b border-slate-100 last:border-0 py-2">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-700">{faq.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pl-14 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Card>

        {/* Documentos */}
        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm mb-8">
          <div className="bg-slate-50 border-b p-5 flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Upload className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Documentos y Archivos</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-800 mb-2">Formatos permitidos</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>PDF (.pdf)</li>
                  <li>Word (.doc, .docx)</li>
                  <li>Excel (.xls, .xlsx)</li>
                  <li>Imágenes (.jpg, .jpeg, .png)</li>
                  <li>Comprimidos (.zip)</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-800 mb-2">Límites</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>Tamaño máximo: 25 MB por archivo</li>
                  <li>Máximo 50 documentos activos por caso (los archivados no cuentan)</li>
                  <li>PDFs escaneados: usar 200-300 DPI en escala de grises</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Estados de documentos
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li><strong>Pendiente:</strong> El documento se subió pero el asesor aún no lo revisa.</li>
                <li><strong>Aprobado:</strong> El asesor revisó y validó el documento.</li>
                <li><strong>Rechazado:</strong> El asesor encontró problemas. Debe corregirse y volver a subir.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Soporte */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="p-3 bg-green-100 rounded-xl">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Soporte Técnico</h3>
              <p className="text-sm text-slate-500">Mesa de ayuda: (321) 634-2133</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Correo Institucional</h3>
              <p className="text-sm text-slate-500">fabrica.software@uniautonoma.edu.co</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-400 text-sm">
          <p>&copy; 2026 Consultorio Juridico - Universidad Autonoma del Cauca</p>
          <p className="mt-1">Sistema de Gestion de Casos v2.0</p>
        </div>
      </main>
    </div>
  );
}
