import { ArrowRight } from "lucide-react";
import { diplomadoData } from "@/data/diplomado";

const P = diplomadoData.programa;

/** Ficha tipo botón: círculo blanco con flecha a la izquierda + texto. */
function TemaCard({ children }: { children: string }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-5 py-4 shadow-sm"
      style={{ background: P.paleta.banner }}
    >
      <span
        className="grid place-items-center w-8 h-8 shrink-0 rounded-full"
        style={{ background: "#ffffff" }}
      >
        <ArrowRight className="w-4 h-4" style={{ color: P.paleta.banner }} />
      </span>
      <span
        className="text-left text-sm md:text-base leading-snug"
        style={{ color: "#ffffff", fontFamily: "var(--font-sans)" }}
      >
        {children}
      </span>
    </div>
  );
}

/** Encabezado de módulo: título grande, subtítulo y divisor. */
function ModuloHeading({ titulo }: { titulo: string }) {
  return (
    <div>
      <h3
        className="text-2xl md:text-3xl font-semibold leading-tight uppercase"
        style={{ color: P.paleta.cuerpo, fontFamily: "var(--font-sans)" }}
      >
        {titulo}
      </h3>
      <div className="mt-4 h-px" style={{ background: P.paleta.tinta, opacity: 0.2 }} />
    </div>
  );
}

/** Franja superior azul con título serif centrado en blanco. */
function Banner({ titulo }: { titulo: string }) {
  return (
    <div className="py-8 md:py-10 text-center" style={{ background: P.paleta.banner }}>
      <h2
        className="text-3xl md:text-5xl font-semibold"
        style={{ color: "#ffffff", fontFamily: "var(--font-serif)" }}
      >
        {titulo}
      </h2>
    </div>
  );
}

/** Encabezado de página de contenido: objetivo + círculo con flecha. */
function ContenidoHeader({ titulo, objetivo }: { titulo: string; objetivo: string }) {
  return (
    <div className="max-w-4xl mx-auto">
      <ModuloHeading titulo={titulo} />
      <div className="mt-6 flex items-start gap-4">
        <span
          className="grid place-items-center w-8 h-8 shrink-0 mt-1 rounded-full"
          style={{ background: P.paleta.banner }}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </span>
        <p
          className="text-base md:text-lg leading-relaxed"
          style={{ color: P.paleta.cuerpo, fontFamily: "var(--font-sans)" }}
        >
          {objetivo}
        </p>
      </div>
    </div>
  );
}

/** Página de contenido de un módulo. */
function PaginaContenido({ pagina }: { pagina: (typeof P.paginasContenido)[number] }) {
  const tituloTemario = "TEMARIO";
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#ffffff", border: "1px solid rgba(74,107,130,0.15)" }}
    >
      {pagina.banner && <Banner titulo="Contenido" />}

      <div className={`px-6 md:px-12 py-10 md:py-14 ${pagina.banner ? "" : "pt-14"}`}>
        <ContenidoHeader titulo={pagina.titulo} objetivo={pagina.objetivo} />

        {/* TEMARIO — la imagen puede ir a la izquierda, derecha o centrada */}
        {pagina.imagenPosition === "center" ? (
          <div className="mt-12 max-w-3xl mx-auto">
            <p
              className="text-sm uppercase tracking-[0.3em] mb-6 text-center"
              style={{ color: P.paleta.tinta, fontFamily: "var(--font-sans)", fontWeight: 600 }}
            >
              {tituloTemario}
            </p>
            <div className="space-y-4">
              {pagina.temario.map((t) => (
                <TemaCard key={t}>{t}</TemaCard>
              ))}
            </div>
            <div className="mt-10 overflow-hidden rounded-xl">
              <img
                src={pagina.imagen}
                alt={pagina.imagenAlt}
                className="w-full h-64 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p
                className="text-sm uppercase tracking-[0.3em] mb-6"
                style={{ color: P.paleta.tinta, fontFamily: "var(--font-sans)", fontWeight: 600 }}
              >
                {tituloTemario}
              </p>
              <div className="space-y-4">
                {pagina.temario.map((t) => (
                  <TemaCard key={t}>{t}</TemaCard>
                ))}
              </div>
            </div>
            <div
              className="overflow-hidden rounded-xl"
              style={{ order: pagina.imagenPosition === "left" ? -1 : 1 }}
            >
              <img
                src={pagina.imagen}
                alt={pagina.imagenAlt}
                className="w-full h-full min-h-64 object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Página de calendario: grid 2x2 de paneles por módulo. */
function PaginaCalendario() {
  const c = P.calendario;
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#ffffff", border: "1px solid rgba(74,107,130,0.15)" }}
    >
      <Banner titulo={c.titulo} />
      <div className="px-6 md:px-12 py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          {c.modulos.map((mod) => (
            <div
              key={mod.titulo}
              className="rounded-xl p-6 md:p-7"
              style={{ background: P.paleta.panel }}
            >
              <h4
                className="text-base md:text-lg font-semibold uppercase leading-snug mb-6"
                style={{ color: P.paleta.banner, fontFamily: "var(--font-sans)" }}
              >
                {mod.titulo}
              </h4>
              <div className="space-y-5">
                {mod.sesiones.map((s) => (
                  <div key={s.titulo}>
                    <p
                      className="text-sm md:text-[15px] font-medium leading-snug"
                      style={{ color: P.paleta.cuerpo, fontFamily: "var(--font-sans)" }}
                    >
                      {s.titulo}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span
                        className="font-semibold"
                        style={{ color: P.paleta.resalte, fontFamily: "var(--font-sans)" }}
                      >
                        {s.fecha}
                      </span>
                      <span style={{ color: P.paleta.cuerpo, opacity: 0.75 }}>{s.docente}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Sección completa del documento editorial del programa. */
export function DiplomadoPrograma() {
  return (
    <div className="space-y-12">
      {P.paginasContenido.map((pagina) => (
        <PaginaContenido key={pagina.titulo} pagina={pagina} />
      ))}
      <PaginaCalendario />
    </div>
  );
}
