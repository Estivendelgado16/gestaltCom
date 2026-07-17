import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunidad Gestáltica — Estudios de Gestalt de Campo" },
      {
        name: "description",
        content:
          "Espacio de formación, práctica clínica y comunidad en Terapia Gestalt de Campo dirigido por Dany Mora Bracho.",
      },
      { property: "og:title", content: "Comunidad Gestáltica" },
      {
        property: "og:description",
        content: "Estudios de Gestalt de Campo. Formación, terapia y comunidad.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-clinic pt-24 pb-32 md:pt-36 md:pb-44 grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8 animate-rise">
            <div
              className="text-[11px] uppercase tracking-[0.35em] mb-8"
              style={{ color: "var(--ink-soft)" }}
            >
              Estudios de Gestalt de Campo
            </div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
              style={{ color: "var(--ink)" }}
            >
              El encuentro
              <br />
              como <em className="not-italic" style={{ color: "var(--gold)" }}>fenómeno</em>
              <br />
              de campo.
            </h1>
            <p
              className="mt-10 max-w-xl text-lg leading-relaxed"
              style={{ color: "var(--ink-soft)" }}
            >
              Comunidad Gestáltica es un espacio de estudio, práctica clínica y
              comunidad fundado por Dany Mora Bracho. Formamos terapeutas en el
              paradigma contemporáneo de la Gestalt de Campo.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link
                to="/formaciones"
                className="group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--ink)", color: "var(--cream)" }}
              >
                Ver formaciones
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/sobre-mi"
                className="text-sm uppercase tracking-widest border-b pb-1"
                style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
              >
                Conocer a Dany
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 animate-rise-delay">
            <div
              className="aspect-[3/4] rounded-sm relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, var(--sand-light), var(--cream))",
              }}
            >
              <div
                className="absolute inset-8 rounded-sm border"
                style={{ borderColor: "color-mix(in oklab, var(--ink) 18%, transparent)" }}
              />
              <svg viewBox="0 0 200 260" className="absolute inset-0 w-full h-full">
                <path
                  d="M100 40c-30 0-50 20-50 45 0 20 15 30 30 40s30 20 30 40-15 35-40 35"
                  stroke="var(--ink)"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="140" cy="60" r="6" fill="var(--gold)" />
                <circle cx="60" cy="200" r="4" fill="var(--ink-soft)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto strip */}
      <section style={{ background: "var(--sand-light)" }}>
        <div className="container-clinic py-24 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>
              Manifiesto
            </div>
          </div>
          <p className="md:col-span-3 text-2xl md:text-3xl leading-snug" style={{ color: "var(--ink)" }}>
            No trabajamos con individuos aislados: trabajamos con el
            <em className="not-italic" style={{ color: "var(--gold)" }}> campo </em>
            que emerge entre el terapeuta, el paciente y el mundo.
            El síntoma es un mensaje del campo, no una falla del sujeto.
          </p>
        </div>
      </section>

      {/* Áreas */}
      <section className="container-clinic py-28">
        <div className="grid md:grid-cols-3 gap-px" style={{ background: "color-mix(in oklab, var(--ink) 12%, transparent)" }}>
          {[
            { n: "01", t: "Terapia individual", d: "Proceso terapéutico desde una escucha fenomenológica y corporal." },
            { n: "02", t: "Supervisión clínica", d: "Espacio para pensar la práctica desde la perspectiva de campo." },
            { n: "03", t: "Formación profesional", d: "Diplomados, seminarios y encuentros para terapeutas en ejercicio." },
          ].map((s) => (
            <div key={s.n} className="p-10 bg-background hover:bg-secondary/40 transition-colors">
              <div className="text-[11px] tracking-[0.3em]" style={{ color: "var(--gold)" }}>{s.n}</div>
              <h3 className="mt-6 text-2xl">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
