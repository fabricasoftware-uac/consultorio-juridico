"use client";

import { useState, useEffect } from "react";
import { Accessibility, X, Type, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

type FontSize = "normal" | "grande" | "extra";

function getPrefs() {
  if (typeof window === "undefined") return { fontSize: "normal" as FontSize, contrast: false };
  return {
    fontSize: (localStorage.getItem("a11y-font") as FontSize) || "normal",
    contrast: localStorage.getItem("a11y-contrast") === "true",
  };
}

function applyPrefs({ fontSize, contrast }: { fontSize: FontSize; contrast: boolean }) {
  const root = document.documentElement;
  root.classList.remove("text-base", "text-lg", "text-xl", "a11y-contrast");
  if (fontSize === "grande") root.classList.add("text-lg");
  if (fontSize === "extra") root.classList.add("text-xl");
  if (contrast) root.classList.add("a11y-contrast");
}

export function BotonAccesibilidad() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const prefs = getPrefs();
    setFontSize(prefs.fontSize);
    setContrast(prefs.contrast);
    applyPrefs(prefs);
  }, []);

  const updateFont = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem("a11y-font", size);
    applyPrefs({ fontSize: size, contrast });
  };

  const toggleContrast = () => {
    const next = !contrast;
    setContrast(next);
    localStorage.setItem("a11y-contrast", String(next));
    applyPrefs({ fontSize, contrast: next });
  };

  // Inject CSS for high contrast
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "a11y-styles";
    style.textContent = `
      .a11y-contrast body { background: #000 !important; color: #fff !important; }
      .a11y-contrast .bg-white, .a11y-contrast .bg-slate-50, .a11y-contrast .bg-slate-100 { background: #111 !important; }
      .a11y-contrast .text-slate-500, .a11y-contrast .text-slate-400, .a11y-contrast .text-slate-600 { color: #ccc !important; }
      .a11y-contrast .text-slate-700, .a11y-contrast .text-slate-800, .a11y-contrast .text-slate-900 { color: #fff !important; }
      .a11y-contrast .border, .a11y-contrast .border-slate-100, .a11y-contrast .border-slate-200 { border-color: #333 !important; }
    `;
    if (!document.getElementById("a11y-styles")) document.head.appendChild(style);
    return () => { const s = document.getElementById("a11y-styles"); if (s) s.remove(); };
  }, []);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer"
        aria-label="Accesibilidad"
      >
        {open ? <X className="w-5 h-5" /> : <Accessibility className="w-5 h-5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-64 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Accessibility className="w-4 h-4 text-blue-600" />
            Accesibilidad
          </p>

          {/* Tamaño de fuente */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" /> Tamaño de letra
            </p>
            <div className="flex gap-1">
              {(["normal", "grande", "extra"] as FontSize[]).map((s) => (
                <Button
                  key={s}
                  variant={fontSize === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFont(s)}
                  className={`text-xs h-7 flex-1 ${fontSize === s ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                >
                  {s === "normal" ? "A" : s === "grande" ? "A+" : "A++"}
                </Button>
              ))}
            </div>
          </div>

          {/* Alto contraste */}
          <div>
            <Button
              variant={contrast ? "default" : "outline"}
              size="sm"
              onClick={toggleContrast}
              className={`text-xs w-full h-7 ${contrast ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            >
              <SunMoon className="w-3.5 h-3.5 mr-1" />
              {contrast ? "Contraste: Activado" : "Alto contraste"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
