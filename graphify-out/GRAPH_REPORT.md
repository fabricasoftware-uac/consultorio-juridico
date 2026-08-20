# Graph Report - consultorio-juridico  (2026-08-20)

## Corpus Check
- 278 files · ~169,097 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1449 nodes · 3380 edges · 209 communities (122 shown, 87 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.87)
- Token cost: 500 input · 300 output

## Community Hubs (Navigation)
- Legal Case Details & Tab Views
- Admin Case Assignment & Team Reallocation
- Advisor Navigation & Schedules
- UI Avatar & Navigation Breadcrumbs
- UI Sheets, Panels & Separators
- Legal Case Details & Tab Views
- Deployment & Supabase Docker Infra
- User Registration & Auth Actions
- Legal Case Details & Tab Views
- Admin Dashboard & Metrics
- Project Dependencies & Scripts
- TypeScript Compiler Configuration
- GeometricBackgroundProps
- Support Professional Workspace
- Database RBAC & Security Hooks
- Database RBAC & Security Hooks
- Shadcn UI Workspace Config
- Database Seeding & Test Fixtures
- UI Sheets, Panels & Separators
- Supabase Schema & Migrations
- Case Intake Multi-Step Form
- UI Modals & Alert Dialogs
- UI Sheets, Panels & Separators
- UI Sheets, Panels & Separators
- UseCarouselParameters
- Database RBAC & Security Hooks
- Project Dependencies & Scripts
- User Notification Triggers
- Supabase Schema & Migrations
- Student Workspace & Case Management
- FormFieldContextValue
- getPayloadConfigFromPayload
- DrawerDescription
- DOMINIO_INSTITUCIONAL
- User Notification Triggers
- Recordatorio de documentos fal...
- Admin Management Views
- navigationMenuTriggerStyle
- SendEmailParams
- API Route /api/admin/exportar ...
- Database RBAC & Security Hooks
- User Notification Triggers
- Supabase Schema & Migrations
- Database RBAC & Security Hooks
- Cuatro clientes Supabase (brow...
- Migracion 20260423000000 — for...
- sumarDiasHabiles (version Ty...
- Politicas RLS de storage.objec...
- Wizard de entrevista de 8 paso...
- Student Workspace & Case Management
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Consultorio Juridico UAC — sis...
- Uniautonoma del Cauca Logo (Wh...
- Admin Management Views
- Legal Case Details & Tab Views
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Deployment & Supabase Docker Infra
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- User Notification Triggers
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Publicacion supabase_realtime ...
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Graphify Agent Rule
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Deployment & Supabase Docker Infra
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- next.config
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- Project Dependencies & Scripts
- postcss.config.mjs
- public.auditoria_casos
- Supabase Schema & Migrations
- Admin Dashboard & Metrics
- Admin Dashboard & Metrics
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- Supabase Schema & Migrations
- public.perfiles_roles
- Path aliases de tsconfig (base...
- Deployment & Supabase Docker Infra
- documentos_caso
- public.asesores
- public.perfiles_roles
- public.usuarios
- public.role_permissions
- public.perfiles
- public.casos
- public.estudiantes
- public.casos
- public.usuarios
- public.llamados_atencion
- public.documentos_caso
- public.casos
- public.documentos_caso
- public.usuarios
- "public"."casos"
- public.casos
- public.casos
- public.casos

## God Nodes (most connected - your core abstractions)
1. `cn()` - 234 edges
2. `Button()` - 57 edges
3. `supabase` - 56 edges
4. `Card()` - 42 edges
5. `Input()` - 31 edges
6. `Label()` - 30 edges
7. `Caso` - 28 edges
8. `Badge()` - 24 edges
9. `SelectTrigger()` - 24 edges
10. `SelectContent()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Modificación de Datos de Identidad Maestros` --semantically_similar_to--> `Migración de Datos desde Supabase Cloud`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `Centro de Ayuda` --semantically_similar_to--> `Tabla de Troubleshooting del Despliegue`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `pnpm allowBuilds / onlyBuiltDependencies` --conceptually_related_to--> `Servicio Docker web (Next.js)`  [AMBIGUOUS]
  pnpm-workspace.yaml → deploy/docker-compose.yml
- `Autorizacion en tres capas (middleware, RLS, token hook)` --conceptually_related_to--> `RBAC por prefijo de ruta en src/middleware.ts`  [INFERRED]
  README.md → AGENTS.md
- `Recordatorio de documentos faltantes (RPC recordar_documentos_caso)` --shares_data_with--> `Tabla notificaciones_usuario`  [INFERRED]
  README.md → docs/ai-contexto.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo de aprobación de un caso entre roles** — manual_usuario_rol_estudiante, manual_usuario_entrevista_8_pasos, manual_usuario_estado_pendiente_de_aprobacion, manual_usuario_rol_asesor_docente, manual_usuario_aprobacion_de_casos [EXTRACTED 1.00]
- **Stack Docker self-hosted (app + Supabase + red compartida)** — deploy_docker_compose_service_web, deploy_docker_compose_service_caddy, deploy_docker_compose_red_supabase_default [EXTRACTED 1.00]
- **Flujo de autorizacion RBAC de extremo a extremo** — docs_ai_contexto_custom_access_token_hook, docs_ai_contexto_perfiles_roles, docs_ai_contexto_role_permissions, docs_ai_contexto_authorize, docs_ai_contexto_estaasignado, docs_ai_contexto_politicas_rls, agents_rbac_middleware [EXTRACTED 1.00]
- **Flujo de llamados de atencion por vencimiento de plazos** — docs_ai_contexto_api_cron_check_plazos, docs_ai_contexto_generar_llamados_atencion, docs_ai_contexto_sumar_dias_habiles, docs_ai_contexto_llamados_atencion, docs_ai_contexto_migracion_dias_habiles, readme_llamados_atencion [EXTRACTED 1.00]
- **Pipeline de notificaciones internas y por email** — docs_ai_contexto_trg_auditoria_notificar, docs_ai_contexto_notificar_usuarios_caso, docs_ai_contexto_notificaciones_usuario, docs_ai_contexto_enqueue_assignment_notification, docs_ai_contexto_notificaciones_pendientes, docs_ai_contexto_pop_notificaciones_pendientes, docs_ai_contexto_api_cron_enviar_notificaciones [EXTRACTED 1.00]
- **Cadena de autorización JWT → user_role → RLS** — docs_despliegue_docker_generacion_de_secretos, docs_despliegue_docker_custom_access_token_hook, docs_despliegue_docker_migraciones_supabase_db_push, docs_despliegue_docker_verificacion_end_to_end [INFERRED 0.85]
- **Dual-Surface University Branding Asset Set** — public_autonoma_logo, public_logo_uniautonoma_blanco_logo, public_autonoma_griffin_emblem, public_autonoma_institutional_brand_identity [INFERRED 0.85]

## Communities (209 total, 87 thin omitted)

### Community 0 - "Legal Case Details & Tab Views"
Cohesion: 0.06
Nodes (80): dynamic, Page(), traerDatos(), dynamic, Page(), traerDatos(), UserRegistrationForm(), traerDatos() (+72 more)

### Community 1 - "Admin Case Assignment & Team Reallocation"
Cohesion: 0.07
Nodes (55): fetchAsesores(), fetchEstudiantes(), AdminReasignarEquipo(), Props, StepProps, AsignacionCaso(), AsignacionCasoProps, RegistroUsuario() (+47 more)

### Community 2 - "Advisor Navigation & Schedules"
Cohesion: 0.05
Nodes (41): Navbar(), MiHorarioPage(), Navbars, RolIcons, RolLabels, Navbar(), GeometricBackground(), GeometricBackgroundProps (+33 more)

### Community 3 - "UI Avatar & Navigation Breadcrumbs"
Cohesion: 0.06
Nodes (36): Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+28 more)

### Community 4 - "UI Sheets, Panels & Separators"
Cohesion: 0.06
Nodes (40): Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+32 more)

### Community 5 - "Legal Case Details & Tab Views"
Cohesion: 0.14
Nodes (28): Page(), TodosLosCasosPage(), Asesor(), dynamic, Step1InfoEntrevista(), MisCasosClient(), dynamic, SupportCasesPage() (+20 more)

### Community 6 - "Deployment & Supabase Docker Infra"
Cohesion: 0.07
Nodes (42): Build args NEXT_PUBLIC_* del servicio web, Red externa supabase_default compartida, Servicio Docker caddy, Servicio Docker web (Next.js), Arquitectura de Despliegue (Caddy + web + Supabase self-hosted), Bucket de Storage documentos-casos, Caddy como Reverse Proxy con auto-TLS, Procedimiento de Cambio de Dominio (+34 more)

### Community 7 - "User Registration & Auth Actions"
Cohesion: 0.11
Nodes (34): ActionResult, generateTempPassword(), registerAsesor(), RegisterAsesorInput, registerEstudiante(), RegisterEstudianteInput, registerProApoyo(), RegisterProApoyoInput (+26 more)

### Community 8 - "Legal Case Details & Tab Views"
Cohesion: 0.13
Nodes (27): AdvisorInfoProps, AREAS, CaseInfoTabProps, ClientInfoProps, ContractInfoProps, DefendantInfoProps, FieldProps, InfoField() (+19 more)

### Community 9 - "Admin Dashboard & Metrics"
Cohesion: 0.17
Nodes (17): LlamadoPendiente, DIAS, EMPTY_FORM, TURNOS, CustomJwtPayload, ERRORES_OAUTH, Alert(), AlertDescription() (+9 more)

### Community 10 - "Project Dependencies & Scripts"
Cohesion: 0.05
Nodes (36): devDependencies, pg, postgres, @snaplet/copycat, @snaplet/seed, supabase, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 11 - "TypeScript Compiler Configuration"
Cohesion: 0.05
Nodes (36): components/*, dom, dom.iterable, esnext, lib/*, next-env.d.ts, .next/types/**/*.ts, node_modules (+28 more)

### Community 12 - "GeometricBackgroundProps"
Cohesion: 0.11
Nodes (15): geistMono, geistSans, metadata, applyPrefs(), BotonAccesibilidad(), FontSize, getPrefs(), Footer() (+7 more)

### Community 13 - "Support Professional Workspace"
Cohesion: 0.11
Nodes (10): HoverCardContent(), Progress(), ResizableHandle(), ResizablePanelGroup(), Skeleton(), ToggleGroup(), ToggleGroupContext, ToggleGroupItem() (+2 more)

### Community 14 - "Database RBAC & Security Hooks"
Cohesion: 0.10
Nodes (8): "public"."authorize"(), public.role_permissions, "public"."set_ultima_modificacion_from_audit", "public"."trg_asesores_casos_notify", "public"."trg_asignacion_estudiante_notificar", "trg_asesores_casos_notify", "trg_asignacion_estudiante_notificar", "trg_audit_update_ultima_modificacion"

### Community 15 - "Database RBAC & Security Hooks"
Cohesion: 0.22
Nodes (18): "public"."asesores", "public"."asesores_casos", "public"."auditoria_casos", "public"."authorize"(), "public"."casos", "public"."contratos_laborales", "public"."custom_access_token_hook"(), "public"."demandados" (+10 more)

### Community 16 - "Shadcn UI Workspace Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 18 - "UI Sheets, Panels & Separators"
Cohesion: 0.17
Nodes (13): SearchableSelector(), SearchableSelectorProps, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+5 more)

### Community 19 - "Supabase Schema & Migrations"
Cohesion: 0.20
Nodes (14): auth, public.handle_new_user, asesores, asesores_casos, casos, contratos_laborales, demandados, estudiantes (+6 more)

### Community 20 - "Case Intake Multi-Step Form"
Cohesion: 0.26
Nodes (12): Step2InfoSolicitante(), Step3QuienSolicita(), Step4InfoLaboral(), Step5DatosAccionado(), Step6InfoContrato(), Step7DetallesCaso(), Step8Firmas(), toggleMulti() (+4 more)

### Community 21 - "UI Modals & Alert Dialogs"
Cohesion: 0.23
Nodes (12): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+4 more)

