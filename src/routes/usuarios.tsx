import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { UsuarioShell } from "@/components/layout/UsuarioShell";

function UsuariosLayout() {
  const { user, hasPaidAccess, loading, refreshPaidAccess } = useRequireAuth("/login");
  const nav = useNavigate();

  // Reconsulta el estado de pago al entrar (por si se aprobó con la sesión abierta).
  useEffect(() => {
    if (user) void refreshPaidAccess();
  }, [user, refreshPaidAccess]);

  // Sin pago aprobado, el usuario no pasa de /pagos.
  useEffect(() => {
    if (!loading && user && hasPaidAccess === false) {
      nav({ to: "/pagos" });
    }
  }, [loading, user, hasPaidAccess, nav]);

  if (loading) {
    return (
      <UsuarioShell>
        <div className="py-20 text-center text-sm" style={{ color: "var(--ink-soft)" }}>
          Cargando...
        </div>
      </UsuarioShell>
    );
  }

  if (!user || !hasPaidAccess) return null;

  return (
    <UsuarioShell>
      <Outlet />
    </UsuarioShell>
  );
}

export const Route = createFileRoute("/usuarios")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mi Diplomado — Comunidad Gestáltica" },
      {
        name: "description",
        content: "Accede al contenido desbloqueado de tu diplomado.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UsuariosLayout,
});
