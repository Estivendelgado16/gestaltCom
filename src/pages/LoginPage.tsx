import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export function LoginPage() {
  const nav = useNavigate();
  const { user, isAdmin, hasPaidAccess, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      nav({ to: isAdmin ? "/admin/dashboard" : hasPaidAccess ? "/clases" : "/pagos" });
    }
  }, [user, isAdmin, hasPaidAccess, loading, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error, data } = await authService.signIn(email.trim(), password);

    setSubmitting(false);

    if (error) {
      toast.error("Credenciales inválidas", {
        description: error.message,
      });
      return;
    }

    const admin = data?.user?.app_metadata?.role === "admin";
    toast.success("Sesión iniciada");
    nav({ to: admin ? "/admin/dashboard" : "/clases" });
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

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: "var(--cream)" }}>
      <div
        className="hidden md:flex flex-col justify-between p-14"
        style={{ background: "var(--ink)", color: "var(--cream)" }}
      >
        <Logo tone="cream" />
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
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-8">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.35em]"
              style={{ color: "var(--ink-soft)" }}
            >
              Acceso
            </div>
            <h2 className="mt-2 text-3xl" style={{ color: "var(--ink)" }}>
              Ingresar
            </h2>
          </div>
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
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                color: "var(--ink)",
              }}
              autoComplete="email"
              required
            />
          </div>
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
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                color: "var(--ink)",
              }}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