### Community 22 - "UI Sheets, Panels & Separators"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 23 - "UI Sheets, Panels & Separators"
Cohesion: 0.12
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 24 - "UseCarouselParameters"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 25 - "Database RBAC & Security Hooks"
Cohesion: 0.18
Nodes (13): Custom access token hook (pg-function), RBAC por prefijo de ruta en src/middleware.ts, Tabla asesores, authorize(requested_permission), custom_access_token_hook(event jsonb), Tabla estudiantes, Flujo de autenticacion (registro -> JWT -> middleware), handle_new_user() trigger (+5 more)

### Community 26 - "Project Dependencies & Scripts"
Cohesion: 0.15
Nodes (13): cmdk, next, dependencies, cmdk, next, @radix-ui/react-avatar, @radix-ui/react-dialog, @radix-ui/react-label (+5 more)

### Community 27 - "User Notification Triggers"
Cohesion: 0.15
Nodes (9): public.notificaciones_usuario, public.notificar_usuarios_caso(), public.asesores_casos, public.casos, public.estudiantes_casos, public.trg_asignacion_asesor_notificar, public.trg_asignacion_estudiante_notificar, trg_asignacion_asesor_notificar (+1 more)

### Community 28 - "Supabase Schema & Migrations"
Cohesion: 0.20
Nodes (12): public.notificaciones_pendientes, "public"."actividades_caso", "public"."caso_admite_documentos"(), "public"."casos", "public"."contratos_laborales", "public"."demandados", "public"."documentos_caso", "public"."generar_llamados_atencion"() (+4 more)

