import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CourseForm } from "@/components/admin/CourseForm";
import { useAuth } from "@/lib/auth-store";
import { useCourses } from "@/lib/courses-store";

export const Route = createFileRoute("/admin/editar/$id")({
  head: () => ({
    meta: [
      { title: "Editar curso — Panel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EditCourse,
});

function EditCourse() {
  const nav = useNavigate();
  const authed = useAuth();
  const { id } = Route.useParams();
  const courses = useCourses();
  const course = courses.find((c) => c.id === id);

  useEffect(() => { if (!authed) nav({ to: "/admin" }); }, [authed, nav]);
  if (!authed) return null;

  return (
    <AdminShell>
      <div className="mb-10">
        <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>Contenido</div>
        <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>Editar curso</h1>
      </div>
      {course ? (
        <CourseForm initial={course} />
      ) : (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Curso no encontrado.</p>
      )}
    </AdminShell>
  );
}
