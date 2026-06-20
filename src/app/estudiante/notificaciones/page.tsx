import { Navbar } from "../components/NavBarEstudiante";
import { PaginaNotificaciones } from "@/components/global/PaginaNotificaciones";

export default function NotificacionesEstudiante() {
  return (
    <>
      <Navbar />
      <PaginaNotificaciones role="estudiante" backHref="/estudiante/inicio" />
    </>
  );
}
