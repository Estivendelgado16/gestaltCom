import type { Formacion } from "@/types";
import { Calendar, MapPin, Clock } from "lucide-react";

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

export function FeaturedCourseCard({ course, delay = 0 }: { course: Formacion; delay?: number }) {
  const isProx = course.tipo === "DIPLOMADO";
  return (
    <article
      className="group relative overflow-hidden rounded-sm p-10 md:p-12 transition-transform hover:-translate-y-1"
      style={{
        background: isProx
          ? "linear-gradient(160deg, var(--ink), var(--ink-soft))"
          : "linear-gradient(160deg, var(--sand-light), var(--cream))",
        color: isProx ? "var(--cream)" : "var(--ink)",
        animation: `rise 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms both`,
      }}
    >
      <div
        className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded-full"
        style={{
          background: isProx ? "var(--gold)" : "var(--ink)",
          color: isProx ? "var(--ink)" : "var(--cream)",
        }}
      >
        {course.tipo}
      </div>
      <div className="text-[11px] uppercase tracking-[0.35em] opacity-70">Formación</div>
      <h3 className="mt-6 text-3xl md:text-4xl leading-tight max-w-xl">{course.titulo}</h3>
      <p className="mt-6 text-base leading-relaxed max-w-xl opacity-80">
        {course.descripcion}
      </p>
      <div className="mt-10 flex flex-wrap gap-6 text-[13px]">
        <span className="inline-flex items-center gap-2 opacity-80">
          <Calendar className="w-4 h-4" /> {fmt(course.fecha_inicio)}
        </span>
        {course.modalidad && (
          <span className="inline-flex items-center gap-2 opacity-80">
            <MapPin className="w-4 h-4" /> {course.modalidad}
          </span>
        )}
        {course.duracion && (
          <span className="inline-flex items-center gap-2 opacity-80">
            <Clock className="w-4 h-4" /> {course.duracion}
          </span>
        )}
      </div>
      <div
        className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--gold)" }}
      />
    </article>
  );
}