import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { actividadService } from "@/services/actividad.service";
import type { Actividad } from "@/types";

const STATUS_PRIORITY: Record<string, number> = {
  "proximo inicio": 0,
  "en curso": 1,
  finalizado: 2,
};

function normalizeBadge(b: string): string {
  return b
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function statusRank(badges: string[]): number {
  const ranks = badges
    .map(normalizeBadge)
    .map((b) => STATUS_PRIORITY[b])
    .filter((r): r is number => r !== undefined);
  return ranks.length ? Math.min(...ranks) : 99;
}

type StatusGroup = "proximas" | "encurso" | "finalizadas";

function statusGroup(badges: string[]): StatusGroup {
  const r = statusRank(badges);
  if (r === 1) return "encurso";
  if (r === 2) return "finalizadas";
  return "proximas";
}

type FilterTab = "todas" | "proximas" | "encurso" | "finalizadas";

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

  const proximas = items.filter((a) => statusGroup(a.status_badges) === "proximas");
  const enCurso = items.filter((a) => statusGroup(a.status_badges) === "encurso");
  const finalizadas = items.filter((a) => statusGroup(a.status_badges) === "finalizadas");

  const sections: { key: StatusGroup; title: string; items: Actividad[] }[] = [
    { key: "proximas", title: "Próximas actividades", items: proximas },
    { key: "encurso", title: "En curso", items: enCurso },
    { key: "finalizadas", title: "Finalizadas", items: finalizadas },
  ];

  const visibleSections =
    filter === "proximas"
      ? sections.filter((s) => s.key === "proximas")
      : filter === "encurso"
        ? sections.filter((s) => s.key === "encurso")
        : filter === "finalizadas"
          ? sections.filter((s) => s.key === "finalizadas")
          : sections;

  return (
    <SiteLayout>
      <section style={{ background: "var(--sand-light)" }}>
        <div className="container-clinic pt-6 pb-6">
          <div
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Comunidad · Actividades · Espacios de Encuentro
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="w-full">
        <img
          src="/img/banner-actividades.png"
          alt="Actividades y espacios de encuentro"
          className="w-full block"
        />
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

      {/* Filtros */}
      <section className="container-clinic pb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "todas", label: "Todas las actividades" },
              { key: "proximas", label: "Próximas" },
              { key: "encurso", label: "En curso" },
              { key: "finalizadas", label: "Finalizadas" },
            ] as const
          ).map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors"
                style={{
                  background: active ? "var(--ink-soft)" : "transparent",
                  color: active ? "var(--cream)" : "var(--ink-soft)",
                  border: "1px solid var(--ink-soft)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <section className="container-clinic pb-28">
          <div className="rounded-2xl p-10 text-center" style={{ background: "var(--sand-light)" }}>
            Cargando actividades...
          </div>
        </section>
      ) : items.length === 0 ? (
        <section className="container-clinic pb-28">
          <div className="rounded-2xl p-10 text-center" style={{ background: "var(--sand-light)" }}>
            No hay actividades publicadas por el momento.
          </div>
        </section>
      ) : (
        <section className="container-clinic pb-28 pt-4">
          <div className="space-y-20">
            {visibleSections.map((section) => (
              <div key={section.key}>
                <div className="mb-8 flex items-baseline justify-between">
                  <h2 className="text-2xl" style={{ color: "var(--ink)" }}>
                    {section.title}
                  </h2>
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{ color: "var(--ink-soft)" }}
                  >
                    {section.items.length} actividad
                    {section.items.length === 1 ? "" : "es"}
                  </span>
                </div>
                {section.items.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    No hay actividades en esta sección por el momento.
                  </p>
                ) : (
                  <div className="grid gap-8 md:grid-cols-2">
                    {section.items.map((a) => (
                      <ActivityCard key={a.id} activity={a} blue={section.key === "encurso"} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function ActivityCard({ activity: a, blue = false }: { activity: Actividad; blue?: boolean }) {
  const imageBg = blue
    ? "color-mix(in oklab, var(--cream) 12%, transparent)"
    : "color-mix(in oklab, var(--ink) 8%, transparent)";

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: blue ? "var(--cream)" : "var(--ink-soft)" }}
        >
          {a.category}
        </span>
        <div className="flex flex-wrap gap-2">
          {a.status_badges.map((b) => (
            <span
              key={b}
              className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-medium"
              style={{
                background: blue
                  ? "color-mix(in oklab, var(--cream) 22%, transparent)"
                  : "color-mix(in oklab, var(--gold) 25%, transparent)",
                color: blue ? "var(--cream)" : "var(--ink)",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <h3
        className="mt-4 text-xl md:text-2xl leading-snug"
        style={{ color: blue ? "var(--cream)" : "var(--ink)" }}
      >
        {a.title}
      </h3>
      <p
        className="mt-3 text-sm md:text-base leading-relaxed flex-1"
        style={{
          color: blue ? "color-mix(in oklab, var(--cream) 78%, transparent)" : "var(--ink-soft)",
        }}
      >
        {a.description}
      </p>
      <a
        href={a.cta_link ?? "#"}
        className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 w-fit"
        style={{
          background: blue ? "var(--cream)" : "var(--ink)",
          color: blue ? "var(--ink)" : "var(--cream)",
        }}
      >
        {a.cta_text}
      </a>
    </>
  );

  if (!a.image_url) {
    return (
      <article
        className="rounded-2xl p-6 md:p-8 flex flex-col"
        style={{ background: blue ? "var(--ink-soft)" : "var(--sand-light)" }}
      >
        {content}
      </article>
    );
  }

  return (
    <article
      className="grid md:grid-cols-12 gap-8 rounded-2xl p-6 md:p-10 md:col-span-2"
      style={{ background: blue ? "var(--ink-soft)" : "var(--sand-light)" }}
    >
      <div className="md:col-span-7 flex flex-col">{content}</div>
      <div className="md:col-span-5">
        <div className="h-full min-h-64 rounded-xl overflow-hidden" style={{ background: imageBg }}>
          <img src={a.image_url} alt={a.image_alt ?? ""} className="w-full h-full object-cover" />
        </div>
      </div>
    </article>
  );
}