### Community 29 - "Student Workspace & Case Management"
Cohesion: 0.30
Nodes (8): completarPerfilEstudiante(), decodificarRol(), GET(), GET(), CompletarPerfilPage(), EstudianteLayout(), esCorreoInstitucional(), createClient()

### Community 30 - "FormFieldContextValue"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 31 - "getPayloadConfigFromPayload"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 32 - "DrawerDescription"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 33 - "DOMINIO_INSTITUCIONAL"
Cohesion: 0.27
Nodes (8): CASO_DETALLE, DOMINIO_INSTITUCIONAL, ROLE_HOME, ROLE_ROUTES, decodeJwtPayload(), updateSession(), config, middleware()

### Community 34 - "User Notification Triggers"
Cohesion: 0.20
Nodes (7): public.notificaciones_pendientes, public.pop_notificaciones_pendientes(), public.casos, public.trg_asesores_casos_notify, public.trg_estudiantes_casos_notify, trg_asesores_casos_notify, trg_estudiantes_casos_notify

### Community 35 - "Recordatorio de documentos fal..."
Cohesion: 0.24
Nodes (10): Tabla auditoria_casos, enqueue_assignment_notification(...), Tabla llamados_atencion, Tabla notificaciones_pendientes (cola de emails), Tabla notificaciones_usuario, notificar_usuarios_caso(...), trg_auditoria_notificar() trigger, Auditoria de casos (+2 more)

