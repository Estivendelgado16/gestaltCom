import { createFileRoute, redirect } from "@tanstack/react-router";

// Ruta legada: el área de clases vive ahora dentro de /usuarios.
export const Route = createFileRoute("/clases")({
  beforeLoad: () => {
    throw redirect({ to: "/usuarios/clases" });
  },
});
