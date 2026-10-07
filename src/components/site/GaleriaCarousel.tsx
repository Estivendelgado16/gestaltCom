import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrusel de la galería de fotos de una formación.
 * Se muestra con flechas de navegación superpuestas y una imagen
 * por slide en móvil (dos en escritorio).
 */
export function GaleriaCarousel({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (fotos.length === 0) return null;

  return (
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.3em] mb-3"
        style={{ color: "var(--ink-soft)" }}
      >
        Galería
      </p>
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden rounded-sm">
          <div className="flex">
            {fotos.map((url, i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 pl-3 first:pl-0"
              >
                <div
                  className="rounded-sm h-80 flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--sand-light)" }}
                >
                  <img
                    src={url}
                    alt={`${titulo} — foto ${i + 1}`}
                    loading="lazy"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {canPrev && (
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canNext && (
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-colors"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
