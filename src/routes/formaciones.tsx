import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const FormacionesPage = lazy(() =>
  import("@/pages/FormacionesPage").then((m) => ({ default: m.FormacionesPage })),
);

export const Route = createFileRoute("/formaciones")({
  head: () => ({
    meta: [
      { title: "Formaciones — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Diplomados, seminarios y talleres en Gestalt de Campo dirigidos por Dany Mora Bracho.",
      },
      { property: "og:title", content: "Formaciones — Comunidad Gestáltica" },
      { property: "og:description", content: "Programas actuales e historial de formaciones." },
    ],
  }),
  component: FormacionesPage,
});
