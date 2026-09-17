import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { actividadService } from "@/services/actividad.service";
import type { Actividad } from "@/types";

type FilterTab = "todas" | "proximas";

export function ActividadesPage() {
  const [filter, setFilter] = useState<FilterTab>("todas");
  const [items, setItems] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    actividadService
      .getActividades({ soloPublicadas: true })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = items.find((a) => a.is_featured) ?? items[0];
  const proximas = items.filter((a) => a.id !== featured?.id);

  return (
    <SiteLayout>
      <section style={{ background: "var(--sand-light)" }}>
        <div className="container-clinic pt-6 pb-10">
          <div
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Comunidad · Actividades · Espacios de Encuentro
          </div>
        </div>
      </section>

      {/* Encabezado */}
      <section className="container-clinic pt-12 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.25em]"
            style={{
              background: "color-mix(in oklab, var(--ink) 6%, transparent)",
              color: "var(--ink-soft)",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--gold)" }}
            />
            {items.length} actividades disponibles
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="container-clinic pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "todas", label: "Todas las actividades" },
                { key: "proximas", label: "Próximas actividades" },
              ] as const
            ).map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors"
                  style={{
                    background: active ? "var(--ink)" : "transparent",
                    color: active ? "var(--cream)" : "var(--ink-soft)",
                    border: active ? "1px solid var(--ink)" : "1px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div
            className="inline-flex items-center gap-2 text-xs"
            style={{ color: "var(--ink-soft)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Actualizado septiembre 2026
          </div>
        </div>
      </section>

      {/* Tarjeta destacada */}
      <section className="container-clinic pt-4">
        {featured ? (
          <article
            className="grid md:grid-cols-12 gap-8 rounded-2xl p-6 md:p-10"
            style={{ background: "#1A2332", color: "var(--cream)" }}
          >
            <div className="md:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--gold)" }}
                >
                  {featured.category}
                </span>
                <div className="flex flex-wrap gap-2">
                  {featured.status_badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium"
                      style={{
                        background: "color-mix(in oklab, var(--gold) 25%, transparent)",
                        color: "var(--ink)",
                      }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl leading-snug" style={{ color: "var(--cream)" }}>
                {featured.title}
              </h2>

              {featured.featured_notice && (
                <p className="flex items-start gap-2 text-base" style={{ color: "var(--gold)" }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-1 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                  <span>{featured.featured_notice}</span>
                </p>
              )}

              <p
                className="text-base leading-relaxed"
                style={{ color: "color-mix(in oklab, var(--cream) 70%, transparent)" }}
              >
                {featured.description}
              </p>

              <a
                href={featured.cta_link ?? "#"}
                className="inline-flex items-center rounded-full px-7 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--gold)", color: "var(--ink)" }}
              >
                {featured.cta_text}
              </a>
            </div>

            <div className="md:col-span-5">
              <div
                className="h-full min-h-64 rounded-xl overflow-hidden"
                style={{ background: "color-mix(in oklab, var(--cream) 8%, transparent)" }}
              >
                <img
                  src={featured.image_url ?? ""}
                  alt={featured.image_alt ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-2xl p-10 text-center" style={{ background: "var(--sand-light)" }}>
            {loading ? "Cargando actividades..." : "No hay actividades publicadas por el momento."}
          </div>
        )}
      </section>

      {/* Próximas actividades */}
      <section className="container-clinic pb-28 pt-20">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-2xl" style={{ color: "var(--ink)" }}>
            Próximas actividades
          </h2>
          <span className="text-xs uppercase tracking-widest" style={{ color: "var(--ink-soft)" }}>
            {proximas.length} actividad{proximas.length === 1 ? "" : "es"}
          </span>
        </div>
        {proximas.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Aún no hay más actividades publicadas.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {proximas.map((a, i) => (
              <article
                key={a.id}
                className="rounded-2xl p-8 flex flex-col"
                style={{ background: "var(--sand-light)" }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {a.category}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {a.status_badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium"
                        style={{
                          background: "color-mix(in oklab, var(--gold) 25%, transparent)",
                          color: "var(--ink)",
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 text-xl leading-snug" style={{ color: "var(--ink)" }}>
                  {a.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed flex-1"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {a.description}
                </p>
                <a
                  href={a.cta_link ?? "#"}
                  className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 w-fit"
                  style={{ background: "var(--ink)", color: "var(--cream)" }}
                >
                  {a.cta_text}
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
