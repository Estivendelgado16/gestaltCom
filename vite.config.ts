import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

// Deploy target: Vercel (Nitro preset "vercel"). Change the preset here to
// deploy elsewhere (e.g. "node-server", "cloudflare-module", "netlify").
export default defineConfig(({ command }) => ({
  server: {
    port: 8080,
    strictPort: true,
  },
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart(),
    ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
    react(),
  ],
}));
