import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/admin/nuevo")({
  head: () => ({
    meta: [
      { title: "Nuevo curso — Panel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: NewCourse,
});

function NewCourse() {
  const nav = useNavigate();
  const authed = useAuth();
  useEffect(() => { if (!authed) nav({ to: "/admin" }); }, [authed, nav]);
  if (!authed) return null;
  return (
    <AdminShell>
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>Contenido</div>
        <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>Crear un nuevo curso</h1>
        <p className="text-sm mt-2 max-w-xl" style={{ color: "var(--ink-soft)" }}>
          Al guardar, Decap CMS committeará una nueva entrada al archivo <code>courses.json</code>.
        </p>
      </div>
      <CourseForm />
    </AdminShell>
  );
}
