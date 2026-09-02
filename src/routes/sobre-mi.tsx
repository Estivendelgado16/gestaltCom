import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí — Dany Mora Bracho | Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Dany Mora Bracho, psicólogo y terapeuta gestáltico. Fundador de Comunidad Gestáltica.",
      },
      { property: "og:title", content: "Dany Mora Bracho — Comunidad Gestáltica" },
      { property: "og:description", content: "Psicólogo y formador en Gestalt de Campo." },
    ],
  }),
  component: AboutPage,
});
