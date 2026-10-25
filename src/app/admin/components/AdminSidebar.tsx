"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  AlertTriangle,
  GraduationCap,
  Users,
  UserCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/global/LogoUac";
import { supabase } from "@/lib/supabase/supabase-client";
import { cn } from "@/components/ui/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  onNavigate,
  isMobile = false,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [llamadosActivos, setLlamadosActivos] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function cargarLlamadosActivos() {
      try {
        const { count, error } = await supabase
          .from("llamados_atencion")
          .select("id", { count: "exact", head: true })
          .eq("resuelto", false);
        if (!error && count !== null && isMounted) {
          setLlamadosActivos(count);
        }
      } catch {
        // Silencioso
      }
    }

    cargarLlamadosActivos();
    const interval = setInterval(cargarLlamadosActivos, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin/inicio") {
      return pathname === "/admin/inicio" || pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const sections = [
    {
      title: "OPERACIONES Y CASOS",
      items: [
        {
          label: "Inicio",
          href: "/admin/inicio",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          label: "Todos los Casos",
          href: "/admin/todos-los-casos",
          icon: FolderOpen,
          badge: null,
        },
        {
          label: "Llamados de Atención",
          href: "/admin/llamados",
          icon: AlertTriangle,
          badge: llamadosActivos && llamadosActivos > 0 ? llamadosActivos : null,
        },
      ],
    },
    {
      title: "DIRECTORIO & USUARIOS",
      items: [
        {
          label: "Estudiantes",
          href: "/admin/estudiantes",
          icon: GraduationCap,
          badge: null,
        },
        {
          label: "Asesores Docentes",
          href: "/admin/asesores",
          icon: Users,
          badge: null,
        },
        {
          label: "Profesionales de Apoyo",
          href: "/admin/proapoyo",
          icon: UserCheck,
          badge: null,
        },
      ],
    },
    {
      title: "INFORMES",
      items: [
        {
          label: "Analíticas",
          href: "/admin/analiticas",
          icon: BarChart3,
          badge: null,
        },
      ],
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col h-full bg-white text-slate-800 select-none">
        {/* Cabecera Sidebar */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-slate-200/80 px-4 shrink-0 transition-all duration-200",
            collapsed ? "justify-center px-2" : "justify-between"
          )}
        >
          <Link
            href="/admin/inicio"
            onClick={onNavigate}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <Logo className="h-9 w-9 shrink-0 rounded-xl group-hover:scale-105 transition-transform" />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm tracking-tight truncate">
                    Consultorio
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200/70 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium truncate">
                  Panel Jurídico
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Lista de Navegación */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {sections.map((section, sIdx) => (
            <div key={section.title} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {section.title}
                </div>
              ) : (
                sIdx > 0 && <div className="my-3 border-t border-slate-100" />
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  if (collapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                              "relative flex items-center justify-center h-10 w-10 mx-auto rounded-xl transition-all duration-150",
                              active
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.badge !== null && (
                              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-white"></span>
                              </span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium text-xs">
                          <p>{item.label}</p>
                          {item.badge !== null && (
                            <p className="text-[10px] text-amber-300 font-normal">
                              {item.badge} llamado{item.badge !== 1 ? "s" : ""} pendiente{item.badge !== 1 ? "s" : ""}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative",
                        active
                          ? "bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-600 rounded-r-none shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          active
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                      {item.badge !== null && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pie con Estado y Control Colapsar */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 mt-auto shrink-0">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-default">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Sistema Activo (En línea)</TooltipContent>
              </Tooltip>
              {!isMobile && onToggleCollapse && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onToggleCollapse}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                      aria-label="Expandir menú"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expandir menú</TooltipContent>
                </Tooltip>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-700">
                    Sistema activo
                  </span>
                  <span className="text-[10px] text-slate-400">En línea</span>
                </div>
              </div>
              {!isMobile && onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  title="Colapsar menú lateral"
                  aria-label="Colapsar menú lateral"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
