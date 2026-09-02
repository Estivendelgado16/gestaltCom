import { defineTool, ToolError } from "@lovable.dev/mcp-js";
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
  name: "get_course",
  title: "Ver una formación",
  description: "Devuelve el detalle de una formación publicada a partir de su id (slug).",
  inputSchema: {
    id: z
      .string()
      .trim()
      .min(1)
      .describe("Id / slug de la formación, ej. 'diplomado-internacional-2026-2027'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const course = all.find((c) => c.id === id);
    if (!course) {
      throw new ToolError(
        `No existe una formación con id "${id}". Usa list_courses para ver los ids disponibles.`,
      );
    }
    return {
      content: [{ type: "text", text: JSON.stringify(course, null, 2) }],
      structuredContent: { course },
    };
  },
});
