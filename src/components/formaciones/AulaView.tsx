import { useAuth } from "@/context/AuthContext";
import { useLessons } from "@/hooks/useLessons";
import { Lesson } from "@/types";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useFormacionModules } from "@/services/formacion.service";
import { Lock, Play, FileText, Upload } from "lucide-react";

export function AulaView({ formacionId }: { formacionId: string }) {
  const { user, hasPaidAccess, loading: authLoading } = useAuth();
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons(formacionId);
  const { data: modules = [], isLoading: modulesLoading } = useFormacionModules(formacionId);

  useEffect(() => {
    if (!authLoading && !user) {
      // Navigate to login if no user
    }
  }, [user, authLoading]);

  const fetching = authLoading || lessonsLoading || modulesLoading;

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="container-clinic pt-32 pb-20 text-center">
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Cargando...
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!user) return null;

  if (!hasPaidAccess) {
    return (
      <SiteLayout>
        <div className="container-clinic pt-32 pb-20 max-w-lg text-center">
          <Lock className="w-16 h-16 mx-auto mb-6" style={{ color: "var(--gold)" }} />
          <h1 className="text-4xl mb-4" style={{ color: "var(--ink)" }}>
            Acceso restringido
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
            Para acceder a las clases de esta formación, necesitas tener una inscripción activa
            y el pago aprobado por el administrador.
          </p>
          <a
            href={`/formaciones/${formacionId}/payment`}
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <Upload className="w-4 h-4" /> Inscribirme y pagar
          </a>
        </div>
      </SiteLayout>
    );
  }

  const lessonsByModule = new Map<string, Lesson[]>();
  const ungrouped: Lesson[] = [];

  for (const lesson of lessons) {
    if (lesson.module_id) {
      const list = lessonsByModule.get(lesson.module_id) ?? [];
      list.push(lesson);
      lessonsByModule.set(lesson.module_id, list);
    } else {
      ungrouped.push(lesson);
    }
  }

  return (
    <SiteLayout>
      <section className="container-clinic pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>
          Contenido del curso
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Tus <span style={{ color: "var(--gold)" }}>clases</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Acceso habilitado. Explora las lecciones disponibles.
        </p>
      </section>

      <section className="container-clinic pb-28">
        {fetching ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Cargando clases...
          </p>
        ) : lessons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              No hay clases disponibles aún. El administrador está configurando el contenido.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {modules.map((mod) => {
              const modLessons = lessonsByModule.get(mod.id) ?? [];
              if (modLessons.length === 0) return null;
              return (
                <div key={mod.id}>
                  <h2 className="text-2xl mb-2" style={{ color: "var(--ink)" }}>
                    {mod.title}
                  </h2>
                  {mod.description && (
                    <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
                      {mod.description}
                    </p>
                  )}
                  <div className="space-y-3">
                    {modLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-sm border transition-colors hover:bg-[color-mix(in_oklab,var(--sand-light)_30%,transparent)]" style={{ borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)" }}>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--sand-light)" }}>
                          <Play className="w-4 h-4" style={{ color: "var(--ink)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                            {lesson.title}
                          </div>
                          {lesson.description && (
                            <div className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-soft)" }}>
                              {lesson.description}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {lesson.video_url && (
                            <a
                              href={lesson.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                              style={{ background: "var(--ink)", color: "var(--cream)" }}
                            >
                              <Play className="w-3 h-3" /> Ver
                            </a>
                          )}
                          {lesson.pdf_url && (
                            <a
                              href={lesson.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border"
                              style={{
                                borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
                                color: "var(--ink-soft)",
                              }}
                            >
                              <FileText className="w-3 h-3" /> PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {ungrouped.length > 0 && (
              <div>
                <h2 className="text-2xl mb-6" style={{ color: "var(--ink)" }}>
                  Clases
                </h2>
                <div className="space-y-3">
                  {ungrouped.map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-4 p-3 rounded-sm border transition-colors hover:bg-[color-mix(in_oklab,var(--sand-light)_30%,transparent)]" style={{ borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)" }}>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--sand-light)" }}>
                        <Play className="w-4 h-4" style={{ color: "var(--ink)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                          {lesson.title}
                        </div>
                        {lesson.description && (
                          <div className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-soft)" }}>
                            {lesson.description}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {lesson.video_url && (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
                            style={{ background: "var(--ink)", color: "var(--cream)" }}
                          >
                            <Play className="w-3 h-3" /> Ver
                          </a>
                        )}
                        {lesson.pdf_url && (
                          <a
                            href={lesson.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border"
                            style={{
                              borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
                              color: "var(--ink-soft)",
                            }}
                          >
                            <FileText className="w-3 h-3" /> PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}