import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Comunidad Gestáltica — Estudios de Gestalt de Campo" },
      {
        name: "description",
        content:
          "Espacio de formación, práctica clínica y comunidad en Terapia Gestalt de Campo dirigido por Dany Mora Bracho.",
      },
      { property: "og:title", content: "Comunidad Gestáltica" },
      {
        property: "og:description",
        content: "Estudios de Gestalt de Campo. Formación, terapia y comunidad.",
      },
    ],
  }),
  component: HomePage,
});
