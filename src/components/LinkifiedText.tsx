import { Fragment, type ReactNode } from "react";

// Detecta URLs con protocolo (https://) o que empiezan con www.
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;

// Puntuación final que suele quedar pegada a un URL en una frase.
const TRAILING_PUNCTUATION = /[.,;:!?)]+$/;

function cleanUrl(raw: string): { href: string; label: string } {
  const cleaned = raw.replace(TRAILING_PUNCTUATION, "");
  const href = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
  return { href, label: cleaned };
}

/**
 * Renderiza un texto plano convirtiendo automáticamente los URLs en enlaces
 * clicables. Acepta URLs con protocolo (https://...) y sin él (www....).
 */
export function LinkifiedText({ text, className }: { text: string; className?: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const regex = new RegExp(URL_REGEX.source, "gi");
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Fragment key={lastIndex}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const { href, label } = cleanUrl(match[0]);
    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {label}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={lastIndex}>{text.slice(lastIndex)}</Fragment>);
  }

  return <span className={`whitespace-pre-line ${className ?? ""}`}>{parts}</span>;
}
