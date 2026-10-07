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

      {/* DOCENTES */}
      <SectionLayout variant="light">
        <Typography.Title withHighlight>Docentes de la formación</Typography.Title>
        <div className="mt-10">
          <DocentesCarousel />
        </div>
      </SectionLayout>

      {/* INTRODUCCIÓN — FORMACIÓN ONLINE */}
      <SectionLayout variant="light" style={{ background: "var(--cream)" }}>
        <MediaFlexLayout
          imageSrc={D.introduccion.imagen}
          imageAlt={D.introduccion.imagenAlt}
          imagePosition="right"
          aspect="aspect-video"
        >
          <Typography.Subtitle as="span">{D.introduccion.categoria}</Typography.Subtitle>
          <Typography.Title className="mt-4 font-bold">{D.introduccion.titulo}</Typography.Title>
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
              <Typography.Subtitle as="span" className="font-bold text-sm">
                {b.titulo}
              </Typography.Subtitle>
              <Typography.Body className="mt-4" tone="on-dark">
                {b.texto}
              </Typography.Body>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-5xl">
          <Typography.Quote size="md" className="text-center">
            {D.objetivoYTipo.cierre}
          </Typography.Quote>
        </div>
      </SectionLayout>

      {/* PROGRAMA / DOCUMENTO EDITORIAL */}
      <section className="w-full">
        <DiplomadoPrograma />
      </section>

      {/* DIFERENCIADORES */}
      <SectionLayout variant="light" style={{ background: "var(--cream)" }}>
        <MediaFlexLayout
          imageSrc={D.diferenciadores.imagen}
          imageAlt={D.diferenciadores.imagenAlt}
          imagePosition="left"
          imageClassName="max-w-sm"
        >
          <Typography.Title>{D.diferenciadores.titulo}</Typography.Title>
          <Typography.Body className="mt-6">{D.diferenciadores.texto}</Typography.Body>
        </MediaFlexLayout>
      </SectionLayout>

      {/* METODOLOGÍA */}
      <SectionLayout variant="white">
        <Typography.Title withHighlight>{D.metodologia.titulo}</Typography.Title>
        <div className="mt-8 max-w-5xl space-y-6">
          <Typography.Body>{D.metodologia.parrafo1}</Typography.Body>
          <Typography.Quote>{D.metodologia.parrafo2}</Typography.Quote>
        </div>
        <div className="mt-12 max-w-5xl space-y-5">
          {D.metodologia.parrafos.map((p, i) => (
            <Typography.Body key={i} style={{ color: "var(--ink)" }}>
              {p}
            </Typography.Body>
          ))}
        </div>
      </SectionLayout>

      {/* BROCHURE */}
      <div className="flex justify-center py-8">
        <a
          href="https://drive.google.com/file/d/11z5c3AG2qi6a8wVLo4bYyPMHi3Ug8HQs/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          Ver brochure completo aquí <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </SiteLayout>
  );
}
