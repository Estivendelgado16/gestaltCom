import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/lib/auth-store";
import { useCourses, deleteCourse, resetCourses, type CourseStatus } from "@/lib/courses-store";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Cursos — Panel" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Dashboard,
});

const statusStyles: Record<CourseStatus, { bg: string; fg: string }> = {
  "Próximo":   { bg: "var(--gold)",       fg: "var(--ink)" },
  "En Curso":  { bg: "var(--ink)",        fg: "var(--cream)" },
  "Finalizado":{ bg: "var(--sand-light)", fg: "var(--ink-soft)" },
};

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
}

function Dashboard() {
  const nav = useNavigate();
  const authed = useAuth();
  const courses = useCourses();

  useEffect(() => {
    if (!authed) nav({ to: "/admin" });
  }, [authed, nav]);

  if (!authed) return null;

  return (
    <AdminShell>
      <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>Contenidos · Formaciones</div>
          <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>Cursos</h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
            {courses.length} entradas en <code>courses.json</code>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetCourses(); toast.success("courses.json restaurado a valores iniciales"); }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border"
            style={{ borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)", color: "var(--ink-soft)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar
          </button>
          <Link
            to="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Nuevo curso
          </Link>
        </div>
      </header>

      <div className="rounded-sm overflow-hidden border" style={{ borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)", background: "var(--background)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)", background: "color-mix(in oklab, var(--ink) 4%, transparent)" }}>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => {
              const s = statusStyles[c.status];
              return (
                <tr key={c.id} className="border-t" style={{ borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)" }}>
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--ink)" }}>{c.title}</div>
                    <div className="text-xs mt-0.5 opacity-60">{c.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>{fmt(c.startDate)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full" style={{ background: s.bg, color: s.fg }}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <Link
                        to="/admin/editar/$id"
                        params={{ id: c.id }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${c.title}"?`)) {
                            deleteCourse(c.id);
                            toast.success("Curso eliminado", { description: "courses.json actualizado" });
                          }
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 rounded-sm text-xs" style={{ background: "var(--sand-light)", color: "var(--ink-soft)" }}>
        <strong style={{ color: "var(--ink)" }}>Simulación Decap CMS:</strong> los cambios se persisten localmente y
        representan la escritura del archivo <code>src/data/courses.json</code>. En producción, Decap
        commiteará este JSON al repositorio y disparará una recompilación estática.
      </div>
    </AdminShell>
  );
}
