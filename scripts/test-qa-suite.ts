import assert from "node:assert/strict";
import { matchesSearch, normalizeText, levenshteinDistance } from "../src/lib/search";
import {
  mismoDia,
  nombreMostrado,
  formatArea,
  sumarDiasHabiles,
  horarioSemanaAFilas,
  validarCambioEstadoAdmin,
  calcularPlazosCambioEstado,
  ESTADOS_VALIDOS_CASO,
} from "../src/lib/utils";
import { ROLE_HOME } from "../src/lib/roles";
import {
  mapLlamadoAdmin,
  groupLlamadosByTipo,
  filterLlamadosGenerales,
  aplicarResolucionLlamado,
  type LlamadoAtencionAdmin,
} from "../supabase/queries/getLlamadosAdmin";
import {
  verificarCasoRequiereReasignacion,
  sugerirSiguienteSemestre,
  validarPeriodoAcademico,
} from "../src/lib/transicion-semestral";
import {
  formatRelativeActivity,
  formatFullDateTime,
} from "../src/lib/format-date";

console.log("=== INICIANDO SUITE DE PRUEBAS DE QA ===\n");

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// -------------------------------------------------------------------
// 1. Pruebas de normalización y Levenshtein
// -------------------------------------------------------------------
console.log("1. Pruebas de utilidades base (normalizeText, levenshteinDistance)");

test("normalizeText limpia tildes y diacríticos", () => {
  assert.equal(normalizeText("Ángel José Pérez"), "angel jose perez");
  assert.equal(normalizeText("Bogotá D.C."), "bogota d.c.");
  assert.equal(normalizeText(""), "");
  assert.equal(normalizeText(null), "");
  assert.equal(normalizeText(undefined), "");
  assert.equal(normalizeText(12345), "12345");
});

test("levenshteinDistance calcula la distancia correctamente", () => {
  assert.equal(levenshteinDistance("gomez", "gomez"), 0);
  assert.equal(levenshteinDistance("gonsales", "gonzalez"), 2);
  assert.equal(levenshteinDistance("camlo", "camilo"), 1);
  assert.equal(levenshteinDistance("test", ""), 4);
});

// -------------------------------------------------------------------
// 2. Pruebas de matchesSearch
// -------------------------------------------------------------------
console.log("\n2. Pruebas de matchesSearch");

test("Consulta vacía o con espacios retorna true (coincide con todo)", () => {
  assert.equal(matchesSearch("", "Juan Perez", "100234567"), true);
  assert.equal(matchesSearch("   ", "Juan Perez", "100234567"), true);
  assert.equal(matchesSearch(null, "Juan Perez"), true);
  assert.equal(matchesSearch(undefined, "Juan Perez"), true);
});

test("Objetivos vacíos retornan false si hay consulta", () => {
  assert.equal(matchesSearch("Juan", null, undefined, ""), false);
  assert.equal(matchesSearch("123"), false);
});

test("Búsqueda insensible a mayúsculas y minúsculas", () => {
  assert.equal(matchesSearch("juan", "JUAN CARLOS"), true);
  assert.equal(matchesSearch("JUAN", "juan carlos"), true);
});

test("Búsqueda insensible a tildes", () => {
  assert.equal(matchesSearch("perez", "María Gómez Pérez"), true);
  assert.equal(matchesSearch("pérez", "Maria Gomez Perez"), true);
  assert.equal(matchesSearch("bogota", "Bogotá"), true);
});

test("Búsqueda en orden libre de palabras (token-based)", () => {
  assert.equal(matchesSearch("Pérez Juan", "Juan Carlos Pérez"), true);
  assert.equal(matchesSearch("Carlos Maria Gomez", "Gomez Carlos"), false);
  assert.equal(matchesSearch("Maria Perez", "Perez Rodriguez Maria Jose"), true);
});

test("Búsqueda de números (cédula, ID) es estricta (no fuzzy falso)", () => {
  // Coincidencia exacta o subcadena numérica
  assert.equal(matchesSearch("100234", "1002345678"), true);
  assert.equal(matchesSearch("1002345678", "1002345678"), true);
  // Un número diferente no debe coincidir por fuzzy
  assert.equal(matchesSearch("1002345679", "1002345678"), false);
  assert.equal(matchesSearch("999999", "1002345678"), false);
});

test("Tolerancia a errores tipográficos leves (fuzzy)", () => {
  assert.equal(matchesSearch("camlo", "Camilo Andres"), true); // dist 1
  assert.equal(matchesSearch("rodriges", "Rodriguez"), true);  // dist 2
  assert.equal(matchesSearch("gonsales", "Gonzalez"), true);   // dist 2
  // Diferencia muy grande no coincide
  assert.equal(matchesSearch("xyzabc", "Gonzalez"), false);
});

// -------------------------------------------------------------------
// 3. Pruebas del Buscador de Texto en Casos (Exclusivo Solicitante y N° Caso)
// -------------------------------------------------------------------
console.log("\n3. Pruebas del Buscador de Texto en Casos (Exclusivo Solicitante y N° Caso)");

const mockCaso = {
  id_caso: 1042,
  area: "laboral",
  estado: "activo",
  periodo: "2026-1",
  clasificacion: "asesoria",
  resumen_hechos: "Despido injustificado sin liquidación",
  usuarios: {
    nombre_completo: "Carlos Alberto Mendoza",
    cedula: "72145896",
  },
  estudiantes_casos: [
    {
      fecha_asignacion: "2026-01-10",
      fecha_fin_asignacion: null, // Activo
      estudiante: {
        id_perfil: "est-1",
        perfil: {
          nombre_completo: "Laura Daniela Ríos Gómez",
          cedula: "1004567890",
        },
      },
    },
  ],
  asesores_casos: [
    {
      fecha_asignacion: "2026-01-10",
      fecha_fin_asignacion: null, // Activo
      asesor: {
        id_perfil: "ase-1",
        perfil: {
          nombre_completo: "Dr. Roberto Alejandro Silva",
          cedula: "19876543",
        },
      },
    },
  ],
};

function searchCasoText(caso: typeof mockCaso | any, query: string): boolean {
  const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;
  return matchesSearch(
    query,
    usuario?.nombre_completo,
    usuario?.cedula,
    caso.id_caso,
  );
}

test("Encuentra caso por ID de caso en el buscador de texto", () => {
  assert.equal(searchCasoText(mockCaso, "1042"), true);
  assert.equal(searchCasoText(mockCaso, "1043"), false);
});

test("Encuentra caso por nombre del cliente (usuario)", () => {
  assert.equal(searchCasoText(mockCaso, "Carlos Mendoza"), true);
  assert.equal(searchCasoText(mockCaso, "mendoza alberto"), true);
});

test("Encuentra caso por cédula del cliente (usuario)", () => {
  assert.equal(searchCasoText(mockCaso, "72145896"), true);
  assert.equal(searchCasoText(mockCaso, "72145"), true);
});

test("Buscador de texto NO busca por nombre de estudiante (evita falsos positivos)", () => {
  assert.equal(searchCasoText(mockCaso, "Laura Rios"), false);
  assert.equal(searchCasoText(mockCaso, "daniela gomez"), false);
  assert.equal(searchCasoText(mockCaso, "Laura Daniela"), false);
});

test("Buscador de texto NO busca por cédula de estudiante", () => {
  assert.equal(searchCasoText(mockCaso, "1004567890"), false);
  assert.equal(searchCasoText(mockCaso, "100456"), false);
});

test("Buscador de texto NO busca por nombre de asesor", () => {
  assert.equal(searchCasoText(mockCaso, "Roberto Silva"), false);
  assert.equal(searchCasoText(mockCaso, "dr roberto"), false);
});

test("Buscador de texto NO busca por cédula de asesor", () => {
  assert.equal(searchCasoText(mockCaso, "19876543"), false);
  assert.equal(searchCasoText(mockCaso, "19876"), false);
});

test("Buscador de texto NO busca por hechos o área (evita contaminar resultados)", () => {
  assert.equal(searchCasoText(mockCaso, "laboral"), false);
  assert.equal(searchCasoText(mockCaso, "despido"), false);
  assert.equal(searchCasoText(mockCaso, "liquidacion"), false);
});

test("No encuentra caso con datos no relacionados", () => {
  assert.equal(searchCasoText(mockCaso, "penal"), false);
  assert.equal(searchCasoText(mockCaso, "Fernanda"), false);
  assert.equal(searchCasoText(mockCaso, "55555555"), false);
});

