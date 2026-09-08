import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { formacionService } from "@/services/formacion.service";
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

export function FormacionDetallePage() {
  const { formacionId } = useParams({ from: "/formaciones/$formacionId" });
  const { data: formacion, isLoading } = useQuery({
    queryKey: ["formacion", formacionId],
    queryFn: () => formacionService.getFormacionById(formacionId),
    retry: false,
  });

  if (isLoading) return <PageLoading />;

  if (!formacion) {
    return (
      <SiteLayout>
        <section className="container-clinic pt-10 pb-28 max-w-xl">
          <h1 className="text-4xl" style={{ color: "var(--ink)" }}>
            Formación no encontrada
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--ink-soft)" }}>
            Es posible que haya sido retirada o que el enlace no sea correcto.
          </p>
          <Link
            to="/formaciones"
            className="mt-8 inline-block text-sm uppercase tracking-widest border-b pb-1"
            style={{ color: "var(--ink)", borderColor: "var(--gold)" }}
          >
            Ver todas las formaciones
          </Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          {formacion.tipo}
        </div>
        <h1 className="mt-8 text-4xl md:text-6xl max-w-4xl leading-tight">{formacion.titulo}</h1>
        <div className="mt-6 flex flex-wrap gap-6 text-[13px]" style={{ color: "var(--ink-soft)" }}>
          {formacion.fecha_inicio && (
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {fmt(formacion.fecha_inicio)}
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
      </section>

      <section className="container-clinic pb-28 max-w-3xl">
        {formacion.flyer_url && (
          <img
            src={formacion.flyer_url}
            alt={`${formacion.titulo} - afiche`}
            className="mb-10 w-full rounded-sm object-cover"
          />
        )}
        <p
          className="text-base leading-relaxed whitespace-pre-line"
          style={{ color: "var(--ink-soft)" }}
        >
          {formacion.descripcion}
        </p>

        {formacion.galeria_fotos?.length > 0 && (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {formacion.galeria_fotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Foto ${i + 1} - ${formacion.titulo}`}
                loading="lazy"
                className="rounded-sm object-cover aspect-video"
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-6">
          {formacion.precio != null && formacion.precio > 0 && (
            <span className="text-2xl" style={{ color: "var(--ink)" }}>
              ${formacion.precio}
            </span>
          )}
          <Link
            to="/formaciones/clases"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            Ir al aula
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
