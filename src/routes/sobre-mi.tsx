import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí — Dany Mora Bracho | Comunidad Gestáltica" },
      { name: "description", content: "Dany Mora Bracho, psicólogo y terapeuta gestáltico. Fundador de Comunidad Gestáltica." },
      { property: "og:title", content: "Dany Mora Bracho — Comunidad Gestáltica" },
      { property: "og:description", content: "Psicólogo y formador en Gestalt de Campo." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="container-clinic pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>
          Sobre mí
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Dany Mora <span style={{ color: "var(--gold)" }}>Bracho</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Psicólogo, terapeuta gestáltico y formador. Fundador de Comunidad
          Gestáltica.
        </p>
      </section>

      <section className="container-clinic pb-28 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] rounded-sm relative overflow-hidden">
            <img
              src="/img/dany-mora.jpg"
              alt="Dany Mora Bracho"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-7 space-y-8 text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
          <p>
            Mi trabajo se sostiene en una convicción sencilla: nada de lo que
            ocurre en la sesión es solo del paciente. Todo emerge en un campo
            que compartimos, atravesado por historia, cuerpo, cultura y presente.
          </p>
          <p>
            Desde hace más de una década acompaño procesos terapéuticos y formo
            terapeutas en la perspectiva contemporánea de la Gestalt de Campo,
            en diálogo con las tradiciones de Buenos Aires, Roma y Cleveland.
          </p>
          <div className="hairline pt-8 grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>Formación</div>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <li>Psicólogo · LUZ</li>
                <li>Terapia Gestalt · IGB</li>
                <li>Gestalt de Campo · IIGT Italia</li>
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>Práctica</div>
              <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                <li>Consulta privada</li>
                <li>Supervisión clínica</li>
                <li>Docencia internacional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
