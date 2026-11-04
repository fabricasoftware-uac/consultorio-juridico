# Graph Report - consultorio-juridico  (2026-11-04)

## Corpus Check
- 300 files · ~197,783 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1307 nodes · 3502 edges · 118 communities (67 shown, 51 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `806682e6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- FormSteps.tsx
- estudiantes/page.tsx
- sheet.tsx
- menubar.tsx
- cn
- mis-casos/[id]/page.tsx
- Servicio Docker web (Next.js)
- Módulo Centro de Conciliación
- dropdown-menu.tsx
- Consultorio Jurídico — UAC
- devDependencies
- compilerOptions
- button.tsx
- AdminHeader.tsx
- app/layout.tsx
- AI Context — Consultorio Jurídico
- components.json
- supabase-admin.ts
- test-qa-suite.ts
- 13. Funciones PL/pgSQL Clave
- card.tsx
- LogoutBtn.tsx
- estudiante/mis-casos/MisCasosClient.tsx
- periodoAcademicoActions.ts
- carousel.tsx
- 12.1 Campos Sociodemográficos (22 campos)
- dependencies
- Descripciones detalladas de migraciones clave
- 9. Políticas RLS
- createClient
- form.tsx
- chart.tsx
- ui/utils.ts
- asesores/page.tsx
- 14. Patrones y Convenciones
- 2.2 Tablas Principales
- 5. Flujos Clave
- 7. API Routes
- enviar-notificaciones/route.ts
- 4. Máquina de Estados del Caso
- actividades/route.ts
- CampanitaNotificaciones.tsx
- 2. Esquema de Base de Datos
- roles.ts
- Architecture
- centro-ayuda/page.tsx
- navigation-menu.tsx
- cmdk
- registerUser.ts
- ProApoyoPage
- context-menu.tsx
- toggle-group.tsx
- case-detail-shell.tsx
- Uniautonoma del Cauca Logo (White Knockout Variant)
- notificaciones/route.ts
- drawer.tsx
- transicion-semestral.ts
- @hookform/resolvers
- lib/utils.ts
- @radix-ui/react-avatar
- analiticas/route.ts
- clsx
- @radix-ui/react-dialog
- migrar-storage.ts
- @radix-ui/react-label
- @radix-ui/react-slider
- jwt-decode
- NavBarEstudiante.tsx
- caso-auditoria.tsx
- llamados-list.tsx
- input-otp.tsx
- class-variance-authority
- skeleton.tsx
- Graphify Agent Rule
- Supabase Auth Service Configuration
- dotenv
- embla-carousel-react
- input-otp
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
- @radix-ui/react-menubar
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
- react
- react-day-picker
- react-dom
- react-hook-form
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
1. `cn()` - 240 edges
2. `Button()` - 58 edges
3. `supabase` - 58 edges
4. `Card()` - 44 edges
5. `Label()` - 31 edges
6. `Caso` - 30 edges
7. `Input()` - 30 edges
8. `matchesSearch()` - 30 edges
9. `SelectTrigger()` - 27 edges
10. `SelectContent()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `pnpm allowBuilds / onlyBuiltDependencies` --conceptually_related_to--> `Servicio Docker web (Next.js)`  [AMBIGUOUS]
  pnpm-workspace.yaml → deploy/docker-compose.yml
- `Centro de Ayuda` --semantically_similar_to--> `Tabla de Troubleshooting del Despliegue`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `Modificación de Datos de Identidad Maestros` --semantically_similar_to--> `Migración de Datos desde Supabase Cloud`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `searchCasoText()` --calls--> `matchesSearch()`  [EXTRACTED]
  scripts/test-qa-suite.ts → src/lib/search.ts
- `filtrarCaso()` --calls--> `matchesSearch()`  [EXTRACTED]
  scripts/test-qa-suite.ts → src/lib/search.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo de aprobación de un caso entre roles** — manual_usuario_rol_estudiante, manual_usuario_entrevista_8_pasos, manual_usuario_estado_pendiente_de_aprobacion, manual_usuario_rol_asesor_docente, manual_usuario_aprobacion_de_casos [EXTRACTED 1.00]
- **Stack Docker self-hosted (app + Supabase + red compartida)** — deploy_docker_compose_service_web, deploy_docker_compose_service_caddy, deploy_docker_compose_red_supabase_default [EXTRACTED 1.00]
- **Cadena de autorización JWT → user_role → RLS** — docs_despliegue_docker_generacion_de_secretos, docs_despliegue_docker_custom_access_token_hook, docs_despliegue_docker_migraciones_supabase_db_push, docs_despliegue_docker_verificacion_end_to_end [INFERRED 0.85]
- **Dual-Surface University Branding Asset Set** — public_autonoma_logo, public_logo_uniautonoma_blanco_logo, public_autonoma_griffin_emblem, public_autonoma_institutional_brand_identity [INFERRED 0.85]

## Communities (118 total, 51 thin omitted)

### Community 0 - "FormSteps.tsx"
Cohesion: 0.06
Nodes (62): AnaliticasPage(), axisStyle, fetchData(), gridStyle, PALETTE, radius, DIAS, EMPTY_FORM (+54 more)

### Community 1 - "estudiantes/page.tsx"
Cohesion: 0.24
Nodes (15): deleteUser(), EMPTY_FORM, EMPTY_FORM, ProApoyoForm, HorarioAdder(), CardHeader(), CardTitle(), Table() (+7 more)

### Community 2 - "sheet.tsx"
Cohesion: 0.15
Nodes (10): AdminHeader(), AdminLayoutClient(), AdminLayoutClientProps, AdminSidebar(), metadata, Sheet(), SheetContent(), SheetFooter() (+2 more)

### Community 3 - "menubar.tsx"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 4 - "cn"
Cohesion: 0.07
Nodes (44): Avatar(), AvatarFallback(), AvatarImage(), DialogOverlay(), RadioGroup(), RadioGroupItem(), ScrollArea(), ScrollBar() (+36 more)

### Community 5 - "mis-casos/[id]/page.tsx"
Cohesion: 0.06
Nodes (80): dynamic, Page(), dynamic, Page(), SolicitudCierreAdmin, STEPS, UserRegistrationForm(), dynamic (+72 more)

### Community 6 - "Servicio Docker web (Next.js)"
Cohesion: 0.07
Nodes (42): Build args NEXT_PUBLIC_* del servicio web, Red externa supabase_default compartida, Servicio Docker caddy, Servicio Docker web (Next.js), Arquitectura de Despliegue (Caddy + web + Supabase self-hosted), Bucket de Storage documentos-casos, Caddy como Reverse Proxy con auto-TLS, Procedimiento de Cambio de Dominio (+34 more)

### Community 7 - "Módulo Centro de Conciliación"
Cohesion: 0.07
Nodes (27): 1. Ya existe un `'conciliacion'`, y significa otra cosa, 2. `estaAsignado()` es el único cuello de autorización, 3. `auditoria_casos` es la excepción — no usa `estaAsignado`, 4. El JWT asume un rol por usuario, 5. Dos mecanismos que parecen reutilizables pero no lo son, 6. `notificar_usuarios_caso()` no conoce el rol nuevo, Autorización, Cambios en pantallas existentes (+19 more)

### Community 8 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 9 - "Consultorio Jurídico — UAC"
Cohesion: 0.07
Nodes (26): Analíticas y Exportación, Arquitectura, Auditoría, Centralización de Horarios y Cambio de Estados, Ciclo de Vida de un Caso, Comandos Útiles, Configuración del Entorno, Consultorio Jurídico — UAC (+18 more)

### Community 10 - "devDependencies"
Cohesion: 0.05
Nodes (37): devDependencies, pg, postgres, @snaplet/copycat, @snaplet/seed, supabase, tailwindcss, @tailwindcss/postcss (+29 more)

### Community 11 - "compilerOptions"
Cohesion: 0.05
Nodes (36): components/*, dom, dom.iterable, esnext, lib/*, next-env.d.ts, .next/types/**/*.ts, node_modules (+28 more)

### Community 12 - "button.tsx"
Cohesion: 0.07
Nodes (56): ActionResult, cambiarEstadoCasoAdmin(), solicitarCierreCasoAdmin(), AdminReasignarEquipo(), Props, StepProps, AsignacionCaso(), RegistroUsuario() (+48 more)

### Community 13 - "AdminHeader.tsx"
Cohesion: 0.33
Nodes (8): AdminHeaderProps, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 14 - "app/layout.tsx"
Cohesion: 0.11
Nodes (15): geistMono, geistSans, metadata, applyPrefs(), BotonAccesibilidad(), FontSize, getPrefs(), Footer() (+7 more)

### Community 15 - "AI Context — Consultorio Jurídico"
Cohesion: 0.14
Nodes (13): 11. Límites Conocidos, 1. Stack y Versiones, 3.1 Flujo de Auth, 3.2 Mapa de Rutas por Rol, 3.3 Clientes Supabase, 3.4 Sistema de Permisos, 3. Autenticación y Roles, 6. Estructura de Archivos (+5 more)

### Community 16 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 17 - "supabase-admin.ts"
Cohesion: 0.15
Nodes (3): serviceRoleKey, supabaseAdmin, supabaseUrl

### Community 18 - "test-qa-suite.ts"
Cohesion: 0.11
Nodes (26): CasoFiltros, filtrarCaso(), mockCaso, mockDatasetCasos, searchCasoText(), AdminPanelPage(), AdminLlamadosPage(), formatDateTime() (+18 more)

### Community 19 - "13. Funciones PL/pgSQL Clave"
Cohesion: 0.18
Nodes (11): 13. Funciones PL/pgSQL Clave, `authorize(requested_permission app_permission) → boolean`, `custom_access_token_hook(event jsonb) → jsonb`, `enqueue_assignment_notification(p_id_caso, p_id_usuario, p_tipo, p_source) → void`, `estaAsignado(uid uuid, caso_id integer) → boolean`, `generar_llamados_atencion() → integer`, `handle_new_user() → trigger`, `notificar_usuarios_caso(p_id_caso, p_id_autor, p_tipo, p_titulo, p_mensaje) → void` (+3 more)

### Community 20 - "card.tsx"
Cohesion: 0.23
Nodes (5): DashboardStats, Card(), CardAction(), CardContent(), CardFooter()

### Community 21 - "LogoutBtn.tsx"
Cohesion: 0.23
Nodes (12): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+4 more)

