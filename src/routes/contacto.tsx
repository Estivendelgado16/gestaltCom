import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ContactPage = lazy(() =>
  import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Escribe a Dany Mora Bracho para agendar una consulta o inscribirte en un programa.",
      },
      { property: "og:title", content: "Contacto — Comunidad Gestáltica" },
      {
        property: "og:description",
        content: "Agenda tu consulta o pide información sobre nuestras formaciones.",
      },
    ],
  }),
  component: ContactPage,
});