test("Maneja casos donde usuario viene como arreglo o null", () => {
  const casoArrayUsuario = {
    ...mockCaso,
    usuarios: [{ nombre_completo: "Ana María Soto", cedula: "43210987" }],
  };
  assert.equal(searchCasoText(casoArrayUsuario, "Ana Soto"), true);
  assert.equal(searchCasoText(casoArrayUsuario, "43210987"), true);

  const casoNullUsuario = {
    ...mockCaso,
    usuarios: null as any,
  };
  assert.equal(searchCasoText(casoNullUsuario, "Laura Rios"), false);
  assert.equal(searchCasoText(casoNullUsuario, "Carlos Mendoza"), false);
  // Pero aún puede coincidir con el ID del caso
  assert.equal(searchCasoText(casoNullUsuario, "1042"), true);
});

test("Maneja casos sin estudiante o asesor asignado sin reventar", () => {
  const casoSinAsignaciones = {
    ...mockCaso,
    estudiantes_casos: [],
    asesores_casos: [],
  };
  assert.equal(searchCasoText(casoSinAsignaciones, "Carlos Mendoza"), true);
  assert.equal(searchCasoText(casoSinAsignaciones, "Laura Rios"), false);
});

// -------------------------------------------------------------------
// 4. Pruebas de Filtros Independientes y Preservación de Datos
// -------------------------------------------------------------------
console.log("\n4. Pruebas de Filtros Independientes y Preservación de Datos");

interface CasoFiltros {
  searchTerm?: string;
  statusFilter?: string;
  areaFilter?: string;
  studentFilter?: string;
  advisorFilter?: string;
  periodoFilter?: string;
  classFilter?: string;
}

function filtrarCaso(caso: any, filtros: CasoFiltros): boolean {
  const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;

  const matchSearch = matchesSearch(
    filtros.searchTerm || "",
    usuario?.nombre_completo,
    usuario?.cedula,
    caso.id_caso,
  );

  const matchStatus = !filtros.statusFilter || filtros.statusFilter === "todos" || caso.estado === filtros.statusFilter;
  const matchArea = !filtros.areaFilter || filtros.areaFilter === "todos" || caso.area === filtros.areaFilter;
  const matchPeriodo = !filtros.periodoFilter || filtros.periodoFilter === "todos" || caso.periodo === filtros.periodoFilter;
  const matchClass = !filtros.classFilter || filtros.classFilter === "todos" || caso.clasificacion === filtros.classFilter;

  const matchStudent =
    !filtros.studentFilter ||
    filtros.studentFilter === "todos" ||
    caso.estudiantes_casos?.some(
      (ec: any) =>
        !ec.fecha_fin_asignacion &&
        ec.estudiante?.perfil?.nombre_completo === filtros.studentFilter,
    );

  const matchAdvisor =
    !filtros.advisorFilter ||
    filtros.advisorFilter === "todos" ||
    caso.asesores_casos?.some(
      (ac: any) =>
        !ac.fecha_fin_asignacion &&
        ac.asesor?.perfil?.nombre_completo === filtros.advisorFilter,
    );

  return Boolean(
    matchSearch &&
    matchStatus &&
    matchArea &&
    matchPeriodo &&
    matchClass &&
    matchStudent &&
    matchAdvisor
  );
}

const mockDatasetCasos = [
  {
    id_caso: 101,
    estado: "activo",
    area: "laboral",
    periodo: "2026-1",
    clasificacion: "asesoria",
    usuarios: { nombre_completo: "Carlos Mendoza", cedula: "72145896" },
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: { perfil: { nombre_completo: "Laura Daniela Ríos Gómez" } },
      },
    ],
    asesores_casos: [
      {
        fecha_fin_asignacion: null,
        asesor: { perfil: { nombre_completo: "Dr. Roberto Alejandro Silva" } },
      },
    ],
  },
  {
    id_caso: 102,
    estado: "cerrado",
    area: "penal",
    periodo: "2026-1",
    clasificacion: "representacion",
    usuarios: { nombre_completo: "Maria Fernanda Gómez", cedula: "10987654" },
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: { perfil: { nombre_completo: "Mateo Restrepo" } },
      },
    ],
    asesores_casos: [
      {
        fecha_fin_asignacion: null,
        asesor: { perfil: { nombre_completo: "Dra. Claudia Morales" } },
      },
    ],
  },
  {
    id_caso: 103,
    estado: "activo",
    area: "civil_familia",
    periodo: "2025-2",
    clasificacion: "asesoria",
    usuarios: { nombre_completo: "Pedro Pablo Pérez", cedula: "80123456" },
    estudiantes_casos: [
      {
        fecha_fin_asignacion: "2026-01-01", // Histórica finalizada
        estudiante: { perfil: { nombre_completo: "Laura Daniela Ríos Gómez" } },
      },
      {
        fecha_fin_asignacion: null, // Asignación activa
        estudiante: { perfil: { nombre_completo: "Mateo Restrepo" } },
      },
    ],
    asesores_casos: [
      {
        fecha_fin_asignacion: null,
        asesor: { perfil: { nombre_completo: "Dr. Roberto Alejandro Silva" } },
      },
    ],
  },
  {
    id_caso: 104,
    estado: "pendiente",
    area: "laboral",
    periodo: "2026-1",
    clasificacion: "tramite",
    usuarios: { nombre_completo: "Julian Casablancas", cedula: "99887766" },
    estudiantes_casos: [],
    asesores_casos: [],
  },
];

test("Filtrado independiente por estudiante asignado activo", () => {
  // Caso 101 tiene a Laura activa; Caso 103 la tiene histórica, no activa
  const filtradosLaura = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, { studentFilter: "Laura Daniela Ríos Gómez" }),
  );
  assert.equal(filtradosLaura.length, 1);
  assert.equal(filtradosLaura[0].id_caso, 101);

  // Mateo activo en caso 102 y caso 103
  const filtradosMateo = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, { studentFilter: "Mateo Restrepo" }),
  );
  assert.equal(filtradosMateo.length, 2);
  assert.deepEqual(
    filtradosMateo.map((c) => c.id_caso),
    [102, 103],
  );
});

test("Filtrado independiente por asesor asignado activo", () => {
  // Dr. Roberto Silva activo en 101 y 103
  const filtradosRoberto = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, { advisorFilter: "Dr. Roberto Alejandro Silva" }),
  );
  assert.equal(filtradosRoberto.length, 2);
  assert.deepEqual(
    filtradosRoberto.map((c) => c.id_caso),
    [101, 103],
  );

  // Dra. Claudia Morales activa en 102
  const filtradosClaudia = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, { advisorFilter: "Dra. Claudia Morales" }),
  );
  assert.equal(filtradosClaudia.length, 1);
  assert.equal(filtradosClaudia[0].id_caso, 102);
});

test("Combinación precisa de buscador de texto con filtros independientes de estudiante y asesor", () => {
  // Buscar cliente "Carlos" y filtrar por estudiante "Laura Daniela Ríos Gómez"
  const matchAmbos = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, {
      searchTerm: "Carlos",
      studentFilter: "Laura Daniela Ríos Gómez",
    }),
  );
  assert.equal(matchAmbos.length, 1);
  assert.equal(matchAmbos[0].id_caso, 101);

  // Buscar cliente "Carlos" pero con estudiante diferente no debe coincidir
  const matchEstudianteInvalido = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, {
      searchTerm: "Carlos",
      studentFilter: "Mateo Restrepo",
    }),
  );
  assert.equal(matchEstudianteInvalido.length, 0);

  // Buscar por N° caso "103" + asesor Roberto Silva
  const matchCasoAsesor = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, {
      searchTerm: "103",
      advisorFilter: "Dr. Roberto Alejandro Silva",
    }),
  );
  assert.equal(matchCasoAsesor.length, 1);
  assert.equal(matchCasoAsesor[0].id_caso, 103);
});

test("Reinicio de filtros restaura el conjunto total de casos (preservación de datos)", () => {
  const estadoOriginal = [...mockDatasetCasos];

  // Aplicar múltiples filtros restrictivos
  const filtrosActivos: CasoFiltros = {
    searchTerm: "Carlos",
    statusFilter: "activo",
    areaFilter: "laboral",
    studentFilter: "Laura Daniela Ríos Gómez",
    advisorFilter: "Dr. Roberto Alejandro Silva",
    periodoFilter: "2026-1",
    classFilter: "asesoria",
  };

  const resultadoRestringido = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, filtrosActivos),
  );
  assert.equal(resultadoRestringido.length, 1);

  // Simular acción onClear / limpiar
  const filtrosReiniciados: CasoFiltros = {
    searchTerm: "",
    statusFilter: "todos",
    areaFilter: "todos",
    studentFilter: "todos",
    advisorFilter: "todos",
    periodoFilter: "todos",
    classFilter: "todos",
  };

  const resultadoReiniciado = mockDatasetCasos.filter((c) =>
    filtrarCaso(c, filtrosReiniciados),
  );

  // Debe retornar la totalidad de los datos sin ninguna pérdida o mutación destructiva
  assert.equal(resultadoReiniciado.length, mockDatasetCasos.length);
  assert.deepEqual(resultadoReiniciado, estadoOriginal);
});

