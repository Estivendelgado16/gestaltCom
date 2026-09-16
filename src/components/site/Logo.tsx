export function Logo({
  className = "",
  tone = "ink",
  img = "/img/logo1.png",
  size = 50,
}: {
  className?: string;
  tone?: "ink" | "cream";
  img?: string;
  size?: number;
}) {
  const color = tone === "cream" ? "var(--cream)" : "var(--ink)";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={img} alt="Comunidad Gestáltica" width={size} height={size} />
      <div className="leading-none">
        <div className="text-[15px] font-bold tracking-tight" style={{ color }}>
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
