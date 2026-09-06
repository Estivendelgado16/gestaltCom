interface VerMasButtonProps {
  expanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function VerMasButton({ expanded, onToggle, className = "mt-6" }: VerMasButtonProps) {
  return (
    <div
      className={`${className} inline-flex rounded-full p-px`}
      style={{
        background: "linear-gradient(to left, var(--sand-light), transparent)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 text-sm font-semibold uppercase tracking-widest text-ink transition-colors hover:bg-[var(--sand-light)]"
      >
        {expanded ? "Ver menos" : "Ver más"}
      </button>
    </div>
  );
}
