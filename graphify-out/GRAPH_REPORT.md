# Graph Report - consultorio-juridico  (2026-08-17)

## Corpus Check
- 260 files · ~159,857 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1395 nodes · 3219 edges · 192 communities (113 shown, 79 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.87)
- Token cost: 170,476 input · 0 output

## Community Hubs (Navigation)
- Case Detail Pages
- Role Navbars & Landing
- Sidebar & Sheet Primitives
- Admin User Management
- API Routes & Cron Jobs
- Docker Deployment Stack
- Case Info Panels
- Case List Views
- Team Reassignment Dialogs
- Package Manifest & Scripts
- TypeScript Config
- Auth Screens & Dashboards
- Case Documents Upload
- Root Layout & Branding
- 8-Step Interview Wizard
- Misc UI Primitives
- Schema Dump Triggers
- Core Schema Tables
- shadcn Component Config
- Searchable Selector
- Menubar Primitive
- Initial Tables Migration
- Alert Dialog & Logout
- Context Menu Primitive
- Carousel Primitive
- RBAC Auth Documentation
- Runtime Dependencies
- User Notifications Migration
- Dump Schema Case Tables
- Form Primitive
- Chart Primitive
- Drawer Primitive
- Assignment Notifications Migration
- Analytics Dashboard
- Navigation Menu Primitive
- Analytics & Export Docs
- Audit & Notification Docs
- Pro-Apoyo Case Creation
- OTP Input & Skeleton
- Documents Flow Docs
- Dump Schema Profiles
- Breadcrumb Primitive
- Middleware RBAC
- Dump Schema Functions
- Authorization Policies Migration
- Project Stack Notes
- Unified Form Docs
- Business Days & Cron Docs
- Business Days Migration
- Last Modified Migration
- Case Lifecycle Docs
- Roles & Interview Docs
- Institutional Brand Assets
- Early Alerts Migration
- Llamados States Fix
- Llamados Unique Fix
- Document Notification Migration
- Activity Notification Migration
- Nullify Deadlines Migration
- Closed Case Documents Migration
- Storage Migration Script
- Schedules Editor & Query
- Unified Form Migration
- Audit FK Fix
- Audit Profile Fix
- Interview Profiles FK Fix
- Auth Confirm Route
- Save Interview RPC
- Last Modified Default
- Interview Enum Fix
- Interview Enums Fix
- Realtime Hooks Docs
- Storage Delete Protection
- Audit Table Migration
- Case Documents Migration
- CVA Dependency
- cmdk Dependency
- dotenv Dependency
- Embla Carousel Dependency
- Hookform Resolvers Dependency
- input-otp Dependency
- jwt-decode Dependency
- lucide-react Dependency
- Next Config
- next-themes Dependency
- ExcelJS Dependency
- Radix Accordion Dependency
- Radix Alert Dialog Dependency
- Radix Aspect Ratio Dependency
- Radix Checkbox Dependency
- Radix Collapsible Dependency
- Radix Context Menu Dependency
- Radix Dropdown Menu Dependency
- Radix Hover Card Dependency
- Radix Menubar Dependency
- Radix Navigation Menu Dependency
- Radix Popover Dependency
- Radix Progress Dependency
- Radix Radio Group Dependency
- Radix Scroll Area Dependency
- Radix Select Dependency
- Radix Separator Dependency
- Radix Slot Dependency
- Radix Switch Dependency
- Radix Tabs Dependency
- Radix Toggle Dependency
- Radix Toggle Group Dependency
- Radix Tooltip Dependency
- React Dependency
- React Day Picker Dependency
- React DOM Dependency
- React Hook Form Dependency
- React Resizable Panels Dependency
- Recharts Dependency
- Sonner Dependency
- Supabase SSR Dependency
- Supabase JS Dependency
- tailwind-merge Dependency
- Vaul Dependency
- Zod Dependency
- PostCSS Config
- Audit Profiles FK
- Audit Notify Trigger
- Case Update Timestamp Trigger
- Case Insert Timestamp Trigger
- Activity Notify Trigger
- Advisor Assignment Notify Trigger
- Document Notify Trigger
- Student Assignment Notify Trigger
- Profiles Roles FK Migration
- Path Aliases Note
- Documentos Caso Table
- Asesores Table
- Profiles Roles Policy
- Usuarios Table Reference
- Role Permissions Reference
- Perfiles Activo Reference
- Casos Update Reference
- Estudiantes Update Reference
- Casos States Reference
- Usuarios Characterization Reference
- Llamados Resolution Reference
- Documentos Permissions Reference
- Casos Period Reference
- Unified Form Documents Reference
- Unified Form Usuarios Reference
- Remote Schema Casos Reference
- Last Modified Casos Reference
- Last Modified Default Reference

