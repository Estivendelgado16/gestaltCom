import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const DashboardPage = lazy(() =>
  import("@/pages/admin/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Cursos — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: DashboardPage,
});
