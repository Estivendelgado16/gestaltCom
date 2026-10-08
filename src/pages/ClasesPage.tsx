import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, FileText, Lock } from "lucide-react";
import { useLessons, useLessonPreviews, useModules } from "@/hooks/useLessons";
import { formacionService } from "@/services/formacion.service";
import { LinkifiedText } from "@/components/LinkifiedText";
import type { Lesson, LessonPreview, Module } from "@/types";

/** Clase desbloqueada: título + documento principal y PDFs secundarios. */
function ClaseDesbloqueada({ lesson }: { lesson: Lesson }) {
  const secondary = lesson.secondary_pdf_urls ?? [];

  return (
    <div className="rounded-sm border border-ink/15 p-5">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink">{lesson.title}</div>
          {lesson.description && (
            <div className="text-xs mt-0.5 text-ink-soft">
              <LinkifiedText text={lesson.description} />
            </div>
          )}
        </div>
      </div>

      {(lesson.pdf_url || secondary.length > 0) && (
        <div className="mt-4 pt-4 border-t border-ink/10 space-y-2">
          {lesson.pdf_url && (
            <a
              href={lesson.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-sm border border-ink/20 px-3 py-2.5 transition-colors hover:bg-sand-light/40"
            >
              <FileText className="w-4 h-4 shrink-0 text-gold" />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink truncate">
                  {lesson.pdf_name || "Documento principal"}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-ink-soft">
                  Documento principal
                </div>
              </div>
            </a>
          )}

          {secondary.length > 0 && (
            <div className="pl-6 space-y-1.5">
              {secondary.map((file) => (
                <a
                  key={file.url}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-xs transition-colors hover:bg-sand-light/40"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-ink-soft" />
                  <span className="truncate text-ink">{file.name}</span>
                  <span className="ml-auto shrink-0 text-[9px] uppercase tracking-widest text-ink-soft">
                    Secundario
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Clase bloqueada (no publicada por el admin): opaca y sin acceso. */
function ClaseBloqueada({ preview }: { preview: LessonPreview }) {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-ink/10 p-4 opacity-50 cursor-not-allowed">
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-sand-light">
        <Lock className="w-4 h-4 text-ink-soft" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-ink">{preview.title}</div>
        {preview.description && (
          <div className="text-xs mt-0.5 text-ink-soft">
            <LinkifiedText text={preview.description} />
          </div>
        )}
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full bg-sand-light text-ink-soft">
        <Lock className="w-3 h-3" /> Bloqueado
      </span>
    </div>
  );
}

/** Módulo colapsable con sus clases dentro. */
function ModuloAcordeon({
  module,
  previews,
  publishedById,
  defaultOpen,
}: {
  module: Module;
  previews: LessonPreview[];
  publishedById: Map<string, Lesson>;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const unlocked = previews.filter((p) => p.is_published).length;
  const allLocked = previews.length === 0 || unlocked === 0;

  return (
    <div className={`rounded-sm border border-ink/15 ${allLocked ? "opacity-70" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-sand-light/30"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl text-ink">{module.title}</h2>
            {allLocked && <Lock className="w-4 h-4 text-ink-soft" />}
          </div>
          {module.description && <p className="text-xs mt-1 text-ink-soft">{module.description}</p>}
          <p className="text-[10px] uppercase tracking-widest mt-2 text-ink-soft">
            {previews.length} {previews.length === 1 ? "clase" : "clases"}
            {unlocked > 0 && ` · ${unlocked} ${unlocked === 1 ? "disponible" : "disponibles"}`}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {previews.length === 0 ? (
            <p className="text-xs italic text-ink-soft">
              Las clases de este módulo se publicarán próximamente.
            </p>
          ) : (
            previews.map((preview) => {
              const full = preview.is_published ? publishedById.get(preview.id) : undefined;
              return full ? (
                <ClaseDesbloqueada key={preview.id} lesson={full} />
              ) : (
                <ClaseBloqueada key={preview.id} preview={preview} />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export function ClasesPage() {
  // Título del diplomado (formación publicada más reciente de tipo DIPLOMADO,
  // o cualquier formación publicada si no hay diplomado).
  const { data: diplomado, isLoading: diplomadoLoading } = useQuery({
    queryKey: ["formaciones", "diplomado-titulo"],
    queryFn: async () => {
      const publicadas = await formacionService.getFormaciones({ soloPublicadas: true });
      return publicadas.find((f) => f.tipo === "DIPLOMADO") ?? publicadas[0] ?? null;
    },
  });

  // Lecciones publicadas con URLs (RLS garantiza que solo usuarios pagos las ven).
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons();
  // Estructura completa (publicadas + bloqueadas) sin URLs sensibles.
  const { data: previews = [], isLoading: previewsLoading } = useLessonPreviews();
  // El usuario pagado solo ve el diplomado al que corresponde su área.
  const { data: modules = [], isLoading: modulesLoading } = useModules(diplomado?.id, !!diplomado);

  const fetching = diplomadoLoading || lessonsLoading || previewsLoading || modulesLoading;

  const publishedById = new Map(lessons.map((l) => [l.id, l]));

  const previewsByModule = new Map<string, LessonPreview[]>();
  for (const preview of previews) {
    if (!preview.module_id) continue;
    const list = previewsByModule.get(preview.module_id) ?? [];
    list.push(preview);
    previewsByModule.set(preview.module_id, list);
  }

  return (
    <>
      <section className="-mt-8 -mx-8 md:-mt-14 md:-mx-14">
        <img
          src="/img/BannerDiplomadoUsers.jpeg"
          alt="Diplomado"
          className="w-full block object-cover"
        />
      </section>

      <section className="pt-6 pb-12">
        <div className="text-[11px] uppercase tracking-[0.35em] text-ink-soft">Mi formación</div>
        <h1 className="mt-8 text-2xl md:text-3xl max-w-4xl leading-[1.1]">
          {diplomado?.titulo ?? (
            <>
              Tus <span className="text-gold">clases</span>
            </>
          )}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-ink-soft">
          Las clases se desbloquean a medida que el administrador publica el contenido.
        </p>
      </section>

      <section className="pb-28 max-w-4xl">
        {fetching ? (
          <p className="text-sm text-ink-soft">Cargando clases...</p>
        ) : modules.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink-soft">
              No hay módulos disponibles aún. El administrador está configurando el contenido.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {modules.map((mod, i) => (
              <ModuloAcordeon
                key={mod.id}
                module={mod}
                previews={previewsByModule.get(mod.id) ?? []}
                publishedById={publishedById}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
