import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Salida standalone: genera .next/standalone con un server.js mínimo y
  // solo las dependencias necesarias. Requerido para una imagen Docker liviana.
  output: "standalone",
};

export default nextConfig;
