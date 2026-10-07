import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useRequireAdmin } from "@/context/AuthContext";
import { youtubeService, type YoutubeVideo } from "@/services/youtube.service";
import { siteFileService, YOUTUBE_LISTA_KEY, type SiteFile } from "@/services/siteFile.service";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, X, RefreshCw, ExternalLink, FileText } from "lucide-react";

export function AdminYoutubePage() {
  const { user, isAdmin, loading } = useRequireAdmin();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [fetching, setFetching] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<YoutubeVideo | null>(null);
  const [listaFile, setListaFile] = useState<SiteFile | null>(null);
  const [listaUploading, setListaUploading] = useState(false);

  const fetchVideos = async () => {
    setFetching(true);
    try {
      const data = await youtubeService.getVideos();
      setVideos(data);
    } catch (err) {
      toast.error("Error al cargar videos", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchVideos();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    siteFileService
      .get(YOUTUBE_LISTA_KEY)
      .then(setListaFile)
      .catch(() => setListaFile(null));
  }, [user]);

  async function handleListaUpload(file: File) {
    setListaUploading(true);
    try {
      const saved = await siteFileService.upload(YOUTUBE_LISTA_KEY, file);
      setListaFile(saved);
      toast.success("Lista de entrevistas actualizada");
    } catch (err) {
      toast.error("No se pudo subir el archivo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setListaUploading(false);
    }
  }

  if (loading || !user || !isAdmin) return null;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(v: YoutubeVideo) {
    setEditing(v);
    setFormOpen(true);
  }

  async function handleDelete(v: YoutubeVideo) {
    if (!confirm(`¿Eliminar "${v.tema}"?`)) return;
    try {
      await youtubeService.deleteVideo(v.id);
      toast.success("Video eliminado");
      setVideos((prev) => prev.filter((x) => x.id !== v.id));
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
            Comunidad · YouTube
          </div>
          <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>
            YouTube
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
            {videos.length} videos registrados
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVideos}
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
            <PlusCircle className="w-3.5 h-3.5" /> Nuevo video
          </button>
        </div>
      </header>

      <section
        className="mb-10 rounded-2xl border p-6"
        style={{
          borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
          background: "color-mix(in oklab, var(--ink) 3%, transparent)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5" style={{ color: "var(--gold)" }} />
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                Lista de entrevistas (PDF)
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                {listaFile
                  ? (listaFile.file_name ?? "Archivo subido")
                  : "No hay archivo subido todavía"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {listaFile && (
              <a
                href={listaFile.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs underline underline-offset-4"
                style={{ color: "var(--gold)" }}
              >
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <label
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs uppercase tracking-widest cursor-pointer transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={listaUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleListaUpload(file);
                  e.target.value = "";
                }}
              />
              {listaUploading ? "Subiendo..." : listaFile ? "Reemplazar" : "Subir PDF"}
            </label>
          </div>
        </div>
      </section>

      {fetching && videos.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          Cargando videos...
        </div>
      ) : videos.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          No hay videos registrados.
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
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Parte</th>
                <th className="px-6 py-4">Tema</th>
                <th className="px-6 py-4">Invitado</th>
                <th className="px-6 py-4">Enlace</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v, i) => (
                <tr
                  key={v.id}
                  className="border-t align-top"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)" }}
                >
                  <td className="px-6 py-4" style={{ color: "var(--ink-soft)" }}>
                    {videos.length - i}
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                    {v.part}
                  </td>
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--ink)" }}>{v.tema}</div>
                    {v.note && <div className="text-xs mt-0.5 opacity-60">{v.note}</div>}
                  </td>
                  <td className="px-6 py-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                    {v.invitado ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    {v.youtube_link ? (
                      <a
                        href={v.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs underline underline-offset-4"
                        style={{ color: "var(--gold)" }}
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs opacity-50">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => openEdit(v)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-secondary"
                        aria-label="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(v)}
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
        <YoutubeForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSaved={(saved) => {
            setFormOpen(false);
            setVideos((prev) => {
              const exists = prev.some((x) => x.id === saved.id);
              return exists ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
            });
          }}
        />
      )}
    </AdminShell>
  );
}

function YoutubeForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: YoutubeVideo | null;
  onClose: () => void;
  onSaved: (v: YoutubeVideo) => void;
}) {
  const isEdit = Boolean(initial);
  const [values, setValues] = useState({
    part: initial?.part ?? "I",
    order_num: initial?.order_num ?? 0,
    tema: initial?.tema ?? "",
    invitado: initial?.invitado ?? "",
    youtube_link: initial?.youtube_link ?? "",
    note: initial?.note ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof values>(k: K, v: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.tema.trim()) {
      toast.error("El tema es obligatorio");
      return;
    }

    const payload = {
      part: values.part,
      order_num: values.order_num,
      tema: values.tema.trim(),
      invitado: values.invitado.trim() || null,
      youtube_link: values.youtube_link.trim() || null,
      note: values.note.trim() || null,
    };

    setSubmitting(true);
    try {
      if (isEdit && initial) {
        const saved = await youtubeService.updateVideo(initial.id, payload);
        toast.success("Video actualizado");
        onSaved(saved);
      } else {
        const saved = await youtubeService.createVideo(payload);
        toast.success("Video creado");
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
              {isEdit ? "Editar video" : "Nuevo video"}
            </h2>
            <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
              Los cambios se reflejan en /ContYoutube.
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
          <Field label="Tema *">
            <input
              value={values.tema}
              onChange={(e) => set("tema", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Parte">
              <input
                value={values.part}
                onChange={(e) => set("part", e.target.value)}
                className="input"
                placeholder="I, II, III, IV..."
              />
            </Field>
            <Field label="Orden (número)">
              <input
                type="number"
                value={values.order_num}
                onChange={(e) => set("order_num", Number(e.target.value))}
                className="input"
              />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Invitado (opcional)">
              <input
                value={values.invitado}
                onChange={(e) => set("invitado", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Enlace de YouTube (opcional)">
              <input
                value={values.youtube_link}
                onChange={(e) => set("youtube_link", e.target.value)}
                className="input"
                placeholder="https://youtu.be/... o https://www.youtube.com/watch?v=..."
              />
            </Field>
          </div>

          <Field label="Nota (opcional)">
            <input
              value={values.note}
              onChange={(e) => set("note", e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full px-8 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear video"}
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
