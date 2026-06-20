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

export function useNotificaciones() {
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);

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

  // Conteo inicial + Realtime
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setup() {
      cargarConteo();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      userIdRef.current = user.id;

      channel = supabase
        .channel(`notif-${user.id}`)
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
            // Si el dropdown está abierto, actualiza la lista también
            setNotificaciones((prev) => prev.length > 0 ? prev : prev);
          },
        )
        .subscribe();
    }

    setup();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [cargarConteo]);

  return { noLeidas, notificaciones, loading, cargarLista, marcarLeida, marcarTodasLeidas };
}
