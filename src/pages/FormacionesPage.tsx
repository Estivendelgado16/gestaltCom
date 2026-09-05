import { useCourses } from "@/services/course.service";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FeaturedCourseCard } from "@/components/site/CourseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

export function FormacionesPage() {
  const courses = useCourses();
  const active = courses.filter((c) => c.status !== "Finalizado");
  const finished = courses.filter((c) => c.status === "Finalizado");

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Formaciones
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Estudiar la Gestalt como un <span style={{ color: "var(--gold)" }}>oficio</span> vivo.
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Programas actuales y en preparación. Cada formación se sostiene en teoría contemporánea,
          práctica supervisada y comunidad.
        </p>
      </section>

      {/* Activos */}
      <section className="container-clinic pb-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-2xl">En curso y próximas</h2>
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
            {active.length} programa{active.length === 1 ? "" : "s"}
          </span>
        </div>
        {active.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No hay formaciones activas en este momento.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {active.map((c, i) => (
              <FeaturedCourseCard key={c.id} course={c} delay={i * 120} />
            ))}
          </div>
        )}
      </section>

      {/* Historial */}
      {finished.length > 0 && (
        <section className="container-clinic pb-28">
          <div className="hairline pt-16">
            <div
              className="text-[11px] uppercase tracking-[0.35em] mb-6"
              style={{ color: "var(--ink-soft)" }}
            >
              Historial de formaciones
            </div>
            <Accordion type="single" collapsible className="w-full">
              {finished.map((c) => (
                <AccordionItem
                  key={c.id}
                  value={c.id}
                  className="border-b"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 10%, transparent)" }}
                >
                  <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex-1 grid grid-cols-12 gap-4 text-left items-center opacity-70 group-hover:opacity-100 transition-opacity">
                      <span
                        className="col-span-8 md:col-span-6 text-base md:text-lg"
                        style={{ color: "var(--ink)" }}
                      >
                        {c.title}
                      </span>
                      <span
                        className="hidden md:block col-span-3 text-xs uppercase tracking-widest"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {fmt(c.startDate)}
                      </span>
                      <span
                        className="col-span-4 md:col-span-3 text-[10px] uppercase tracking-[0.3em] justify-self-end px-3 py-1 rounded-full"
                        style={{
                          background: "color-mix(in oklab, var(--ink) 8%, transparent)",
                          color: "var(--ink-soft)",
                        }}
                      >
                        Finalizado
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="pb-6 pl-1 max-w-2xl text-sm leading-relaxed"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {c.shortDescription}
                      {(c.location || c.duration) && (
                        <div className="mt-3 text-xs opacity-70">
                          {c.location}
                          {c.location && c.duration ? " · " : ""}
                          {c.duration}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
