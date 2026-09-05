import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ClasesPage = lazy(() =>
  import("@/pages/ClasesPage").then((m) => ({ default: m.ClasesPage })),
);

export const Route = createFileRoute("/formaciones/clases")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Clases — Comunidad Gestáltica" },
      {
        name: "description",
        content: "Acceso a las lecciones y módulos de la formación.",
      },
      { name: "author", content: "Dany Mora Bracho" },
      { property: "og:title", content: "Comunidad Gestáltica — Clases" },
      {
        property: "og:description",
        content: "Acceso a las lecciones y módulos de la formación.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClasesPage,
});