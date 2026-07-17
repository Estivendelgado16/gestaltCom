export function Logo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "cream" }) {
  const color = tone === "cream" ? "var(--cream)" : "var(--ink)";
  const accent = "var(--gold)";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 4c-6 0-10 4-10 9 0 4 3 6 6 8s6 4 6 8-3 7-8 7"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="28" cy="12" r="2.6" fill={accent} />
      </svg>
      <div className="leading-none">
        <div
          className="text-[15px] font-bold tracking-tight"
          style={{ color }}
        >
          Comunidad Gestáltica
        </div>
        <div
          className="text-[9px] uppercase tracking-[0.28em] mt-1"
          style={{ color: tone === "cream" ? "var(--sand-light)" : "var(--ink-soft)" }}
        >
          Estudios de Gestalt de Campo
        </div>
      </div>
    </div>
  );
}