### Community 22 - "estudiante/mis-casos/MisCasosClient.tsx"
Cohesion: 0.13
Nodes (31): verificarEstudianteRequiereActualizacion(), Page(), TodosLosCasosPage(), Asesor(), dynamic, MisCasosClient(), dynamic, SupportCasesPage() (+23 more)

### Community 23 - "periodoAcademicoActions.ts"
Cohesion: 0.19
Nodes (12): ActionResult, CompletarPerfilInput, JORNADAS, ActionResult, ActualizarSemestreInput, DatosEstudianteTransicion, JORNADAS, VerificacionTransicionResult (+4 more)

### Community 24 - "carousel.tsx"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 25 - "12.1 Campos Sociodemográficos (22 campos)"
Cohesion: 0.22
Nodes (9): 12.1 Campos Sociodemográficos (22 campos), 12.2 Estructura del Wizard (8 pasos), 12.3 Tipos TypeScript, 12. Formulario de Entrevista, Condición Actual (2 campos), Identidad y Orientación (2 campos), Identificación (5 campos), Sociodemográficos (9 campos) (+1 more)

### Community 26 - "dependencies"
Cohesion: 0.15
Nodes (13): browser-image-compression, next, dependencies, browser-image-compression, next, @radix-ui/react-hover-card, @radix-ui/react-navigation-menu, @radix-ui/react-tooltip (+5 more)

