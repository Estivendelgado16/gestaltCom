import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const AdminYoutubePage = lazy(() =>
  import("@/pages/admin/AdminYoutubePage").then((m) => ({ default: m.AdminYoutubePage })),
);

export const Route = createFileRoute("/admin/youtube")({
  head: () => ({
    meta: [{ title: "YouTube — Panel" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminYoutubePage,
});
