import { useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export function ServicesPage() {
  const [open, setOpen] = useState<number | null>(null);

  const services = [
    {
      n: "01",
      t: "Psicoterapia individual",
      d: '"Sin el otro no se abre nada. Sin el otro no existe nada. Sin el otro, el self no existe; sin el otro, la expresión no existe; sin el otro, no existe la palabra".',
      author: "Jean-Marie Robine",
      d_ext:
        "Creamos juntos un espacio de encuentro en el que la experiencia es abordada en su dimensión situacional, en relación con el contexto de cada persona y en un aquí y un ahora particular. Te acompaño desde una presencia implicada, atenta a cómo se configura nuestra experiencia en ese encuentro que hacemos posible juntos. Acompaño experiencias de sufrimiento y distintos momentos vitales, sosteniendo un espacio donde aquello que emerge pueda ser reconocido, elaborado y transformado en relación.",
      tag: "Adultos",
      whatsapp: "584240000000",
    },
    {
      n: "02",
      t: "Psicoterapia de parejas",
      d: '"La parte más profunda de nosotros mismos es la superficie en la que nos encontramos. El abismo no está dentro, sino entre nosotros, y solamente allí puede ser colmado".',
      author: "Pietro Cavalieri",
      d_ext:
        "Las relaciones de pareja atraviesan momentos de tensión, silencios, desencuentros o repetición de conflictos que, en ocasiones, dificultan el sustento del vínculo y la posibilidad de comprenderse mutuamente. La terapia de pareja es un espacio de encuentro que permite detenerse y observar, con mayor claridad, lo que está ocurriendo en la relación. Desde una comprensión experiencial, se explora cómo la relación vive el vínculo y cómo, a través de sus formas de comunicarse, acercarse, distanciarse y responderse mutuamente, han ido configurando la dinámica actual de la pareja. Acompaño este proceso favoreciendo un entorno propicio para que la pareja pueda escucharse de nuevas maneras, reconocer estas dinámicas y abrir posibilidades distintas de contacto, diálogo y cuidado mutuo.",
      tag: "Parejas",
      whatsapp: "584240000001",
    },
    {
      n: "03",
      t: "Supervisión de casos clínicos (espacio para terapeutas)",
      d: '"Los apasionados son libertinos porque se arriesgan a ver la vida con los ojos del otro".',
      author: "Marcos Müller",
      d_ext:
        "El grupo de co-vigil clínica es un espacio de confianza, cuidado y aprendizaje compartido, en el que los terapeutas pueden presentar y explorar sus experiencias clínicas. Mediante el diálogo entre colegas y la orientación del supervisor, se promueve una reflexión rigurosa sobre los casos, se amplía la comprensión de los procesos terapéuticos y se fortalecen los recursos personales y profesionales para la práctica clínica. Es, al mismo tiempo, un encuentro de aprendizaje colectivo, donde la experiencia se transforma en conocimiento y el intercambio sostiene el crecimiento profesional y personal. Dirigido a psicólogos con orientación clínica gestáltica interesados en profundizar en su práctica, ampliar su comprensión del campo terapéutico y fortalecer la calidad del acompañamiento a sus pacientes.",
      tag: "Profesionales",
      whatsapp: "584240000002",
    },
  ];

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Servicios
        </div>
<h1 className="mt-8 text-3xl md:text-4xl lg:text-5xl leading-[1.1]" style={{ width: "90%" }}>
          “El dolor no es otra cosa que
          <span style={{ color: "var(--gold)" }}>la sorpresa de no encontrarnos</span> De todos los
          pecados de la psicología, el más mortal es su indiferencia ante la belleza.”
</h1>
        <p>J. Hillman</p>
      </section>

      <section className="pb-28">
        <div
          className="grid gap-px"
          style={{ background: "color-mix(in oklab, var(--ink) 12%, transparent)" }}
        >
          {services.map((s, i) => (
            <article
              key={s.n}
              className="bg-background transition-colors group cursor-pointer hover:bg-[var(--cream)]"
              onClick={() => setOpen((v) => (v === i ? null : i))}
            >
              <div className="container-clinic p-10 md:p-16 md:py-16 py-10 grid md:grid-cols-12 gap-8">
                <div className="md:col-span-2">
                  {i === 0 ? (
                    <video
                      src="/img/service1.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-64 rounded-sm object-cover"
                    />
                  ) : i === 1 ? (
                    <video
                      src="/img/service2.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-64 rounded-sm object-cover"
                    />
                  ) : i === 2 ? (
                    <video
                      src="/img/service3.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-64 rounded-sm object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className="text-[11px] tracking-[0.3em]"
                        style={{ color: "var(--gold)" }}
                      >
                        {s.n}
                      </div>
                      <div
                        className="mt-2 text-[10px] uppercase tracking-[0.28em]"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        {s.tag}
                      </div>
                    </>
                  )}
                </div>
                <div className="md:col-span-7">
                  <h2 className="text-3xl md:text-4xl">{s.t}</h2>
                  <p
                    className="mt-5 text-base leading-relaxed max-w-xl italic"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {s.d}
                  </p>
                  <div
                    className="mt-3 text-[11px] uppercase tracking-[0.3em]"
                    style={{ color: "var(--gold)" }}
                  >
                    — {s.author}
                  </div>
                  {open === i && (
                    <div
                      className="mt-6 text-base leading-relaxed max-w-xl animate-rise"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {s.d_ext}
                    </div>
                  )}
                </div>
                <div className="md:col-span-3 flex md:justify-end items-center">
                  <a
                    href={`https://wa.me/${s.whatsapp}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm uppercase tracking-widest border-b pb-1 transition-transform group-hover:-translate-y-0.5"
                    style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
                  >
                    Solicitar información
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
