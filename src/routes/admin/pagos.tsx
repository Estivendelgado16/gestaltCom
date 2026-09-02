import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AdminPagosPage = lazy(() =>
  import("@/pages/admin/AdminPagosPage").then((m) => ({ default: m.AdminPagosPage })),
);

export const Route = createFileRoute("/admin/pagos")({
  head: () => ({
    meta: [{ title: "Pagos — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminPagosPage,
});
