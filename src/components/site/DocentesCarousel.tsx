import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { docentes } from "@/data/docentes";

/** Carrusel de docentes (Embla): foto centrada con bandera en la esquina
 *  y descripción debajo de cada foto. */
export function DocentesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {docentes.map((d) => (
            <div
              key={d.nombre}
              className="min-w-0 flex-[0_0_100%] pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
            >
              <div
                className="flex h-full flex-col rounded-2xl p-4 md:p-5"
                style={{ background: "var(--ink)" }}
              >
                {/* Foto con bandera(s) en la esquina */}
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={d.foto}
                    alt={d.nombre}
                    className="aspect-square w-full object-cover object-center"
                  />
                  <div className="absolute right-3 top-3 flex flex-col gap-1">
                    {(d.banderas ?? [d.bandera]).map((bandera, i) => (
                      <img
                        key={i}
                        src={bandera}
                        alt={d.pais}
                        className="h-9 w-9 rounded-full object-cover shadow ring-2 ring-white/80"
                      />
                    ))}
                  </div>
                </div>

                {/* Descripción debajo de la foto */}
                <div className="mt-4 px-1 text-center">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "var(--gold)", fontFamily: "var(--font-sans)" }}
                  >
                    {d.nombre}
                  </h3>
                  <div
                    className="mt-1 text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--cream)" }}
                  >
                    {d.pais}
                  </div>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{
                      color: "color-mix(in oklab, var(--cream) 82%, transparent)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {d.descripcion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Anterior"
          className="grid h-11 w-11 place-items-center rounded-full border transition-colors hover:bg-cream"
          style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              className="h-2.5 w-2.5 rounded-full transition-all"
              style={{
                background:
                  i === selectedIndex
                    ? "var(--gold)"
                    : "color-mix(in oklab, var(--ink) 20%, transparent)",
                transform: i === selectedIndex ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Siguiente"
          className="grid h-11 w-11 place-items-center rounded-full border transition-colors hover:bg-cream"
          style={{ borderColor: "var(--ink)", color: "var(--ink)" }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