### Community 27 - "Descripciones detalladas de migraciones clave"
Cohesion: 0.25
Nodes (8): 10. Migraciones Clave, 20260327000000 — Alertas Tempranas, 20260409000000 / 20260409000001 — Documentos, 20260423000000 — Formulario Unificado, 20260427000000 — Aprobado a Activo, 20260711000000 — Días Hábiles, Descripciones detalladas de migraciones clave, Listado completo (47 migraciones)

### Community 28 - "9. Políticas RLS"
Cohesion: 0.29
Nodes (7): 9.1 `casos`, 9.2 `estudiantes_casos` / `asesores_casos`, 9.3 `documentos_caso`, 9.4 `storage.objects` (bucket `documentos-casos`), 9.5 Otras Tablas, 9.6 Función auxiliar `estaAsignado`, 9. Políticas RLS

### Community 29 - "createClient"
Cohesion: 0.30
Nodes (8): completarPerfilEstudiante(), decodificarRol(), GET(), GET(), CompletarPerfilPage(), EstudianteLayout(), esCorreoInstitucional(), createClient()

### Community 30 - "form.tsx"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 31 - "chart.tsx"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 32 - "ui/utils.ts"
Cohesion: 0.10
Nodes (12): AdminSidebarProps, Checkbox(), HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Slider(), Switch() (+4 more)