## God Nodes (most connected - your core abstractions)
1. `cn()` - 232 edges
2. `Button()` - 55 edges
3. `supabase` - 53 edges
4. `Card()` - 41 edges
5. `Caso` - 28 edges
6. `Input()` - 28 edges
7. `Label()` - 28 edges
8. `Badge()` - 24 edges
9. `SelectTrigger()` - 22 edges
10. `SelectContent()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Recordatorio de documentos faltantes (RPC recordar_documentos_caso)` --shares_data_with--> `Tabla notificaciones_usuario`  [INFERRED]
  README.md → docs/ai-contexto.md
- `Modificación de Datos de Identidad Maestros` --semantically_similar_to--> `Migración de Datos desde Supabase Cloud`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `Centro de Ayuda` --semantically_similar_to--> `Tabla de Troubleshooting del Despliegue`  [INFERRED] [semantically similar]
  MANUAL_USUARIO.md → docs/despliegue-docker.md
- `pnpm allowBuilds / onlyBuiltDependencies` --conceptually_related_to--> `Servicio Docker web (Next.js)`  [AMBIGUOUS]
  pnpm-workspace.yaml → deploy/docker-compose.yml
- `fetchAsesores()` --calls--> `getAsesores()`  [EXTRACTED]
  src/app/admin/asesores/page.tsx → supabase/queries/getAsesores.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Flujo de autorizacion RBAC de extremo a extremo** — docs_ai_contexto_custom_access_token_hook, docs_ai_contexto_perfiles_roles, docs_ai_contexto_role_permissions, docs_ai_contexto_authorize, docs_ai_contexto_estaasignado, docs_ai_contexto_politicas_rls, agents_rbac_middleware [EXTRACTED 1.00]
- **Flujo de llamados de atencion por vencimiento de plazos** — docs_ai_contexto_api_cron_check_plazos, docs_ai_contexto_generar_llamados_atencion, docs_ai_contexto_sumar_dias_habiles, docs_ai_contexto_llamados_atencion, docs_ai_contexto_migracion_dias_habiles, readme_llamados_atencion [EXTRACTED 1.00]
- **Pipeline de notificaciones internas y por email** — docs_ai_contexto_trg_auditoria_notificar, docs_ai_contexto_notificar_usuarios_caso, docs_ai_contexto_notificaciones_usuario, docs_ai_contexto_enqueue_assignment_notification, docs_ai_contexto_notificaciones_pendientes, docs_ai_contexto_pop_notificaciones_pendientes, docs_ai_contexto_api_cron_enviar_notificaciones [EXTRACTED 1.00]
- **Flujo de aprobación de un caso entre roles** — manual_usuario_rol_estudiante, manual_usuario_entrevista_8_pasos, manual_usuario_estado_pendiente_de_aprobacion, manual_usuario_rol_asesor_docente, manual_usuario_aprobacion_de_casos [EXTRACTED 1.00]
- **Stack Docker self-hosted (app + Supabase + red compartida)** — deploy_docker_compose_service_web, deploy_docker_compose_service_caddy, deploy_docker_compose_red_supabase_default, deploy_supabase_docker_compose_override_service_db, deploy_supabase_docker_compose_override_service_auth, deploy_supabase_docker_compose_override_service_storage [EXTRACTED 1.00]
- **Cadena de autorización JWT → user_role → RLS** — docs_despliegue_docker_generacion_de_secretos, deploy_supabase_docker_compose_override_service_auth, docs_despliegue_docker_custom_access_token_hook, docs_despliegue_docker_migraciones_supabase_db_push, docs_despliegue_docker_verificacion_end_to_end [INFERRED 0.85]
- **Dual-Surface University Branding Asset Set** — public_autonoma_logo, public_logo_uniautonoma_blanco_logo, public_autonoma_griffin_emblem, public_autonoma_institutional_brand_identity [INFERRED 0.85]

## Communities (192 total, 79 thin omitted)

