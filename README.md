# Comunidad Gestáltica

> Plataforma web de **Comunidad Gestáltica — Estudios de Terapia Gestalt de Campo**: un espacio de encuentro, formación y divulgación de la psicoterapia gestáltica con perspectiva de campo.

Aplicación fullstack con renderizado en servidor (SSR) para el psicólogo **Dany Mora Bracho**. Expone el sitio público de la comunidad, un área privada para estudiantes con acceso por pago y un panel de administración para gestionar contenidos, formaciones, actividades, clases y pagos.

---

## ✨ Características

- **Sitio público** con páginas independientes: Inicio, Sobre mí, Servicios, Formaciones, Actividades, YouTube y Contacto.
- **Formaciones dinámicas** clasificadas automáticamente por estado (Próximo, En curso, Finalizado) y con historial de formaciones finalizadas.
- **Área privada de estudiantes** (`/usuarios/clases`) con módulos y clases que se desbloquean al aprobar el pago.
- **Flujo de pagos** con registro de medio de pago y fecha, verificación y aprobación por el administrador.
- **Panel de administración** (`/admin`) para contenidos, formaciones, actividades, clases, pagos y enlaces de YouTube.
- **Headless CMS** respaldado por Supabase (PostgreSQL + Storage + Auth + RLS).
- **SSR + hidratación** con TanStack Start, navegación por archivos con TanStack Router y consultas con TanStack Query.
- Animaciones de entrada y de scroll, diseño responsivo y accesible.

---

## 🧱 Stack tecnológico

