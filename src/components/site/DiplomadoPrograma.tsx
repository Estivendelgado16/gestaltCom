import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { diplomadoData } from "@/data/diplomado";

const P = diplomadoData.programa;

/** Carrusel de banners del programa (Embla): imagen a ancho completo con
 *  flechas laterales dentro de la imagen y sin indicadores inferiores. */
export function DiplomadoPrograma() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {P.modulos.map((modulo) => (
          <div key={modulo.moduloTag} className="min-w-0 flex-[0_0_100%]">
            <img src={modulo.imagen} alt={modulo.imagenAlt} className="block w-full h-auto" />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 md:left-6"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 md:right-6"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