### Community 33 - "asesores/page.tsx"
Cohesion: 0.14
Nodes (20): registerAsesor(), ActionResult, toggleUserStatus(), updateAsesor(), updateAsesorHorario(), AsesoresPage(), AsesorForm, EMPTY_FORM (+12 more)

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

### Community 38 - "enviar-notificaciones/route.ts"
Cohesion: 0.17
Nodes (12): buildEmailHtml(), handleRetry(), markFailed(), markSent(), POST(), validarSesion(), EmailProvider, getEmailProvider() (+4 more)

### Community 39 - "4. Máquina de Estados del Caso"
Cohesion: 0.50
Nodes (4): 4.1 Diagrama, 4.2 Descripción de Estados, 4.3 Reglas de Transición, 4. Máquina de Estados del Caso

### Community 40 - "actividades/route.ts"
Cohesion: 0.83
Nodes (3): clienteDeUsuario(), GET(), POST()

### Community 41 - "CampanitaNotificaciones.tsx"
Cohesion: 0.24
Nodes (13): CampanitaNotificaciones(), ICONOS, NotificacionItem(), tiempoRelativo(), PaginaNotificaciones(), tiempoRelativo(), api(), habilitarAudioNotificaciones() (+5 more)

### Community 42 - "2. Esquema de Base de Datos"
Cohesion: 0.67
Nodes (3): 2.1 Diagrama de Relaciones, 2.3 Enums Clave, 2. Esquema de Base de Datos

### Community 43 - "roles.ts"
Cohesion: 0.27
Nodes (8): CASO_DETALLE, DOMINIO_INSTITUCIONAL, ROLE_HOME, ROLE_ROUTES, decodeJwtPayload(), updateSession(), config, middleware()

### Community 44 - "Architecture"
Cohesion: 0.17
Nodes (12): Architecture, Commands, Consultorio Jurídico — AGENTS.md, DB queries, Env vars (see `.env.example`), Key details, Path aliases (tsconfig `baseUrl: src/`), Project structure (+4 more)

### Community 45 - "centro-ayuda/page.tsx"
Cohesion: 0.14
Nodes (14): Navbar(), Navbar(), Navbars, RolIcons, RolLabels, Navbar(), LogoutButton(), Navbar() (+6 more)

### Community 46 - "navigation-menu.tsx"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 48 - "registerUser.ts"
Cohesion: 0.20
Nodes (11): getPeriodoActivo(), setPeriodoActivo(), ActionResult, generateTempPassword(), RegisterAsesorInput, registerEstudiante(), RegisterEstudianteInput, registerProApoyo() (+3 more)

### Community 49 - "ProApoyoPage"
Cohesion: 0.50
Nodes (3): updateProApoyo(), ProApoyoPage(), getProApoyo()

### Community 50 - "context-menu.tsx"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 51 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 52 - "case-detail-shell.tsx"
Cohesion: 0.26
Nodes (10): CaseDetailShellProps, ETIQUETAS_PESTANAS, ORDEN_PESTANAS, PestanaCaso, ICONOS, Props, Tabs(), TabsContent() (+2 more)

### Community 53 - "Uniautonoma del Cauca Logo (White Knockout Variant)"
Cohesion: 0.53
Nodes (6): Griffin Emblem (Institutional Heraldic Mark), Institutional Brand Identity Asset Set, Uniautonoma del Cauca Logo (Navy), Vigilado Mineducacion Compliance Mark, Uniautonoma del Cauca Logo (White Knockout Variant), Raster-in-SVG Wrapper Pattern

