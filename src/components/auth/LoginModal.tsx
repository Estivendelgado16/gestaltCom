import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function AdminLoginPage() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) nav({ to: "/login" });
      else if (isAdmin) nav({ to: "/admin/dashboard" });
      else nav({ to: "/clases" });
    }
  }, [user, isAdmin, loading, nav]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
        <nav className="text-sm">
          <a href="/login" className="text-cream hover:underline">
            Volver al login
          </a>
        </nav>
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-4">
            Panel privado
          </div>
          <h1 className="text-5xl leading-tight max-w-sm">
            <em className="not-italic" style={{ color: "var(--gold)" }}>
              cuidar
            </em>{" "}
            lo que publicas.
          </h1>
          <p className="mt-6 text-sm opacity-70 max-w-sm">
            Gestiona contenidos, pagos y clases de la plataforma.
          </p>
        </div>
        <div className="text-xs opacity-50">© Comunidad Gestáltica</div>
      </div>

      <div className="flex items-center justify-center p-10">
        <p className="text-lg text-ink">
          Ya tienes sesión activa.{" "}
          <a href="/" className="text-gold hover:underline">
            Ir al sitio
          </a>
        </p>
      </div>
    </div>
  );
}
