"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PanelLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CampanitaNotificaciones } from "@/components/global/CampanitaNotificaciones";
import LogoutButton from "@/components/global/LogoutBtn";

export interface AdminHeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenMobile?: () => void;
}

export function AdminHeader({
  onToggleCollapse,
  onOpenMobile,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Generador de migas de pan semánticas
  const renderBreadcrumbs = () => {
    // Si estamos en inicio
    if (pathname === "/admin" || pathname === "/admin/inicio") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              Inicio
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/todos-los-casos")) {
      const parts = pathname.split("/").filter(Boolean);
      const isDetail = parts.length > 2;
      const caseId = isDetail ? parts[2] : null;

      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isDetail ? (
              <BreadcrumbLink asChild>
                <Link
                  href="/admin/todos-los-casos"
                  className="text-slate-500 hover:text-slate-900"
                >
                  Todos los Casos
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-semibold text-slate-900">
                Todos los Casos
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {isDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">
                  Caso #{caseId}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/llamados")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              Llamados de Atención
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/estudiantes")) {
      const parts = pathname.split("/").filter(Boolean);
      const isDetail = parts.length > 2;

      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isDetail ? (
              <BreadcrumbLink asChild>
                <Link
                  href="/admin/estudiantes"
                  className="text-slate-500 hover:text-slate-900"
                >
                  Estudiantes
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className="font-semibold text-slate-900">
                Estudiantes
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {isDetail && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-slate-900">
                  Detalle
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/asesores")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              Asesores Docentes
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/proapoyo")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              Profesionales de Apoyo
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    if (pathname.startsWith("/admin/analiticas")) {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
                Administración
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-slate-900">
              Analíticas
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      );
    }

    // Ruta genérica
    const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/admin/inicio" className="text-slate-500 hover:text-slate-900">
              Administración
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const href = `/admin/${segments.slice(0, idx + 1).join("/")}`;
          const formatted = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

          return (
            <span key={seg} className="inline-flex items-center gap-1.5 sm:gap-2.5">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-slate-900">
                    {formatted}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href} className="text-slate-500 hover:text-slate-900">
                      {formatted}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Lado izquierdo: Botón Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle para escritorio */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Alternar barra lateral"
            title="Alternar barra lateral"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        {/* Toggle para móvil */}
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir navegación"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="hidden sm:block truncate">
          <Breadcrumb>{renderBreadcrumbs()}</Breadcrumb>
        </div>
      </div>

      {/* Lado derecho: Notificaciones + Cerrar Sesión */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <CampanitaNotificaciones role="admin" />
        <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />
        <LogoutButton />
      </div>
    </header>
  );
}