### Community 54 - "notificaciones/route.ts"
Cohesion: 0.83
Nodes (3): GET(), getUser(), PATCH()

### Community 55 - "drawer.tsx"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 56 - "transicion-semestral.ts"
Cohesion: 0.25
Nodes (7): actualizarSemestreEstudianteAction(), EstudianteCaso, ModalActualizarSemestre(), getEstudianteActivoCaso(), MotivoReasignacion, sugerirSiguienteSemestre(), validarPeriodoAcademico()

### Community 58 - "lib/utils.ts"
Cohesion: 0.18
Nodes (10): Step1InfoEntrevista(), AREA_LABELS, EstadoCaso, ESTADOS_VALIDOS_CASO, FilaHorario, HorarioDiaInfo, HorarioSemanaInput, nombreMostrado() (+2 more)

### Community 60 - "analiticas/route.ts"
Cohesion: 0.60
Nodes (5): agruparConteo(), agruparEnfoque(), agruparPorMes(), agruparRangosEdad(), GET()

### Community 63 - "migrar-storage.ts"
Cohesion: 0.50
Nodes (4): dst, listAll(), main(), src

### Community 67 - "NavBarEstudiante.tsx"
Cohesion: 0.27
Nodes (4): Navbar(), GeometricBackground(), GeometricBackgroundProps, dynamic

### Community 68 - "caso-auditoria.tsx"
Cohesion: 0.40
Nodes (5): ACCION_ICON, CasoAuditoria(), CasoAuditoriaProps, AuditEvent, getAuditEventsByCaso()

### Community 70 - "llamados-list.tsx"
Cohesion: 0.53
Nodes (4): LlamadosList(), LlamadosListProps, getLlamadosByCaso(), LlamadoAtencion

### Community 71 - "input-otp.tsx"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

## Ambiguous Edges - Review These
- `Uniautonoma del Cauca Logo (White Knockout Variant)` → `Vigilado Mineducacion Compliance Mark`  [AMBIGUOUS]
  public/logo_uniautonoma_blanco.svg · relation: conceptually_related_to
- `Servicio Docker web (Next.js)` → `pnpm allowBuilds / onlyBuiltDependencies`  [AMBIGUOUS]
  pnpm-workspace.yaml · relation: conceptually_related_to

## Knowledge Gaps
- **405 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+400 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Uniautonoma del Cauca Logo (White Knockout Variant)` and `Vigilado Mineducacion Compliance Mark`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Servicio Docker web (Next.js)` and `pnpm allowBuilds / onlyBuiltDependencies`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `cn` to `FormSteps.tsx`, `estudiantes/page.tsx`, `sheet.tsx`, `menubar.tsx`, `mis-casos/[id]/page.tsx`, `dropdown-menu.tsx`, `button.tsx`, `AdminHeader.tsx`, `card.tsx`, `LogoutBtn.tsx`, `estudiante/mis-casos/MisCasosClient.tsx`, `carousel.tsx`, `form.tsx`, `chart.tsx`, `ui/utils.ts`, `centro-ayuda/page.tsx`, `navigation-menu.tsx`, `registerUser.ts`, `context-menu.tsx`, `toggle-group.tsx`, `case-detail-shell.tsx`, `drawer.tsx`, `input-otp.tsx`, `skeleton.tsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `FormSteps.tsx`, `asesores/page.tsx`, `estudiantes/page.tsx`, `cn`, `mis-casos/[id]/page.tsx`, `llamados-list.tsx`, `CampanitaNotificaciones.tsx`, `app/layout.tsx`, `card.tsx`, `LogoutBtn.tsx`, `estudiante/mis-casos/MisCasosClient.tsx`, `case-detail-shell.tsx`, `carousel.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `supabaseAdmin` connect `supabase-admin.ts` to `asesores/page.tsx`, `enviar-notificaciones/route.ts`, `button.tsx`, `registerUser.ts`, `notificaciones/route.ts`, `periodoAcademicoActions.ts`, `analiticas/route.ts`, `createClient`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _405 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `FormSteps.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0584385226741468 - nodes in this community are weakly interconnected._