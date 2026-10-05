import type { Modulo } from "@/data/diplomado";
import { Mountain } from "lucide-react";

/** Resalta en negrita las palabras/frases clave dentro de un texto. */
function Resaltar({ texto, resaltes }: { texto: string; resaltes?: readonly string[] }) {
  if (!resaltes || resaltes.length === 0) return <>{texto}</>;

  const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${resaltes.map(escapar).join("|")})`, "gi");
  const partes = texto.split(regex);

  return (
    <>
      {partes.map((parte, i) =>
        resaltes.some((r) => r.toLowerCase() === parte.toLowerCase()) ? (
          <strong key={i} className="font-bold">
            {parte}
          </strong>
        ) : (
          <span key={i}>{parte}</span>
        ),
      )}
    </>
  );
}

/**
 * Banner hero de un módulo del diplomado (16:6 aprox.):
 * imagen de paisaje de fondo + overlay, logos arriba al centro,
 * bloque jerárquico a la izquierda (título + cápsula + síntesis) y
 * tarjeta azul marino con el cronograma de sesiones a la derecha.
 */
export function ModuloBannerCard({ modulo }: { modulo: Modulo }) {
  return (
    <article
      className="relative w-full overflow-hidden bg-cover bg-center min-h-[480px] md:min-h-[540px]"
      style={{ backgroundImage: `url(${modulo.imagen})` }}
    >
      {/* Overlay oscuro para contraste de las letras blancas */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

      <div className="relative p-[5%]">
        {/* Logos institucionales arriba al centro */}
        <header className="flex items-center justify-center gap-6">
          <img
            src={modulo.logoLeft}
            alt="Diplomado Internacional en Terapia Gestalt de Campo"
            className="h-10 w-auto object-contain md:h-12"
          />
          <img
            src={modulo.logoRight}
            alt="Comunidad Gestáltica"
            className="h-10 w-auto object-contain md:h-12"
          />
        </header>

        {/* Layout: izquierda 55% / derecha 40% */}
        <div className="mt-4 grid grid-cols-1 items-center gap-x-[5%] gap-y-6 lg:grid-cols-[55%_40%] lg:justify-between">
          {/* Columna izquierda: título, cápsula y síntesis pedagógica */}
          <div>
            <h3 className="font-sans text-2xl font-extrabold uppercase tracking-wide leading-[0.95] text-white drop-shadow-md md:text-4xl lg:text-5xl">
              {modulo.titulo}
            </h3>

            <span className="my-4 inline-flex items-center gap-2 rounded-full bg-[#233F62] px-5 py-2 text-white shadow-lg">
              <Mountain className="h-4 w-4" />
              <span className="text-base font-semibold uppercase tracking-[2px] md:text-lg">
                {modulo.moduloTag}
              </span>
            </span>

            <p className="text-sm font-normal leading-relaxed text-white md:text-base">
              <Resaltar texto={modulo.objetivo} resaltes={modulo.resaltes} />
            </p>
          </div>

          {/* Columna derecha: tarjeta flotante con el cronograma */}
          <div className="rounded-3xl bg-[#233F62] p-6 text-white shadow-2xl md:p-7">
            <ul>
              {modulo.sesiones.map((s) => (
                <li
                  key={s.titulo}
                  className="mb-3 border-b border-white/30 pb-3 text-center last:mb-0 last:border-b-0 last:pb-0"
                >
                  <p className="text-sm font-bold leading-snug text-white md:text-[15px]">
                    {s.titulo}
                  </p>
                  <div className="mt-1 text-xs font-semibold text-white md:text-[13px]">
                    {s.fecha}
                  </div>
                  <div className="mt-0.5 text-xs font-light text-white">
                    {s.docente} ({s.pais})
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