| Capa            | Tecnología                                             |
| --------------- | ------------------------------------------------------ |
| Framework       | [TanStack Start](https://tanstack.com/start) (SSR)     |
| UI              | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Estilos         | [Tailwind CSS v4](https://tailwindcss.com)             |
| Routing         | [TanStack Router](https://tanstack.com/router)         |
| Datos           | [TanStack Query](https://tanstack.com/query)           |
| Backend / DB    | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage) |
| Componentes     | [Radix UI](https://www.radix-ui.com) + [lucide-react](https://lucide.dev) |
| Validación      | [Zod](https://zod.dev)                                 |
| Testing E2E     | [Playwright](https://playwright.dev)                   |

---

## 📦 Requisitos

- **Node.js 20+** (recomendado instalar con [nvm](https://github.com/nvm-sh/nvm)).
- Una cuenta y proyecto de [Supabase](https://supabase.com).

---

## 🚀 Instalación

```sh
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
npm install
```

Crea un archivo `.env` en la raíz (o copia de `.env.example`) con las variables de tu proyecto de Supabase:

```sh
VITE_SUPABASE_URL=tu-url-de-supabase
VITE_SUPABASE_ANON_KEY=tu-anon-key
DATABASE_URL=tu-cadena-de-conexion-postgres
```

> Nunca subas `.env` al repositorio (ya está en `.gitignore`).

Aplica las migraciones de la base de datos:

```sh
supabase db push
```

Inicia el servidor de desarrollo:

```sh
npm run dev
```

Abre `http://localhost:8080` (el puerto lo configura el dev server automáticamente).

---

## 🧪 Scripts disponibles

| Comando                 | Descripción                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Levanta el servidor de desarrollo con Vite               |
| `npm run build`         | Compila la versión de producción                         |
| `npm run build:dev`     | Compila en modo desarrollo                               |
| `npm run preview`       | Previsualiza el build de producción                      |
| `npm run lint`          | Ejecuta ESLint                                           |
| `npm run format`        | Formatea el código con Prettier                          |
| `npm run test:e2e`      | Corre los tests end-to-end con Playwright                |
| `npm run test:e2e:ui`   | Modo UI interactivo de Playwright                        |
| `npm run test:e2e:debug`| Ejecuta los tests paso a paso                            |

---

## 📁 Estructura del proyecto

```
.
├── e2e/                      # Tests end-to-end (Playwright)
├── public/                   # Estáticos (imágenes, videos, banners)
├── supabase/
│   ├── functions/            # Edge Functions
│   └── migrations/           # Migraciones SQL (consolidadas por dominio)
└── src/
    ├── components/           # UI (ui, site, layout, auth, admin)
    ├── context/              # Contexto de autenticación
    ├── hooks/                # Hooks de datos
    ├── lib/                  # Clientes (Supabase, etc.)
    ├── pages/                # Vistas por página
    ├── routes/               # Rutas (file-based, TanStack Router)
    ├── services/             # Acceso a datos por dominio
    ├── types/                # Tipos y tipos generados de la DB
    ├── styles.css            # Estilos globales y tokens de marca
    ├── router.tsx            # Configuración del router
    └── start.ts              # Instancia de TanStack Start (SSR + middleware de errores)
```

---

## 🗄️ Base de datos

Las migraciones están **consolidadas por dominio** en `supabase/migrations/`:

| Archivo                                | Dominio                              |
| -------------------------------------- | ------------------------------------ |
| `20260830000001_pagos_y_acceso.sql`    | Pagos, acceso y aprobación           |
| `20260830000002_clases.sql`            | Módulos, lecciones y archivos        |
| `20260830000003_formaciones.sql`       | Formaciones e inscripciones          |
| `20260830000004_youtube.sql`           | Listas de reproducción de YouTube    |
| `20260830000005_actividades.sql`       | Actividades y espacios de encuentro  |
| `20260830000006_archivos.sql`          | Archivos únicos editables            |

La seguridad se aplica mediante **Row Level Security (RLS)**: los usuarios ven su propio acceso y pagos, y solo los administradores gestionan el contenido.

---

## ✅ Testing (E2E)

Se usa **Playwright** para los flujos públicos (home, navegación, páginas públicas, contacto y redirecciones de autenticación).

- Configuración: `playwright.config.ts` (levanta el dev server automáticamente en `http://localhost:8080`).
- Tests: `e2e/public.spec.ts`.

```sh
npm run test:e2e        # corre todos los tests
npm run test:e2e:ui     # modo UI interactivo
npm run test:e2e:debug  # paso a paso
npx playwright show-report  # ver reporte HTML con trazas
```

Notas:
- Con SSR + hidratación (TanStack Start) hay que esperar `window.__TSR_ROUTER__` antes de interactuar con formularios (ver helper `waitForHydration`).
- `/clases` y `/pagos` redirigen a `/admin` sin sesión; los flujos autenticados requieren credenciales de prueba.
- No commitear `test-results/` ni `playwright-report/` (ya están en `.gitignore`).

---

## 🌐 Despliegue (Vercel)

El proyecto está configurado para **Vercel** usando Nitro con el preset `vercel` (definido en `vite.config.ts`).

```sh
npm run build
```

El build genera la salida en `.vercel/output/`, lista para desplegar.

### Opción A — Conectar el repositorio (recomendado)

1. Sube el repositorio a GitHub.
2. En Vercel: **Add New → Project** e importa el repositorio.
3. Vercel detecta el framework automáticamente. Configura las variables de entorno:

| Variable                 | Descripción                        |
| ------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`      | URL del proyecto en Supabase       |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (pública) de Supabase |

4. Deploy.

### Opción B — Vercel CLI

```sh
npx vercel
```

> Para cambiar el destino de despliegue, edita el `preset` de Nitro en `vite.config.ts` (ej. `node-server`, `netlify`, `cloudflare-module`).

---

## ⚠️ Notas de desarrollo

- La ruta privada usa **file-based routing**: no crear `src/pages/`, `src/routes/_app/index.tsx` ni `app/layout.tsx` (convenciones de Next/Remix).
- `routeTree.gen.ts` se genera automáticamente; no editar a mano.

---

## 👤 Autor

**Dany Mora Bracho** — Psicólogo, terapeuta gestáltico y fundador de Comunidad Gestáltica.
