import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const NuevoCursoPage = lazy(() =>
  import("@/pages/admin/NuevoCursoPage").then((m) => ({ default: m.NuevoCursoPage })),
);

export const Route = createFileRoute("/admin/nuevo")({
  head: () => ({
    meta: [{ title: "Nueva formación — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: NuevoCursoPage,
});