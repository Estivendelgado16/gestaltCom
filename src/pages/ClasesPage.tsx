import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronDown, FileText, Lock, Play, X } from "lucide-react";
import { useLessons, useLessonPreviews, useModules } from "@/hooks/useLessons";
import { formacionService } from "@/services/formacion.service";
import type { Lesson, LessonPreview, Module } from "@/types";

/** Clase desbloqueada: título + icono de video que abre un popup (lazy) + PDF. */
function ClaseDesbloqueada({ lesson }: { lesson: Lesson }) {
  // El reproductor solo se monta cuando el usuario abre el popup (lazy),
  // para no cargar todos los videos de la página de una vez.
  const [showVideo, setShowVideo] = useState(false);

  // Cerrar el popup con la tecla Escape.
  useEffect(() => {
    if (!showVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowVideo(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showVideo]);

  return (
    <div className="rounded-sm border border-ink/15 p-5">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-ink">{lesson.title}</div>
          {lesson.description && (
            <div className="text-xs mt-0.5 truncate text-ink-soft">{lesson.description}</div>
          )}
        </div>

        {lesson.video_url ? (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            aria-label={`Ver video de ${lesson.title}`}
            title="Ver video"
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-ink text-cream transition-transform hover:scale-105"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <span
            title="El video se subirá próximamente"
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-sand-light text-ink-soft"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </span>
        )}

        {lesson.pdf_url && (
          <a
            href={lesson.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir PDF de ${lesson.title}`}
            title="Material PDF"
            className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full border border-ink/20 text-ink transition-colors hover:bg-sand-light/40"
          >
            <FileText className="w-4 h-4" />
          </a>
        )}
      </div>

      {showVideo && lesson.video_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              aria-label="Cerrar video"
              className="absolute -top-12 right-0 flex items-center justify-center w-10 h-10 rounded-full bg-cream text-ink transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              controls
              autoPlay
              preload="metadata"
              src={lesson.video_url}
              className="w-full rounded-sm bg-black aspect-video"
            />
          </div>
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
          <div className="text-xs mt-0.5 truncate text-ink-soft">{preview.description}</div>
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
      <section className="pt-6 pb-12">
        <div className="text-[11px] uppercase tracking-[0.35em] text-ink-soft">Mi formación</div>
        <h1 className="mt-8 text-4xl md:text-6xl max-w-4xl leading-[1.02]">
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
