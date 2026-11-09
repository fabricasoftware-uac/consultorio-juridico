import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/sonner";

import { BotonAccesibilidad } from "@/components/global/BotonAccesibilidad";
import IdleTimerProvider from "@/components/global/IdleTimerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const museoSans = localFont({
  src: [
    {
      path: "./fuentes/museo-300.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fuentes/museo-500.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fuentes/museo-700.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fuentes/museo-900.woff",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-museo-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Consultorio Juridico UAC",
  description: "Consultorio Juridico UAC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${museoSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <IdleTimerProvider />
        {children}
        <Footer />
        <Toaster />
        <BotonAccesibilidad />
      </body>
    </html>
  );
}
