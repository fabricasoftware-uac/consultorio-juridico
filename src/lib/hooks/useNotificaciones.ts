"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase/supabase-client";

export type Notificacion = {
  id: number;
  id_caso: number | null;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
};

async function api(path: string, options?: RequestInit) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return null;
    const res = await fetch(path, {
      ...options,
      headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json", ...options?.headers },
    });
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Un único AudioContext para toda la sesión.
 *
 * Los navegadores lo crean en estado "suspended" hasta que el usuario
 * interactúa con la página (política de autoplay). Crear uno nuevo por cada
 * sonido no solo desperdicia recursos: en iOS hay un tope de contextos
 * simultáneos y a partir de cierto punto simplemente dejan de sonar.
 */
let audioCtx: AudioContext | null = null;
let gestoRegistrado = false;

function obtenerAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) {
    try {
      audioCtx = new AC();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/**
 * Desbloquea el audio en el primer gesto del usuario. Sin esto, la primera
 * notificación tras cargar la página no suena y el fallo es silencioso.
 */
export function habilitarAudioNotificaciones() {
  if (gestoRegistrado || typeof window === "undefined") return;
  gestoRegistrado = true;

  const desbloquear = () => {
    const ctx = obtenerAudioContext();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  };

  // `once` no sirve: si el resume falla en el primer gesto conviene reintentar,
  // así que se limpian los listeners solo cuando el contexto quedó activo.
  const manejar = () => {
    desbloquear();
    if (audioCtx?.state === "running") {
      window.removeEventListener("pointerdown", manejar);
      window.removeEventListener("keydown", manejar);
      window.removeEventListener("touchstart", manejar);
    }
  };

  window.addEventListener("pointerdown", manejar);
  window.addEventListener("keydown", manejar);
  window.addEventListener("touchstart", manejar);
}

function playChime() {
  if (typeof window === "undefined" || document.visibilityState !== "visible") return;
  try {
    const ctx = obtenerAudioContext();
    if (!ctx) return;
    // Si el navegador aún no lo desbloqueó, se intenta aquí; puede llegar tarde
    // para este sonido pero deja el contexto listo para el siguiente.
    if (ctx.state === "suspended") {
      void ctx.resume();
      return;
    }
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = "sine";   osc1.frequency.value = 800;
    osc2.type = "sine";   osc2.frequency.value = 1000;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc1.connect(gain);   osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start(ctx.currentTime);           osc1.stop(ctx.currentTime + 0.15);
    osc2.start(ctx.currentTime + 0.12);     osc2.stop(ctx.currentTime + 0.35);
    // No se cierra: el contexto es compartido y cerrarlo dejaría mudas todas
    // las notificaciones siguientes. Los osciladores se liberan solos al parar.
  } catch { /* silencioso si el navegador bloquea AudioContext */ }
}

export function useNotificaciones() {
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("notif-muted") === "true";
  });
  const mutedRef = useRef(muted);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Deja el audio listo desde el primer clic o tecla del usuario.
  useEffect(() => { habilitarAudioNotificaciones(); }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem("notif-muted", String(next));
      return next;
    });
  }, []);

  const cargarConteo = useCallback(async () => {
    const data = await api("/api/notificaciones?solo=conteo");
    if (data) setNoLeidas(data.no_leidas ?? 0);
  }, []);

  const cargarLista = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/notificaciones");
      if (data) setNotificaciones(data.notificaciones ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarLeida = useCallback(async (id: number) => {
    await api("/api/notificaciones", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    });
    setNoLeidas((n) => Math.max(0, n - 1));
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n)),
    );
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    await api("/api/notificaciones", {
      method: "PATCH",
      body: JSON.stringify({ todas: true }),
    });
    setNoLeidas(0);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setup() {
      cargarConteo();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userIdRef.current = user.id;

      channel = supabase
        .channel(`notif-${user.id}-${Math.random().toString(36).slice(2, 8)}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notificaciones_usuario",
            filter: `id_usuario=eq.${user.id}`,
          },
          () => {
            cargarConteo();
            cargarLista();
            if (!mutedRef.current) playChime();
          },
        )
        .subscribe();
    }

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [cargarConteo, cargarLista]);

  return { noLeidas, notificaciones, loading, muted, toggleMute, cargarLista, marcarLeida, marcarTodasLeidas };
}
