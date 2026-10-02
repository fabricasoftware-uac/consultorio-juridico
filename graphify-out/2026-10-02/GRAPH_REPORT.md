# Graph Report - consultorio-juridico  (2026-09-04)

## Corpus Check
- 282 files · ~175,950 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1217 nodes · 3167 edges · 102 communities (52 shown, 50 thin omitted)
- Extraction: 99% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba5f6491`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- mis-casos/[id]/page.tsx
- asesores/page.tsx
- PaginaNotificaciones.tsx
- cn
- sidebar.tsx
- estudiante/mis-casos/MisCasosClient.tsx
- Servicio Docker web (Next.js)
- Módulo Centro de Conciliación
- button.tsx
- Consultorio Jurídico — UAC
- devDependencies
- compilerOptions
- app/layout.tsx
- ui/utils.ts
- menubar.tsx
- AI Context — Consultorio Jurídico
- components.json
- supabase-admin.ts
- SearchableSelector.tsx
- 13. Funciones PL/pgSQL Clave
- UserRegistrationForm.tsx
- LogoutBtn.tsx
- context-menu.tsx
- documentos-caso.tsx
- carousel.tsx
- 12.1 Campos Sociodemográficos (22 campos)
- dependencies
- Descripciones detalladas de migraciones clave
- 9. Políticas RLS
- callback/route.ts
- form.tsx
- chart.tsx
- drawer.tsx
- roles.ts
- 14. Patrones y Convenciones
- 2.2 Tablas Principales
- 5. Flujos Clave
- 7. API Routes
- email.ts
- 4. Máquina de Estados del Caso
- actividades/route.ts
- enviar-notificaciones/route.ts
- 2. Esquema de Base de Datos
- Architecture
- completarPerfilEstudiante.ts
- Uniautonoma del Cauca Logo (White Knockout Variant)
- analiticas/route.ts
- migrar-storage.ts
- notificaciones/route.ts
- Graphify Agent Rule
- class-variance-authority
- clsx
- Supabase Auth Service Configuration
- dotenv
- embla-carousel-react
- @hookform/resolvers
- input-otp
- jwt-decode
- lucide-react
- next.config.ts
- next-themes
- exceljs
- @radix-ui/react-accordion
- @radix-ui/react-alert-dialog
- @radix-ui/react-aspect-ratio
- @radix-ui/react-checkbox
- @radix-ui/react-collapsible
- @radix-ui/react-context-menu
- @radix-ui/react-dropdown-menu
- @radix-ui/react-hover-card
- @radix-ui/react-menubar
- @radix-ui/react-navigation-menu
- @radix-ui/react-popover
- @radix-ui/react-progress
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-switch
- @radix-ui/react-tabs
- @radix-ui/react-toggle
- @radix-ui/react-toggle-group
- @radix-ui/react-tooltip
- react
- react-day-picker
- react-dom
- react-hook-form
- react-resizable-panels
- recharts
- sonner
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- vaul
- zod
- postcss.config.mjs
- Supabase Storage Service Configuration

## God Nodes (most connected - your core abstractions)
1. `cn()` - 234 edges
2. `supabase` - 56 edges
3. `Button()` - 55 edges
4. `Card()` - 43 edges
5. `Input()` - 30 edges
6. `Caso` - 29 edges
7. `Label()` - 27 edges
8. `SelectTrigger()` - 24 edges
9. `SelectContent()` - 24 edges
10. `SelectItem()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `pnpm allowBuilds / onlyBuiltDependencies` --conceptually_related_to--> `Servicio Docker web (Next.js)`  [AMBIGUOUS]
  pnpm-workspace.yaml → deploy/docker-compose.yml
- `Centro de Ayuda` --semantically_similar_to--> `Tabla de Troubleshooting del Despliegue`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `Modificación de Datos de Identidad Maestros` --semantically_similar_to--> `Migración de Datos desde Supabase Cloud`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `UserRegistrationForm()` --calls--> `getAsesores()`  [EXTRACTED]
  src/app/estudiante/mis-casos/[id_caso]/entrevista/components/UserRegistrationForm.tsx → supabase/queries/getAsesores.tsx
- `DocumentosCaso()` --calls--> `insertAuditEvent()`  [EXTRACTED]
  src/components/casos-juridicos/documentos-caso.tsx → supabase/queries/auditoriaCasos.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo de aprobación de un caso entre roles** — manual_usuario_rol_estudiante, manual_usuario_entrevista_8_pasos, manual_usuario_estado_pendiente_de_aprobacion, manual_usuario_rol_asesor_docente, manual_usuario_aprobacion_de_casos [EXTRACTED 1.00]
