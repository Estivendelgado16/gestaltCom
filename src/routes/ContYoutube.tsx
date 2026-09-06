import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ContYoutubePage = lazy(() =>
  import("@/pages/ContYoutubePage").then((m) => ({ default: m.ContYoutubePage })),
);

export const Route = createFileRoute("/ContYoutube")({
  head: () => ({
    meta: [
      { title: "YouTube — Comunidad Gestáltica" },
      {
        name: "description",
        content:
          "Entrevistas y divulgación en torno a la Terapia Gestalt de Campo en el canal de YouTube de Dany Mora Bracho.",
      },
      { property: "og:title", content: "YouTube — Comunidad Gestáltica" },
    ],
  }),
  component: ContYoutubePage,
});