// -------------------------------------------------------------------
// 5. Pruebas de mismoDia y utilidades
// -------------------------------------------------------------------
console.log("\n5. Pruebas de mismoDia y utilidades");

test("mismoDia ignora tildes y mayúsculas/minúsculas", () => {
  assert.equal(mismoDia("Miércoles", "Miercoles"), true);
  assert.equal(mismoDia("MIÉRCOLES", "miercoles"), true);
  assert.equal(mismoDia("Sábado", "sabado"), true);
  assert.equal(mismoDia("Lunes", "lunes"), true);
  assert.equal(mismoDia("Jueves", "Viernes"), false);
  assert.equal(mismoDia(null, "Lunes"), false);
  assert.equal(mismoDia("Lunes", undefined), false);
  assert.equal(mismoDia("", ""), false);
});

test("nombreMostrado maneja strings válidos, null, undefined y vacíos", () => {
  assert.equal(nombreMostrado("Juan Pérez"), "Juan Pérez");
  assert.equal(nombreMostrado("   "), "Sin nombre");
  assert.equal(nombreMostrado(null), "Sin nombre");
  assert.equal(nombreMostrado(undefined), "Sin nombre");
});

test("formatArea traduce correctamente las claves de área", () => {
  assert.equal(formatArea("laboral"), "Derecho Laboral");
  assert.equal(formatArea("penal"), "Derecho Penal");
  assert.equal(formatArea("civil_familia"), "Derecho Civil y familiar");
  assert.equal(formatArea("no_asignada"), "No asignada");
  assert.equal(formatArea(null), "");
});

// -------------------------------------------------------------------
// 6. Pruebas de filtrado en Gestión de Usuarios (Admin)
// -------------------------------------------------------------------
console.log("\n6. Pruebas de filtrado en Gestión de Usuarios");

test("Filtrado seguro de estudiantes con perfil nulo o incompleto", () => {
  const estudiantes = [
    {
      id_perfil: "e1",
      semestre: 8,
      jornada: "diurna",
      perfil: {
        nombre_completo: "Sofia Vergara",
        cedula: "11223344",
        correo: "sofia@correo.com",
        activo: true,
      },
    },
    {
      id_perfil: "e2",
      semestre: null,
      jornada: "nocturna",
      perfil: null as any, // Perfil no completado aún (alta Google)
    },
  ];

  // Búsqueda
  const match1 = estudiantes.filter((e) =>
    matchesSearch(
      "sofia",
      e.perfil?.nombre_completo,
      e.perfil?.cedula,
      e.perfil?.correo,
      e.jornada,
      e.semestre?.toString(),
    ),
  );
  assert.equal(match1.length, 1);
  assert.equal(match1[0].id_perfil, "e1");

  // Filtrado de activos sin reventar por e.perfil null
  const activos = estudiantes.filter((e) => e.perfil?.activo ?? false);
  assert.equal(activos.length, 1);
  assert.equal(activos[0].id_perfil, "e1");
});

test("Filtrado seguro de asesores con perfil nulo o incompleto", () => {
  const asesores = [
    {
      id_perfil: "a1",
      area: "penal",
      perfil: {
        nombre_completo: "Dr. Mario Bros",
        cedula: "98765",
        correo: "mario@asesor.com",
        activo: true,
      },
    },
    {
      id_perfil: "a2",
      area: "laboral",
      perfil: undefined as any,
    },
  ];

  const match = asesores.filter((a) =>
    matchesSearch(
      "mario",
      a.perfil?.nombre_completo,
      a.perfil?.cedula,
      a.perfil?.correo,
    ),
  );
  assert.equal(match.length, 1);
  assert.equal(match[0].id_perfil, "a1");

  const activos = asesores.filter((a) => a.perfil?.activo ?? false);
  assert.equal(activos.length, 1);
});

// -------------------------------------------------------------------
// 7. Pruebas de AsignacionCaso - Lógica de turno y fallback
// -------------------------------------------------------------------
console.log("\n7. Pruebas de AsignacionCaso - Lógica de turno y fallback");

test("atiendeHoy detecta estudiantes en turno usando horarios reales", () => {
  const diaActual = "Miércoles";
  const atiendeHoy = (e: any) =>
    (e.horarios ?? []).some((h: any) => mismoDia(h.dia, diaActual));

  const e1 = {
    id_perfil: "e1",
    horarios: [{ dia: "Miercoles", turno: "9-11" }], // sin tilde en BD
  };
  const e2 = {
    id_perfil: "e2",
    horarios: [{ dia: "Viernes", turno: "2-4" }],
  };
  const e3 = {
    id_perfil: "e3",
    horarios: [],
  };

  assert.equal(atiendeHoy(e1), true);
  assert.equal(atiendeHoy(e2), false);
  assert.equal(atiendeHoy(e3), false);

  // Fallback si nadie atiende hoy
  const estudiantesSinTurnoHoy = [e2, e3];
  const hayEstudiantesHoy = estudiantesSinTurnoHoy.some(atiendeHoy);
  assert.equal(hayEstudiantesHoy, false);

  const mostrarTodos = false;
  const mostrarTodosEfectivo = mostrarTodos || !hayEstudiantesHoy;
  assert.equal(mostrarTodosEfectivo, true); // Debe activarse fallback
});

// -------------------------------------------------------------------
// 8. Pruebas del Módulo de Llamados de Atención (Admin / Casos)
// -------------------------------------------------------------------
console.log("\n8. Pruebas del Módulo de Llamados de Atención");

// --- 8.1 Normalización y mapeo de datos ---
test("mapLlamadoAdmin normaliza datos de llamado de docente (asesor) con perfil y caso embebidos", () => {
  const rawItem = {
    id: 1,
    id_caso: 1050,
    id_usuario: "user-asesor-1",
    tipo: "asesor",
    motivo: "Demora en revisión de minuta",
    fecha_creacion: "2026-10-15T10:00:00Z",
    leido: 0,
    resuelto: false,
    fecha_resolucion: null,
    resuelto_por: null,
    motivo_resolucion: null,
    perfil: {
      id: "user-asesor-1",
      nombre_completo: "Dr. Roberto Casas",
      correo: "roberto.casas@uac.edu.co",
      cedula: "72123456",
      telefono: "3001234567",
    },
    caso: {
      id_caso: 1050,
      area: "penal",
      estado: "en_revision",
      fecha_creacion: "2026-10-01T08:00:00Z",
      usuarios: {
        nombre_completo: "Carlos Solicitante",
        cedula: "1045678901",
      },
    },
  };

  const mapped = mapLlamadoAdmin(rawItem);
  assert.equal(mapped.id, 1);
  assert.equal(mapped.id_caso, 1050);
  assert.equal(mapped.id_usuario, "user-asesor-1");
  assert.equal(mapped.tipo, "asesor");
  assert.equal(mapped.motivo, "Demora en revisión de minuta");
  assert.equal(mapped.leido, false); // 0 convertido a false
  assert.equal(mapped.resuelto, false);
  assert.equal(mapped.perfil?.nombre_completo, "Dr. Roberto Casas");
  assert.equal(mapped.perfil?.cedula, "72123456");
  assert.equal(mapped.caso?.area, "penal");
  assert.equal(mapped.caso?.usuarios?.nombre_completo, "Carlos Solicitante");
  assert.equal(mapped.caso?.usuarios?.cedula, "1045678901");
});