### Community 36 - "Admin Management Views"
Cohesion: 0.22
Nodes (6): AnaliticasPage(), axisStyle, fetchData(), gridStyle, PALETTE, radius

### Community 37 - "navigationMenuTriggerStyle"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 38 - "SendEmailParams"
Cohesion: 0.24
Nodes (5): EmailProvider, ResendProvider, SendEmailParams, SendEmailResult, SmtpProvider

### Community 39 - "API Route /api/admin/exportar ..."
Cohesion: 0.36
Nodes (8): API Route /api/admin/analiticas, API Route /api/admin/exportar (ExcelJS), Tabla asesores_casos, Tabla casos (tabla central), Tabla demandados, estaAsignado(uid, caso_id), Tabla estudiantes_casos, Analiticas y exportacion Excel

### Community 40 - "Database RBAC & Security Hooks"
Cohesion: 0.29
Nodes (8): "public"."horarios", "public"."asesores", "public"."auditoria_casos", "public"."custom_access_token_hook"(), "auth"."users", "public"."estudiantes", public.perfiles, public.perfiles_roles

### Community 41 - "User Notification Triggers"
Cohesion: 0.46
Nodes (7): buildEmailHtml(), handleRetry(), markFailed(), markSent(), POST(), validarSesion(), getEmailProvider()

### Community 42 - "Supabase Schema & Migrations"
Cohesion: 0.36
Nodes (8): "public"."asesores_casos", "public"."estaasignado"(), "public"."notificar_usuarios_caso"(), "public"."recordar_documentos_caso"(), "public"."sumar_dias_habiles"(), "public"."trg_auditoria_notificar"(), public.estudiantes_casos, public.notificaciones_usuario

### Community 43 - "Database RBAC & Security Hooks"
Cohesion: 0.25
Nodes (7): public.authorize(), public.custom_access_token_hook(), public.estaAsignado(), public.asesores_casos, public.estudiantes_casos, public.perfiles_roles, public.role_permissions

