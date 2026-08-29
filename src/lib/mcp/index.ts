import { defineMcp } from "@lovable.dev/mcp-js";
import listCourses from "./tools/list-courses";
import getCourse from "./tools/get-course";
import getContactInfo from "./tools/get-contact-info";

export default defineMcp({
  name: "gestalt-space",
  title: "Gestalt Space",
  version: "0.1.0",
  instructions:
    "Herramientas públicas de lectura del sitio Comunidad Gestáltica (Dany Mora Bracho). Usa list_courses y get_course para consultar formaciones, y get_contact_info para datos de contacto.",
  tools: [listCourses, getCourse, getContactInfo],
});
