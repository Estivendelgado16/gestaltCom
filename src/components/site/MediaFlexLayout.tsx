import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * <MediaFlexLayout /> — sección de dos columnas 50/50: contenido textual en
 * una columna y un elemento visual en la opuesta. La dirección se controla vía
 * `imagePosition` (Inversión de Control); en móvil apila la imagen primero.
 */
export function MediaFlexLayout({
  imageSrc,
  imageAlt = "",
  imagePosition = "right",
  imageClassName = "",
  aspect = "aspect-[4/3]",
  children,
}: {
  imageSrc: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  imageClassName?: string;
  aspect?: string;
  children: ReactNode;
}) {
  const image = (
    <div className={cn("w-full overflow-hidden rounded-sm", aspect, imageClassName)}>
      <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );

  return (
    <div className="grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
      {imagePosition === "right" && image}
      <div>{children}</div>
      {imagePosition === "left" && image}
    </div>
  );
}
