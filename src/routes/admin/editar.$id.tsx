import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useAuth } from "@/context/AuthContext";
import { formacionService } from "@/services/formacion.service";

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
  const { user, loading } = useAuth();
  const { id } = Route.useParams();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin" });
  }, [user, loading, nav]);
  if (loading || !user) return null;

  // Obtener formación de Supabase
  const { data: formacion, error } = await formacionService.getFormacionById(id);

  if (error) {
    toast.error("Error al cargar formación", { description: error.message });
    return null;
  }

  if (!formacion) return null;

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