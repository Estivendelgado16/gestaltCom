import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ArrowRight } from "lucide-react";

export function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-clinic pt-6 pb-32 md:pt-10 md:pb-44 grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-8 animate-rise">
            <div
              className="text-[11px] uppercase tracking-[0.35em] mb-8"
              style={{ color: "var(--ink-soft)" }}
            >
              Estudios de Gestalt de Campo
            </div>
            <h1
              className="text-2xl md:text-4xl lg:text-5xl leading-[1.1]"
              style={{ color: "var(--ink)" }}
            >
              “Necesitamos estar preparados para ser «sorprendidos»
              <br />
              ante el{" "}
              <em className="not-italic" style={{ color: "var(--gold)" }}>
                poder aterrador, la delicada fragilidad y la belleza efímera del mundo
              </em>
              <br />
              que emana hacia adelante en cada «ahora»”.
            </h1>
            <p>Merleau-Ponty</p>
            <div
              className="mt-10 max-w-3xl text-lg leading-relaxed space-y-5"
              style={{ color: "var(--ink-soft)" }}
            >
              <p>
                Comunidad Gestáltica es un espacio de encuentro, formación y difusión de la Terapia
                Gestalt con perspectiva de campo. Nace con el propósito de propiciar un diálogo
                entre teoría, clínica y experiencia, favoreciendo la construcción colectiva de
                conocimiento y el intercambio académico entre profesionales de distintos contextos
                culturales.
              </p>
              <p>
                Entendemos la Gestalt de Campo como una práctica viva, contextual y en permanente
                transformación. Por ello, promovemos la formación, supervisión y entrenamiento
                clínico, la reflexión epistemológica y el estudio de la psicopatología desde una
                mirada de campo, sosteniendo la pluralidad de desarrollos que enriquecen la
                tradición gestáltica.
              </p>
              <p>
                Aspiramos a continuar la difusión y desarrollo de la Terapia Gestalt de Campo,
                fortaleciendo una red de profesionales comprometidos con la actualización permanente
                y la creación de comunidad como fundamento ético y formativo.
              </p>
            </div>
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
                Conocer a su fundador
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 animate-rise-delay mt-8 md:mt-24">
            <div
              className="aspect-3/4 rounded-sm relative overflow-hidden"
              style={{
                background: "linear-gradient(160deg, var(--sand-light), var(--cream))",
              }}
            >
              <video
                src="/img/videoHome1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manifiesto */}
      <section style={{ background: "var(--sand-light)" }}>
        <div className="container-clinic py-24 grid md:grid-cols-3 gap-10 items-center">
          <div className="flex flex-col items-center text-center">
            <video
              src="/img/videoHome2.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="mt-6 w-64 rounded-sm object-cover aspect-square"
            />
          </div>
          <p
            className="md:col-span-2 text-2xl md:text-3xl leading-snug"
            style={{ color: "var(--ink)" }}
          >
            "
            <em className="not-italic" style={{ color: "var(--gold)" }}>
              {" "}
              Otro debe prestar su propia carne{" "}
            </em>
            para permitir que lo no formado llegue a la presencia, es necesario
            <em className="not-italic" style={{ color: "var(--gold)" }}>
              {" "}
              que alguien esté presente y disponible{" "}
            </em>
            para sentir lo no sentido porque no es sentible”.
            <span className="flex">Gianni Francesetti</span>
          </p>
        </div>
      </section>

      {/* Áreas */}
      <section className="container-clinic py-28">
        <div
          className="grid md:grid-cols-3 gap-px"
          style={{ background: "color-mix(in oklab, var(--ink) 12%, transparent)" }}
        >
          {[
            {
              n: "01",
              t: "Terapia individual",
              d: "Proceso terapéutico desde una escucha fenomenológica y corporal.",
              img: "/img/terapia.jpg",
              alt: "Pies descalzos caminando sobre un árbol",
            },
            {
              n: "02",
              t: "Supervisión clínica",
              d: "Espacio para pensar la práctica desde la perspectiva de campo.",
              img: "/img/supervision.jpg",
              alt: "Gotas de agua creando ondas",
            },
            {
              n: "03",
              t: "Formación profesional",
              d: "Diplomados, seminarios y encuentros para terapeutas en ejercicio.",
              img: "/img/formacion.jpg",
              alt: "Manos pintadas juntas",
            },
          ].map((s) => (
            <div key={s.n} className="p-10 bg-background hover:bg-secondary/40 transition-colors">
              <div className="text-[11px] tracking-[0.3em]" style={{ color: "var(--gold)" }}>
                {s.n}
              </div>
              <h3 className="mt-6 text-2xl">{s.t}</h3>
              <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                {s.d}
              </p>
              <img src={s.img} alt={s.alt} className="mt-6 w-full h-48 object-cover rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