- **Stack Docker self-hosted (app + Supabase + red compartida)** — deploy_docker_compose_service_web, deploy_docker_compose_service_caddy, deploy_docker_compose_red_supabase_default [EXTRACTED 1.00]
- **Cadena de autorización JWT → user_role → RLS** — docs_despliegue_docker_generacion_de_secretos, docs_despliegue_docker_custom_access_token_hook, docs_despliegue_docker_migraciones_supabase_db_push, docs_despliegue_docker_verificacion_end_to_end [INFERRED 0.85]
- **Dual-Surface University Branding Asset Set** — public_autonoma_logo, public_logo_uniautonoma_blanco_logo, public_autonoma_griffin_emblem, public_autonoma_institutional_brand_identity [INFERRED 0.85]

## Communities (102 total, 50 thin omitted)

### Community 0 - "mis-casos/[id]/page.tsx"
Cohesion: 0.07
Nodes (63): dynamic, Page(), dynamic, Page(), StepProps, UserRegistrationForm(), dynamic, Page() (+55 more)

### Community 1 - "asesores/page.tsx"
Cohesion: 0.05
Nodes (78): ActionResult, generateTempPassword(), registerAsesor(), RegisterAsesorInput, registerEstudiante(), RegisterEstudianteInput, registerProApoyo(), RegisterProApoyoInput (+70 more)

### Community 2 - "PaginaNotificaciones.tsx"
Cohesion: 0.06
Nodes (45): Navbar(), Navbars, RolIcons, RolLabels, Navbar(), GeometricBackground(), GeometricBackgroundProps, dynamic (+37 more)

### Community 3 - "cn"
Cohesion: 0.07
Nodes (35): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+27 more)

### Community 4 - "sidebar.tsx"
Cohesion: 0.06
Nodes (39): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle(), Sidebar() (+31 more)

### Community 5 - "estudiante/mis-casos/MisCasosClient.tsx"
Cohesion: 0.12
Nodes (33): Page(), TodosLosCasosPage(), Asesor(), dynamic, MisCasosClient(), dynamic, SupportCasesPage(), dynamic (+25 more)

### Community 6 - "Servicio Docker web (Next.js)"
Cohesion: 0.07
Nodes (42): Build args NEXT_PUBLIC_* del servicio web, Red externa supabase_default compartida, Servicio Docker caddy, Servicio Docker web (Next.js), Arquitectura de Despliegue (Caddy + web + Supabase self-hosted), Bucket de Storage documentos-casos, Caddy como Reverse Proxy con auto-TLS, Procedimiento de Cambio de Dominio (+34 more)

### Community 7 - "Módulo Centro de Conciliación"
Cohesion: 0.07
Nodes (27): 1. Ya existe un `'conciliacion'`, y significa otra cosa, 2. `estaAsignado()` es el único cuello de autorización, 3. `auditoria_casos` es la excepción — no usa `estaAsignado`, 4. El JWT asume un rol por usuario, 5. Dos mecanismos que parecen reutilizables pero no lo son, 6. `notificar_usuarios_caso()` no conoce el rol nuevo, Autorización, Cambios en pantallas existentes (+19 more)

### Community 8 - "button.tsx"
Cohesion: 0.06
Nodes (63): AnaliticasPage(), axisStyle, fetchData(), gridStyle, PALETTE, radius, LlamadoPendiente, DIAS (+55 more)

### Community 9 - "Consultorio Jurídico — UAC"
Cohesion: 0.08
Nodes (24): Analíticas y Exportación, Arquitectura, Auditoría, Ciclo de Vida de un Caso, Comandos Útiles, Configuración del Entorno, Consultorio Jurídico — UAC, Documentos con flujo de aprobación (+16 more)

### Community 10 - "devDependencies"
Cohesion: 0.05
Nodes (36): devDependencies, pg, postgres, @snaplet/copycat, @snaplet/seed, supabase, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 11 - "compilerOptions"
Cohesion: 0.05
Nodes (36): components/*, dom, dom.iterable, esnext, lib/*, next-env.d.ts, .next/types/**/*.ts, node_modules (+28 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.11
Nodes (15): geistMono, geistSans, metadata, applyPrefs(), BotonAccesibilidad(), FontSize, getPrefs(), Footer() (+7 more)

### Community 13 - "ui/utils.ts"
Cohesion: 0.13
Nodes (9): HoverCardContent(), ResizableHandle(), ResizablePanelGroup(), Skeleton(), ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle() (+1 more)

### Community 14 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 15 - "AI Context — Consultorio Jurídico"
Cohesion: 0.14
Nodes (13): 11. Límites Conocidos, 1. Stack y Versiones, 3.1 Flujo de Auth, 3.2 Mapa de Rutas por Rol, 3.3 Clientes Supabase, 3.4 Sistema de Permisos, 3. Autenticación y Roles, 6. Estructura de Archivos (+5 more)

### Community 16 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 18 - "SearchableSelector.tsx"
Cohesion: 0.18
Nodes (12): SearchableSelectorProps, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+4 more)

