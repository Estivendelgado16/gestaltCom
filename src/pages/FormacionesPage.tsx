import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { formacionService } from "@/services/formacion.service";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FeaturedCourseCard } from "@/components/site/CourseCard";
import { FormacionDetails } from "@/components/site/FormacionDetails";
import { useNavigate } from "@tanstack/react-router";
import type { Formacion } from "@/types";
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
  const nav = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null); // card ampliada (cursos/talleres)

  // Diplomado -> /diplomado; cursos/talleres/otros se amplían flotando
  function handleCardClick(c: Formacion) {
    if (c.tipo === "DIPLOMADO") {
      nav({ to: "/diplomado" });
    } else {
      setExpandedId((prev) => (prev === c.id ? null : c.id));
    }
  }
  const { data: courses = [] } = useQuery({
    queryKey: ["formaciones", "publicadas"],
    queryFn: () => formacionService.getFormaciones({ soloPublicadas: true }),
  });
  // Activa = sin fecha de fin, o cuya fecha de fin aún no ha pasado
  const today = new Date().toISOString().slice(0, 10);
  const active = courses.filter((c) => !c.fecha_fin || c.fecha_fin >= today);
  const finished = courses.filter((c) => c.fecha_fin && c.fecha_fin < today);
  const expandedCourse = courses.find((c) => c.id === expandedId) ?? null;

  // El diplomado siempre es protagonista: va arriba y el resto debajo.
  const diplomados = active.filter((c) => c.tipo === "DIPLOMADO");
  const otros = active.filter((c) => c.tipo !== "DIPLOMADO");

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Formaciones
        </div>
<h1 className="mt-8 text-3xl md:text-4xl lg:text-5xl leading-[1.1]" style={{ width: "90%" }}>
          "El momento en que el terapeuta está{" "}
          <span style={{ color: "var(--gold)" }}>
            presente en la ausencia, esta ya no está ausente
          </span>{" "}
          , el dolor se despliega, toma una nueva vida en la carne de los dos, los dos se vuelven
          más vivos”.
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Las formaciones son encuentros que se configuran como espacios de aprendizaje
          experiencial, donde el conocimiento no se transmite únicamente como contenido, sino que se
          construye en el encuentro, en diálogo con la experiencia y el contexto. Estos espacios
          están orientados a acompañar procesos de formación que articulen el desarrollo profesional
          con la experiencia personal, promoviendo una mirada crítica, sensible y comprometida con
          el quehacer terapéutico.
        </p>
      </section>

      {/* Diplomado: protagonista, siempre arriba */}
      {diplomados.length > 0 && (
        <section className="container-clinic pb-24">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="text-2xl">Diplomado</h2>
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
              {diplomados.length} programa{diplomados.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {diplomados.map((c, i) => (
              <FeaturedCourseCard
                key={c.id}
                course={c}
                delay={i * 120}
                onClick={() => handleCardClick(c)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Resto de formaciones */}
      <section className="container-clinic pb-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-2xl">Formaciones disponibles</h2>
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
            {otros.length} programa{otros.length === 1 ? "" : "s"}
          </span>
        </div>
        {otros.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No hay otras formaciones activas en este momento.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {otros.map((c, i) => (
              <FeaturedCourseCard
                key={c.id}
                course={c}
                delay={i * 120}
                onClick={() => handleCardClick(c)}
              />
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
                        {c.titulo}
                      </span>
                      <span
                        className="hidden md:block col-span-3 text-xs uppercase tracking-widest"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {c.fecha_inicio ? fmt(c.fecha_inicio) : "—"}
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
                      {c.descripcion}
                      {(c.modalidad || c.duracion) && (
                        <div className="mt-3 text-xs opacity-70">
                          {c.modalidad}
                          {c.modalidad && c.duracion ? " · " : ""}
                          {c.duracion}
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
      {/* Cursos/talleres: la card se agranda y flota sobre las demás */}
      {expandedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ background: "color-mix(in oklab, var(--ink) 55%, transparent)" }}
          onClick={() => setExpandedId(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl animate-rise"
            onClick={(e) => e.stopPropagation()}
          >
            <FeaturedCourseCard course={expandedCourse} />
            <div
              className="p-8 md:p-10 border-t"
              style={{
                background: "var(--background)",
                borderColor: "color-mix(in oklab, var(--gold) 40%, transparent)",
              }}
            >
              <FormacionDetails formacion={expandedCourse} />
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
