"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/supabase-client";

export function useRealtimeCaso(idCaso: string, onRefresh: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel(`caso-detail-${idCaso}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "casos",
          filter: `id_caso=eq.${idCaso}`,
        },
        () => onRefresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "estudiantes_casos",
          filter: `id_caso=eq.${idCaso}`,
        },
        () => onRefresh(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asesores_casos",
          filter: `id_caso=eq.${idCaso}`,
        },
        () => onRefresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [idCaso, onRefresh]);
}
