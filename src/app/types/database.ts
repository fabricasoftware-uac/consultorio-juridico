// --- ENUMS -----------------------------------------------------

export type EstadoEnum =
  | "activo"
  | "en_proceso"
  | "pendiente_aprobacion"
  | "en_correccion"
  | "cerrado"
  | "archivado";
export type AreaEnum =
  | "no_asignada"
  | "laboral"
  | "civil_familia"
  | "penal"
  | "publica"
  | "conciliacion"
  | "privado"
  | "otros";
export type TurnoEnum = "9-11" | "2-4" | "4-6";
export type ClasificacionEnum = "en_tramite" | "solo_asesoria";
export type JornadaEnum = "diurna" | "nocturna" | "mixto";
export type EstadoCivilEnum = "soltero" | "casado" | "union libre" | "viudo" | "divorciado" | "otro";
export type TipoContratoEnum =
  | "escrito"
  | "verbal"
  | "prestacion_servicios"
  | "otro";
export type situacionLaboral =
  | "dependiente"
  | "desempleado"
  | "independiente"
  | "otro";

// --- USUARIOS --------------------------------------------------

export type SexoEnum =
  | "MASCULINO"
  | "FEMENINO"
  | "INTERSEXUAL"
  | "PREFIERO_NO_RESPONDER"
  | "OTRO"
  | "";

export type CaracterizacionLgbtiqEnum =
  | "GAY"
  | "LESBIANA"
  | "BISEXUAL"
  | "HOMBRE_TRANS"
  | "MUJER_TRANS"
  | "NO_BINARIO"
  | "OTRA"
  | "PREFIERO_NO_RESPONDER"
  | "";

export type Usuario = {
  id_usuario?: string;
  nombre_completo: string;
  sexo: SexoEnum;
  cedula: string;
  telefono: string;
  edad?: number | null;
  contacto_familiar?: string | null;
  estado_civil?: EstadoCivilEnum | null;
  estrato?: number | null;
  direccion?: string | null;
  correo?: string | null;
  tipo_vivienda?: string | null;
  situacion_laboral?: situacionLaboral | null;
  otros_ingresos?: boolean | null;
  valor_otros_ingresos?: number | null;
  concepto_otros_ingresos?: string | null;
  tiene_contrato?: boolean;
  tiene_representado?: boolean;
  tipo_documento?: string | null;
  fecha_expedicion_doc?: string | null;
  ciudad_expedicion?: string | null;
  fecha_nacimiento?: string | null;
  nacionalidad?: string | null;
  enfoque_diverso?: boolean | null;
  caracterizacion_lgbtiq?: CaracterizacionLgbtiqEnum | null;
  identidad_genero?: string | null;
  orientacion_sexual?: string | null;
  escolaridad?: string | null;
  grupo_etnico?: string | null;
  barrio?: string | null;
  zona?: string | null;
  tenencia_vivienda?: string | null;
  comuna?: string | null;
  tiene_sisben?: boolean | null;
  personas_cargo?: number | null;
  rango_salarial?: string | null;
  servicios_publicos?: string | null;
  sabe_leer?: boolean | null;
  discapacidad?: string | null;
  condicion_actual?: string | null;
};

// --- PERFILES --------------------------------------------------
export type Perfil = {
  id: string;
  nombre_completo: string | null;
  correo?: string | null;
  cedula?: string | null;
  telefono?: string | null;
  activo: boolean;
};

// --- ESTUDIANTES -----------------------------------------------

export type Estudiante = {
  id_perfil: string;
  /** NULL mientras el estudiante no complete su perfil (alta por Google). */
  semestre: number | null;
  jornada: JornadaEnum;
  /** @deprecated Columna muerta; el horario real está en `horarios`. */
  turno: TurnoEnum;
  /** @deprecated Columna muerta; el horario real está en `horarios`. */
  dia?: string | null;
  perfil: Perfil;
  total_casos?: number;
  /** Días y turnos reales, desde la tabla `horarios`. */
  horarios?: { dia: string; turno: string }[];
};

// --- ASESORES --------------------------------------------------

export type Asesor = {
  id_perfil: string;
  perfil: Perfil;
  turno: TurnoEnum;
  area: AreaEnum;
  dia?: string | null;
  horario?: Record<string, string> | null;
  total_casos?: number;
};

// --- RELACIONES ------------------------------------------------

export type EstudianteCaso = {
  fecha_asignacion?: string | null;
  fecha_fin_asignacion?: string | null;

  // relación opcional
  estudiante: Estudiante;
};

export type AsesorCaso = {
  fecha_asignacion?: string | null;
  fecha_fin_asignacion?: string | null;

  // relación opcional
  asesor: Asesor;
};

// --- CASOS -----------------------------------------------------

export type Caso = {
  id_caso?: number;
  id_usuario?: string;
  resumen_hechos?: string | null;
  observaciones?: string | null;
  observaciones_estudiante?: string | null;
  fecha_creacion: string;
  fecha_entrega_entrevista?: string | null;
  fecha_vencimiento_estudiante?: string | null;
  fecha_vencimiento_asesor?: string | null;
  ultima_modificacion?: string | null;
  periodo?: string | null;
  estado: EstadoEnum;
  fecha_cierre?: string | null;
  area: AreaEnum;
  tipo_proceso?: string;
  clasificacion?: ClasificacionEnum | null;

  // Relaciones
  usuarios: Usuario;
  estudiantes_casos: EstudianteCaso[];
  asesores_casos: AsesorCaso[];
  documentos_caso?: { count: number }[];
};
// --- DEMANDADOS -------------------------------------------------
export type Demandado = {
  id_demandado: string;
  id_caso: number;
  nombre_completo: string;
  documento: string | null;
  celular: string | null;
  lugar_residencia: string | null;
  correo: string | null;
};

export type ContratoLaboral = {
  id_contrato: number;
  id_usuario: string;
  tipo_contrato: string | null;
  representante_legal: string | null;
  direccion_empresa: string | null;
  correo_patrono: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  continua: boolean | null;
  salario_inicial: number | null;
  salario_actual: number | null;
};
