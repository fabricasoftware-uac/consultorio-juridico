"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "lucide-react";
import { supabase } from "../../lib/supabase/supabase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "app/types/jwt";
import { Separator } from "@/components/ui/separator";
import { DOMINIO_INSTITUCIONAL } from "@/lib/roles";

const ERRORES_OAUTH: Record<string, string> = {
  dominio_no_permitido: `Debes ingresar con tu correo institucional ${DOMINIO_INSTITUCIONAL}.`,
  sin_rol: "Tu cuenta no tiene un rol asignado. Contacta al administrador.",
  oauth: "No se pudo completar el ingreso con Google. Intenta de nuevo.",
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.26a12 12 0 0 0 0 10.76l4.01-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.18 15.24 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El callback de /auth/callback devuelve el motivo del rechazo en ?error=.
  useEffect(() => {
    const codigo = searchParams.get("error");
    if (codigo) {
      setError(ERRORES_OAUTH[codigo] ?? "No se pudo iniciar sesión.");
    }
  }, [searchParams]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // `hd` solo pre-filtra la lista de cuentas en Google; la validación real
        // del dominio ocurre en el servidor, en /auth/callback.
        queryParams: {
          hd: DOMINIO_INSTITUCIONAL.replace("@", ""),
          prompt: "select_account",
        },
      },
    });
    if (error) {
      setError("No se pudo iniciar el ingreso con Google. " + error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await supabase.auth.refreshSession();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Correo o contraseña incorrectos.");
        } else {
          setError(error.message);
        }
        setIsLoading(false);
        return;
      }
      const session = data.session;

      if (session) {
        const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
        const role = jwt.user_role;
        switch (role) {
          case "admin":
            router.refresh();
            router.push("/admin/inicio");
            break;
          case "estudiante":
            router.refresh();
            router.push("/estudiante/inicio");
            break;
          case "asesor":
            router.refresh();
            router.push("/asesor/inicio");
            break;
          case "pro_apoyo":
            router.refresh();
            router.push("/pro-apoyo/inicio");
            break;
          default:
            setError("Rol de usuario no reconocido.");
        }
      }
    } catch (error) {
      setError("Error al iniciar sesión. " + error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToPasswordReset = () => {
    router.refresh();
    router.push("/recuperar-contrasena");
  };

  return (
    <Card className="w-full mx-auto border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
      <CardHeader className="space-y-2 pb-6 pt-8 px-8 border-b border-slate-100 bg-white">
        <CardTitle className="text-2xl font-bold text-center text-slate-900 tracking-tight">
          ¡Bienvenido de nuevo!
        </CardTitle>
        <CardDescription className="text-center text-slate-500 font-medium text-sm">
          Ingresa tus credenciales para acceder a tu panel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-8 px-8 pb-8">
        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base"
          >
            {isGoogleLoading ? (
              <Spinner className="mr-2 h-5 w-5" />
            ) : (
              <GoogleIcon className="mr-2 h-5 w-5" />
            )}
            {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
          </Button>
          <p className="text-xs text-center text-slate-500">
            Para estudiantes con correo{" "}
            <span className="font-medium">{DOMINIO_INSTITUCIONAL}</span>
          </p>

          <div className="relative">
            <Separator className="bg-slate-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400 font-medium">
              o ingresa con tu correo
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2.5">
            <Label
              htmlFor="email"
              className="text-slate-700 font-semibold text-sm"
            >
              Correo Electrónico
            </Label>
            <div className="relative group">
              <MailIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@uniautonoma.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm rounded-xl focus-visible:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="text-slate-700 font-semibold text-sm"
            >
              Contraseña
            </Label>
            <div className="relative group">
              <LockIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all duration-200 text-sm rounded-xl focus-visible:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-hidden cursor-pointer"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all text-left w-max cursor-pointer"
              onClick={handleRedirectToPasswordReset}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
              Si eres un usuario nuevo o es la primera vez que ingresas, debes
              restablecer tu contraseña haciendo clic en el enlace superior.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all font-semibold text-base mt-2"
          >
            {isLoading ? <Spinner className="mr-2 h-5 w-5" /> : null}
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          {error && (
            <Alert
              variant="destructive"
              className="mt-4 border-red-200 bg-red-50 text-red-800 rounded-xl"
            >
              <AlertCircleIcon className="h-5 w-5 text-red-600" />
              <AlertTitle className="font-semibold text-red-900">
                Error de Acceso
              </AlertTitle>
              <AlertDescription className="text-red-700 text-sm mt-1">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
