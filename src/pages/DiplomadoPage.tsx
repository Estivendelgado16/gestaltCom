import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionLayout } from "@/components/site/SectionLayout";
import { Typography } from "@/components/site/Typography";
import { MediaFlexLayout } from "@/components/site/MediaFlexLayout";
import { DiplomadoPrograma } from "@/components/site/DiplomadoPrograma";
import { DocentesCarousel } from "@/components/site/DocentesCarousel";
import { diplomadoData } from "@/data/diplomado";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

const D = diplomadoData;

/** Resalta en negrita los segmentos marcados dentro de un párrafo de Generalidades. */
function Segmentado({
  texto,
  segments,
}: {
  texto: string;
  segments?: readonly { text: string; bold: boolean }[];
}) {
  if (!segments) return <>{texto}</>;
  return (
    <>
      {segments.map((s, i) =>
        s.bold ? (
          <strong key={i} className="font-semibold" style={{ color: "var(--ink)" }}>
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}

export function DiplomadoPage() {
  return (
    <SiteLayout>
      {/* Barra de navegación superior */}
      <nav className="container-clinic pt-6 pb-10 flex items-center justify-between">
        <Link
          to="/formaciones"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-1 transition-transform hover:-translate-y-0.5"
          style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Volver a formaciones
        </Link>
        <Link
          to="/admin"
          aria-label="Ingresar"
          className="inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          <User className="w-4 h-4" /> Inicio sesión
        </Link>
      </nav>

      {/* HERO / PORTADA — banner completo */}
      <section>
        <img
          src={D.hero.imagenFondo}
          alt="Banner del Diplomado Internacional en Terapia Gestalt de Campo"
          className="block w-full h-full"
        />
      </section>

      {/* INTRODUCCIÓN — FORMACIÓN ONLINE */}
      <SectionLayout variant="light" style={{ background: "#f7dfea" }}>
        <MediaFlexLayout
          imageSrc={D.introduccion.imagen}
          imageAlt={D.introduccion.imagenAlt}
          imagePosition="right"
        >
          <Typography.Subtitle as="span">{D.introduccion.categoria}</Typography.Subtitle>
          <Typography.Title className="mt-4">{D.introduccion.titulo}</Typography.Title>
          <Typography.Body className="mt-6">{D.introduccion.descripcion}</Typography.Body>
        </MediaFlexLayout>
      </SectionLayout>

      {/* PRESENTACIÓN */}
      <SectionLayout variant="white">
        <div className="max-w-5xl">
          <Typography.Title withHighlight>{D.presentacion.titulo}</Typography.Title>
          <div className="mt-8 space-y-6">
            {D.presentacion.parrafos.map((p, i) => (
              <Typography.Body key={i}>{p}</Typography.Body>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* OBJETIVO Y DESTINATARIOS — bloque azul oscuro */}
      <SectionLayout variant="dark">
        <div className="grid gap-12 md:grid-cols-2">
          {D.objetivoYTipo.bloques.map((b) => (
            <div key={b.titulo}>
              <Typography.Subtitle as="span">{b.titulo}</Typography.Subtitle>
              <Typography.Body className="mt-4" tone="on-dark">
                {b.texto}
              </Typography.Body>
            </div>
          ))}
        </div>
        <div className="mt-14 max-w-3xl">
          <Typography.Quote size="lg">{D.objetivoYTipo.cierre}</Typography.Quote>
        </div>
      </SectionLayout>

      {/* DIFERENCIADORES */}
      <SectionLayout variant="light" style={{ background: "#f7dfea" }}>
        <MediaFlexLayout
          imageSrc={D.diferenciadores.imagen}
          imageAlt={D.diferenciadores.imagenAlt}
          imagePosition="left"
        >
          <Typography.Title>{D.diferenciadores.titulo}</Typography.Title>
          <Typography.Body className="mt-6">{D.diferenciadores.texto}</Typography.Body>
        </MediaFlexLayout>
      </SectionLayout>

      {/* METODOLOGÍA */}
      <SectionLayout variant="white">
        <Typography.Title withHighlight>{D.metodologia.titulo}</Typography.Title>
        <div className="mt-8 max-w-3xl space-y-6">
          <Typography.Body>{D.metodologia.parrafo1}</Typography.Body>
          <Typography.Quote>{D.metodologia.parrafo2}</Typography.Quote>
        </div>
        <div className="mt-12 max-w-3xl space-y-5">
          {D.metodologia.parrafos.map((p, i) => (
            <Typography.Body key={i} style={{ color: "var(--ink)" }}>
              {p}
            </Typography.Body>
          ))}
        </div>
      </SectionLayout>

      {/* GENERALIDADES */}
      <SectionLayout variant="light" style={{ background: "#f7dfea" }}>
        <div className="max-w-3xl">
          <Typography.Title withHighlight>{D.generalidades.titulo}</Typography.Title>
          <div className="mt-8 space-y-6">
            {D.generalidades.parrafos.map((p, i) => (
              <Typography.Body key={i}>
                <Segmentado texto={p.texto} segments={p.segments} />
              </Typography.Body>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* PROGRAMA / DOCUMENTO EDITORIAL */}
      <section className="w-full">
        <DiplomadoPrograma />
      </section>

      {/* DOCENTES */}
      <SectionLayout variant="light">
        <Typography.Title withHighlight>Docentes</Typography.Title>
        <div className="mt-10">
          <DocentesCarousel />
        </div>
      </SectionLayout>

      {/* PROCESO DE INSCRIPCIÓN */}
      <SectionLayout variant="white">
        <div className="max-w-3xl">
          <Typography.Title withHighlight>{D.inscripcion.titulo}</Typography.Title>
          <ol className="mt-8 space-y-5">
            {D.inscripcion.pasos.map((paso, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="shrink-0 pt-1 text-[11px] uppercase tracking-[0.35em] font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {paso.titulo}
                </span>
                <Typography.Body>
                  {paso.parts.map((part, j) => {
                    if ("href" in part) {
                      return (
                        <a
                          key={j}
                          href={part.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2"
                          style={{ color: "var(--gold)" }}
                        >
                          {part.text}
                        </a>
                      );
                    }
                    if ("bold" in part) {
                      return (
                        <strong key={j} className="font-semibold" style={{ color: "var(--ink)" }}>
                          {part.text}
                        </strong>
                      );
                    }
                    return <span key={j}>{part.text}</span>;
                  })}
                </Typography.Body>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <p
              className="italic leading-snug text-lg md:text-xl"
              style={{ color: "var(--ink-soft)" }}
            >
              “{D.inscripcion.cita}” — {D.inscripcion.citaAutor}
            </p>
          </div>
        </div>
      </SectionLayout>

      {/* INVERSIÓN */}
      <SectionLayout variant="white">
        <h2
          className="inline-block px-4 py-1 italic text-3xl md:text-4xl leading-tight"
          style={{
            color: "var(--ink)",
            fontFamily: "var(--font-serif)",
            fontWeight: 600,
            background: "#DCE4EE",
          }}
        >
          {D.inversion.titulo}
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-stretch">
          <div className="relative min-h-90 overflow-hidden rounded-sm md:min-h-0">
            <img
              src={D.inversion.imagen}
              alt={D.inversion.imagenAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col gap-6">
            {D.inversion.bloques.map((bloque) => (
              <div
                key={bloque.titulo}
                className="flex flex-1 flex-col items-center justify-center rounded-sm px-8 py-10 text-center"
                style={{ background: "#738A9C", color: "#ffffff" }}
              >
                <h3 className="text-2xl md:text-3xl font-bold">{bloque.titulo}</h3>
                <div className="mt-4 h-px w-24" style={{ background: "var(--gold)" }} />
                <div className="mt-6 space-y-5">
                  {bloque.items.map((item) => (
                    <div key={item.precio}>
                      <div className="text-xl md:text-2xl font-bold">{item.precio}</div>
                      <div
                        className="mt-1 text-sm italic"
                        style={{ color: "rgba(255, 255, 255, 0.85)" }}
                      >
                        ({item.aclaracion})
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 inline-flex items-center gap-3 text-left">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white">
                    <ArrowRight className="h-4 w-4" style={{ color: "var(--gold)" }} />
                  </span>
                  <span className="text-sm">
                    <strong className="font-bold italic">{bloque.fechaLabel}</strong> {bloque.fecha}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* MEDIOS DE PAGO */}
      <SectionLayout variant="dark">
        <div className="h-px w-24" style={{ background: "var(--gold)" }} />
        <h2
          className="mt-6 italic leading-tight"
          style={{ color: "var(--ink)", fontFamily: "var(--font-serif)", fontWeight: 600 }}
        >
          {D.mediosPago.titulo.map((linea) => (
            <span key={linea} className="block">
              <span
                className="inline-block px-4 py-1 text-3xl md:text-4xl"
                style={{ background: "#DCE4EE" }}
              >
                {linea}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {D.mediosPago.bloques.map((bloque) => (
            <div key={bloque.titulo}>
              <h3
                className="text-xl md:text-2xl font-bold"
                style={{ color: "var(--cream)", fontFamily: "var(--font-sans)" }}
              >
                {bloque.titulo}
              </h3>
              <div
                className="mt-1 text-base md:text-lg italic"
                style={{ color: "var(--sand-light)", fontFamily: "var(--font-sans)" }}
              >
                {bloque.aclaracion}
              </div>

              <div className="mt-6 border-t" style={{ borderColor: "var(--gold)" }}>
                {bloque.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b py-5"
                    style={{ borderColor: "var(--gold)" }}
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
                      style={{ background: "#70889B" }}
                    >
                      <ArrowRight className="h-4 w-4" style={{ color: "var(--gold)" }} />
                    </span>
                    <span
                      className="text-base md:text-lg leading-relaxed"
                      style={{ color: "var(--cream)" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <p className="italic text-base md:text-lg" style={{ color: "var(--cream)" }}>
            {D.mediosPago.nota}
          </p>
        </div>
      </SectionLayout>

      {/* POLÍTICA DE DEVOLUCIÓN */}
      <SectionLayout variant="white">
        <div className="max-w-3xl">
          <Typography.Title withHighlight>{D.devolucion.titulo}</Typography.Title>
          <div className="mt-8 space-y-6">
            {D.devolucion.items.map((item) => (
              <div key={item.titulo}>
                <Typography.Subtitle as="span">{item.titulo}</Typography.Subtitle>
                <Typography.Body className="mt-2">{item.texto}</Typography.Body>
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* CONTACTO Y AVAL ACADÉMICO */}
      <SectionLayout variant="light" style={{ background: "#f7dfea" }}>
        <div className="max-w-3xl">
          <Typography.Title withHighlight>{D.contacto.titulo}</Typography.Title>
          <ul className="mt-8 space-y-4">
            {D.contacto.items.map((item) => (
              <li key={item.label} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <span
                  className="text-[11px] uppercase tracking-[0.35em] font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {item.label}
                </span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base md:text-lg leading-relaxed underline-offset-2 hover:underline"
                  style={{ color: "var(--ink)" }}
                >
                  {item.valor}
                </a>
              </li>
            ))}
          </ul>
          <Typography.Body className="mt-10" style={{ color: "var(--ink)" }}>
            {D.contacto.entidades}
          </Typography.Body>
          <div className="mt-8 flex flex-wrap items-center gap-8">
            {D.contacto.logos.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className="h-14 w-auto"
                style={{ objectFit: "contain" }}
              />
            ))}
          </div>
        </div>
      </SectionLayout>
    </SiteLayout>
  );
}
