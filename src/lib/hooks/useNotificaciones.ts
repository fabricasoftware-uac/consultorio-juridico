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

function playChime() {
  if (typeof window === "undefined" || document.visibilityState !== "visible") return;
  try {
    const ctx = new AudioContext();
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
    setTimeout(() => ctx.close(), 500);
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
