import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((m) => ({ default: m.ResetPasswordPage })),
);

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña — Comunidad Gestáltica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});
