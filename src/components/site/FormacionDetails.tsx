import type { Formacion } from "@/types";
import { Calendar, MapPin, Clock, Instagram } from "lucide-react";
import { GaleriaCarousel } from "@/components/site/GaleriaCarousel";

const INSTAGRAM_URL = "https://www.instagram.com/comunidad.gestaltica";

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

/** Detalle completo de una formación: flyer, datos, descripción, galería e Instagram.
 *  Se usa tanto en el popup (diplomados) como en la expansión inline (cursos/talleres). */
export function FormacionDetails({ formacion }: { formacion: Formacion }) {
  return (
    <div className="space-y-6">
      {/* 1. Flyer / afiche */}
      {formacion.flyer_url && (
        <img
          src={formacion.flyer_url}
          alt={`${formacion.titulo} — afiche`}
          className="w-full rounded-sm object-contain"
        />
      )}

      {/* Datos rápidos */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
        {formacion.fecha_inicio && (
          <span className="inline-flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {fmt(formacion.fecha_inicio)}
            {formacion.fecha_fin ? ` — ${fmt(formacion.fecha_fin)}` : ""}
          </span>
        )}
        {formacion.modalidad && (
          <span className="inline-flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {formacion.modalidad}
          </span>
        )}
        {formacion.duracion && (
          <span className="inline-flex items-center gap-2">
            <Clock className="w-4 h-4" /> {formacion.duracion}
          </span>
        )}
      </div>

      {formacion.horarios && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          {formacion.horarios}
        </p>
      )}

      {/* Descripción con temario */}
      <p
        className="text-sm leading-relaxed whitespace-pre-line"
        style={{ color: "var(--ink-soft)" }}
      >
        {formacion.descripcion}
      </p>

      {/* 3. Galería de fotos — el admin las sube al finalizar la formación */}
      {formacion.galeria_fotos?.length > 0 && (
        <GaleriaCarousel fotos={formacion.galeria_fotos} titulo={formacion.titulo} />
      )}

      {/* 2. Link de Instagram */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b pb-1 transition-transform hover:-translate-y-0.5"
        style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
      >
        <Instagram className="w-4 h-4" /> @comunidad.gestaltica
      </a>
    </div>
  );
}