### Community 19 - "13. Funciones PL/pgSQL Clave"
Cohesion: 0.18
Nodes (11): 13. Funciones PL/pgSQL Clave, `authorize(requested_permission app_permission) → boolean`, `custom_access_token_hook(event jsonb) → jsonb`, `enqueue_assignment_notification(p_id_caso, p_id_usuario, p_tipo, p_source) → void`, `estaAsignado(uid uuid, caso_id integer) → boolean`, `generar_llamados_atencion() → integer`, `handle_new_user() → trigger`, `notificar_usuarios_caso(p_id_caso, p_id_autor, p_tipo, p_titulo, p_mensaje) → void` (+3 more)

### Community 20 - "UserRegistrationForm.tsx"
Cohesion: 0.20
Nodes (15): Step1InfoEntrevista(), Step2InfoSolicitante(), Step3QuienSolicita(), Step4InfoLaboral(), Step5DatosAccionado(), Step6InfoContrato(), Step7DetallesCaso(), Step8Firmas() (+7 more)

### Community 21 - "LogoutBtn.tsx"
Cohesion: 0.23
Nodes (12): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+4 more)

### Community 22 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 23 - "documentos-caso.tsx"
Cohesion: 0.11
Nodes (21): ALLOWED_TYPES, api(), Documento, DocumentosCaso(), formatSize(), getFreshSignedUrl(), getIcon(), ICON_MIME (+13 more)

### Community 24 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 25 - "12.1 Campos Sociodemográficos (22 campos)"
Cohesion: 0.22
Nodes (9): 12.1 Campos Sociodemográficos (22 campos), 12.2 Estructura del Wizard (8 pasos), 12.3 Tipos TypeScript, 12. Formulario de Entrevista, Condición Actual (2 campos), Identidad y Orientación (2 campos), Identificación (5 campos), Sociodemográficos (9 campos) (+1 more)

### Community 26 - "dependencies"
Cohesion: 0.15
Nodes (13): cmdk, next, dependencies, cmdk, next, @radix-ui/react-avatar, @radix-ui/react-dialog, @radix-ui/react-label (+5 more)

### Community 27 - "Descripciones detalladas de migraciones clave"
Cohesion: 0.25
Nodes (8): 10. Migraciones Clave, 20260327000000 — Alertas Tempranas, 20260409000000 / 20260409000001 — Documentos, 20260423000000 — Formulario Unificado, 20260427000000 — Aprobado a Activo, 20260711000000 — Días Hábiles, Descripciones detalladas de migraciones clave, Listado completo (47 migraciones)

### Community 28 - "9. Políticas RLS"
Cohesion: 0.29
Nodes (7): 9.1 `casos`, 9.2 `estudiantes_casos` / `asesores_casos`, 9.3 `documentos_caso`, 9.4 `storage.objects` (bucket `documentos-casos`), 9.5 Otras Tablas, 9.6 Función auxiliar `estaAsignado`, 9. Políticas RLS

### Community 29 - "callback/route.ts"
Cohesion: 0.30
Nodes (8): completarPerfilEstudiante(), decodificarRol(), GET(), GET(), CompletarPerfilPage(), EstudianteLayout(), esCorreoInstitucional(), createClient()

### Community 30 - "form.tsx"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 31 - "chart.tsx"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 32 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 33 - "roles.ts"
Cohesion: 0.27
Nodes (8): CASO_DETALLE, DOMINIO_INSTITUCIONAL, ROLE_HOME, ROLE_ROUTES, decodeJwtPayload(), updateSession(), config, middleware()

### Community 34 - "14. Patrones y Convenciones"
Cohesion: 0.40
Nodes (5): 14. Patrones y Convenciones, Flujo de datos, Manejo de sesión, Nomenclatura, Utilidades

### Community 35 - "2.2 Tablas Principales"
Cohesion: 0.13
Nodes (16): 2.2 Tablas Principales, `actividades_caso`, `asesores`, `auditoria_casos`, `casos`, `contratos_laborales`, `demandados`, `documentos_caso` (+8 more)

### Community 36 - "5. Flujos Clave"
Cohesion: 0.40
Nodes (5): 5.1 Flujo Principal: Creación y Ciclo de Vida de un Caso, 5.2 Flujo de Documentos, 5.3 Flujo de Llamados de Atención, 5.4 Flujo de Notificaciones, 5. Flujos Clave