test("mapLlamadoAdmin soporta respuesta de Supabase con relaciones en formato array", () => {
  const rawItemArrayFormat = {
    id: 2,
    id_caso: 1051,
    id_usuario: "user-est-1",
    tipo: "estudiante",
    motivo: "Inasistencia a turno de atención",
    fecha_creacion: "2026-10-16T14:30:00Z",
    leido: true,
    resuelto: true,
    fecha_resolucion: "2026-10-17T09:00:00Z",
    resuelto_por: "admin-uid-1",
    motivo_resolucion: "Presentó soporte de examen médico",
    perfil: [
      {
        id: "user-est-1",
        nombre_completo: "Valentina Gómez",
        correo: "valentina@estudiante.uac.edu.co",
        cedula: "1140987654",
        telefono: "3119876543",
      },
    ],
    caso: [
      {
        id_caso: 1051,
        area: "civil",
        estado: "activo",
        fecha_creacion: "2026-10-05T09:00:00Z",
        usuarios: [
          {
            nombre_completo: "María Claudia Solicitante",
            cedula: "32987654",
          },
        ],
      },
    ],
  };

  const mapped = mapLlamadoAdmin(rawItemArrayFormat);
  assert.equal(mapped.id, 2);
  assert.equal(mapped.tipo, "estudiante");
  assert.equal(mapped.leido, true);
  assert.equal(mapped.resuelto, true);
  assert.equal(mapped.motivo_resolucion, "Presentó soporte de examen médico");
  assert.equal(mapped.perfil?.nombre_completo, "Valentina Gómez");
  assert.equal(mapped.caso?.usuarios?.nombre_completo, "María Claudia Solicitante");
});

test("mapLlamadoAdmin maneja de forma segura perfiles o casos nulos o eliminados", () => {
  const rawItemOrphan = {
    id: 3,
    id_caso: 1099,
    id_usuario: "user-deleted",
    tipo: "estudiante",
    motivo: "Llamado huérfano",
    fecha_creacion: "2026-10-17T12:00:00Z",
    leido: false,
    resuelto: false,
    perfil: null,
    caso: null,
  };

  const mapped = mapLlamadoAdmin(rawItemOrphan);
  assert.equal(mapped.id, 3);
  assert.equal(mapped.perfil, null);
  assert.equal(mapped.caso, null);
  assert.equal(mapped.fecha_resolucion, null);
  assert.equal(mapped.resuelto_por, null);
  assert.equal(mapped.motivo_resolucion, null);
});

// --- 8.2 Agrupación por docente y por estudiante ---
test("groupLlamadosByTipo agrupa correctamente llamados de docentes (asesores)", () => {
  const mockLlamados: LlamadoAtencionAdmin[] = [
    {
      id: 10,
      id_caso: 201,
      id_usuario: "asesor-alpha",
      tipo: "asesor",
      motivo: "Demora en revisión",
      fecha_creacion: "2026-10-10T10:00:00Z",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "asesor-alpha",
        nombre_completo: "Dr. Alpha Asesor",
        cedula: "80001",
        correo: "alpha@uac.edu.co",
        telefono: "3001",
      },
      caso: {
        id_caso: 201,
        area: "penal",
        estado: "en_revision",
        fecha_creacion: "2026-10-01T00:00:00Z",
        usuarios: { nombre_completo: "Cliente 1", cedula: "901" },
      },
    },
    {
      id: 11,
      id_caso: 201, // Mismo caso (caso afectado único)
      id_usuario: "asesor-alpha",
      tipo: "asesor",
      motivo: "Segundo llamado de revisión",
      fecha_creacion: "2026-10-12T10:00:00Z",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "asesor-alpha",
        nombre_completo: "Dr. Alpha Asesor",
        cedula: "80001",
        correo: "alpha@uac.edu.co",
        telefono: "3001",
      },
      caso: {
        id_caso: 201,
        area: "penal",
        estado: "en_revision",
        fecha_creacion: "2026-10-01T00:00:00Z",
        usuarios: { nombre_completo: "Cliente 1", cedula: "901" },
      },
    },
    {
      id: 12,
      id_caso: 202,
      id_usuario: "asesor-alpha",
      tipo: "asesor",
      motivo: "Caso resuelto anteriormente",
      fecha_creacion: "2026-10-05T10:00:00Z",
      leido: true,
      resuelto: true,
      fecha_resolucion: "2026-10-06T10:00:00Z",
      resuelto_por: "admin-1",
      motivo_resolucion: "Revisado",
      perfil: {
        id: "asesor-alpha",
        nombre_completo: "Dr. Alpha Asesor",
        cedula: "80001",
        correo: "alpha@uac.edu.co",
        telefono: "3001",
      },
      caso: {
        id_caso: 202,
        area: "laboral",
        estado: "activo",
        fecha_creacion: "2026-10-01T00:00:00Z",
        usuarios: { nombre_completo: "Cliente 2", cedula: "902" },
      },
    },
    {
      id: 13,
      id_caso: 203,
      id_usuario: "asesor-beta",
      tipo: "asesor",
      motivo: "Demora menor",
      fecha_creacion: "2026-10-14T10:00:00Z",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "asesor-beta",
        nombre_completo: "Dra. Beta Asesora",
        cedula: "80002",
        correo: "beta@uac.edu.co",
        telefono: "3002",
      },
      caso: {
        id_caso: 203,
        area: "civil",
        estado: "en_revision",
        fecha_creacion: "2026-10-01T00:00:00Z",
        usuarios: { nombre_completo: "Cliente 3", cedula: "903" },
      },
    },
    {
      id: 14,
      id_caso: 204,
      id_usuario: "est-1",
      tipo: "estudiante", // Debe ser ignorado en agrupamiento de asesores
      motivo: "Llamado estudiante",
      fecha_creacion: "2026-10-15T10:00:00Z",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "est-1",
        nombre_completo: "Estudiante Uno",
        cedula: "50001",
        correo: "est1@uac.edu.co",
        telefono: "3005",
      },
      caso: null,
    },
  ];

  const grupos = groupLlamadosByTipo(mockLlamados, "asesor");

  // Debe haber 2 docentes agrupados (asesor-alpha y asesor-beta), estudiante excluido
  assert.equal(grupos.length, 2);

  // Ordenamiento por totalPendientes descendente: asesor-alpha tiene 2 pendientes, asesor-beta tiene 1
  assert.equal(grupos[0].id_usuario, "asesor-alpha");
  assert.equal(grupos[0].totalPendientes, 2);
  assert.equal(grupos[0].totalResueltos, 1);
  assert.equal(grupos[0].totalCasosAfectados, 2); // Casos 201 y 202 (201 aparece dos veces)
  assert.deepEqual(grupos[0].areas.sort(), ["laboral", "penal"]);

  // Los llamados dentro del grupo deben tener los pendientes primero
  assert.equal(grupos[0].llamados[0].resuelto, false);
  assert.equal(grupos[0].llamados[1].resuelto, false);
  assert.equal(grupos[0].llamados[2].resuelto, true);

  assert.equal(grupos[1].id_usuario, "asesor-beta");
  assert.equal(grupos[1].totalPendientes, 1);
  assert.equal(grupos[1].totalResueltos, 0);
  assert.equal(grupos[1].totalCasosAfectados, 1);
});

test("groupLlamadosByTipo agrupa correctamente llamados de estudiantes y maneja perfil incompleto", () => {
  const mockEstudiantes: LlamadoAtencionAdmin[] = [
    {
      id: 20,
      id_caso: 301,
      id_usuario: "est-sin-perfil",
      tipo: "estudiante",
      motivo: "Inasistencia",
      fecha_creacion: "2026-10-14T08:00:00Z",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: null,
      caso: null,
    },
    {
      id: 21,
      id_caso: 302,
      id_usuario: "est-con-perfil",
      tipo: "estudiante",
      motivo: "Falta en bitácora",
      fecha_creacion: "2026-10-15T08:00:00Z",
      leido: true,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "est-con-perfil",
        nombre_completo: "Andrea Mendoza",
        cedula: "1098765",
        correo: "andrea@uac.edu.co",
        telefono: "300888",
      },
      caso: {
        id_caso: 302,
        area: "publico",
        estado: "activo",
        fecha_creacion: "2026-10-01T00:00:00Z",
        usuarios: { nombre_completo: "Solicitante P", cedula: "777" },
      },
    },
  ];

  const grupos = groupLlamadosByTipo(mockEstudiantes, "estudiante");
  assert.equal(grupos.length, 2);

  const sinPerfil = grupos.find((g) => g.id_usuario === "est-sin-perfil");
  assert.ok(sinPerfil);
  assert.equal(sinPerfil?.nombre, "Sin nombre registrado");
  assert.equal(sinPerfil?.cedula, null);

  const conPerfil = grupos.find((g) => g.id_usuario === "est-con-perfil");
  assert.ok(conPerfil);
  assert.equal(conPerfil?.nombre, "Andrea Mendoza");
  assert.equal(conPerfil?.totalCasosAfectados, 1);
});

