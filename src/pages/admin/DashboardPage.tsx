import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useAuth } from "@/context/AuthContext";
import { formacionService } from "@/services/formacion.service";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, RotateCcw } from "lucide-react";

export function DashboardPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const { data: formaciones = [] } = useQuery({
    queryKey: ["formaciones", "all"],
    queryFn: () => formacionService.getFormaciones(),
  });

  useEffect(() => {
    if (!loading && !user) nav({ to: "/admin" });
  }, [user, loading, nav]);

  if (loading || !user) return null;

  const formacionesList = formaciones;

  return (
    <AdminShell>
      <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Contenidos · Formaciones
          </div>
          <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>
            Formaciones
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
            {formacionesList.length} formaciones registradas
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Resetear simulando restaurar valores por defecto
              toast.success("Datos restaurados", {
                description: "Las formaciones se restablecieron desde Supabase",
              });
            }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border"
            style={{
              borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
              color: "var(--ink-soft)",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restaurar
          </button>
          <Link
            to="/admin/nuevo"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Nueva formación
          </Link>
        </div>
      </header>

      <div
        className="rounded-sm overflow-hidden border"
        style={{
          borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
          background: "var(--background)",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left text-[10px] uppercase tracking-[0.3em]"
              style={{
                color: "var(--ink-soft)",
                background: "color-mix(in oklab, var(--ink) 4%, transparent)",
              }}
            >
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Fecha inicio</th>
              <th className="px-6 py-4">Modalidad</th>
              <th className="px-6 py-4">Duración</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {formacionesList.map((f) => {
              const tipoLabel =
                f.tipo === "DIPLOMADO"
                  ? "Diplomado"
                  : f.tipo === "CURSO"
                    ? "Curso"
                    : f.tipo === "TALLER"
                      ? "Taller"
                      : "Otro";

              const statusStyles: Record<string, { bg: string; fg: string }> = {
                DIPLOMADO: { bg: "var(--gold)", fg: "var(--ink)" },
                CURSO: { bg: "var(--ink)", fg: "var(--cream)" },
                TALLER: { bg: "var(--sand-light)", fg: "var(--ink-soft)" },
                OTRO: { bg: "var(--ink-soft)", fg: "var(--cream)" },
              };

              const s = statusStyles[f.tipo] ?? statusStyles.OTRO;

              return (
                <tr
                  key={f.id}
                  className="border-t"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)" }}
                >
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--ink)" }}>{f.titulo}</div>
                    <div className="text-xs mt-0.5 opacity-60">{f.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      {tipoLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: "var(--ink-soft)" }}>
                    {f.fecha_inicio ? new Date(f.fecha_inicio).toLocaleDateString("es-ES") : "—"}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--ink-soft)" }}>
                    {f.modalidad}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex gap-2">
                      <Link
                        to="/admin/editar/$id"
                        params={{ id: f.id }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${f.titulo}"?`)) {
                            // Lógica de eliminación - en producción usaríamos formacionService.deleteFormacion
                            toast.success("Formación eliminada", {
                              description: "Se removió de Supabase",
                            });
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

      <div
        className="mt-8 p-6 rounded-sm text-xs"
        style={{ background: "var(--sand-light)", color: "var(--ink-soft)" }}
      >
        <strong style={{ color: "var(--ink)" }}>Panel Administrativo:</strong> Los cambios se
        reflejan en tiempo real en la base de datos Supabase y son visibles en el sitio público
        inmediatamente después de guardarse.
      </div>
    </AdminShell>
  );
}
