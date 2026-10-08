import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ActividadesPage = lazy(() =>
  import("@/pages/ActividadesPage").then((m) => ({ default: m.ActividadesPage })),
);

export const Route = createFileRoute("/actividades")({
  head: () => ({
    meta: [
      { title: "Actividades — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Grupos, talleres, seminarios y espacios de encuentro en Gestalt de Campo y psicoterapia relacional.",
      },
      { property: "og:title", content: "Actividades — Comunidad Gestáltica" },
      {
        property: "og:description",
        content: "Espacios de reflexión clínica y personal en Gestalt de Campo.",
      },
    ],
  }),
  component: ActividadesPage,
});
