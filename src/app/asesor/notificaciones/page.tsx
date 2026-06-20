import { Navbar } from "../components/NavBarAsesor";
import { PaginaNotificaciones } from "@/components/global/PaginaNotificaciones";

export default function NotificacionesAsesor() {
  return (
    <>
      <Navbar />
      <PaginaNotificaciones role="asesor" backHref="/asesor/inicio" />
    </>
  );
}