### Community 0 - "Case Detail Pages"
Cohesion: 0.05
Nodes (88): dynamic, Page(), traerDatos(), dynamic, Page(), traerDatos(), StepProps, UserRegistrationForm() (+80 more)

### Community 1 - "Role Navbars & Landing"
Cohesion: 0.05
Nodes (39): Navbar(), MiHorarioPage(), Navbars, RolIcons, RolLabels, Navbar(), GeometricBackground(), GeometricBackgroundProps (+31 more)

### Community 2 - "Sidebar & Sheet Primitives"
Cohesion: 0.07
Nodes (48): Avatar(), AvatarFallback(), AvatarImage(), PaginationEllipsis(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+40 more)

### Community 3 - "Admin User Management"
Cohesion: 0.09
Nodes (40): ActionResult, generateTempPassword(), registerAsesor(), RegisterAsesorInput, registerEstudiante(), RegisterEstudianteInput, registerProApoyo(), RegisterProApoyoInput (+32 more)

### Community 4 - "API Routes & Cron Jobs"
Cohesion: 0.06
Nodes (22): agruparConteo(), agruparEnfoque(), agruparPorMes(), agruparRangosEdad(), GET(), buildEmailHtml(), handleRetry(), markFailed() (+14 more)

### Community 5 - "Docker Deployment Stack"
Cohesion: 0.07
Nodes (45): Build args NEXT_PUBLIC_* del servicio web, Red externa supabase_default compartida, Servicio Docker caddy, Servicio Docker web (Next.js), Override del servicio auth (GoTrue hook), Override del servicio db (supabase/postgres 17), Override del servicio storage (FILE_SIZE_LIMIT 50 MiB), Arquitectura de Despliegue (Caddy + web + Supabase self-hosted) (+37 more)

### Community 6 - "Case Info Panels"
Cohesion: 0.14
Nodes (29): RegistroUsuarioProps, AdvisorInfo(), AdvisorInfoProps, AREA_OPTIONS, CaseFiltersProps, CLASS_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS (+21 more)

### Community 7 - "Case List Views"
Cohesion: 0.17
Nodes (23): Page(), TodosLosCasosPage(), Asesor(), dynamic, MisCasosClient(), dynamic, SupportCasesPage(), dynamic (+15 more)

### Community 8 - "Team Reassignment Dialogs"
Cohesion: 0.17
Nodes (24): AdminReasignarEquipo(), Props, AsignacionCaso(), ResumenCaso(), Props, ReasignarEquipo(), Asesor, Estudiante (+16 more)

### Community 9 - "Package Manifest & Scripts"
Cohesion: 0.05
Nodes (36): devDependencies, pg, postgres, @snaplet/copycat, @snaplet/seed, supabase, tailwindcss, @tailwindcss/postcss (+28 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.05
Nodes (36): components/*, dom, dom.iterable, esnext, lib/*, next-env.d.ts, .next/types/**/*.ts, node_modules (+28 more)

### Community 11 - "Auth Screens & Dashboards"
Cohesion: 0.17
Nodes (16): DashboardMetrics(), AdminPanelPage(), LlamadoPendiente, CustomJwtPayload, Alert(), AlertDescription(), AlertTitle(), alertVariants (+8 more)

### Community 12 - "Case Documents Upload"
Cohesion: 0.11
Nodes (21): ALLOWED_TYPES, api(), Documento, DocumentosCaso(), formatSize(), getFreshSignedUrl(), getIcon(), ICON_MIME (+13 more)

### Community 13 - "Root Layout & Branding"
Cohesion: 0.11
Nodes (15): geistMono, geistSans, metadata, applyPrefs(), BotonAccesibilidad(), FontSize, getPrefs(), Footer() (+7 more)

### Community 14 - "8-Step Interview Wizard"
Cohesion: 0.20
Nodes (15): Step1InfoEntrevista(), Step2InfoSolicitante(), Step3QuienSolicita(), Step4InfoLaboral(), Step5DatosAccionado(), Step6InfoContrato(), Step7DetallesCaso(), Step8Firmas() (+7 more)

### Community 15 - "Misc UI Primitives"
Cohesion: 0.11
Nodes (11): HoverCardContent(), ResizableHandle(), ResizablePanelGroup(), ScrollArea(), ScrollBar(), Slider(), ToggleGroup(), ToggleGroupContext (+3 more)

### Community 16 - "Schema Dump Triggers"
Cohesion: 0.10
Nodes (8): "public"."authorize"(), public.role_permissions, "public"."set_ultima_modificacion_from_audit", "public"."trg_asesores_casos_notify", "public"."trg_asignacion_estudiante_notificar", "trg_asesores_casos_notify", "trg_asignacion_estudiante_notificar", "trg_audit_update_ultima_modificacion"

### Community 17 - "Core Schema Tables"
Cohesion: 0.22
Nodes (18): "public"."asesores", "public"."asesores_casos", "public"."auditoria_casos", "public"."authorize"(), "public"."casos", "public"."contratos_laborales", "public"."custom_access_token_hook"(), "public"."demandados" (+10 more)

### Community 18 - "shadcn Component Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 19 - "Searchable Selector"
Cohesion: 0.17
Nodes (13): SearchableSelector(), SearchableSelectorProps, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+5 more)

