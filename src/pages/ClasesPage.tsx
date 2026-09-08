import { Link } from "@tanstack/react-router";
import { useRequireAuth } from "@/context/AuthContext";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { useLessons, useModules } from "@/hooks/useLessons";
import { LessonCard } from "@/components/site/LessonCard";
import type { Lesson } from "@/types";
import { Lock, Upload } from "lucide-react";

export function ClasesPage() {
  const { user, hasPaidAccess, loading: authLoading } = useRequireAuth("/login");
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons();
  const { data: modules = [], isLoading: modulesLoading } = useModules();

  const fetching = authLoading || lessonsLoading || modulesLoading;

  if (authLoading) {
    return <PageLoading />;
  }

  if (!user) return null;

  if (!hasPaidAccess) {
    return (
      <SiteLayout>
        <div className="container-clinic pt-10 pb-20 max-w-lg text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-gold" />
          <h1 className="text-4xl mb-4 text-ink">Acceso restringido</h1>
          <p className="text-sm mb-8 text-ink-soft">
            Para acceder a las clases, necesitas que tu pago haya sido verificado por el
            administrador. Si aún no has enviado tu comprobante de pago, hazlo ahora.
          </p>
          <Link
            to="/pagos"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 bg-ink text-cream"
          >
            <Upload className="w-4 h-4" /> Subir comprobante
          </Link>
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
      <section className="container-clinic pt-6 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em] text-ink-soft">
          Contenido del curso
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Tus <span className="text-gold">clases</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft">
          Acceso habilitado. Explora las lecciones disponibles.
        </p>
      </section>

      <section className="container-clinic pb-28">
        {fetching ? (
          <p className="text-sm text-ink-soft">Cargando clases...</p>
        ) : lessons.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-ink-soft">
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
                  <h2 className="text-2xl mb-2 text-ink">{mod.title}</h2>
                  {mod.description && (
                    <p className="text-sm mb-6 text-ink-soft">{mod.description}</p>
                  )}
                  <div className="space-y-3">
                    {modLessons.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                </div>
              );
            })}

            {ungrouped.length > 0 && (
              <div>
                <h2 className="text-2xl mb-6 text-ink">Clases</h2>
                <div className="space-y-3">
                  {ungrouped.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
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
