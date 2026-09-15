import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ClasesPage = lazy(() =>
  import("@/pages/ClasesPage").then((m) => ({ default: m.ClasesPage })),
);

export const Route = createFileRoute("/usuarios/clases")({
  head: () => ({
    meta: [
      { title: "Mis Clases — Comunidad Gestáltica" },
      { name: "description", content: "Accede a las clases y materiales de las formaciones." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ClasesPage,
});
