import assert from "node:assert/strict";
import { matchesSearch, normalizeText, levenshteinDistance } from "../src/lib/search";
import { mismoDia, nombreMostrado, formatArea } from "../src/lib/utils";

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
// 3. Pruebas del Buscador Multi-Rol en Casos
// -------------------------------------------------------------------
console.log("\n3. Pruebas del Buscador Multi-Rol en Casos");

const mockCaso = {
  id_caso: 1042,
  area: "laboral",
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

function searchCaso(caso: typeof mockCaso, query: string): boolean {
  const usuario = Array.isArray(caso.usuarios) ? caso.usuarios[0] : caso.usuarios;
  const estudianteActivo = caso.estudiantes_casos?.find(
    (e: any) => !e.fecha_fin_asignacion,
  )?.estudiante;
  const asesorActivo = caso.asesores_casos?.find(
    (a: any) => !a.fecha_fin_asignacion,
  )?.asesor;

  return matchesSearch(
    query,
    usuario?.nombre_completo,
    usuario?.cedula,
    estudianteActivo?.perfil?.nombre_completo,
    estudianteActivo?.perfil?.cedula,
    asesorActivo?.perfil?.nombre_completo,
    asesorActivo?.perfil?.cedula,
    caso.id_caso,
    caso.area,
    caso.resumen_hechos,
  );
}

test("Encuentra caso por ID de caso", () => {
  assert.equal(searchCaso(mockCaso, "1042"), true);
  assert.equal(searchCaso(mockCaso, "1043"), false);
});

test("Encuentra caso por nombre del cliente (usuario)", () => {
  assert.equal(searchCaso(mockCaso, "Carlos Mendoza"), true);
  assert.equal(searchCaso(mockCaso, "mendoza alberto"), true);
});

test("Encuentra caso por cédula del cliente (usuario)", () => {
  assert.equal(searchCaso(mockCaso, "72145896"), true);
  assert.equal(searchCaso(mockCaso, "72145"), true);
});

test("Encuentra caso por nombre del estudiante asignado", () => {
  assert.equal(searchCaso(mockCaso, "Laura Rios"), true);
  assert.equal(searchCaso(mockCaso, "daniela gomez"), true);
});

test("Encuentra caso por cédula del estudiante asignado", () => {
  assert.equal(searchCaso(mockCaso, "1004567890"), true);
  assert.equal(searchCaso(mockCaso, "100456"), true);
});

test("Encuentra caso por nombre del asesor asignado", () => {
  assert.equal(searchCaso(mockCaso, "Roberto Silva"), true);
  assert.equal(searchCaso(mockCaso, "dr roberto"), true);
});

test("Encuentra caso por cédula del asesor asignado", () => {
  assert.equal(searchCaso(mockCaso, "19876543"), true);
  assert.equal(searchCaso(mockCaso, "19876"), true);
});

test("Encuentra caso por hechos o área", () => {
  assert.equal(searchCaso(mockCaso, "laboral"), true);
  assert.equal(searchCaso(mockCaso, "despido"), true);
  assert.equal(searchCaso(mockCaso, "liquidacion"), true);
});

test("No encuentra caso con datos no relacionados", () => {
  assert.equal(searchCaso(mockCaso, "penal"), false);
  assert.equal(searchCaso(mockCaso, "Fernanda"), false);
  assert.equal(searchCaso(mockCaso, "55555555"), false);
});

test("Maneja casos donde usuario viene como arreglo o null", () => {
  const casoArrayUsuario = {
    ...mockCaso,
    usuarios: [{ nombre_completo: "Ana María Soto", cedula: "43210987" }],
  };
  assert.equal(searchCaso(casoArrayUsuario, "Ana Soto"), true);
  assert.equal(searchCaso(casoArrayUsuario, "43210987"), true);

  const casoNullUsuario = {
    ...mockCaso,
    usuarios: null as any,
  };
  assert.equal(searchCaso(casoNullUsuario, "Laura Rios"), true);
  assert.equal(searchCaso(casoNullUsuario, "Carlos Mendoza"), false);
});

test("Maneja casos sin estudiante o asesor asignado sin reventar", () => {
  const casoSinAsignaciones = {
    ...mockCaso,
    estudiantes_casos: [],
    asesores_casos: [],
  };
  assert.equal(searchCaso(casoSinAsignaciones, "Carlos Mendoza"), true);
  assert.equal(searchCaso(casoSinAsignaciones, "Laura Rios"), false);
});

// -------------------------------------------------------------------
// 4. Pruebas de mismoDia y utilidades
// -------------------------------------------------------------------
console.log("\n4. Pruebas de mismoDia y utilidades");

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
// 5. Pruebas de filtrado en Gestión de Usuarios (Admin)
// -------------------------------------------------------------------
console.log("\n5. Pruebas de filtrado en Gestión de Usuarios");

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
// 6. Pruebas de AsignacionCaso - Lógica de turno y fallback
// -------------------------------------------------------------------
console.log("\n6. Pruebas de AsignacionCaso - Lógica de turno y fallback");

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

console.log(`\n=== RESUMEN DE PRUEBAS ===`);
console.log(`Total pasadas: ${passed}`);
console.log(`Total fallidas: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!\n");
}
