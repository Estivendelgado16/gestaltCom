import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { login, useAuth } from "@/lib/auth-store";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Panel — Comunidad Gestáltica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const authed = useAuth();
  const [email, setEmail] = useState("dany@comunidadgestaltica.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authed) nav({ to: "/admin/dashboard" });
  }, [authed, nav]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Bienvenido, Dany");
      nav({ to: "/admin/dashboard" });
    } else {
      toast.error("Credenciales inválidas", { description: "Sugerencia demo: gestalt2026" });
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{ background: "var(--cream)" }}>
      <div className="hidden md:flex flex-col justify-between p-14" style={{ background: "var(--ink)", color: "var(--cream)" }}>
        <Logo tone="cream" />
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em] opacity-60 mb-4">Panel privado</div>
          <h1 className="text-5xl leading-tight max-w-sm">
            Un espacio para <em className="not-italic" style={{ color: "var(--gold)" }}>cuidar</em> lo que publicas.
          </h1>
          <p className="mt-6 text-sm opacity-70 max-w-sm">
            Este panel gestiona el contenido estático del sitio a través de Decap CMS.
            Los cambios se reflejan directamente en <code>/src/data/courses.json</code>.
          </p>
        </div>
        <div className="text-xs opacity-50">© Comunidad Gestáltica</div>
      </div>

      <div className="flex items-center justify-center p-10">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>Acceso</div>
            <h2 className="mt-2 text-3xl" style={{ color: "var(--ink)" }}>Ingresar al panel</h2>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>Correo</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)", color: "var(--ink)" }}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)", color: "var(--ink)" }}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            Entrar
          </button>
          <p className="text-xs opacity-60" style={{ color: "var(--ink-soft)" }}>
            Demo · usuario prellenado · contraseña <code>gestalt2026</code>
          </p>
        </form>
      </div>
    </div>
  );
}
