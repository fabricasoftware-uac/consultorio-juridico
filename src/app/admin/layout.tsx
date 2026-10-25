import { ReactNode } from "react";
import { AdminLayoutClient } from "./components/AdminLayoutClient";

export const metadata = {
  title: "Panel de Administración - Consultorio Jurídico",
  description: "Módulo administrativo del Consultorio Jurídico de la Universidad Autónoma",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
