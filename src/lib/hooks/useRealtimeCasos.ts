"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/supabase-client";

export function useRealtimeCasos(onChange: () => void) {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const channel = supabase
      .channel("casos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "casos" },
        () => onChangeRef.current(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "estudiantes_casos" },
        () => onChangeRef.current(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "asesores_casos" },
        () => onChangeRef.current(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
