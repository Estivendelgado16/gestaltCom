import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const DiplomadoPage = lazy(() =>
  import("@/pages/DiplomadoPage").then((m) => ({ default: m.DiplomadoPage })),
);

export const Route = createFileRoute("/diplomado")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Diplomado Internacional — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Diplomado Internacional en Terapia Gestalt de Campo: fundamentos en fenomenología y teoría de campo.",
      },
      { name: "author", content: "Dany Mora Bracho" },
      { property: "og:title", content: "Comunidad Gestáltica — Diplomado" },
      {
        property: "og:description",
        content:
          "Diplomado Internacional en Terapia Gestalt de Campo: fundamentos en fenomenología y teoría de campo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiplomadoPage,
});
