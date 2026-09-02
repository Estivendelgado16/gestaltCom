import { useDialog } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/sonner";
import { X, Lock, Mail, Phone } from "lucide-react";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { open: openToast, close: closeToast } = useToast();
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div>
        <p className="text-sm">Cargando sesión...</p>
      </div>
    );
  }

  return {
    trigger: (
      <button
        className="hidden"
      >
        Abrir login
      </button>
    ),
    content: (
      <div className="max-w-md p-6">
        {user ? (
          <div>
            <p className="text-sm mb-4">
              Sesión activa: <strong>{user.email}</strong>
            </p>
            <button
              onClick={() => {
                signOut();
                closeToast("Sesión cerrada");
                onClose();
              }}
              className="w-full inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form
            onSubmit={async (e: React.FormEvent) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;

              try {
                await signIn(email.trim(), password);
                closeToast("Sesión iniciada");
                onClose();
              } catch (error: any) {
                closeToast("Error al iniciar sesión", {
                  description: error.message,
                });
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-sm uppercase tracking-widest mb-2" style={{ color: "var(--ink-soft)" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="name@ejemplo.com"
                className="w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
                style={{
                  borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                  color: "var(--ink)",
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm uppercase tracking-widest mb-2" style={{ color: "var(--ink-soft)" }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
                style={{
                  borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                  color: "var(--ink)",
                }}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="flex-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--ink)", color: "var(--cream)" }}
              >
                Entrar
              </button>
            </div>

            <div className="text-center text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
              ¿No tienes cuenta?
              <a
                href="/admin"
                className="underline hover:text-[var(--gold)]"
                onClick={() => {
                  close();
                  navigate({ to: "/admin" });
                }}
              >
                Regístrate
              </a>
            </div>
          </form>
        )}
      </div>
    ),
    cancel: true,
    title: "Iniciar sesión",
    maxWidth: "sm",
  };
}