### Community 20 - "Menubar Primitive"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 21 - "Initial Tables Migration"
Cohesion: 0.20
Nodes (14): auth, public.handle_new_user, asesores, asesores_casos, casos, contratos_laborales, demandados, estudiantes (+6 more)

### Community 22 - "Alert Dialog & Logout"
Cohesion: 0.23
Nodes (12): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+4 more)

### Community 23 - "Context Menu Primitive"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 24 - "Carousel Primitive"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 25 - "RBAC Auth Documentation"
Cohesion: 0.18
Nodes (13): Custom access token hook (pg-function), RBAC por prefijo de ruta en src/middleware.ts, Tabla asesores, authorize(requested_permission), custom_access_token_hook(event jsonb), Tabla estudiantes, Flujo de autenticacion (registro -> JWT -> middleware), handle_new_user() trigger (+5 more)

### Community 26 - "Runtime Dependencies"
Cohesion: 0.15
Nodes (13): clsx, next, dependencies, clsx, next, @radix-ui/react-avatar, @radix-ui/react-dialog, @radix-ui/react-label (+5 more)

### Community 27 - "User Notifications Migration"
Cohesion: 0.15
Nodes (9): public.notificaciones_usuario, public.notificar_usuarios_caso(), public.asesores_casos, public.casos, public.estudiantes_casos, public.trg_asignacion_asesor_notificar, public.trg_asignacion_estudiante_notificar, trg_asignacion_asesor_notificar (+1 more)

### Community 28 - "Dump Schema Case Tables"
Cohesion: 0.20
Nodes (12): public.notificaciones_pendientes, "public"."actividades_caso", "public"."caso_admite_documentos"(), "public"."casos", "public"."contratos_laborales", "public"."demandados", "public"."documentos_caso", "public"."generar_llamados_atencion"() (+4 more)

### Community 29 - "Form Primitive"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 30 - "Chart Primitive"
Cohesion: 0.25
Nodes (9): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), getPayloadConfigFromPayload(), THEMES (+1 more)

### Community 31 - "Drawer Primitive"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 32 - "Assignment Notifications Migration"
Cohesion: 0.20
Nodes (7): public.notificaciones_pendientes, public.pop_notificaciones_pendientes(), public.casos, public.trg_asesores_casos_notify, public.trg_estudiantes_casos_notify, trg_asesores_casos_notify, trg_estudiantes_casos_notify

### Community 33 - "Analytics Dashboard"
Cohesion: 0.22
Nodes (6): AnaliticasPage(), axisStyle, fetchData(), gridStyle, PALETTE, radius

### Community 34 - "Navigation Menu Primitive"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 35 - "Analytics & Export Docs"
Cohesion: 0.31
Nodes (9): API Route /api/admin/analiticas, API Route /api/admin/exportar (ExcelJS), Tabla asesores_casos, Tabla casos (tabla central), Tabla demandados, estaAsignado(uid, caso_id), Tabla estudiantes_casos, Analiticas y exportacion Excel (+1 more)

### Community 36 - "Audit & Notification Docs"
Cohesion: 0.28
Nodes (9): Tabla auditoria_casos, enqueue_assignment_notification(...), Tabla llamados_atencion, Tabla notificaciones_pendientes (cola de emails), Tabla notificaciones_usuario, notificar_usuarios_caso(...), trg_auditoria_notificar() trigger, Auditoria de casos (+1 more)

