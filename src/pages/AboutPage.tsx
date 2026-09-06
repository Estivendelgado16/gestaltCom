import { useRef, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
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
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Sobre mí
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Dany Rafael <span style={{ color: "var(--gold)" }}>Mora Bracho</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Psicólogo, terapeuta gestáltico y formador. Fundador de Comunidad Gestáltica.
        </p>
      </section>

      <section className="container-clinic pb-28 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <div className="aspect-4/5 rounded-sm relative overflow-hidden">
            <img
              src="/img/dany-mora.jpg"
              alt="Dany Mora Bracho"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div
          className="md:col-span-7 space-y-8 text-lg leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          <p>
            Creo en la terapia como una experiencia co-construida y situacional, entendiendo esta
            como una matriz de sentido en permanente configuración. Soy psicólogo y terapeuta
            gestáltico con un profundo interés en la Terapia Gestalt desde una perspectiva de campo.
            Mi trayectoria integra la práctica clínica, la formación académica y la construcción de
            comunidad como espacios vivos de encuentro, diálogo y transformación.
          </p>
          <p>
            A lo largo de más de una década he acompañado procesos terapéuticos, formativos e
            institucionales. Soy fundador de Comunidad Gestáltica: Estudios de Terapia Gestalt de
            Campo, un proyecto orientado a la reflexión, el intercambio internacional y la formación
            permanente en Gestalt que articula la clínica fenomenológica, la supervisión clínica, la
            clínica y la psicopatología gestáltica.
          </p>
          <div className="hairline pt-8 grid grid-cols-2 gap-8">
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "var(--gold)" }}
              >
                Formación
              </div>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <li>Psicólogo · LUZ</li>
                <li>Terapia Gestalt · IGB</li>
                <li>Gestalt de Campo · IIGT Italia</li>
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
                <li>Supervisión clínica</li>
                <li>Docencia internacional</li>
              </ul>
            </div>
          </div>
          <VerMasButton expanded={showMore} onToggle={handleToggle} />
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
              className="mt-8 grid md:grid-cols-2 gap-x-16 gap-y-8 text-base"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
            >
              {[
                "Soy Psicólogo egresado de la Universidad Rafael Urdaneta (Venezuela, 2009). Magíster en Orientación mención Educación por la Universidad del Zulia (Venezuela, 2021).",
                "Inicié mi formación en Terapia Gestalt en el Centro Gestáltico San Isidro (Argentina, 2011). Desde entonces he venido profundizando en la perspectiva de campo, inicialmente junto a José Miguel Echarte (Argentina, 2021–2026).",
                "Realicé el Posgrado en Terapia Gestalt Relacional y de Campo (2022–2023) y la Formación en Psicopatología desde la Perspectiva Gestalt de Campo (2024–2025) en Terapiados Formación (España).",
                "Me formé en Psicopatología desde la Gestalt de Campo en el Centro Gestáltico San Isidro (2022–2023) y cursé el Diplomado en Psicoterapia Gestalt desde la Perspectiva de Campo en CEFEX (Chile) y el Centre Gestalt de Valencia (España) (2025–2026).",
                "Cuento con formación complementaria en prevención y atención del comportamiento suicida, intervención en salud mental, docencia universitaria, consejería en adicciones y prevención del consumo de drogas, así como estudios en psicodrama y terapias corporales.",
                "He trabajado en programas de restablecimiento de derechos de niños, niñas y adolescentes; en unidades de rehabilitación por consumo de sustancias; en el área de neurodesarrollo y rehabilitación integral; y como psicólogo del programa de telepsicología para emergencias en salud mental «Línea Amiga».",
                "Me desempeñé como docente del Centro Gestáltico de Medellín (2017–2025).",
                "Soy cofundador de Catarsis: Psicoterapia & Formación desde 2021.",
              ].map((item, i) => (
                <li key={i} className="relative">
                  <span
                    className="inline-block mr-3 w-2 h-2 rounded-full align-middle"
                    style={{ background: "var(--gold)" }}
                  />
                  <span className="align-middle" style={{ color: "var(--ink-soft)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-base" style={{ color: "var(--ink-soft)" }}>
              Actualmente lidero
              <strong style={{ color: "var(--ink)" }}>
                Comunidad Gestáltica: Estudios de Terapia Gestalt de Campo
              </strong>
              , un espacio orientado a la reflexión académica, la supervisión y entrenamiento
              clínico y el diálogo internacional en torno a la Terapia Gestalt. Nació como un
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
