import { Fragment, useRef, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { VerMasButton } from "@/components/site/VerMasButton";

export function AboutPage() {
  const [showMore, setShowMore] = useState(false);
  const trayectoriaRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    setShowMore((v) => {
      const next = !v;
      if (next) {
        requestAnimationFrame(() => {
          trayectoriaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return next;
    });
  };

  return (
    <SiteLayout>
      <section className="w-full pb-10">
        <img
          src="/img/banner-about.png"
          alt="Dany Rafael Mora Bracho — Psicólogo, Terapeuta Gestáltico, Supervisor, Docente y Fundador de Comunidad Gestáltica"
          className="w-full block"
        />
      </section>

      <section className="container-clinic pb-28 grid md:grid-cols-12 gap-16">
        <Reveal className="md:col-span-5">
          <div className="group aspect-4/5 rounded-sm relative overflow-hidden">
            <img
              src="/img/dany-mora.jpg"
              alt="Dany Mora Bracho"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Reveal>
        <div
          className="md:col-span-7 space-y-8 text-lg leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          <Reveal>
            <p>
              Creo en la terapia como una experiencia co-construida y situacional, entendiendo esta
              como una matriz de sentido en permanente configuración. Soy psicólogo y terapeuta
              gestáltico con un profundo interés en la Terapia Gestalt desde una perspectiva de
              campo. Mi trayectoria integra la práctica clínica, la formación académica y la
              construcción de comunidad como espacios vivos de encuentro, diálogo y transformación.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p>
              A lo largo de más de una década he acompañado procesos terapéuticos, formativos e
              institucionales. Soy fundador de Comunidad Gestáltica: Estudios de Terapia Gestalt de
              Campo, un proyecto orientado a la reflexión, el intercambio internacional y la
              formación permanente en Gestalt que articula la clínica fenomenológica, la supervisión
              clínica, la clínica y la psicopatología gestáltica.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="hairline pt-8 grid grid-cols-2 gap-8">
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--gold)" }}
                >
                  Formación
                </div>
                <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <li>Psicólogo de orientación clínica</li>
                  <li>Terapeuta Gestáltico con perspectiva de campo</li>
                  <li>Magíster en orientación</li>
                </ul>
              </div>
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: "var(--gold)" }}
                >
                  Práctica
                </div>
                <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                  <li>Consulta privada</li>
                  <li>Supervisión y entrenamiento clínico</li>
                  <li>Formación Gestáltica</li>
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <VerMasButton expanded={showMore} onToggle={handleToggle} />
          </Reveal>
        </div>
      </section>

      {showMore && (
        <section
          ref={trayectoriaRef}
          className="w-full pb-28 pt-10"
          style={{ scrollMarginTop: "6rem", background: "var(--cream)" }}
        >
          <div className="container-clinic animate-rise">
            <div
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)" }}
            >
              Trayectoria
            </div>
            <h3 className="mt-4 text-2xl" style={{ color: "var(--ink)" }}>
              Dany Rafael Mora Bracho
            </h3>

            {/* Timeline */}
            <ol
              className="mt-8 grid md:grid-cols-2 gap-x-16 gap-y-4 text-base"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
            >
              {[
                "Psicólogo egresado de la Universidad Rafael Urdaneta (Venezuela, 2009) y magíster en Orientación, mención Educación, por la Universidad del Zulia (Venezuela, 2021).",
                "Inició su formación en Terapia Gestalt en el Centro Gestáltico San Isidro (Argentina, 2011). Posteriormente, empezó a profundizar en la perspectiva de campo, inicialmente junto a José Miguel Echarte (Argentina, 2021–2026).",
                "Realizó el Posgrado en Terapia Gestalt Relacional y de Campo (2022–2023) y la Formación en Psicopatología desde la Perspectiva Gestalt de Campo (2024–2025) en Terapiados Formación (España).",
                "Se ha formado en Psicopatología desde la Gestalt de Campo en el Centro Gestáltico San Isidro (2022–2023) y cursó el Diplomado en Psicoterapia Gestalt desde la Perspectiva de Campo en CEFEX (Chile) y el Centre Gestalt de Valencia (España) (2025–2026).",
                "Cuenta con formación complementaria en prevención y atención del comportamiento suicida, intervención en salud mental, docencia universitaria, consejería en adicciones y prevención del consumo de drogas, así como con estudios en psicodrama y otras terapias corporales.",
                "Ha trabajado en programas de restablecimiento de derechos de niños, niñas y adolescentes; en unidades de rehabilitación por consumo de sustancias; en el área de neurodesarrollo y rehabilitación integral; y como psicólogo del programa de telepsicología para emergencias en salud mental «Línea Amiga».",
                "Se desempeñó como docente del Centro Gestáltico de Medellín (2017–2025).",
                "Es cofundador de Catarsis: Psicoterapia & Formación desde 2021.",
              ].map((item, i) => (
                <Fragment key={i}>
                  <li
                    className="relative"
                    style={{
                      animation: `rise 0.7s cubic-bezier(.2,.7,.2,1) ${i * 70}ms both`,
                    }}
                  >
                    <span
                      className="inline-block mr-3 w-2 h-2 rounded-full align-middle"
                      style={{ background: "var(--gold)" }}
                    />
                    <span className="align-middle" style={{ color: "var(--ink-soft)" }}>
                      {item}
                    </span>
                    {i === 0 && (
                      <img
                        src="/img/lineaFotos1.png"
                        alt="Momentos de formación de Dany Mora"
                        className="mt-4 w-full block"
                      />
                    )}
                    {i === 1 && (
                      <img
                        src="/img/lineaFotos2.png"
                        alt="Momentos de formación de Dany Mora"
                        className="mt-4 w-full block"
                      />
                    )}
                    {i === 7 && (
                      <a
                        href="https://www.instagram.com/catarsis.mde"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-1 transition-colors"
                        style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
                      >
                        INSTAGRAM · @catarsis.mde
                      </a>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>

            <p className="mt-10  text-base" style={{ color: "var(--ink-soft)" }}>
              Actualmente lidera{" "}
              <strong style={{ color: "var(--ink)" }}>
                Comunidad Gestáltica: Estudios de Terapia Gestalt de Campo
              </strong>
              , un espacio orientado a la reflexión académica, la supervisión y entrenamiento
              clínico y el diálogo internacional en torno a la Terapia Gestalt que inició como un
              proyecto de entrevistas y divulgación que busca ampliar la circulación de saberes y
              experiencias en el campo gestáltico.
            </p>
            <a
              href="https://www.youtube.com/@danymora.gestalt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-1 transition-colors"
              style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
            >
              YouTube · @danymora.gestalt
            </a>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
