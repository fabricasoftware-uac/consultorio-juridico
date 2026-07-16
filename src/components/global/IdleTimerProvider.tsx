"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabase-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MAX_IDLE_TIME = 15 * 60 * 1000; // 15 minutos (milisegundos)
const WARNING_TIME = 14 * 60 * 1000; // 14 minutos (milisegundos)
const SESSION_STORAGE_KEY = "idleExpiresAt";

export default function IdleTimerProvider() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const lastActivityTime = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    setShowWarning(false);

    // Listen to Auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (event === "SIGNED_OUT") {
        setIsExpired(false);
        setShowWarning(false);
        // Limpiar caché, local storage, o estados globales
        localStorage.clear();
        sessionStorage.clear();
        // Redirigir al inicio de sesión
        router.refresh();
        router.push("/login");
      } else if (event === "SIGNED_IN") {
        setIsExpired(false);
        setShowWarning(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      return;
    }

    // Check if session already expired (survives page reload)
    const storedExpiry = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (storedExpiry && parseInt(storedExpiry, 10) < Date.now()) {
      // Session expired while the page was closed/reloaded — sign out immediately
      handleLogout();
      return;
    }

    // Restore lastActivityTime from storage if available
    if (storedExpiry) {
      const storedExpiryMs = parseInt(storedExpiry, 10);
      lastActivityTime.current = storedExpiryMs - MAX_IDLE_TIME;
      const timeIdle = Date.now() - lastActivityTime.current;
      if (timeIdle >= MAX_IDLE_TIME) {
        setIsExpired(true);
        setShowWarning(true);
      } else if (timeIdle >= WARNING_TIME) {
        setShowWarning(true);
        setTimeLeft(Math.floor((MAX_IDLE_TIME - timeIdle) / 1000));
      }
    }

    const resetTimer = () => {
      if (showWarning) return; // Si el modal de advertencia está abierto, no reiniciamos solo moviendo el mouse.
      lastActivityTime.current = Date.now();
    };

    // Eventos a monitorizar para detectar inactividad
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "DOMMouseScroll",
      "mousewheel",
      "touchmove",
      "touchstart",
    ];

    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // Monitoreando el tiempo periódicamente
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeIdle = currentTime - lastActivityTime.current;

      // Persist expiry to sessionStorage (survives reload)
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        String(lastActivityTime.current + MAX_IDLE_TIME),
      );

      if (timeIdle >= MAX_IDLE_TIME) {
        if (!isExpired) {
          setIsExpired(true);
          setShowWarning(true);
          localStorage.clear();
          sessionStorage.clear();
        }
      } else if (timeIdle >= WARNING_TIME && !showWarning) {
        // Mostrar advertencia en el minuto 14
        setShowWarning(true);
        setTimeLeft(Math.floor((MAX_IDLE_TIME - timeIdle) / 1000));
      }
    }, 5000); // Check every 5 seconds for accuracy

    // Limpieza de event listeners al desmontar
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAuthenticated, showWarning, isExpired, handleLogout]);

  // Auto-logout after expiry grace period
  useEffect(() => {
    if (!isExpired) return;
    const timeout = setTimeout(() => {
      handleLogout();
    }, 10_000); // 10-second grace period
    return () => clearTimeout(timeout);
  }, [isExpired, handleLogout]);

  // Manejador del temporizador de advertencia (- 1 segundo)
  useEffect(() => {
    if (showWarning && !isExpired) {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            setIsExpired(true);
            localStorage.clear();
            sessionStorage.clear();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownRef.current) clearInterval(countdownRef.current);
    }

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showWarning, isExpired]);

  const handleContinue = () => {
    setShowWarning(false);
    lastActivityTime.current = Date.now();
    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      String(Date.now() + MAX_IDLE_TIME),
    );
  };

  if (!isAuthenticated) return null;

  return (
    <Dialog
      open={showWarning}
      onOpenChange={(open) => {
        if (isExpired) return;
        if (!open) handleContinue();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isExpired ? "Sesión Expirada" : "Aviso de Inactividad"}
          </DialogTitle>
          <DialogDescription>
            {isExpired
              ? "Su sesión ha expirado por inactividad. Por favor, cierre sesión y vuelva a ingresar."
              : `Por su seguridad, su sesión expirará en ${timeLeft} segundos si no realiza ninguna acción. ¿Desea mantener la sesión activa?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button
            variant={isExpired ? "default" : "secondary"}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
          {!isExpired && (
            <Button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuar Sesión
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
