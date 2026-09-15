import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

function AdminIndexRedirect() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/login" });
    } else if (isAdmin) {
      nav({ to: "/admin/dashboard" });
    } else {
      nav({ to: "/usuarios/clases" });
    }
  }, [user, isAdmin, loading, nav]);

  return null;
}

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Panel — Comunidad Gestáltica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminIndexRedirect,
});
