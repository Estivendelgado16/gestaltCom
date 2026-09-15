import { Typography } from "@/components/site/Typography";
import { diplomadoData } from "@/data/diplomado";

type Segmento = { text: string; bold: boolean };
type ParrafoSegmentado = { texto: string; segments?: Segmento[] };

function Segmentado({ texto, segments }: { texto: string; segments?: readonly Segmento[] }) {
  return (
    <>
      {segments?.map((s, i) =>
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

function renderParrafo(p: string | { texto: string; segments?: readonly Segmento[] }) {
  if (typeof p === "string") return <Typography.Body>{p}</Typography.Body>;
  return (
    <Typography.Body>
      <Segmentado texto={p.texto} segments={p.segments} />
    </Typography.Body>
  );
}

export function UsuariosPage() {
  return (
    <>
      <section className="pt-6 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em] text-ink-soft">
          Contenido del diplomado
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Tu progreso <span className="text-gold">diplomado</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-soft">
          Acceso habilitado. Explora las secciones disponibles.
        </p>
      </section>

      <section className="pb-28 max-w-4xl">
        {diplomadoData.generalidades.parrafos.map((p, i) => (
          <div key={i} className="mb-8">
            <Typography.Title withHighlight>{diplomadoData.generalidades.titulo}</Typography.Title>
            {renderParrafo(p)}
          </div>
        ))}

        <div className="mt-16 pt-12 border-t">
          <Typography.Title withHighlight>{diplomadoData.evaluacion.titulo}</Typography.Title>
          <Typography.Body className="mt-4">{diplomadoData.evaluacion.texto}</Typography.Body>
        </div>
      </section>
    </>
  );
}
