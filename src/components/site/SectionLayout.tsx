import type { CSSProperties, ReactNode } from "react";

type SectionVariant = "light" | "dark" | "white";

const VARIANT_STYLES: Record<SectionVariant, CSSProperties> = {
  light: {
    background: "var(--background)",
    color: "var(--ink)",
  },
  dark: {
    background: "var(--ink)",
    color: "var(--cream)",
  },
  white: {
    background: "#ffffff",
    color: "var(--ink)",
  },
};

/**
 * Sección contenedora: gestiona el espaciado vertical, el ancho máximo de
 * lectura y el color de fondo según la variante. Un único responsable de
 * layout (Single Responsibility), extensible sin modificar (Open/Closed).
 */
export function SectionLayout({
  variant = "light",
  id,
  className = "",
  style,
  children,
}: {
  variant?: SectionVariant;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ ...VARIANT_STYLES[variant], ...style }}>
      <div className={`container-clinic py-16 md:py-24 ${className}`.trim()}>{children}</div>
    </section>
  );
}