### Community 44 - "Cuatro clientes Supabase (brow..."
Cohesion: 0.33
Nodes (7): cleanData() — strings vacios a null, Consultas tipadas en supabase/queries/, scripts/seed.ts (Snaplet Seed, 4 usuarios de prueba), Setup local con Supabase en Docker, Stack Next.js 15 + Supabase + Tailwind v4, Cuatro clientes Supabase (browser/server/admin/middleware), Convencion de flujo de datos por cliente Supabase

### Community 45 - "Migracion 20260423000000 — for..."
Cohesion: 0.29
Nodes (7): Tabla actividades_caso, 22 campos sociodemograficos del solicitante, Tabla contratos_laborales, Tabla horarios, Migracion 20260423000000 — formulario unificado, Tabla usuarios (solicitantes), Observaciones (chat interno estudiante-asesor)

### Community 46 - "sumarDiasHabiles (version Ty..."
Cohesion: 0.33
Nodes (7): API Route /api/cron/check-plazos, API Route /api/cron/enviar-notificaciones, generar_llamados_atencion(), Migracion 20260711000000 — dias habiles, pop_notificaciones_pendientes(p_limit), sumar_dias_habiles(start_date, num_days), sumarDiasHabiles() (version TypeScript en src/lib/utils.ts)

### Community 47 - "Politicas RLS de storage.objec..."
Cohesion: 0.33
Nodes (7): API Route /api/documentos, Tabla documentos_caso, Limites conocidos del sistema, Politicas RLS de storage.objects (bucket documentos-casos), Documentos con flujo de aprobacion, Rol asesor (/asesor/*), Subida directa al Storage para evadir el limite de Vercel

### Community 48 - "Wizard de entrevista de 8 paso..."
Cohesion: 0.29
Nodes (7): Wizard de entrevista de 8 pasos con borrador en localStorage, Entrevista de 8 pasos (wizard), Autorizacion en tres capas (middleware, RLS, token hook), Reasignacion de equipo asignado, Rol admin (/admin/*), Rol estudiante (/estudiante/*), Rol pro_apoyo (/pro-apoyo/*)

### Community 49 - "Student Workspace & Case Management"
Cohesion: 0.33
Nodes (6): ActionResult, CompletarPerfilInput, JORNADAS, StudentForm, PerfilForm, JornadaEnum

### Community 50 - "Supabase Schema & Migrations"
Cohesion: 0.29
Nodes (5): public.sumar_dias_habiles(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 51 - "Supabase Schema & Migrations"
Cohesion: 0.29
Nodes (4): public.set_ultima_modificacion_direct, public.set_ultima_modificacion_from_audit, trg_audit_update_ultima_modificacion, trg_casos_update_ultima_modificacion

### Community 52 - "Consultorio Juridico UAC — sis..."
Cohesion: 0.33
Nodes (6): estado_enum (maquina de estados del caso), Maquina de estados y reglas de transicion, Migracion 20260427000000 — aprobado a activo, Ciclo de vida del caso, Consultorio Juridico UAC — sistema de gestion de casos, Llamados de atencion (business-day-aware)

### Community 53 - "Uniautonoma del Cauca Logo (Wh..."
Cohesion: 0.53
Nodes (6): Griffin Emblem (Institutional Heraldic Mark), Institutional Brand Identity Asset Set, Uniautonoma del Cauca Logo (Navy), Vigilado Mineducacion Compliance Mark, Uniautonoma del Cauca Logo (White Knockout Variant), Raster-in-SVG Wrapper Pattern

### Community 54 - "Admin Management Views"
Cohesion: 0.60
Nodes (5): agruparConteo(), agruparEnfoque(), agruparPorMes(), agruparRangosEdad(), GET()

### Community 55 - "Legal Case Details & Tab Views"
Cohesion: 0.33
Nodes (5): AREA_OPTIONS, CaseFiltersProps, CLASS_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS

### Community 56 - "Supabase Schema & Migrations"
Cohesion: 0.47
Nodes (5): public.generar_llamados_atencion(), public.llamados_atencion, public.asesores_casos, public.casos, public.estudiantes_casos

### Community 57 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 58 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 59 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.trg_documento_notificar(), public.asesores_casos, public.estudiantes_casos, public.trg_documento_notificar, trg_documento_notificar

### Community 60 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.trg_actividad_notificar(), public.asesores_casos, public.estudiantes_casos, public.trg_actividad_notificar, trg_actividad_notificar

### Community 61 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 62 - "Supabase Schema & Migrations"
Cohesion: 0.33
Nodes (5): public.caso_admite_documentos(), public.recordar_documentos_caso(), public.casos, public.estudiantes_casos, public.notificaciones_usuario

### Community 63 - "Deployment & Supabase Docker Infra"
Cohesion: 0.50
Nodes (4): dst, listAll(), main(), src

### Community 64 - "Supabase Schema & Migrations"
Cohesion: 0.40
Nodes (4): public.actividades_caso, public.horarios, public.casos, public.perfiles

### Community 65 - "Supabase Schema & Migrations"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.demandados

### Community 66 - "Supabase Schema & Migrations"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.perfiles

### Community 67 - "Supabase Schema & Migrations"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.perfiles

### Community 68 - "User Notification Triggers"
Cohesion: 0.83
Nodes (3): GET(), getUser(), PATCH()

### Community 70 - "Supabase Schema & Migrations"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 72 - "Supabase Schema & Migrations"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 73 - "Supabase Schema & Migrations"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 75 - "Publicacion supabase_realtime ..."
Cohesion: 1.00
Nodes (3): Publicacion supabase_realtime (Postgres CDC), Hook useRealtimeCaso(idCaso, onRefresh), Hook useRealtimeCasos(onChange)

## Ambiguous Edges - Review These
- `Observaciones (chat interno estudiante-asesor)` → `Tabla actividades_caso`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Servicio Docker web (Next.js)` → `pnpm allowBuilds / onlyBuiltDependencies`  [AMBIGUOUS]
  pnpm-workspace.yaml · relation: conceptually_related_to
- `Vigilado Mineducacion Compliance Mark` → `Uniautonoma del Cauca Logo (White Knockout Variant)`  [AMBIGUOUS]
  public/logo_uniautonoma_blanco.svg · relation: conceptually_related_to

## Knowledge Gaps
- **259 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+254 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **87 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Observaciones (chat interno estudiante-asesor)` and `Tabla actividades_caso`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Servicio Docker web (Next.js)` and `pnpm allowBuilds / onlyBuiltDependencies`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Vigilado Mineducacion Compliance Mark` and `Uniautonoma del Cauca Logo (White Knockout Variant)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `UI Avatar & Navigation Breadcrumbs` to `Legal Case Details & Tab Views`, `Admin Case Assignment & Team Reallocation`, `Advisor Navigation & Schedules`, `UI Sheets, Panels & Separators`, `Legal Case Details & Tab Views`, `User Registration & Auth Actions`, `Legal Case Details & Tab Views`, `Admin Dashboard & Metrics`, `Support Professional Workspace`, `UI Sheets, Panels & Separators`, `Case Intake Multi-Step Form`, `UI Modals & Alert Dialogs`, `UI Sheets, Panels & Separators`, `UI Sheets, Panels & Separators`, `UseCarouselParameters`, `FormFieldContextValue`, `getPayloadConfigFromPayload`, `DrawerDescription`, `navigationMenuTriggerStyle`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Why does `Button()` connect `Admin Dashboard & Metrics` to `Legal Case Details & Tab Views`, `Admin Case Assignment & Team Reallocation`, `Advisor Navigation & Schedules`, `UI Avatar & Navigation Breadcrumbs`, `Admin Management Views`, `Legal Case Details & Tab Views`, `UI Sheets, Panels & Separators`, `User Registration & Auth Actions`, `Legal Case Details & Tab Views`, `GeometricBackgroundProps`, `UI Sheets, Panels & Separators`, `Case Intake Multi-Step Form`, `UI Modals & Alert Dialogs`, `Legal Case Details & Tab Views`, `UseCarouselParameters`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `supabaseAdmin` connect `Database Seeding & Test Fixtures` to `User Notification Triggers`, `User Registration & Auth Actions`, `User Notification Triggers`, `Student Workspace & Case Management`, `Admin Management Views`, `Student Workspace & Case Management`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _259 weakly-connected nodes found - possible documentation gaps or missing edges._