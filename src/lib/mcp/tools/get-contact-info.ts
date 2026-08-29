import { defineTool } from "@lovable.dev/mcp-js";

const info = {
  organization: "Comunidad Gestáltica",
  founder: "Dany Mora Bracho",
  focus: "Estudios, práctica clínica y comunidad en Terapia Gestalt de Campo",
  location: "Maracaibo, Venezuela",
  email: "hola@comunidadgestaltica.com",
  phone: "+58 424 000 0000",
  pages: ["/", "/sobre-mi", "/servicios", "/formaciones", "/contacto"],
};

export default defineTool({
  name: "get_contact_info",
  title: "Información de contacto",
  description:
    "Devuelve la información pública de contacto y las secciones del sitio de Comunidad Gestáltica.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    structuredContent: info,
  }),
});
