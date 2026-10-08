import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AdminActividadesPage = lazy(() =>
  import("@/pages/admin/AdminActividadesPage").then((m) => ({ default: m.AdminActividadesPage })),
);

export const Route = createFileRoute("/admin/actividades")({
  head: () => ({
    meta: [{ title: "Actividades — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminActividadesPage,
});