### Community 37 - "Pro-Apoyo Case Creation"
Cohesion: 0.28
Nodes (5): Navbar(), RegistroUsuario(), StepIndicator(), StepIndicatorProps, steps

### Community 38 - "OTP Input & Skeleton"
Cohesion: 0.22
Nodes (4): InputOTP(), InputOTPGroup(), InputOTPSlot(), Skeleton()

### Community 39 - "Documents Flow Docs"
Cohesion: 0.29
Nodes (8): API Route /api/documentos, Tabla documentos_caso, Limites conocidos del sistema, Politicas RLS de storage.objects (bucket documentos-casos), Documentos con flujo de aprobacion, Recordatorio de documentos faltantes (RPC recordar_documentos_caso), Rol asesor (/asesor/*), Subida directa al Storage para evadir el limite de Vercel

### Community 40 - "Dump Schema Profiles"
Cohesion: 0.29
Nodes (8): "public"."horarios", "public"."asesores", "public"."auditoria_casos", "public"."custom_access_token_hook"(), "auth"."users", "public"."estudiantes", public.perfiles, public.perfiles_roles

### Community 41 - "Breadcrumb Primitive"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 42 - "Middleware RBAC"
Cohesion: 0.36
Nodes (6): decodeJwtPayload(), ROLE_HOME, ROLE_ROUTES, updateSession(), config, middleware()

### Community 43 - "Dump Schema Functions"
Cohesion: 0.36
Nodes (8): "public"."asesores_casos", "public"."estaasignado"(), "public"."notificar_usuarios_caso"(), "public"."recordar_documentos_caso"(), "public"."sumar_dias_habiles"(), "public"."trg_auditoria_notificar"(), public.estudiantes_casos, public.notificaciones_usuario

### Community 44 - "Authorization Policies Migration"
Cohesion: 0.25
Nodes (7): public.authorize(), public.custom_access_token_hook(), public.estaAsignado(), public.asesores_casos, public.estudiantes_casos, public.perfiles_roles, public.role_permissions

### Community 45 - "Project Stack Notes"
Cohesion: 0.33
Nodes (7): cleanData() — strings vacios a null, Consultas tipadas en supabase/queries/, scripts/seed.ts (Snaplet Seed, 4 usuarios de prueba), Setup local con Supabase en Docker, Stack Next.js 15 + Supabase + Tailwind v4, Cuatro clientes Supabase (browser/server/admin/middleware), Convencion de flujo de datos por cliente Supabase

### Community 46 - "Unified Form Docs"
Cohesion: 0.29
Nodes (7): Tabla actividades_caso, 22 campos sociodemograficos del solicitante, Tabla contratos_laborales, Tabla horarios, Migracion 20260423000000 — formulario unificado, Tabla usuarios (solicitantes), Observaciones (chat interno estudiante-asesor)

### Community 47 - "Business Days & Cron Docs"
Cohesion: 0.33
Nodes (7): API Route /api/cron/check-plazos, API Route /api/cron/enviar-notificaciones, generar_llamados_atencion(), Migracion 20260711000000 — dias habiles, pop_notificaciones_pendientes(p_limit), sumar_dias_habiles(start_date, num_days), sumarDiasHabiles() (version TypeScript en src/lib/utils.ts)

### Community 48 - "Business Days Migration"
Cohesion: 0.29
Nodes (5): public.sumar_dias_habiles(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 49 - "Last Modified Migration"
Cohesion: 0.29
Nodes (4): public.set_ultima_modificacion_direct, public.set_ultima_modificacion_from_audit, trg_audit_update_ultima_modificacion, trg_casos_update_ultima_modificacion

### Community 50 - "Case Lifecycle Docs"
Cohesion: 0.33
Nodes (6): estado_enum (maquina de estados del caso), Maquina de estados y reglas de transicion, Migracion 20260427000000 — aprobado a activo, Ciclo de vida del caso, Consultorio Juridico UAC — sistema de gestion de casos, Llamados de atencion (business-day-aware)

### Community 51 - "Roles & Interview Docs"
Cohesion: 0.33
Nodes (6): Wizard de entrevista de 8 pasos con borrador en localStorage, Entrevista de 8 pasos (wizard), Autorizacion en tres capas (middleware, RLS, token hook), Reasignacion de equipo asignado, Rol estudiante (/estudiante/*), Rol pro_apoyo (/pro-apoyo/*)

### Community 52 - "Institutional Brand Assets"
Cohesion: 0.53
Nodes (6): Griffin Emblem (Institutional Heraldic Mark), Institutional Brand Identity Asset Set, Uniautonoma del Cauca Logo (Navy), Vigilado Mineducacion Compliance Mark, Uniautonoma del Cauca Logo (White Knockout Variant), Raster-in-SVG Wrapper Pattern

### Community 53 - "Early Alerts Migration"
Cohesion: 0.47
Nodes (5): public.generar_llamados_atencion(), public.llamados_atencion, public.asesores_casos, public.casos, public.estudiantes_casos

### Community 54 - "Llamados States Fix"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 55 - "Llamados Unique Fix"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 56 - "Document Notification Migration"
Cohesion: 0.33
Nodes (5): public.trg_documento_notificar(), public.asesores_casos, public.estudiantes_casos, public.trg_documento_notificar, trg_documento_notificar

### Community 57 - "Activity Notification Migration"
Cohesion: 0.33
Nodes (5): public.trg_actividad_notificar(), public.asesores_casos, public.estudiantes_casos, public.trg_actividad_notificar, trg_actividad_notificar

### Community 58 - "Nullify Deadlines Migration"
Cohesion: 0.33
Nodes (5): public.generar_llamados_atencion(), public.asesores_casos, public.casos, public.estudiantes_casos, public.llamados_atencion

### Community 59 - "Closed Case Documents Migration"
Cohesion: 0.33
Nodes (5): public.caso_admite_documentos(), public.recordar_documentos_caso(), public.casos, public.estudiantes_casos, public.notificaciones_usuario

### Community 60 - "Storage Migration Script"
Cohesion: 0.50
Nodes (4): dst, listAll(), main(), src

### Community 61 - "Schedules Editor & Query"
Cohesion: 0.50
Nodes (4): HorariosEditor(), getHorarios(), Horario, saveHorarios()

### Community 62 - "Unified Form Migration"
Cohesion: 0.40
Nodes (4): public.actividades_caso, public.horarios, public.casos, public.perfiles

### Community 63 - "Audit FK Fix"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.demandados

### Community 64 - "Audit Profile Fix"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.perfiles

### Community 65 - "Interview Profiles FK Fix"
Cohesion: 0.40
Nodes (4): public.guardar_entrevista(), public.casos, public.contratos_laborales, public.perfiles

### Community 68 - "Save Interview RPC"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 70 - "Interview Enum Fix"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 71 - "Interview Enums Fix"
Cohesion: 0.50
Nodes (3): public.guardar_entrevista(), public.contratos_laborales, public.demandados

### Community 72 - "Realtime Hooks Docs"
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
- **247 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+242 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **79 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Observaciones (chat interno estudiante-asesor)` and `Tabla actividades_caso`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Servicio Docker web (Next.js)` and `pnpm allowBuilds / onlyBuiltDependencies`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Vigilado Mineducacion Compliance Mark` and `Uniautonoma del Cauca Logo (White Knockout Variant)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `Sidebar & Sheet Primitives` to `Case Detail Pages`, `Role Navbars & Landing`, `Admin User Management`, `Case Info Panels`, `Case List Views`, `Team Reassignment Dialogs`, `Auth Screens & Dashboards`, `Case Documents Upload`, `8-Step Interview Wizard`, `Misc UI Primitives`, `Searchable Selector`, `Menubar Primitive`, `Alert Dialog & Logout`, `Context Menu Primitive`, `Carousel Primitive`, `Form Primitive`, `Chart Primitive`, `Drawer Primitive`, `Navigation Menu Primitive`, `OTP Input & Skeleton`, `Breadcrumb Primitive`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `Button()` connect `Auth Screens & Dashboards` to `Case Detail Pages`, `Analytics Dashboard`, `Role Navbars & Landing`, `Admin User Management`, `Sidebar & Sheet Primitives`, `Pro-Apoyo Case Creation`, `Case Info Panels`, `Case List Views`, `Team Reassignment Dialogs`, `Case Documents Upload`, `Root Layout & Branding`, `8-Step Interview Wizard`, `Searchable Selector`, `Alert Dialog & Logout`, `Carousel Primitive`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `supabaseAdmin` connect `API Routes & Cron Jobs` to `Admin User Management`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _247 weakly-connected nodes found - possible documentation gaps or missing edges._