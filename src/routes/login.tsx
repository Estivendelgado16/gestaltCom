import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Ingresar — Comunidad Gestáltica" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});
