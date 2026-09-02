import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AdminLoginPage = lazy(() =>
  import("@/pages/admin/AdminLoginPage").then((m) => ({ default: m.AdminLoginPage })),
);

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Panel — Comunidad Gestáltica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLoginPage,
});