// --- 8.3 Búsqueda en la tabla general con matchesSearch ---
test("filterLlamadosGenerales busca por nombre de docente asesor", () => {
  const data: LlamadoAtencionAdmin[] = [
    {
      id: 1,
      id_caso: 501,
      id_usuario: "doc-1",
      tipo: "asesor",
      motivo: "Revisión demorada",
      fecha_creacion: "2026-10-10",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "doc-1",
        nombre_completo: "Dr. Guillermo León",
        cedula: "19123456",
        correo: "guillermo@uac.edu.co",
        telefono: null,
      },
      caso: {
        id_caso: 501,
        area: "penal",
        estado: "en_revision",
        fecha_creacion: "2026-10-01",
        usuarios: { nombre_completo: "Pedro Nel", cedula: "888" },
      },
    },
    {
      id: 2,
      id_caso: 502,
      id_usuario: "doc-2",
      tipo: "asesor",
      motivo: "Falta de seguimiento",
      fecha_creacion: "2026-10-10",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "doc-2",
        nombre_completo: "Dra. Camila Osorio",
        cedula: "20123456",
        correo: "camila@uac.edu.co",
        telefono: null,
      },
      caso: {
        id_caso: 502,
        area: "civil",
        estado: "activo",
        fecha_creacion: "2026-10-01",
        usuarios: { nombre_completo: "Juana Martínez", cedula: "999" },
      },
    },
  ];

  // Búsqueda insensible a tildes y mayúsculas
  const res1 = filterLlamadosGenerales(data, { searchQuery: "guillermo leon" });
  assert.equal(res1.length, 1);
  assert.equal(res1[0].id, 1);

  const res2 = filterLlamadosGenerales(data, { searchQuery: "LEON" });
  assert.equal(res2.length, 1);
  assert.equal(res2[0].id, 1);

  const resNoMatch = filterLlamadosGenerales(data, { searchQuery: "Fernando" });
  assert.equal(resNoMatch.length, 0);
});

test("filterLlamadosGenerales busca por nombre de estudiante infractor", () => {
  const data: LlamadoAtencionAdmin[] = [
    {
      id: 10,
      id_caso: 601,
      id_usuario: "est-10",
      tipo: "estudiante",
      motivo: "No subió minuta a tiempo",
      fecha_creacion: "2026-10-12",
      leido: true,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "est-10",
        nombre_completo: "Santiago Valderrama",
        cedula: "1002345678",
        correo: "santiago@est.uac.edu.co",
        telefono: null,
      },
      caso: {
        id_caso: 601,
        area: "familia",
        estado: "activo",
        fecha_creacion: "2026-10-01",
        usuarios: { nombre_completo: "Consuelo Berrío", cedula: "444" },
      },
    },
  ];

  const res = filterLlamadosGenerales(data, { searchQuery: "valderrama" });
  assert.equal(res.length, 1);
  assert.equal(res[0].id_usuario, "est-10");
});

test("filterLlamadosGenerales busca por cliente del caso o por ID de caso", () => {
  const data: LlamadoAtencionAdmin[] = [
    {
      id: 20,
      id_caso: 7042,
      id_usuario: "doc-5",
      tipo: "asesor",
      motivo: "Revisión pendiente",
      fecha_creacion: "2026-10-14",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: {
        id: "doc-5",
        nombre_completo: "Dr. Hernando Gómez",
        cedula: "55555",
        correo: "hernando@uac.edu.co",
        telefono: null,
      },
      caso: {
        id_caso: 7042,
        area: "laboral",
        estado: "en_revision",
        fecha_creacion: "2026-10-01",
        usuarios: { nombre_completo: "Alcira Peñaloza", cedula: "33221100" },
      },
    },
  ];

  // Búsqueda por cliente
  const resCliente = filterLlamadosGenerales(data, { searchQuery: "alcira penalosa" });
  assert.equal(resCliente.length, 1);
  assert.equal(resCliente[0].id, 20);

  // Búsqueda por cédula del cliente
  const resCedulaCliente = filterLlamadosGenerales(data, { searchQuery: "33221100" });
  assert.equal(resCedulaCliente.length, 1);

  // Búsqueda por ID de caso
  const resIdCaso = filterLlamadosGenerales(data, { searchQuery: "7042" });
  assert.equal(resIdCaso.length, 1);

  // Búsqueda por ID de caso inexistente
  const resIdInvalido = filterLlamadosGenerales(data, { searchQuery: "99999" });
  assert.equal(resIdInvalido.length, 0);
});

test("filterLlamadosGenerales filtra correctamente por rol y estado combinados", () => {
  const data: LlamadoAtencionAdmin[] = [
    {
      id: 30,
      id_caso: 801,
      id_usuario: "u1",
      tipo: "asesor",
      motivo: "Demora asesor pendiente",
      fecha_creacion: "2026-10-15",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: { id: "u1", nombre_completo: "Asesor Uno", cedula: "1", correo: "a1@test.com", telefono: null },
      caso: null,
    },
    {
      id: 31,
      id_caso: 802,
      id_usuario: "u2",
      tipo: "asesor",
      motivo: "Demora asesor resuelto",
      fecha_creacion: "2026-10-15",
      leido: true,
      resuelto: true,
      fecha_resolucion: "2026-10-16",
      resuelto_por: "admin",
      motivo_resolucion: "Atendido",
      perfil: { id: "u2", nombre_completo: "Asesor Dos", cedula: "2", correo: "a2@test.com", telefono: null },
      caso: null,
    },
    {
      id: 32,
      id_caso: 803,
      id_usuario: "u3",
      tipo: "estudiante",
      motivo: "Inasistencia estudiante pendiente",
      fecha_creacion: "2026-10-15",
      leido: false,
      resuelto: false,
      fecha_resolucion: null,
      resuelto_por: null,
      motivo_resolucion: null,
      perfil: { id: "u3", nombre_completo: "Estudiante Tres", cedula: "3", correo: "e3@test.com", telefono: null },
      caso: null,
    },
  ];

  // Solo asesores pendientes
  const asesoresPendientes = filterLlamadosGenerales(data, {
    roleFilter: "asesor",
    statusFilter: "pendientes",
  });
  assert.equal(asesoresPendientes.length, 1);
  assert.equal(asesoresPendientes[0].id, 30);

  // Solo asesores resueltos
  const asesoresResueltos = filterLlamadosGenerales(data, {
    roleFilter: "asesor",
    statusFilter: "resueltos",
  });
  assert.equal(asesoresResueltos.length, 1);
  assert.equal(asesoresResueltos[0].id, 31);

  // Solo estudiantes pendientes
  const estudiantesPendientes = filterLlamadosGenerales(data, {
    roleFilter: "estudiante",
    statusFilter: "pendientes",
  });
  assert.equal(estudiantesPendientes.length, 1);
  assert.equal(estudiantesPendientes[0].id, 32);

  // Búsqueda por motivo de resolución
  const busquedaResolucion = filterLlamadosGenerales(data, {
    searchQuery: "atendido",
  });
  assert.equal(busquedaResolucion.length, 1);
  assert.equal(busquedaResolucion[0].id, 31);
});

// --- 8.4 Validación del ciclo de vida: resolución con y sin justificación ---
test("aplicarResolucionLlamado resuelve correctamente con motivo de justificación", () => {
  const llamadoPendiente: LlamadoAtencionAdmin = {
    id: 50,
    id_caso: 901,
    id_usuario: "est-50",
    tipo: "estudiante",
    motivo: "Inasistencia reiterada al turno de los jueves",
    fecha_creacion: "2026-10-10T10:00:00Z",
    leido: false,
    resuelto: false,
    fecha_resolucion: null,
    resuelto_por: null,
    motivo_resolucion: null,
    perfil: {
      id: "est-50",
      nombre_completo: "David Sánchez",
      cedula: "10981234",
      correo: "david@uac.edu.co",
      telefono: null,
    },
    caso: null,
  };

  const fechaTest = "2026-10-17T18:00:00.000Z";
  const justificacion = "  Estudiante presentó excusa médica certificada por EPS y avalada por coordinación.  ";
  const adminId = "admin-user-uuid-123";

  const resuelto = aplicarResolucionLlamado(llamadoPendiente, adminId, justificacion, fechaTest);

  assert.equal(resuelto.id, 50);
  assert.equal(resuelto.resuelto, true);
  assert.equal(resuelto.fecha_resolucion, fechaTest);
  assert.equal(resuelto.resuelto_por, adminId);
  // Debe hacer trim() al motivo
  assert.equal(
    resuelto.motivo_resolucion,
    "Estudiante presentó excusa médica certificada por EPS y avalada por coordinación.",
  );
});

