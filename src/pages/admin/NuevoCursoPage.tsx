import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";
import { useAuth } from "@/context/AuthContext";

export function NuevoCursoPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin" });
  }, [user, loading, nav]);
  if (loading || !user) return null;
  return (
    <AdminShell>
      <div className="mb-10">
        <div
          className="text-[10px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Contenido
        </div>
        <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>
          Crear un nuevo curso
        </h1>
        <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--ink-soft)" }}>
          Al guardar, Decap CMS committeará una nueva entrada al archivo <code>courses.json</code>.
        </p>
      </div>
      <CourseForm />
    </AdminShell>
  );
}
