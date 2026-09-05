import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const FormacionesPage = lazy(() =>
  import("@/pages/FormacionesPage").then((m) => ({ default: m.FormacionesPage })),
);

export const Route = createFileRoute("/formaciones/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Formaciones — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Programas actuales y en preparación. Cada formación se sostiene en teoría contemporánea, práctica supervisada y comunidad.",
      },
      { name: "author", content: "Dany Mora Bracho" },
      { property: "og:title", content: "Comunidad Gestáltica — Formaciones" },
      {
        property: "og:description",
        content:
          "Programas actuales y en preparación. Cada formación se sostiene en teoría contemporánea, práctica supervisada y comunidad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FormacionesPage,
});