test("aplicarResolucionLlamado resuelve correctamente sin motivo de justificación (motivo opcional)", () => {
  const llamadoPendiente: LlamadoAtencionAdmin = {
    id: 51,
    id_caso: 902,
    id_usuario: "doc-51",
    tipo: "asesor",
    motivo: "Demora en aprobación de memorial",
    fecha_creacion: "2026-10-11T11:00:00Z",
    leido: true,
    resuelto: false,
    fecha_resolucion: null,
    resuelto_por: null,
    motivo_resolucion: null,
    perfil: {
      id: "doc-51",
      nombre_completo: "Dra. Sandra Peña",
      cedula: "45123456",
      correo: "sandra@uac.edu.co",
      telefono: null,
    },
    caso: null,
  };

  const adminId = "admin-uuid-456";

  // Caso 1: string vacío
  const resueltoVacio = aplicarResolucionLlamado(llamadoPendiente, adminId, "");
  assert.equal(resueltoVacio.resuelto, true);
  assert.equal(resueltoVacio.motivo_resolucion, null);

  // Caso 2: solo espacios en blanco
  const resueltoEspacios = aplicarResolucionLlamado(llamadoPendiente, adminId, "   ");
  assert.equal(resueltoEspacios.resuelto, true);
  assert.equal(resueltoEspacios.motivo_resolucion, null);

  // Caso 3: undefined
  const resueltoUndefined = aplicarResolucionLlamado(llamadoPendiente, adminId, undefined);
  assert.equal(resueltoUndefined.resuelto, true);
  assert.equal(resueltoUndefined.motivo_resolucion, null);

  // Caso 4: null
  const resueltoNull = aplicarResolucionLlamado(llamadoPendiente, adminId, null);
  assert.equal(resueltoNull.resuelto, true);
  assert.equal(resueltoNull.motivo_resolucion, null);
});

test("Resolución de llamado actualiza de forma reactiva métricas y posición en el grupo", () => {
  const llamadoOriginal: LlamadoAtencionAdmin = {
    id: 60,
    id_caso: 950,
    id_usuario: "asesor-metrics",
    tipo: "asesor",
    motivo: "Demora revisión caso 950",
    fecha_creacion: "2026-10-15T10:00:00Z",
    leido: false,
    resuelto: false,
    fecha_resolucion: null,
    resuelto_por: null,
    motivo_resolucion: null,
    perfil: {
      id: "asesor-metrics",
      nombre_completo: "Dr. Metrics",
      cedula: "99001",
      correo: "metrics@uac.edu.co",
      telefono: null,
    },
    caso: {
      id_caso: 950,
      area: "penal",
      estado: "en_revision",
      fecha_creacion: "2026-10-01",
      usuarios: { nombre_completo: "Cliente M", cedula: "111" },
    },
  };

  // Antes de resolver
  const grupoAntes = groupLlamadosByTipo([llamadoOriginal], "asesor")[0];
  assert.equal(grupoAntes.totalPendientes, 1);
  assert.equal(grupoAntes.totalResueltos, 0);
  assert.equal(grupoAntes.llamados[0].resuelto, false);

  // Resolver llamado
  const llamadoResuelto = aplicarResolucionLlamado(
    llamadoOriginal,
    "admin-user",
    "Docente aprobó el memorial pendiente",
  );

  // Después de resolver
  const grupoDespues = groupLlamadosByTipo([llamadoResuelto], "asesor")[0];
  assert.equal(grupoDespues.totalPendientes, 0);
  assert.equal(grupoDespues.totalResueltos, 1);
  assert.equal(grupoDespues.llamados[0].resuelto, true);
  assert.equal(grupoDespues.llamados[0].motivo_resolucion, "Docente aprobó el memorial pendiente");
});

// -------------------------------------------------------------------
// 9. Sincronización de Horarios de Asesores (HorarioSemana -> public.horarios)
// -------------------------------------------------------------------
console.log("\n9. Pruebas de Sincronización de Horarios de Asesores");

test("horarioSemanaAFilas convierte HorarioSemana con turnos activos en filas para public.horarios", () => {
  const horarioMock = {
    Lunes: { activo: true, turno: "9-11" },
    Martes: { activo: false, turno: "2-4" },
    Miércoles: { activo: true, turno: "4-6" },
    Jueves: { activo: false, turno: "9-11" },
    Viernes: { activo: true, turno: "2-4" },
    Sábado: { activo: false, turno: "9-11" },
  };
  const userId = "asesor-uuid-123";
  const filas = horarioSemanaAFilas(userId, horarioMock);

  assert.equal(filas.length, 3);
  assert.deepEqual(filas, [
    { id_perfil: "asesor-uuid-123", dia: "Lunes", turno: "9-11" },
    { id_perfil: "asesor-uuid-123", dia: "Miércoles", turno: "4-6" },
    { id_perfil: "asesor-uuid-123", dia: "Viernes", turno: "2-4" },
  ]);
});

test("horarioSemanaAFilas capitaliza los nombres de los días si vienen en minúscula", () => {
  const horarioMin = {
    lunes: { activo: true, turno: "9-11" },
    miercoles: { activo: true, turno: "4-6" },
    sabado: { activo: true, turno: "2-4" },
  };
  const filas = horarioSemanaAFilas("asesor-uuid-456", horarioMin);

  assert.equal(filas.length, 3);
  assert.equal(filas[0].dia, "Lunes");
  assert.equal(filas[1].dia, "Miercoles");
  assert.equal(filas[2].dia, "Sabado");
});

test("horarioSemanaAFilas omite días inactivos o sin turno válido", () => {
  const horarioIncompleto = {
    Lunes: { activo: false, turno: "9-11" },
    Martes: { activo: true, turno: "" },
    Miércoles: { activo: true, turno: null as any },
    Jueves: { activo: true, turno: "2-4" },
    Viernes: { activo: false, turno: "" },
  };
  const filas = horarioSemanaAFilas("asesor-uuid-789", horarioIncompleto);

  assert.equal(filas.length, 1);
  assert.deepEqual(filas[0], {
    id_perfil: "asesor-uuid-789",
    dia: "Jueves",
    turno: "2-4",
  });
});

test("horarioSemanaAFilas maneja estructuras vacías, nulas o undefined retornando arreglo vacío", () => {
  assert.deepEqual(horarioSemanaAFilas("ase-empty", {}), []);
  assert.deepEqual(horarioSemanaAFilas("ase-null", null), []);
  assert.deepEqual(horarioSemanaAFilas("ase-undef", undefined), []);
  assert.deepEqual(horarioSemanaAFilas("ase-invalid", "no-es-objeto" as any), []);
});

// -------------------------------------------------------------------
// 10. Lógica de Plazos en Cambio de Estado Admin (calcularPlazosCambioEstado)
// -------------------------------------------------------------------
console.log("\n10. Pruebas de Lógica de Plazos en Cambio de Estado Admin");

test("en_correccion asigna 3 días hábiles a estudiante y limpia vencimiento de asesor (saltando fin de semana)", () => {
  // Viernes 23 de octubre de 2026
  const viernes = new Date("2026-10-23T10:00:00.000Z");
  const res = calcularPlazosCambioEstado("en_correccion", viernes);

  // Viernes + 3 días hábiles -> Miércoles 28 de octubre de 2026
  const miercolesEsperado = new Date("2026-10-28T10:00:00.000Z").toISOString();
  assert.equal(res.fecha_vencimiento_estudiante, miercolesEsperado);
  assert.equal(res.fecha_vencimiento_asesor, null);
  assert.equal(res.fecha_cierre, undefined);
});

test("en_correccion asigna 3 días hábiles consecutivos dentro de la misma semana laboral", () => {
  // Lunes 19 de octubre de 2026
  const lunes = new Date("2026-10-19T14:30:00.000Z");
  const res = calcularPlazosCambioEstado("en_correccion", lunes);

  // Lunes + 3 días hábiles -> Jueves 22 de octubre de 2026
  const juevesEsperado = new Date("2026-10-22T14:30:00.000Z").toISOString();
  assert.equal(res.fecha_vencimiento_estudiante, juevesEsperado);
  assert.equal(res.fecha_vencimiento_asesor, null);
  assert.equal(res.fecha_cierre, undefined);
});

test("activo limpia vencimiento de asesor sin fijar fecha_cierre ni alterar estudiante", () => {
  const res = calcularPlazosCambioEstado("activo");

  assert.equal(res.fecha_vencimiento_asesor, null);
  assert.equal(res.fecha_vencimiento_estudiante, undefined);
  assert.equal(res.fecha_cierre, undefined);
});

test("cerrado registra fecha_cierre actual y limpia ambos vencimientos", () => {
  const fechaCierre = new Date("2026-10-25T16:00:00.000Z");
  const res = calcularPlazosCambioEstado("cerrado", fechaCierre);

  assert.equal(res.fecha_cierre, fechaCierre.toISOString());
  assert.equal(res.fecha_vencimiento_estudiante, null);
  assert.equal(res.fecha_vencimiento_asesor, null);
});

