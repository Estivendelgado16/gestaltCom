import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { lessonService } from "@/services/lesson.service";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";
import { Check, FileText, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { LinkifiedText } from "@/components/LinkifiedText";
import type { Formacion } from "@/types";

/**
 * Sección del dashboard admin que muestra las formaciones tipo DIPLOMADO
 * con sus módulos y lecciones. El admin puede crear módulos y lecciones,
 * subir el PDF y el video de cada lección (a Cloudflare R2) y desbloquear
 * el contenido con un switch por módulo (o por lección).
 * El usuario solo sube el comprobante y espera a que el admin desbloquee.
 */
export function DiplomadoModulosSection({ formacion }: { formacion: Formacion }) {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(false);
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDescription, setNewLessonDescription] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] = useState("");
  const [editingModuleDescription, setEditingModuleDescription] = useState("");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [editingLessonDescription, setEditingLessonDescription] = useState("");
  const [editingFileName, setEditingFileName] = useState<string | null>(null);
  const [editingFileNameValue, setEditingFileNameValue] = useState("");

  const { data: modules = [] } = useQuery({
    queryKey: ["admin-modules", formacion.id],
    queryFn: () => lessonService.getModules(formacion.id),
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["admin-lessons", formacion.id],
    queryFn: () => lessonService.getLessonForAdmin(modules.map((m) => m.id)),
    enabled: modules.length > 0,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-modules", formacion.id] });
    await queryClient.invalidateQueries({ queryKey: ["admin-lessons", formacion.id] });
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;
    setPending(true);
    try {
      await lessonService.createModule({
        formacionId: formacion.id,
        title: newModuleTitle,
        description: newModuleDescription,
        orderIndex: modules.length + 1,
      });
      setNewModuleTitle("");
      setNewModuleDescription("");
      setAddingModule(false);
      await refresh();
      toast.success("Módulo creado");
    } catch (err) {
      toast.error("No se pudo crear el módulo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const addLesson = async (moduleId: string) => {
    if (!newLessonTitle.trim()) return;
    setPending(true);
    try {
      await lessonService.createLesson({
        moduleId,
        title: newLessonTitle,
        description: newLessonDescription,
      });
      setNewLessonTitle("");
      setNewLessonDescription("");
      setAddingLessonTo(null);
      await refresh();
      toast.success("Lección creada");
    } catch (err) {
      toast.error("No se pudo crear la lección", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const saveModuleEdit = async (moduleId: string) => {
    const title = editingModuleTitle.trim();
    if (!title) return;
    setPending(true);
    try {
      await lessonService.updateModule(moduleId, {
        title,
        description: editingModuleDescription,
      });
      setEditingModuleId(null);
      setEditingModuleTitle("");
      setEditingModuleDescription("");
      await refresh();
      toast.success("Módulo actualizado");
    } catch (err) {
      toast.error("No se pudo actualizar el módulo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const saveLessonEdit = async (lessonId: string) => {
    const title = editingLessonTitle.trim();
    if (!title) return;
    setPending(true);
    try {
      await lessonService.updateLesson(lessonId, {
        title,
        description: editingLessonDescription,
      });
      setEditingLessonId(null);
      setEditingLessonTitle("");
      setEditingLessonDescription("");
      await refresh();
      toast.success("Lección actualizada");
    } catch (err) {
      toast.error("No se pudo actualizar la lección", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const deleteModule = async (moduleId: string, moduleTitle: string) => {
    if (!confirm(`¿Eliminar el módulo "${moduleTitle}" y todas sus lecciones?`)) return;
    setPending(true);
    try {
      await lessonService.deleteModule(moduleId);
      await refresh();
      toast.success("Módulo eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el módulo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const deleteLesson = async (lessonId: string, lessonTitle: string) => {
    if (!confirm(`¿Eliminar la lección "${lessonTitle}"?`)) return;
    setPending(true);
    try {
      await lessonService.deleteLesson(lessonId);
      await refresh();
      toast.success("Lección eliminada");
    } catch (err) {
      toast.error("No se pudo eliminar la lección", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const uploadPdf = async (lessonId: string, file: File) => {
    const key = `${lessonId}-pdf`;
    setUploading(key);
    try {
      const publicUrl = await uploadService.uploadToSupabaseStorage(file, key, "modules-pdfs");
      await lessonService.updateLessonUrls(lessonId, {
        pdf_url: publicUrl,
        pdf_name: file.name,
      });
      await refresh();
      toast.success("PDF subido");
    } catch (err) {
      toast.error("No se pudo subir el archivo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setUploading(null);
    }
  };

  const uploadSecondaryPdf = async (lessonId: string, file: File) => {
    const key = `${lessonId}-pdf-secondary`;
    setUploading(key);
    try {
      const lesson = lessons.find((l) => l.id === lessonId);
      const current = lesson?.secondary_pdf_urls ?? [];
      if (current.length >= 4) {
        toast.error("Límite alcanzado", { description: "Máximo 4 PDFs secundarios." });
        return;
      }
      const publicUrl = await uploadService.uploadToSupabaseStorage(
        file,
        `${lessonId}-pdf-${Date.now()}`,
        "modules-pdfs",
      );
      await lessonService.updateLessonUrls(lessonId, {
        secondary_pdf_urls: [...current, { name: file.name, url: publicUrl }],
      });
      await refresh();
      toast.success("PDF secundario subido");
    } catch (err) {
      toast.error("No se pudo subir el archivo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setUploading(null);
    }
  };

  const removeSecondaryPdf = async (lessonId: string, index: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    const current = lesson?.secondary_pdf_urls ?? [];
    setPending(true);
    try {
      await lessonService.updateLessonUrls(lessonId, {
        secondary_pdf_urls: current.filter((_, i) => i !== index),
      });
      await refresh();
      toast.success("PDF secundario eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el archivo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const saveFileName = async (lessonId: string) => {
    const name = editingFileNameValue.trim();
    setPending(true);
    try {
      await lessonService.updateLessonUrls(lessonId, { pdf_name: name || null });
      setEditingFileName(null);
      setEditingFileNameValue("");
      await refresh();
      toast.success("Nombre actualizado");
    } catch (err) {
      toast.error("No se pudo actualizar el nombre", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const removeFile = async (lessonId: string, label: string) => {
    if (!confirm(`¿Eliminar ${label} de esta lección?`)) return;
    setPending(true);
    try {
      await lessonService.updateLessonUrls(lessonId, { pdf_url: null, pdf_name: null });
      await uploadService.deleteFromStorage(`${lessonId}-pdf`, "modules-pdfs");
      await refresh();
      toast.success("PDF eliminado");
    } catch (err) {
      toast.error("No se pudo eliminar el archivo", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setPending(false);
    }
  };

  const isModuleUnlocked = (moduleId: string) => {
    const moduleLessons = lessons.filter((l) => l.module_id === moduleId);
    return moduleLessons.length > 0 && moduleLessons.every((l) => l.is_published);
  };

  const toggleModule = async (moduleId: string, moduleTitle: string) => {
    const unlock = !isModuleUnlocked(moduleId);
    setPending(true);
    try {
      await lessonService.setModulePublished(moduleId, unlock);
      await queryClient.invalidateQueries({ queryKey: ["admin-lessons", formacion.id] });
      toast.success(unlock ? "Módulo desbloqueado" : "Módulo bloqueado", {
        description: `"${moduleTitle}" ahora está ${unlock ? "visible" : "oculto"} para los usuarios.`,
      });
    } catch {
      toast.error("Error", { description: "No se pudo actualizar el módulo." });
    } finally {
      setPending(false);
    }
  };

  const toggleLesson = async (lessonId: string, current: boolean, title: string) => {
    setPending(true);
    try {
      await lessonService.setLessonPublished(lessonId, !current);
      await queryClient.invalidateQueries({ queryKey: ["admin-lessons", formacion.id] });
      toast.success(!current ? "Lección desbloqueada" : "Lección bloqueada", {
        description: `"${title}" ahora está ${!current ? "visible" : "oculta"}.`,
      });
    } catch {
      toast.error("Error", { description: "No se pudo actualizar la lección." });
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="rounded-sm border p-6"
      style={{
        borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
        background: "var(--background)",
      }}
    >
      <h2 className="text-xl" style={{ color: "var(--ink)" }}>
        {formacion.titulo}
      </h2>
      <p className="text-sm mt-1 mb-6" style={{ color: "var(--ink-soft)" }}>
        {modules.length} módulo{modules.length === 1 ? "" : "s"} · activa el interruptor para
        desbloquear el contenido a los usuarios
      </p>

      {modules.length === 0 && !addingModule && (
        <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
          Este diplomado aún no tiene módulos. Crea el primero con el botón de abajo.
        </p>
      )}

      <div className="space-y-4">
        {modules.map((mod) => {
          const unlocked = isModuleUnlocked(mod.id);
          const modLessons = lessons.filter((l) => l.module_id === mod.id);

          return (
            <div
              key={mod.id}
              className="rounded-sm border p-4"
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
                background: "var(--sand-light)",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {editingModuleId === mod.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          value={editingModuleTitle}
                          onChange={(e) => setEditingModuleTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveModuleEdit(mod.id);
                            if (e.key === "Escape") {
                              setEditingModuleId(null);
                              setEditingModuleTitle("");
                              setEditingModuleDescription("");
                            }
                          }}
                          className="flex-1 bg-transparent border-b py-1 text-sm outline-none focus:border-[var(--gold)]"
                          style={{
                            borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                            color: "var(--ink)",
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => saveModuleEdit(mod.id)}
                          disabled={pending || !editingModuleTitle.trim()}
                          className="shrink-0 opacity-70 hover:opacity-100 disabled:opacity-30"
                          title="Guardar"
                          aria-label="Guardar módulo"
                        >
                          <Check className="w-4 h-4" style={{ color: "var(--ink)" }} />
                        </button>
                      </div>
                      <textarea
                        value={editingModuleDescription}
                        onChange={(e) => setEditingModuleDescription(e.target.value)}
                        placeholder="Descripción (opcional)"
                        rows={2}
                        className="w-full bg-transparent border-b py-1 text-xs outline-none focus:border-[var(--gold)] resize-none"
                        style={{
                          borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                          color: "var(--ink)",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <strong style={{ color: "var(--ink)" }}>
                        Módulo {mod.order_index}: {mod.title}
                      </strong>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingModuleId(mod.id);
                          setEditingModuleTitle(mod.title);
                          setEditingModuleDescription(mod.description ?? "");
                        }}
                        className="shrink-0 opacity-50 hover:opacity-100"
                        title="Editar módulo"
                        aria-label={`Editar módulo ${mod.title}`}
                      >
                        <Pencil className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} />
                      </button>
                    </div>
                  )}
                  {mod.description && (
                    <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                      <LinkifiedText text={mod.description} />
                    </p>
                  )}
                </div>

                {/* Switch para desbloquear el módulo completo */}
                <div className="flex items-center gap-3 shrink-0">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {unlocked ? "Desbloqueado" : "Bloqueado"}
                    </span>
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer accent-[var(--gold)]"
                      checked={unlocked}
                      disabled={pending}
                      onChange={() => toggleModule(mod.id, mod.title)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => deleteModule(mod.id, mod.title)}
                    disabled={pending}
                    className="shrink-0 opacity-50 hover:opacity-100 disabled:opacity-30"
                    title="Eliminar módulo"
                    aria-label={`Eliminar módulo ${mod.title}`}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
                  </button>
                </div>
              </div>

              {/* Lecciones del módulo: info, video y PDF */}
              <div className="mt-4 space-y-2">
                {modLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-sm px-3 py-2"
                    style={{ background: "var(--background)" }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        {editingLessonId === lesson.id ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                value={editingLessonTitle}
                                onChange={(e) => setEditingLessonTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveLessonEdit(lesson.id);
                                  if (e.key === "Escape") {
                                    setEditingLessonId(null);
                                    setEditingLessonTitle("");
                                    setEditingLessonDescription("");
                                  }
                                }}
                                className="flex-1 bg-transparent border-b py-1 text-sm outline-none focus:border-[var(--gold)]"
                                style={{
                                  borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                                  color: "var(--ink)",
                                }}
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveLessonEdit(lesson.id)}
                                disabled={pending || !editingLessonTitle.trim()}
                                className="shrink-0 opacity-70 hover:opacity-100 disabled:opacity-30"
                                title="Guardar"
                                aria-label="Guardar lección"
                              >
                                <Check className="w-4 h-4" style={{ color: "var(--ink)" }} />
                              </button>
                            </div>
                            <textarea
                              value={editingLessonDescription}
                              onChange={(e) => setEditingLessonDescription(e.target.value)}
                              placeholder="Descripción (opcional)"
                              rows={2}
                              className="w-full bg-transparent border-b py-1 text-xs outline-none focus:border-[var(--gold)] resize-none"
                              style={{
                                borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                                color: "var(--ink)",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="text-sm truncate" style={{ color: "var(--ink)" }}>
                              {lesson.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLessonId(lesson.id);
                                setEditingLessonTitle(lesson.title);
                                setEditingLessonDescription(lesson.description ?? "");
                              }}
                              className="shrink-0 opacity-50 hover:opacity-100"
                              title="Editar lección"
                              aria-label={`Editar lección ${lesson.title}`}
                            >
                              <Pencil
                                className="w-3.5 h-3.5"
                                style={{ color: "var(--ink-soft)" }}
                              />
                            </button>
                          </div>
                        )}
                        {lesson.description && (
                          <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                            <LinkifiedText text={lesson.description} />
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer accent-[var(--gold)]"
                          checked={lesson.is_published}
                          disabled={pending}
                          onChange={() =>
                            toggleLesson(lesson.id, lesson.is_published, lesson.title)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => deleteLesson(lesson.id, lesson.title)}
                          disabled={pending}
                          className="shrink-0 opacity-50 hover:opacity-100 disabled:opacity-30"
                          title="Eliminar lección"
                          aria-label={`Eliminar lección ${lesson.title}`}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
                        </button>
                      </div>
                    </div>

                    {/* Archivos: PDF principal y secundarios anidados */}
                    <div
                      className="mt-2 pt-2 border-t space-y-2"
                      style={{
                        borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)",
                      }}
                    >
                      {lesson.pdf_url ? (
                        <div className="flex items-center gap-2 text-xs">
                          <LessonFileControl
                            url={lesson.pdf_url}
                            name={lesson.pdf_name}
                            editing={editingFileName === `${lesson.id}-pdf`}
                            editingValue={editingFileNameValue}
                            pending={pending}
                            onStartEdit={() => {
                              setEditingFileName(`${lesson.id}-pdf`);
                              setEditingFileNameValue(lesson.pdf_name ?? "");
                            }}
                            onNameChange={setEditingFileNameValue}
                            onSave={() => saveFileName(lesson.id)}
                            onCancel={() => {
                              setEditingFileName(null);
                              setEditingFileNameValue("");
                            }}
                            onRemove={() => removeFile(lesson.id, lesson.pdf_name || "el PDF")}
                          />
                        </div>
                      ) : (
                        <UploadButton
                          label="Subir PDF"
                          accept="application/pdf"
                          uploading={uploading === `${lesson.id}-pdf`}
                          onSelect={(file) => uploadPdf(lesson.id, file)}
                        />
                      )}

                      <div className="pl-5 space-y-1">
                        {(lesson.secondary_pdf_urls ?? []).map((file, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <FileText
                              className="w-3.5 h-3.5 shrink-0"
                              style={{ color: "var(--ink-soft)" }}
                            />
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="truncate"
                              style={{ color: "var(--ink-soft)" }}
                            >
                              {file.name}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeSecondaryPdf(lesson.id, i)}
                              disabled={pending}
                              className="ml-auto shrink-0 opacity-60 hover:opacity-100"
                              title="Quitar PDF"
                              aria-label={`Quitar ${file.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {(lesson.secondary_pdf_urls ?? []).length < 4 && (
                          <UploadButton
                            label="Agregar PDF secundario"
                            accept="application/pdf"
                            uploading={uploading === `${lesson.id}-pdf-secondary`}
                            onSelect={(file) => uploadSecondaryPdf(lesson.id, file)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {modLessons.length === 0 && addingLessonTo !== mod.id && (
                  <p className="text-xs px-1" style={{ color: "var(--ink-soft)" }}>
                    Sin lecciones todavía.
                  </p>
                )}

                {/* Formulario inline para crear lección */}
                {addingLessonTo === mod.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <input
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="Título de la lección"
                        className="flex-1 bg-transparent border-b py-2 text-sm outline-none focus:border-[var(--gold)]"
                        style={{
                          borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                          color: "var(--ink)",
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => addLesson(mod.id)}
                        disabled={pending || !newLessonTitle.trim()}
                        className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full disabled:opacity-50"
                        style={{ background: "var(--ink)", color: "var(--cream)" }}
                      >
                        Crear
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingLessonTo(null);
                          setNewLessonTitle("");
                          setNewLessonDescription("");
                        }}
                        className="text-[10px] uppercase tracking-widest opacity-60"
                      >
                        Cancelar
                      </button>
                    </div>
                    <textarea
                      value={newLessonDescription}
                      onChange={(e) => setNewLessonDescription(e.target.value)}
                      placeholder="Descripción (opcional)"
                      rows={2}
                      className="w-full bg-transparent border-b py-1 text-xs outline-none focus:border-[var(--gold)] resize-none"
                      style={{
                        borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingLessonTo(mod.id)}
                    className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-1"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    <PlusCircle className="w-3 h-3" /> Agregar lección
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Formulario para crear módulo */}
        {addingModule ? (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2 items-center">
              <input
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Título del módulo"
                className="flex-1 bg-transparent border-b py-2 text-sm outline-none focus:border-[var(--gold)]"
                style={{
                  borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                  color: "var(--ink)",
                }}
                autoFocus
              />
              <button
                type="button"
                onClick={addModule}
                disabled={pending || !newModuleTitle.trim()}
                className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full disabled:opacity-50"
                style={{ background: "var(--ink)", color: "var(--cream)" }}
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingModule(false);
                  setNewModuleTitle("");
                  setNewModuleDescription("");
                }}
                className="text-[10px] uppercase tracking-widest opacity-60"
              >
                Cancelar
              </button>
            </div>
            <textarea
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
              placeholder="Descripción (opcional)"
              rows={2}
              className="w-full bg-transparent border-b py-1 text-xs outline-none focus:border-[var(--gold)] resize-none"
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
                color: "var(--ink)",
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddingModule(true)}
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest"
            style={{ color: "var(--ink-soft)" }}
          >
            <PlusCircle className="w-3 h-3" /> Agregar módulo
          </button>
        )}
      </div>
    </div>
  );
}

function UploadButton({
  label,
  accept,
  uploading,
  onSelect,
}: {
  label: string;
  accept: string;
  uploading: boolean;
  onSelect: (file: File) => void;
}) {
  return (
    <label
      className="inline-flex items-center gap-1 text-xs cursor-pointer"
      style={{ color: "var(--ink-soft)", opacity: uploading ? 0.5 : 1 }}
    >
      {uploading ? "Subiendo..." : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelect(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function LessonFileControl({
  url,
  name,
  editing,
  editingValue,
  pending,
  onStartEdit,
  onNameChange,
  onSave,
  onCancel,
  onRemove,
}: {
  url: string;
  name: string | null;
  editing: boolean;
  editingValue: string;
  pending: boolean;
  onStartEdit: () => void;
  onNameChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const label = name || "PDF";

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          value={editingValue}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") onCancel();
          }}
          className="w-28 bg-transparent border-b py-0.5 text-xs outline-none focus:border-[var(--gold)]"
          style={{
            borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
            color: "var(--ink)",
          }}
          autoFocus
        />
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="shrink-0 opacity-70 hover:opacity-100 disabled:opacity-30"
          title="Guardar"
          aria-label="Guardar nombre del PDF"
        >
          <Check className="w-3.5 h-3.5" style={{ color: "var(--ink)" }} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs"
        style={{ color: "var(--ink-soft)" }}
      >
        <FileText className="w-3.5 h-3.5" /> {label}
      </a>
      <button
        type="button"
        onClick={onStartEdit}
        disabled={pending}
        className="shrink-0 opacity-50 hover:opacity-100 disabled:opacity-30"
        title="Editar nombre del PDF"
        aria-label={`Editar nombre de ${label}`}
      >
        <Pencil className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={pending}
        className="shrink-0 opacity-50 hover:opacity-100 disabled:opacity-30"
        title="Eliminar PDF"
        aria-label={`Eliminar ${label}`}
      >
        <Trash2 className="w-3.5 h-3.5" style={{ color: "var(--ink-soft)" }} />
      </button>
    </div>
  );
}