### Community 37 - "7. API Routes"
Cohesion: 0.40
Nodes (5): 7.1 Documentos, 7.2 Admin, 7.3 Cron, 7.4 Otros Endpoints, 7. API Routes

### Community 38 - "email.ts"
Cohesion: 0.24
Nodes (5): EmailProvider, ResendProvider, SendEmailParams, SendEmailResult, SmtpProvider

### Community 39 - "4. Máquina de Estados del Caso"
Cohesion: 0.50
Nodes (4): 4.1 Diagrama, 4.2 Descripción de Estados, 4.3 Reglas de Transición, 4. Máquina de Estados del Caso

### Community 40 - "actividades/route.ts"
Cohesion: 0.83
Nodes (3): clienteDeUsuario(), GET(), POST()

### Community 41 - "enviar-notificaciones/route.ts"
Cohesion: 0.46
Nodes (7): buildEmailHtml(), handleRetry(), markFailed(), markSent(), POST(), validarSesion(), getEmailProvider()

### Community 42 - "2. Esquema de Base de Datos"
Cohesion: 0.67
Nodes (3): 2.1 Diagrama de Relaciones, 2.3 Enums Clave, 2. Esquema de Base de Datos

### Community 44 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Commands, Consultorio Jurídico — AGENTS.md, DB queries, Env vars (see `.env.example`), Key details, Path aliases (tsconfig `baseUrl: src/`), Project structure (+4 more)

### Community 49 - "completarPerfilEstudiante.ts"
Cohesion: 0.33
Nodes (6): ActionResult, CompletarPerfilInput, JORNADAS, StudentForm, PerfilForm, JornadaEnum

### Community 53 - "Uniautonoma del Cauca Logo (White Knockout Variant)"
Cohesion: 0.53
Nodes (6): Griffin Emblem (Institutional Heraldic Mark), Institutional Brand Identity Asset Set, Uniautonoma del Cauca Logo (Navy), Vigilado Mineducacion Compliance Mark, Uniautonoma del Cauca Logo (White Knockout Variant), Raster-in-SVG Wrapper Pattern

### Community 54 - "analiticas/route.ts"
Cohesion: 0.60
Nodes (5): agruparConteo(), agruparEnfoque(), agruparPorMes(), agruparRangosEdad(), GET()

### Community 63 - "migrar-storage.ts"
Cohesion: 0.50
Nodes (4): dst, listAll(), main(), src

### Community 68 - "notificaciones/route.ts"
Cohesion: 0.83
Nodes (3): GET(), getUser(), PATCH()

## Ambiguous Edges - Review These
- `Uniautonoma del Cauca Logo (White Knockout Variant)` → `Vigilado Mineducacion Compliance Mark`  [AMBIGUOUS]
  public/logo_uniautonoma_blanco.svg · relation: conceptually_related_to
- `Servicio Docker web (Next.js)` → `pnpm allowBuilds / onlyBuiltDependencies`  [AMBIGUOUS]
  pnpm-workspace.yaml · relation: conceptually_related_to

## Knowledge Gaps
- **367 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+362 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Uniautonoma del Cauca Logo (White Knockout Variant)` and `Vigilado Mineducacion Compliance Mark`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Servicio Docker web (Next.js)` and `pnpm allowBuilds / onlyBuiltDependencies`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `cn` to `drawer.tsx`, `asesores/page.tsx`, `PaginaNotificaciones.tsx`, `mis-casos/[id]/page.tsx`, `sidebar.tsx`, `estudiante/mis-casos/MisCasosClient.tsx`, `button.tsx`, `ui/utils.ts`, `menubar.tsx`, `SearchableSelector.tsx`, `UserRegistrationForm.tsx`, `LogoutBtn.tsx`, `context-menu.tsx`, `documentos-caso.tsx`, `carousel.tsx`, `form.tsx`, `chart.tsx`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `mis-casos/[id]/page.tsx`, `asesores/page.tsx`, `PaginaNotificaciones.tsx`, `cn`, `sidebar.tsx`, `estudiante/mis-casos/MisCasosClient.tsx`, `app/layout.tsx`, `SearchableSelector.tsx`, `UserRegistrationForm.tsx`, `LogoutBtn.tsx`, `documentos-caso.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `supabaseAdmin` connect `supabase-admin.ts` to `asesores/page.tsx`, `notificaciones/route.ts`, `enviar-notificaciones/route.ts`, `completarPerfilEstudiante.ts`, `analiticas/route.ts`, `callback/route.ts`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _367 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `mis-casos/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07010078387458006 - nodes in this community are weakly interconnected._