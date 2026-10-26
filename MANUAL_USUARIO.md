# Manual de Usuario: Sistema de Gestión del Consultorio Jurídico

Bienvenido al manual de usuario del **Consultorio Jurídico**. Este documento proporciona instrucciones detalladas para los cuatro roles del sistema: **Estudiantes**, **Asesores Docentes**, **Profesionales de Apoyo** y **Administradores**.

---

## 1. Rol: Estudiante

El estudiante es el encargado del contacto directo con el solicitante y la ejecución jurídica y técnica del caso.

### 1.1 Acceso Directo y Visualización de Casos
- Al iniciar sesión con tu correo institucional Google (`@uniautonoma.edu.co`), el sistema te dirige inmediatamente a **"Mis Casos"** (`/estudiante/mis-casos`).
- Visualizarás tarjetas ejecutivas con el resumen de tus casos activos, pendientes de corrección y cerrados.
- **Buscador limpio**: Busca directamente por nombre o cédula del solicitante o por el identificador del caso (`#ID`).
- **Filtros independientes**: Filtra por Asesor Docente, Área del derecho, Estado procesal, Clasificación y Período académico sin mezclar términos.

### 1.2 Transición Semestral (Self-Service de 30 Segundos)
- Al inicio de cada nuevo ciclo académico (ej. 2026-2, 2027-1), al iniciar sesión serás recibido con una ventana modal de confirmación rápida:
  1. **Semestre**: Sugiere automáticamente tu siguiente semestre (tope 10).
  2. **Jornada**: Diurna, Nocturna o Mixto.
  3. **Turnos de Consultorio**: Selecciona el día y horario en que prestarás turno (ej. Lunes 9:00 am - 11:00 am).
  4. **Teléfono de contacto**: Confirmación de tu celular para coordinaciones de casos.
- Al confirmar, tu perfil queda marcado como **"Al día"** y continúas a tus casos sin interrupciones.

### 1.3 Proceso de Entrevista y Documentos
- Para los casos en estado **"En Proceso"**, utiliza el botón **"Continuar a entrevista"** (formulario guiado de 8 pasos sociodemográficos y jurídicos).
- Puedes adjuntar documentos probatorios directamente en formato PDF, Word, Excel o imágenes (hasta 25 MB).
- Al finalizar la entrevista, el estado cambiará a **"Pendiente de Aprobación"** para la revisión del asesor docente.

---

## 2. Rol: Asesor Docente

El asesor docente supervisa la labor del practicante y certifica la calidad técnica de las actuaciones.

### 2.1 Acceso Directo y Supervisión de Casos
- Al iniciar sesión, ingresas directamente a **"Mis Casos"** (`/asesor/mis-casos`), donde observas los expedientes de tus estudiantes asignados.
- Puedes filtrar por estudiante asignado específico o buscar por datos del solicitante.

### 2.2 Consulta de Horario Asignado
- En el menú **"Mi Horario"** (`/asesor/mi-horario`), puedes consultar los días y turnos de atención asignados administrativamente.
- La gestión y asignación de horarios es administrada de forma centralizada por la Dirección/Coordinación del Consultorio.

### 2.3 Aprobación, Ajustes y Observaciones
- **Aprobar Caso**: Si la entrevista y documentos cumplen con los requisitos, aprueba el caso para pasarlo a estado **"Activo"** (en trámite).
- **Solicitar Correcciones**: Si faltan soportes o hechos por aclarar, solicita ajustes enviando el caso a **"En Corrección"** (el estudiante dispondrá de 3 días hábiles para subsanar).
- **Observaciones en tiempo real**: Canal de comunicación interno por caso para orientar al practicante.

---

## 3. Rol: Profesional de Apoyo (Pro-Apoyo)

El profesional de apoyo coordina la operación, apertura de expedientes y equilibrio de cargas.

### 3.1 Apertura y Asignación de Casos
- Creación de nuevos expedientes en `/pro-apoyo/crear-caso`, registrando al solicitante, los hechos y asignando al equipo inicial (estudiante y docente).
- El selector inteligente prioriza a los estudiantes y asesores que prestan turno el día de hoy.

### 3.2 Detección de Casos Huérfanos y Reasignación Rápida
- **Alerta de Practicante Inactivo**: Si un estudiante asignado culminó sus prácticas o fue inactivado administrativamente, su caso se destaca con el badge `⚠️ Practicante Inactivo (Requiere Reasignación)`.
- **Filtro de Reasignación**: Botón directo para listar exclusivamente los casos que necesitan nuevo practicante.
- **Herramienta de Reasignación**: Modal con búsqueda, historial de asignaciones previas, carga actual de casos (ej. 2/5) y turnos semanales reales de cada candidato.

---

## 4. Rol: Administrador del Sistema

El administrador tiene control directivo, de auditoría y configuración académica.

### 4.1 Barra Lateral de Navegación (Sidebar)
- Navegación agrupada y colapsable con persistencia de preferencias y menú móvil responsive:
  - **Operaciones**: Inicio (KPIs ejecutivos), Todos los Casos, Llamados de Atención.
  - **Directorio**: Estudiantes, Asesores Docentes, Profesionales de Apoyo.
  - **Analíticas**: Métricas demográficas, operativas y exportación a Excel.

### 4.2 Centralización de Horarios Docentes
- En `/admin/asesores`, el administrador tiene control exclusivo para asignar los días y turnos de atención de cada docente mediante el componente visual `ScheduleEditor`, sincronizando en tiempo real la base de datos relacional.

### 4.3 Control de Estado de Casos con Glosario Interactivo
- En el detalle de cualquier caso (`/admin/todos-los-casos/[id]`), el administrador puede forzar la transición de estado procesal:
  - **Glosario en pantalla**: Explicación interactiva del significado de cada estado (`en_proceso`, `pendiente_aprobacion`, `en_correccion`, `activo`, `cerrado`, `archivado`).
  - **Justificación Obligatoria**: Exige un motivo detallado que queda registrado con fecha y usuario en `auditoria_casos`.
  - **Recálculo de Plazos**: Al pasar a `en_correccion` asigna automáticamente 3 días hábiles al estudiante; al cerrar o archivar limpia los plazos pendientes.

### 4.4 Módulo de Llamados de Atención y Justificación
- En `/admin/llamados`, visualización agrupada por impacto de infractores (docentes y practicantes con alertas activas).
- Permite resolver llamados de forma manual ingresando un motivo de justificación (ej. excusa médica, entrega en reunión, acuerdo en comité docente).

### 4.5 Transición de Período Académico
- En `/admin/estudiantes`, selector del período académico vigente (ej. `2026-2`, `2027-1`).
- Permite identificar de inmediato qué estudiantes están **"Al día"** con su matrícula y disponibilidad, y quiénes están **"Pendientes"**.

---

## 5. Preguntas Frecuentes y Soporte

### 5.1 Centro de Ayuda Contextual
- Accesible desde el menú superior en `/centro-ayuda` con preguntas frecuentes filtradas por rol.

### 5.2 Mesa de Soporte Técnico
- **Canal Telefónico**: (321) 634-2133
- **Correo Institucional**: ayuda-consultorio@uac.edu.co

---

_© 2026 Consultorio Jurídico - Universidad Autónoma del Caribe_
