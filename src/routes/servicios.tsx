import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ServicesPage = lazy(() =>
  import("@/pages/ServicesPage").then((m) => ({ default: m.ServicesPage })),
);

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — Comunidad Gestáltica" },
      {
        name: "description",
        content: "Terapia individual, supervisión clínica y formación en Gestalt de Campo.",
      },
      { property: "og:title", content: "Servicios — Comunidad Gestáltica" },
      { property: "og:description", content: "Terapia, supervisión y formación." },
    ],
  }),
  component: ServicesPage,
});
