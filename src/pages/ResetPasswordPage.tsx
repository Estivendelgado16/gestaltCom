import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setSubmitting(true);
    const { error } = await authService.updatePassword(password);
    setSubmitting(false);

    if (error) {
      toast.error("No se pudo actualizar la contraseña", { description: error.message });
      return;
    }

    toast.success("Contraseña actualizada", {
      description: "Ya puedes iniciar sesión con tu nueva contraseña.",
    });
    nav({ to: "/login" });
  }

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
            Define tu{" "}
            <em className="not-italic" style={{ color: "var(--gold)" }}>
              nueva
            </em>{" "}
            contraseña.
          </h1>
        </div>
        <div className="text-xs opacity-50">© Comunidad Gestáltica</div>
      </div>

      <div className="flex items-center justify-center p-10">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-8">
          <h2 className="text-3xl" style={{ color: "var(--ink)" }}>
            Nueva contraseña
          </h2>

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div>
            <label
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--ink-soft)" }}
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                color: "var(--ink)",
              }}
              autoComplete="new-password"
              minLength={6}
              required
            />
            <p className="mt-2 text-xs" style={{ color: "var(--ink-soft)" }}>
              Mínimo 6 caracteres.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            {submitting ? "Procesando..." : "Actualizar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
