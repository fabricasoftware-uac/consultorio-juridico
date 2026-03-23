import { Navbar as GlobalNavbar } from "@/components/global/Navbar";

export function Navbar() {
  const links = [
    { href: "/asesor/inicio", label: "Inicio" },
    { href: "/asesor/mis-casos", label: "Mis Casos" },
    { href: "/asesor/mi-horario", label: "Mi Horario" },
    { href: "/centro-ayuda", label: "Centro de Ayuda" },
  ];

  return (
    <GlobalNavbar roleName="Asesor" basePath="/asesor/inicio" links={links} />
  );
}