test("archivado registra fecha_cierre actual y limpia ambos vencimientos", () => {
  const fechaArchivo = new Date("2026-10-25T17:15:00.000Z");
  const res = calcularPlazosCambioEstado("archivado", fechaArchivo);

  assert.equal(res.fecha_cierre, fechaArchivo.toISOString());
  assert.equal(res.fecha_vencimiento_estudiante, null);
  assert.equal(res.fecha_vencimiento_asesor, null);
});

test("estados en_proceso y pendiente_aprobacion no alteran vencimientos ni cierre", () => {
  const resProceso = calcularPlazosCambioEstado("en_proceso");
  assert.deepEqual(resProceso, {});

  const resPendiente = calcularPlazosCambioEstado("pendiente_aprobacion");
  assert.deepEqual(resPendiente, {});
});

// -------------------------------------------------------------------
// 11. Validación de Motivo Obligatorio en Cambio de Estado Admin
// -------------------------------------------------------------------
console.log("\n11. Pruebas de Validación de Motivo Obligatorio en Cambio de Estado Admin");

test("validarCambioEstadoAdmin rechaza motivo vacío o compuesto de espacios", () => {
  const resVacio = validarCambioEstadoAdmin({
    idCaso: 1042,
    nuevoEstado: "en_correccion",
    motivo: "",
  });
  assert.equal(resVacio.valido, false);
  assert.equal(
    resVacio.error,
    "Debe ingresar un motivo o justificación para el cambio de estado.",
  );

  const resEspacios = validarCambioEstadoAdmin({
    idCaso: 1042,
    nuevoEstado: "activo",
    motivo: "   \t\n  ",
  });
  assert.equal(resEspacios.valido, false);
  assert.equal(
    resEspacios.error,
    "Debe ingresar un motivo o justificación para el cambio de estado.",
  );
});

test("validarCambioEstadoAdmin rechaza motivo nulo o indefinido", () => {
  const resNull = validarCambioEstadoAdmin({
    idCaso: 1042,
    nuevoEstado: "cerrado",
    motivo: null,
  });
  assert.equal(resNull.valido, false);

  const resUndef = validarCambioEstadoAdmin({
    idCaso: 1042,
    nuevoEstado: "archivado",
    motivo: undefined,
  });
  assert.equal(resUndef.valido, false);
});

test("validarCambioEstadoAdmin valida identificador de caso numérico y positivo", () => {
  assert.equal(
    validarCambioEstadoAdmin({ idCaso: 0, nuevoEstado: "activo", motivo: "Motivo válido" }).valido,
    false,
  );
  assert.equal(
    validarCambioEstadoAdmin({ idCaso: -10, nuevoEstado: "activo", motivo: "Motivo válido" }).valido,
    false,
  );
  assert.equal(
    validarCambioEstadoAdmin({ idCaso: NaN, nuevoEstado: "activo", motivo: "Motivo válido" }).valido,
    false,
  );
  assert.equal(
    validarCambioEstadoAdmin({ idCaso: null as any, nuevoEstado: "activo", motivo: "Motivo válido" }).valido,
    false,
  );
  assert.equal(
    validarCambioEstadoAdmin({ idCaso: "no-numero" as any, nuevoEstado: "activo", motivo: "Motivo válido" }).valido,
    false,
  );
});

test("validarCambioEstadoAdmin rechaza estados no catalogados", () => {
  const resEstadoInvalido = validarCambioEstadoAdmin({
    idCaso: 1042,
    nuevoEstado: "estado_inventado",
    motivo: "Justificación de prueba",
  });
  assert.equal(resEstadoInvalido.valido, false);
  assert.equal(resEstadoInvalido.error, 'El estado "estado_inventado" no es válido.');
});

test("validarCambioEstadoAdmin acepta todas las transiciones válidas con motivo suficiente", () => {
  for (const estado of ESTADOS_VALIDOS_CASO) {
    const res = validarCambioEstadoAdmin({
      idCaso: 1042,
      nuevoEstado: estado,
      motivo: `Cambio administrativo justificado hacia el estado ${estado}.`,
    });
    assert.equal(res.valido, true, `Debe aceptar estado válido: ${estado}`);
    assert.equal(res.error, undefined);
  }
});

// -------------------------------------------------------------------
// 12. Verificación de ROLE_HOME y Rutas de Inicio por Rol
// -------------------------------------------------------------------
console.log("\n12. Pruebas de Verificación de ROLE_HOME");

test("ROLE_HOME apunta estudiante directamente a /estudiante/mis-casos", () => {
  assert.equal(ROLE_HOME.estudiante, "/estudiante/mis-casos");
});

test("ROLE_HOME apunta asesor directamente a /asesor/mis-casos", () => {
  assert.equal(ROLE_HOME.asesor, "/asesor/mis-casos");
});

test("ROLE_HOME define inicio correcto para admin y pro_apoyo", () => {
  assert.equal(ROLE_HOME.admin, "/admin/inicio");
  assert.equal(ROLE_HOME.pro_apoyo, "/pro-apoyo/inicio");
});

test("ROLE_HOME cubre exactamente los 4 roles del sistema con rutas con prefijo '/'", () => {
  const rolesEsperados = ["admin", "asesor", "estudiante", "pro_apoyo"];
  assert.deepEqual(Object.keys(ROLE_HOME).sort(), rolesEsperados.sort());

  for (const [rol, ruta] of Object.entries(ROLE_HOME)) {
    assert.ok(typeof ruta === "string" && ruta.startsWith("/"), `Ruta para rol ${rol} debe comenzar con /: ${ruta}`);
    assert.ok(ruta.length > 1, `Ruta para rol ${rol} no puede ser vacía`);
  }
});

test("ROLE_HOME maneja roles no definidos devolviendo undefined para fallback seguro", () => {
  assert.equal(ROLE_HOME["superadmin"], undefined);
  assert.equal(ROLE_HOME["invitado"], undefined);
  assert.equal(ROLE_HOME[""], undefined);

  // Verificación de patrón de fallback usado en middleware y auth callback: (ROLE_HOME[rol] ?? "/")
  const getHome = (rol: string) => ROLE_HOME[rol] ?? "/";
  assert.equal(getHome("estudiante"), "/estudiante/mis-casos");
  assert.equal(getHome("asesor"), "/asesor/mis-casos");
  assert.equal(getHome("desconocido"), "/");
});

// -------------------------------------------------------------------
// 13. Pruebas de Transición Semestral y Detección de Casos a Reasignar
// -------------------------------------------------------------------
console.log("\n13. Pruebas de Transición Semestral y Detección de Casos a Reasignar");

// --- 13.1 verificarCasoRequiereReasignacion ---
test("verificarCasoRequiereReasignacion: Caso activo con estudiante activo y con horarios -> false", () => {
  const caso: any = {
    id_caso: 501,
    estado: "activo",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: {
          id_perfil: "est-1",
          perfil: { activo: true, nombre_completo: "Carlos Estudiante" },
          horarios: [{ dia: "Lunes", turno: "9-11" }],
        },
      },
    ],
  };

  const resultado = verificarCasoRequiereReasignacion(caso);
  assert.equal(resultado.requiereReasignacion, false);
  assert.equal(resultado.motivo, null);
  assert.equal(resultado.estudianteActivo?.id_perfil, "est-1");
});

test("verificarCasoRequiereReasignacion: Caso activo con estudiante inactivo (activo === false) -> true", () => {
  const caso: any = {
    id_caso: 502,
    estado: "activo",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: {
          id_perfil: "est-2",
          perfil: { activo: false, nombre_completo: "Estudiante Inactivo" },
          horarios: [{ dia: "Martes", turno: "2-4" }],
        },
      },
    ],
  };

  const resultado = verificarCasoRequiereReasignacion(caso);
  assert.equal(resultado.requiereReasignacion, true);
  assert.equal(resultado.motivo, "inactivo");
  assert.equal(resultado.estudianteActivo?.id_perfil, "est-2");
});

test("verificarCasoRequiereReasignacion: Caso activo con estudiante activo sin horarios -> false (no es inactivo)", () => {
  const caso: any = {
    id_caso: 503,
    estado: "activo",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: {
          id_perfil: "est-3",
          perfil: { activo: true, nombre_completo: "Carlos Rodriguez", horarios: [] },
          horarios: [],
        },
      },
    ],
  };

  const resultado = verificarCasoRequiereReasignacion(caso);
  assert.equal(resultado.requiereReasignacion, false);
  assert.equal(resultado.motivo, null);
  assert.equal(resultado.estudianteActivo?.id_perfil, "est-3");
});

