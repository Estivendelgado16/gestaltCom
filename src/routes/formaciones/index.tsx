import { Link, useRouterState } from "@tanstack/react-router";
import { useFormaciones } from "@/services/formacion.service";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FormacionCard } from "@/components/site/FormacionCard";

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

export function FormacionesPage() {
  const formaciones = useFormaciones();
  const active = formaciones.filter((f) => f.is_published && f.tipo !== "Finalizado");
  const finished = formaciones.filter((f) => !f.is_published || f.tipo === "Finalizado");

  return (
    <SiteLayout>
      <section className="container-clinic pt-24 pb-16">
        <div
          className="text-[11px] uppercase tracking-[0.35em]"
          style={{ color: "var(--ink-soft)" }}
        >
          Formaciones
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Estudiar la Gestalt como un <span style={{ color: "var(--gold)" }}>oficio</span> vivo.
        </h1>
        <p className="mt-8 max-w-2xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Programas actuales y en preparación. Cada formación se sostiene en teoría contemporánea,
          práctica supervisada y comunidad.
        </p>
      </section>

      {/* Activos */}
      <section className="container-clinic pb-24">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-2xl">En curso y próximas</h2>
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
            {active.length} formación{active.length === 1 ? "" : "s"}
          </span>
        </div>
        {active.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            No hay formaciones activas en este momento.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {active.map((f, i) => (
              <FormacionCard key={f.id} formacion={f} delay={i * 120} />
            ))}
          </div>
        )}
      </section>

      {/* Historial / Finalizadas */}
      {finished.length > 0 && (
        <section className="container-clinic pb-28">
          <div className="hairline pt-16">
            <div
              className="text-[11px] uppercase tracking-[0.35em] mb-6"
              style={{ color: "var(--ink-soft)" }}
            >
              Historial de formaciones
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {finished.map((f) => (
                <div
                  key={f.id}
                  className="bg-background rounded-sm p-6 transition-colors hover:bg-secondary/40"
                >
                  <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--gold)" }}>
                    {f.tipo}
                  </div>
                  <h3 className="mt-2 text-xl">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-70">
                    {f.shortDescription}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
                    <span className="opacity-70">
                      <Calendar className="w-3 h-3 mr-1" /> {fmt(f.fecha_inicio)}
                    </span>
                    {f.duracion && (
                      <span className="opacity-70">
                        <Clock className="w-3 h-3 mr-1" /> {f.duracion}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}