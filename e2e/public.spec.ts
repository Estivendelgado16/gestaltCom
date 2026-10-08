import { test, expect, type Page } from "@playwright/test";

// Espera a que React haya hidratado la página (handlers de eventos activos)
async function waitForHydration(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => window.__TSR_ROUTER__ != null);
}

test.describe("Home", () => {
  test("carga y muestra el hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await expect(
      page.getByRole("heading", { name: /necesitamos estar preparados/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: /ver formaciones/i }),
    ).toBeVisible();
  });

  test("errores de consola inesperados", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
});

test.describe("Navegación", () => {
  test("navega a Formaciones desde el CTA del hero", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("link", { name: /ver formaciones/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/formaciones/);
    await expect(page.getByRole("heading", { name: /formaciones disponibles/i })).toBeVisible();
  });

  test("los enlaces principales de navegación están presentes", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header.getByText(/formaciones/i).first()).toBeVisible();
    await expect(header.getByText(/servicios/i).first()).toBeVisible();
    await expect(header.getByText(/sobre/i).first()).toBeVisible();
  });
});

test.describe("Páginas públicas", () => {
  test("Servicios renderiza", async ({ page }) => {
    await page.goto("/servicios");
    await expect(page.getByRole("heading", { name: /el dolor no es otra cosa/i })).toBeVisible();
  });

  test("Formaciones renderiza", async ({ page }) => {
    await page.goto("/formaciones");
    await expect(page.getByRole("heading", { name: /formaciones disponibles/i })).toBeVisible();
  });

  test("Sobre mí renderiza", async ({ page }) => {
    await page.goto("/sobre-mi");
    await expect(page.getByRole("img", { name: /dany rafael mora bracho/i })).toBeVisible();
  });

  test("Clases (ruta legada) redirige al login sin sesión", async ({ page }) => {
    await page.goto("/clases");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("/usuarios redirige al login sin sesión", async ({ page }) => {
    await page.goto("/usuarios");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("/usuarios/clases redirige al login sin sesión", async ({ page }) => {
    await page.goto("/usuarios/clases");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("Pagos redirige al login sin sesión", async ({ page }) => {
    await page.goto("/pagos");
    await page.waitForURL(/\/login/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Contacto", () => {
  test("renderiza el formulario completo", async ({ page }) => {
    await page.goto("/contacto");
    await waitForHydration(page);
    await expect(page.getByRole("heading", { name: /inscripciones/i })).toBeVisible();
    await expect(page.locator("form input").nth(0)).toBeVisible();
    await expect(page.locator("form select")).toBeVisible();
    await expect(page.locator("form textarea")).toBeVisible();
    await expect(page.getByRole("button", { name: /^enviar$/i })).toBeVisible();
  });

  test("muestra errores de validación al enviar vacío", async ({ page }) => {
    await page.goto("/contacto");
    await waitForHydration(page);
    await expect(page.locator("form")).toBeVisible();
    await page.getByRole("button", { name: /^enviar$/i }).click();
    await expect(page.getByText("Nombre requerido")).toBeVisible();
    await expect(page.getByText("Correo inválido")).toBeVisible();
    await expect(page.getByText("Cuenta un poco más")).toBeVisible();
    // No debe abrir WhatsApp al haber errores
    expect(page.context().pages()).toHaveLength(1);
  });

  test("con datos válidos abre WhatsApp en pestaña nueva", async ({ page, context }) => {
    await page.goto("/contacto");
    await waitForHydration(page);
    await expect(page.locator("form")).toBeVisible();
    await page.locator("form input").nth(0).fill("Test Usuario");
    await page.locator("form input").nth(1).fill("test@example.com");
    await page.locator("form textarea").fill("Este es un mensaje de prueba.");

    // Evitar abrir una pestaña real a wa.me: interceptamos window.open target
    await context.route("https://wa.me/**", (route) => route.abort());

    await page.getByRole("button", { name: /^enviar$/i }).click();

    // Toast de éxito
    await expect(page.getByText("Mensaje enviado")).toBeVisible();
    await expect(page.getByText("Nombre requerido")).not.toBeVisible();
  });
});