test("verificarCasoRequiereReasignacion: Caso cerrado o archivado con estudiante inactivo -> false", () => {
  const casoCerrado: any = {
    id_caso: 504,
    estado: "cerrado",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: {
          id_perfil: "est-4",
          perfil: { activo: false },
          horarios: [],
        },
      },
    ],
  };

  const resultadoCerrado = verificarCasoRequiereReasignacion(casoCerrado);
  assert.equal(resultadoCerrado.requiereReasignacion, false);
  assert.equal(resultadoCerrado.estudianteActivo, null);
  assert.equal(resultadoCerrado.motivo, null);

  const casoArchivado: any = {
    id_caso: 505,
    estado: "archivado",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: null,
        estudiante: {
          id_perfil: "est-5",
          perfil: { activo: false },
          horarios: [],
        },
      },
    ],
  };

  const resultadoArchivado = verificarCasoRequiereReasignacion(casoArchivado);
  assert.equal(resultadoArchivado.requiereReasignacion, false);
  assert.equal(resultadoArchivado.estudianteActivo, null);
  assert.equal(resultadoArchivado.motivo, null);
});

test("verificarCasoRequiereReasignacion: Caso sin estudiante asignado -> false", () => {
  const casoSinAsignar: any = {
    id_caso: 506,
    estado: "activo",
    estudiantes_casos: [],
  };

  const resultadoVacio = verificarCasoRequiereReasignacion(casoSinAsignar);
  assert.equal(resultadoVacio.requiereReasignacion, false);
  assert.equal(resultadoVacio.estudianteActivo, null);
  assert.equal(resultadoVacio.motivo, null);

  const casoConHistoricos: any = {
    id_caso: 507,
    estado: "activo",
    estudiantes_casos: [
      {
        fecha_fin_asignacion: "2026-01-15",
        estudiante: {
          id_perfil: "est-historico",
          perfil: { activo: false },
          horarios: [],
        },
      },
    ],
  };

  const resultadoHistorico = verificarCasoRequiereReasignacion(casoConHistoricos);
  assert.equal(resultadoHistorico.requiereReasignacion, false);
  assert.equal(resultadoHistorico.estudianteActivo, null);
  assert.equal(resultadoHistorico.motivo, null);
});

// --- 13.2 Lógica de transición de semestre (sugerirSiguienteSemestre) ---
test("sugerirSiguienteSemestre avanza semestre + 1 cuando es menor a 10", () => {
  assert.equal(sugerirSiguienteSemestre(7), 8);
  assert.equal(sugerirSiguienteSemestre(8), 9);
  assert.equal(sugerirSiguienteSemestre(9), 10);
  assert.equal(sugerirSiguienteSemestre(1), 2);
});

test("sugerirSiguienteSemestre respeta el tope máximo en semestre 10", () => {
  assert.equal(sugerirSiguienteSemestre(10), 10);
  assert.equal(sugerirSiguienteSemestre(11), 10);
  assert.equal(sugerirSiguienteSemestre(12), 10);
});

test("sugerirSiguienteSemestre sugiere 7 como valor inicial seguro para perfiles nulos o incompletos", () => {
  assert.equal(sugerirSiguienteSemestre(null), 7);
  assert.equal(sugerirSiguienteSemestre(undefined), 7);
  assert.equal(sugerirSiguienteSemestre(0), 7);
  assert.equal(sugerirSiguienteSemestre(-3), 7);
  assert.equal(sugerirSiguienteSemestre(NaN), 7);
});

// --- 13.3 Validación de actualización de período académico activo ---
test("validarPeriodoAcademico acepta formatos válidos AAAA-1 y AAAA-2", () => {
  assert.deepEqual(validarPeriodoAcademico("2026-1"), { valido: true, periodoNormalizado: "2026-1" });
  assert.deepEqual(validarPeriodoAcademico("2026-2"), { valido: true, periodoNormalizado: "2026-2" });
  assert.deepEqual(validarPeriodoAcademico("2027-1"), { valido: true, periodoNormalizado: "2027-1" });
  assert.deepEqual(validarPeriodoAcademico("2030-2"), { valido: true, periodoNormalizado: "2030-2" });
});

test("validarPeriodoAcademico normaliza espacios en blanco en extremos", () => {
  assert.deepEqual(validarPeriodoAcademico("   2026-2   "), {
    valido: true,
    periodoNormalizado: "2026-2",
  });
});

test("validarPeriodoAcademico rechaza entradas vacías o solo espacios", () => {
  const vacio = validarPeriodoAcademico("");
  assert.equal(vacio.valido, false);
  assert.equal(vacio.error, "El período académico no puede estar vacío.");

  const espacios = validarPeriodoAcademico("     ");
  assert.equal(espacios.valido, false);
  assert.equal(espacios.error, "El período académico no puede estar vacío.");
});

test("validarPeriodoAcademico rechaza formatos que no corresponden a período académico", () => {
  const formatosInvalidos = [
    "2026-3",
    "2026-0",
    "2026",
    "26-1",
    "2026/1",
    "periodo-1",
    "2026-1-extra",
  ];

  for (const f of formatosInvalidos) {
    const res = validarPeriodoAcademico(f);
    assert.equal(res.valido, false, `Formato "${f}" debe ser rechazado`);
    assert.ok(res.error?.includes('formato del período debe ser "AAAA-1" o "AAAA-2"'));
  }
});

test("validarPeriodoAcademico rechaza tipos no string", () => {
  assert.equal(validarPeriodoAcademico(null).valido, false);
  assert.equal(validarPeriodoAcademico(undefined).valido, false);
  assert.equal(validarPeriodoAcademico(2026 as any).valido, false);
  assert.equal(validarPeriodoAcademico({ periodo: "2026-1" } as any).valido, false);
});

// -------------------------------------------------------------------
// 14. Pruebas de Formateo de Actividad Reciente y Fechas
// -------------------------------------------------------------------
console.log("\n14. Pruebas de Formateo de Actividad Reciente y Fechas");

test("formatRelativeActivity maneja casos nulos, indefinidos o vacíos", () => {
  assert.equal(formatRelativeActivity(null), "Sin actividad");
  assert.equal(formatRelativeActivity(undefined), "Sin actividad");
  assert.equal(formatRelativeActivity(""), "Sin actividad");
  assert.equal(formatRelativeActivity("fecha-invalida"), "—");
});

test("formatRelativeActivity formatea tiempos recientes relativos adecuadamente", () => {
  const now = Date.now();
  // Menos de 60 segundos
  assert.equal(formatRelativeActivity(new Date(now - 10 * 1000).toISOString()), "Hace un momento");
  // Minutos
  assert.equal(formatRelativeActivity(new Date(now - 60 * 1000).toISOString()), "Hace 1 minuto");
  assert.equal(formatRelativeActivity(new Date(now - 15 * 60 * 1000).toISOString()), "Hace 15 minutos");
  // Horas
  assert.equal(formatRelativeActivity(new Date(now - 3600 * 1000).toISOString()), "Hace 1 hora");
  assert.equal(formatRelativeActivity(new Date(now - 4 * 3600 * 1000).toISOString()), "Hace 4 horas");
  // Días
  assert.equal(formatRelativeActivity(new Date(now - 24 * 3600 * 1000).toISOString()), "Hace 1 día");
  assert.equal(formatRelativeActivity(new Date(now - 3 * 24 * 3600 * 1000).toISOString()), "Hace 3 días");
  // Semanas
  assert.equal(formatRelativeActivity(new Date(now - 8 * 24 * 3600 * 1000).toISOString()), "Hace 1 semana");
  assert.equal(formatRelativeActivity(new Date(now - 21 * 24 * 3600 * 1000).toISOString()), "Hace 3 semanas");
});

test("formatFullDateTime maneja casos nulos y formatea fecha completa", () => {
  assert.equal(formatFullDateTime(null), "");
  assert.equal(formatFullDateTime(undefined), "");
  assert.equal(formatFullDateTime(""), "");
  assert.equal(formatFullDateTime("invalido"), "");

  const full = formatFullDateTime("2026-11-04T15:30:00Z");
  assert.ok(full.length > 5);
  assert.ok(full.includes("2026") || full.includes("noviembre") || full.includes("nov"));
});

console.log(`\n=== RESUMEN DE PRUEBAS ===`);
console.log(`Total pasadas: ${passed}`);
console.log(`Total fallidas: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!\n");
}
