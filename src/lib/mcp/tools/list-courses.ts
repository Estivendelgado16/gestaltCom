import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import courses from "@/data/courses.json";

type Course = {
  id: string;
  title: string;
  startDate: string;
  shortDescription: string;
  status: string;
  location?: string;
  duration?: string;
};

const all = courses as Course[];

export default defineTool({
  name: "list_courses",
  title: "Listar formaciones",
  description:
    "Lista las formaciones publicadas de Comunidad Gestáltica (diplomados, seminarios, talleres y supervisión), opcionalmente filtradas por estado.",
  inputSchema: {
    status: z
      .enum(["Próximo", "En Curso", "Finalizado"])
      .optional()
      .describe("Filtrar por estado de la formación."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status }) => {
    const rows = status ? all.filter((c) => c.status === status) : all;
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { courses: rows, count: rows.length },
    };
  },
});
