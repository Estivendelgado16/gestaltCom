import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const PagosPage = lazy(() => import("@/pages/PagosPage").then((m) => ({ default: m.PagosPage })));

export const Route = createFileRoute("/pagos")({
  head: () => ({
    meta: [
      { title: "Subir Comprobante — Comunidad Gestáltica" },
      {
        name: "description",
        content: "Envía tu comprobante de pago para acceder a las formaciones.",
      },
    ],
  }),
  component: PagosPage,
});
