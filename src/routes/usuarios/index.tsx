import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const UsuariosPage = lazy(() =>
  import("@/pages/UsuariosPage").then((m) => ({ default: m.UsuariosPage })),
);

export const Route = createFileRoute("/usuarios/")({
  component: UsuariosPage,
});
