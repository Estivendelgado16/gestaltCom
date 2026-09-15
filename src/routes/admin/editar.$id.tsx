import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useRequireAdmin } from "@/context/AuthContext";
import { formacionService } from "@/services/formacion.service";
import type { Formacion } from "@/types";

const CourseForm = lazy(() =>
  import("@/components/admin/CourseForm").then((m) => ({ default: m.CourseForm })),
);

export const Route = createFileRoute("/admin/editar/$id")({
  head: () => ({
    meta: [{ title: "Editar formación — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: EditarCursoPage,
});

function EditarCursoPage() {
  const nav = useNavigate();
  const { user, isAdmin, loading } = useRequireAdmin();
  const { id } = Route.useParams();
  const [formacion, setFormacion] = useState<Formacion | null>(null);

  useEffect(() => {
    if (loading || !user || !isAdmin) return;

    // Obtener formación de Supabase
    formacionService.getFormacionById(id).then((data) => {
      if (!data) return;
      setFormacion(data);
    });
  }, [user, isAdmin, loading, id, nav]);

  if (loading || !user || !isAdmin) return null;

  if (!formacion) {
    return (
      <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
        Formación no encontrada.
      </p>
    );
  }

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
          Editar formación
        </h1>
      </div>
      <Suspense>
        <CourseForm initial={formacion} />
      </Suspense>
    </AdminShell>
  );
}
