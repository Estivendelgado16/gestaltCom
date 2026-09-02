# Gestalt Space

Actúa como un Arquitecto de Software Fullstack Senior. Quiero que desarrolles la plataforma "Comunidad Gestáltica" para el psicólogo Dany Mora Bracho utilizando React, TypeScript y Tailwind CSS. Este proyecto requiere una arquitectura escalable de alto rendimiento con un sistema de administración de contenido estático (Headless CMS).

### 1. Identidad Visual (Guía de HUV):

- Aplica estrictamente los colores de la marca: Oscuros (`#1D2444`, `#294461`), Dorados/Arena (`#C9A982`), Claros (`#EFD6BA`, `#FDEAD3`).

- Utiliza fuentes sans-serif geométricas limpias y sofisticadas (estilo Nexa) con amplios márgenes que transmitan "silencio y espacio clínico".

### 2. Arquitectura de Datos y Escalabilidad (CMS Estático):

- El sitio debe consumir la información de la sección "Formaciones" desde archivos locales JSON estructurados.

- Prepara y simula en el frontend la ruta privada `/admin` de Decap CMS (antiguo Netlify CMS). Diseña la interfaz visual de este panel de control privado que vería el cliente:

  - Interfaz de Login minimalista y limpia para Dany Mora.

  - Dashboard de administración visual donde se listen los cursos guardados en el JSON.

  - Formulario intuitivo para "Crear un Nuevo Curso" con los campos: Título, Fecha de Inicio, Descripción Corta, y un Selector de Estado (con las opciones: "Próximo", "En Curso" y "Finalizado").

  - Simula la acción de guardar simulando que escribe o actualiza el archivo JSON de constantes locales.

### 3. Vistas Públicas Independientes:

- **Inicio, Sobre Mí, y Servicios:** Vistas independientes limpias, estéticas y responsivas.

- **Formaciones (Dinámica):** Esta página debe leer los cursos y clasificarlos automáticamente en pantalla según su estado:

  - Arriba: Tarjetas destacadas con animaciones fluidas para los cursos marcados como "Próximo" o "En Curso" (ej. Diplomado Internacional 2026-2027).

  - Abajo: Un acordeón o sección sutil de "Historial de Formaciones" que agrupe y muestre de manera más opaca los cursos marcados como "Finalizado".

- **Contacto:** Formulario validado conectado a un servicio simulado de emails que redirige también a WhatsApp.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ee23b2b1-6944-4527-841c-a1d91070cd2c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
