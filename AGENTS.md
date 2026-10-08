## Testing (E2E)

Se usa **Playwright** (@playwright/test) para tests end-to-end de flujos públicos.

- Config: `playwright.config.ts` (usa el Chrome del sistema vía `channel: "chrome"`; levanta el dev server automáticamente en `http://localhost:8080`).
- Tests: `e2e/public.spec.ts` (home, navegación, páginas públicas, contacto, redirects de auth).

Comandos:
```bash
npm run test:e2e        # corre todos los tests
npm run test:e2e:ui     # modo UI interactivo
npm run test:e2e:debug  # paso a paso
npx playwright show-report  # ver reporte HTML con trazas
```

Notas:
- Con SSR + hidratación (TanStack Start), hay que esperar `window.__TSR_ROUTER__` antes de interactuar con formularios (ver helper `waitForHydration`).
- `/clases` y `/pagos` redirigen a `/admin` sin sesión; los flujos autenticados aún no están cubiertos (requieren credenciales de prueba).
- No commitear `test-results/` ni `playwright-report/` (ya están en .gitignore).
