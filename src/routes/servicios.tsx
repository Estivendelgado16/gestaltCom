import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — Comunidad Gestáltica" },
      { name: "description", content: "Terapia individual, supervisión clínica y formación en Gestalt de Campo." },
      { property: "og:title", content: "Servicios — Comunidad Gestáltica" },
      { property: "og:description", content: "Terapia, supervisión y formación." },
    ],
  }),
  component: Services,
});

const services = [
  {
    n: "01",
    t: "Terapia individual",
    d: "Proceso terapéutico presencial u online, con enfoque fenomenológico y sensible al cuerpo. Sesiones semanales de 55 minutos.",
    tag: "Adultos",
  },
  {
    n: "02",
    t: "Supervisión clínica",
    d: "Espacio de supervisión individual y grupal para terapeutas en ejercicio, con foco en la lectura del campo y el uso de sí mismo.",
    tag: "Profesionales",
  },
  {
    n: "03",
    t: "Formación y diplomados",
    d: "Programas de formación intensiva, seminarios temáticos y encuentros quincenales de estudio en Gestalt de Campo.",
    tag: "Formación",
  },
  {
    n: "04",
    t: "Conferencias y talleres",
    d: "Intervenciones para instituciones, universidades y organizaciones sobre salud mental, vínculos y práctica clínica contemporánea.",
    tag: "Instituciones",
  },
];

function Services() {
  return (
    <SiteLayout>
      <section className="container-clinic pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>
          Servicios
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Cuatro modos de <span style={{ color: "var(--gold)" }}>habitar</span> el campo.
        </h1>
      </section>

      <section className="container-clinic pb-28">
        <div className="grid gap-px" style={{ background: "color-mix(in oklab, var(--ink) 12%, transparent)" }}>
          {services.map((s) => (
            <article
              key={s.n}
              className="bg-background p-10 md:p-16 grid md:grid-cols-12 gap-8 hover:bg-secondary/40 transition-colors group"
            >
              <div className="md:col-span-2">
                <div className="text-[11px] tracking-[0.3em]" style={{ color: "var(--gold)" }}>{s.n}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--ink-soft)" }}>{s.tag}</div>
              </div>
              <div className="md:col-span-7">
                <h2 className="text-3xl md:text-4xl">{s.t}</h2>
                <p className="mt-5 text-base leading-relaxed max-w-xl" style={{ color: "var(--ink-soft)" }}>{s.d}</p>
              </div>
              <div className="md:col-span-3 flex md:justify-end items-end">
                <Link
                  to="/contacto"
                  className="text-sm uppercase tracking-widest border-b pb-1 transition-transform group-hover:-translate-y-0.5"
                  style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
                >
                  Solicitar información
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
