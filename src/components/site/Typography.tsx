import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * <Typography /> — familia de componentes tipográficos reutilizables.
 * Un único responsable por pieza (Single Responsibility) y composición
 * polimórfica mediante objetos adjuntos como Title / Subtitle / Body / Quote.
 */

type TitleProps = {
  as?: "h2" | "h3";
  /** Activa la franja translúcida de resaltado detrás del texto. */
  withHighlight?: boolean;
  align?: "left" | "center";
  id?: string;
  className?: string;
  children: ReactNode;
};

function Title({
  as = "h2",
  withHighlight = false,
  align = "left",
  id,
  className,
  children,
}: TitleProps) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={cn(
        "text-3xl md:text-4xl leading-tight",
        align === "center" && "text-center",
        withHighlight && "inline-block px-4 py-1",
        className,
      )}
      style={{
        color: "var(--ink)",
        fontFamily: "var(--font-serif)",
        fontWeight: 600,
        ...(withHighlight
          ? {
              background: "color-mix(in oklab, var(--ink-soft) 12%, transparent)",
              color: "var(--ink)",
            }
          : {}),
      }}
    >
      {children}
    </Tag>
  );
}

type SubtitleProps = {
  as?: "h3" | "h4" | "span";
  className?: string;
  children: ReactNode;
};

function Subtitle({ as = "h3", className, children }: SubtitleProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("text-[11px] uppercase tracking-[0.35em] font-medium", className)}
      style={{ color: "var(--gold)" }}
    >
      {children}
    </Tag>
  );
}

type BodyProps = {
  as?: "p" | "div";
  tone?: "default" | "on-dark";
  className?: string;
  children: ReactNode;
};

function Body({ as = "p", tone = "default", className, children }: BodyProps) {
  const Tag = as;
  return (
    <Tag
      className={cn("text-base md:text-lg leading-relaxed", className)}
      style={{ color: tone === "on-dark" ? "var(--cream)" : "var(--ink-soft)" }}
    >
      {children}
    </Tag>
  );
}

type QuoteProps = {
  className?: string;
  size?: "md" | "lg";
  children: ReactNode;
};

function Quote({ className, size = "md", children }: QuoteProps) {
  return (
    <p
      className={cn(
        "italic leading-snug",
        size === "md" ? "text-lg md:text-xl" : "text-2xl md:text-3xl",
        className,
      )}
      style={{ color: "var(--gold)" }}
    >
      {children}
    </p>
  );
}

export const Typography = {
  Title,
  Subtitle,
  Body,
  Quote,
};
