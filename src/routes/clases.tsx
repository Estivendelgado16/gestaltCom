import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ClasesPage = lazy(() =>
  import("@/pages/ClasesPage").then((m) => ({ default: m.ClasesPage })),
);

export const Route = createFileRoute("/clases")({
  head: () => ({
    meta: [
      { title: "Clases — Comunidad Gestáltica" },
      { name: "description", content: "Accede a las clases y materiales de las formaciones." },
    ],
  }),
  component: ClasesPage,
});
