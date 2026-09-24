import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useRequireAdmin } from "@/context/AuthContext";
import { actividadService } from "@/services/actividad.service";
import { uploadService } from "@/services/upload.service";
import type { Actividad } from "@/types";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, X, RefreshCw, Upload } from "lucide-react";

const BADGE_OPTIONS = ["Próximo inicio", "En curso", "Finalizado"];

export function AdminActividadesPage() {
  const { user, isAdmin, loading } = useRequireAdmin();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [fetching, setFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Actividad | null>(null);

  const fetchActividades = async () => {
    setFetching(true);
    try {
      const data = await actividadService.getActividades();
      setActividades(data);
    } catch (err) {
      toast.error("Error al cargar actividades", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchActividades();
  }, [user]);

  if (loading || !user || !isAdmin) return null;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(a: Actividad) {
    setEditing(a);
    setFormOpen(true);
  }

  async function handleDelete(a: Actividad) {
    if (!confirm(`¿Eliminar "${a.title}"?`)) return;
    try {
      await actividadService.deleteActividad(a.id);
      toast.success("Actividad eliminada");
      setActividades((prev) => prev.filter((x) => x.id !== a.id));
    } catch (err) {
      toast.error("No se pudo eliminar", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    }
  }

  return (
    <AdminShell>
      <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Comunidad · Actividades
          </div>
          <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>
            Actividades
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
            {actividades.length} actividades registradas
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchActividades}
            disabled={fetching}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border"
            style={{
              borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
              color: "var(--ink-soft)",
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} /> Actualizar
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <PlusCircle className="w-3.5 h-3.5" /> Nueva actividad
          </button>
        </div>
      </header>

      {fetching && actividades.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          Cargando actividades...
        </div>
      ) : actividades.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          No hay actividades registradas.
        </div>
      ) : (
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
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {actividades.map((a) => (
                <tr
                  key={a.id}
                  className="border-t align-top"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)" }}
                >
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--ink)" }}>{a.title}</div>
                    <div className="text-xs mt-0.5 opacity-60">{a.id.slice(0, 8)}...</div>
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                    {a.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {a.status_badges.map((b) => (
                        <span
                          key={b}
                          className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium"
                          style={{
                            background: "color-mix(in oklab, var(--gold) 25%, transparent)",
                            color: "var(--ink)",
                          }}
                        >
                          {b}
                        </span>
                      ))}
                      {!a.is_published && (
                        <span
                          className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em]"
                          style={{ background: "var(--ink-soft)", color: "var(--cream)" }}
                        >
                          No publicada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {a.image_url ? (
                      <div
                        className="w-24 h-16 rounded-sm overflow-hidden"
                        style={{ background: "var(--sand-light)" }}
                      >
                        <img
                          src={a.image_url}
                          alt={a.image_alt ?? ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-xs opacity-50">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <ActividadForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSaved={(saved) => {
            setFormOpen(false);
            setActividades((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
            });
          }}
        />
      )}
    </AdminShell>
  );
}

function ActividadForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Actividad | null;
  onClose: () => void;
  onSaved: (a: Actividad) => void;
}) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    subtitle: initial?.subtitle ?? "",
    description: initial?.description ?? "",
    featured_notice: initial?.featured_notice ?? "",
    status_badges: initial?.status_badges ?? [],
    cta_text: initial?.cta_text ?? "ZOOM →",
    cta_link: initial?.cta_link ?? "",
    image_url: initial?.image_url ?? "",
    image_alt: initial?.image_alt ?? "",
    is_featured: initial?.is_featured ?? false,
    is_published: initial?.is_published ?? true,
  });
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof values>(k: K, v: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  const [imageUploading, setImageUploading] = useState(false);

  async function uploadImage(file: File) {
    setImageUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.-]/g, "_");
      const path = `actividad-${Date.now()}-${safeName}`;
      const publicUrl = await uploadService.uploadToSupabaseStorage(file, path, "galeria");
      set("image_url", publicUrl);
      toast.success("Imagen subida correctamente");
    } catch (err) {
      toast.error("No se pudo subir la imagen", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setImageUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.title.trim() || !values.description.trim()) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    const payload = {
      title: values.title.trim(),
      category: values.category.trim() || "Actividad",
      subtitle: values.subtitle.trim() || null,
      description: values.description.trim(),
      featured_notice: values.featured_notice.trim() || null,
      status_badges: values.status_badges,
      cta_text: values.cta_text.trim() || "Más info",
      cta_link: values.cta_link.trim() || null,
      image_url: values.image_url.trim() || null,
      image_alt: values.image_alt.trim() || null,
      is_featured: values.is_featured,
      is_published: values.is_published,
      sort_order: initial?.sort_order ?? 0,
    };

    setSubmitting(true);
    try {
      if (isEdit && initial) {
        const saved = await actividadService.updateActividad(initial.id, payload);
        toast.success("Actividad actualizada");
        onSaved(saved);
      } else {
        const saved = await actividadService.createActividad(payload);
        toast.success("Actividad creada");
        onSaved(saved);
      }
    } catch (err) {
      toast.error("No se pudo guardar", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8 bg-black/40">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl my-auto rounded-2xl p-6 md:p-8"
        style={{ background: "var(--background)", color: "var(--ink)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl" style={{ color: "var(--ink)" }}>
              {isEdit ? "Editar actividad" : "Nueva actividad"}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              Los cambios se reflejan en /actividades al publicarse.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <Field label="Título *">
            <input
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Categoría">
              <input
                value={values.category}
                onChange={(e) => set("category", e.target.value)}
                className="input"
                placeholder="ej. Seminario online · Clínica"
              />
            </Field>
            <Field label="Subtítulo (opcional)">
              <input
                value={values.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Descripción *">
            <textarea
              rows={4}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              className="input resize-none"
            />
          </Field>

          <Field label="Aviso destacado (opcional)">
            <input
              value={values.featured_notice}
              onChange={(e) => set("featured_notice", e.target.value)}
              className="input"
              placeholder="ej. Última sesión gratuita: 14 de septiembre a las 19:30 h."
            />
          </Field>

          <Field label="Etiquetas / badges">
            <div className="flex flex-wrap gap-6">
              {BADGE_OPTIONS.map((badge) => (
                <label key={badge} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status_badge"
                    checked={values.status_badges.includes(badge)}
                    onChange={() => set("status_badges", [badge])}
                  />
                  {badge}
                </label>
              ))}
            </div>
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Texto del botón">
              <input
                value={values.cta_text}
                onChange={(e) => set("cta_text", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Enlace del botón (opcional)">
              <input
                value={values.cta_link}
                onChange={(e) => set("cta_link", e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Imagen (opcional)">
              <div className="mt-2">
                <label
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors hover:opacity-80"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                >
                  <Upload className="w-4 h-4" />
                  {imageUploading ? "Subiendo..." : "Subir imagen desde el PC"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={imageUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(file);
                    }}
                  />
                </label>
                {values.image_url && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={values.image_url}
                      alt={values.image_alt ?? "Vista previa"}
                      className="w-20 h-16 object-cover rounded-sm border"
                      style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                    />
                    <button
                      type="button"
                      onClick={() => set("image_url", "")}
                      className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>
            </Field>
            <Field label="Texto alternativo (opcional)">
              <input
                value={values.image_alt}
                onChange={(e) => set("image_alt", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.is_published}
                onChange={(e) => set("is_published", e.target.checked)}
              />
              Publicada
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
              />
              Destacada
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full px-8 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear actividad"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm uppercase tracking-widest opacity-70"
          >
            Cancelar
          </button>
        </div>

        <style>{`
          .input { width: 100%; background: transparent; border: none; border-bottom: 1px solid color-mix(in oklab, var(--ink) 25%, transparent); padding: 10px 2px; font-size: 15px; color: var(--ink); outline: none; transition: border-color .2s; }
          .input:focus { border-color: var(--gold); }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
