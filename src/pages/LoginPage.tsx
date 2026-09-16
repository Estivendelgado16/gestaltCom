import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

type Mode = "login" | "registro" | "recuperar";

export function LoginPage() {
  const nav = useNavigate();
  const { user, isAdmin, hasPaidAccess, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      nav({ to: isAdmin ? "/admin/dashboard" : hasPaidAccess ? "/usuarios/clases" : "/pagos" });
    }
  }, [user, isAdmin, hasPaidAccess, loading, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "login") {
      const { error } = await authService.signIn(email.trim(), password);

      setSubmitting(false);

      if (error) {
        toast.error("No se pudo iniciar sesión", { description: error.message });
        return;
      }

      toast.success("Sesión iniciada");
      // La redirección se hace en el useEffect cuando AuthContext actualiza el usuario
      return;
    }

    // Recuperar contraseña
    if (mode === "recuperar") {
      const { error } = await authService.resetPassword(email.trim());

      setSubmitting(false);

      if (error) {
        toast.error("No se pudo enviar el correo", { description: error.message });
        return;
      }

      toast.success("Correo enviado", {
        description: "Revisa tu bandeja para restablecer tu contraseña.",
      });
      setMode("login");
      return;
    }

    // Registro
    const { error } = await authService.signUp(email.trim(), password);

    setSubmitting(false);

    if (error) {
      toast.error("No se pudo crear la cuenta", { description: error.message });
      return;
    }

    toast.success("Cuenta creada", {
      description: "Revisa tu correo para confirmar tu cuenta y luego inicia sesión.",
    });
    setMode("login");
    setPassword("");
  }

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--cream)" }}
      >
        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (user) return null;

  const inputStyle = {
    borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
    color: "var(--ink)",
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: "var(--cream)" }}>
      <div
        className="hidden md:flex flex-col justify-between p-14"
        style={{ background: "var(--ink)", color: "var(--cream)" }}
      >
        <Logo tone="cream" img="/img/logo2.png" size={56} />
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-4">Acceso</div>
          <h1 className="text-5xl leading-tight max-w-sm">
            Un espacio para{" "}
            <em className="not-italic" style={{ color: "var(--gold)" }}>
              cuidar
            </em>{" "}
            lo que publicas.
          </h1>
          <p className="mt-6 text-sm opacity-70 max-w-sm">
            Ingresa a tu cuenta para acceder a las clases y al panel de administración.
          </p>
        </div>
        <div className="text-xs opacity-50">© Comunidad Gestáltica</div>
      </div>

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-left">
            <Link
              to="/formaciones"
              className="text-[10px] uppercase tracking-[0.3em] transition-colors hover:opacity-70"
              style={{ color: "var(--ink-soft)" }}
            >
              ← Volver a Formación
            </Link>
          </div>
          {/* Selector de modo */}
          <div className="flex gap-6 mb-8">
            {(["login", "registro"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className="text-[10px] uppercase tracking-[0.3em] pb-1 border-b-2 transition-colors"
                  style={{
                    color: mode === m ? "var(--ink)" : "var(--ink-soft)",
                    borderColor: mode === m ? "var(--gold)" : "transparent",
                  }}
                >
                  {m === "login" ? "Ingresar" : "Registrarse"}
                </button>
              ))}
            </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <h2 className="text-3xl" style={{ color: "var(--ink)" }}>
              {mode === "login"
                ? "Ingresar"
                : mode === "registro"
                  ? "Crear cuenta"
                  : "Recuperar contraseña"}
            </h2>

            <div>
              <label
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "var(--ink-soft)" }}
              >
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
                style={inputStyle}
                autoComplete="email"
                required
              />
            </div>

            {mode !== "recuperar" && (
              <div>
                <label
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
                  style={inputStyle}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={6}
                  required
                />
                {mode === "registro" && (
                  <p className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>
                    Mínimo 6 caracteres.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              {submitting
                ? "Procesando..."
                : mode === "login"
                  ? "Entrar"
                  : mode === "registro"
                    ? "Crear cuenta"
                    : "Enviar correo"}
            </button>

            <div className="text-center">
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => setMode("recuperar")}
                  className="text-xs underline underline-offset-4"
                  style={{ color: "var(--ink-soft)" }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              {mode === "recuperar" && (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs underline underline-offset-4"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Volver a ingresar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
