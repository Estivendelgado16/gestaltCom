import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const FormacionDetallePage = lazy(() =>
  import("@/pages/FormacionDetallePage").then((m) => ({ default: m.FormacionDetallePage })),
);

export const Route = createFileRoute("/formaciones/$formacionId")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Formación — Comunidad Gestáltica" },
      {
        name: "description",
        content: "Detalle de la formación y acceso a módulos.",
      },
      { name: "author", content: "Dany Mora Bracho" },
      { property: "og:title", content: "Comunidad Gestáltica — Formación" },
      {
        property: "og:description",
        content: "Detalle de la formación y acceso a módulos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FormacionDetallePage,
});