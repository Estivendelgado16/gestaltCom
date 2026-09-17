import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Menu } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-mi", label: "Sobre mí" },
  {
    to: "/servicios",
    label: "Servicios",
    items: [
      { to: "/formaciones?tipo=DIPLOMADO", label: "Diplomados" },
      { to: "/formaciones?tipo=CURSO", label: "Cursos" },
      { to: "/formaciones?tipo=TALLER", label: "Talleres" },
    ],
  },
  { to: "/formaciones", label: "Formaciones" },
  { to: "/actividades", label: "Actividades" },
  { to: "/contacto", label: "Contacto" },
];

export function SiteLayout({
  children,
  hideChrome = false,
}: {
  children: ReactNode;
  /** Si es true, no renderiza el header ni el footer (solo el contenido). */
  hideChrome?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (route: string) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!hideChrome && (
        <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
          <div className="container-clinic flex items-center justify-between h-20">
            <Link to="/" className="shrink-0">
              <Logo />
            </Link>
            <nav className="hidden lg:flex items-center gap-10">
              {nav.map((n) => {
                const active = isActive(n.to);

                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="relative text-[13px] tracking-wide uppercase transition-colors"
                    style={{ color: active ? "var(--ink)" : "var(--ink-soft)" }}
                  >
                    {n.label}
                    <span
                      className="absolute -bottom-2 left-0 h-px transition-all"
                      style={{
                        width: active ? "100%" : "0%",
                        background: "var(--gold)",
                      }}
                    />
                  </Link>
                );
              })}
            </nav>
            <Link
              to="/ContYoutube"
              className="hidden lg:inline-flex items-center rounded-full px-5 py-2 text-[12px] uppercase tracking-widest transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              Youtube
            </Link>

            <Sheet>
              <SheetTrigger
                className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-secondary cursor-pointer"
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" style={{ color: "var(--ink)" }} />
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:max-w-sm p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <SheetDescription className="sr-only">
                  Navegación del sitio Comunidad Gestáltica
                </SheetDescription>
                <nav className="flex flex-col gap-1 p-6 pt-16">
                  {nav.map((n) => {
                    const active = isActive(n.to);
                    return (
                      <Link
                        key={n.to}
                        to={n.to}
                        className="px-3 py-3 rounded-md text-sm uppercase tracking-widest transition-colors"
                        style={{
                          color: active ? "var(--ink)" : "var(--ink-soft)",
                          background: active
                            ? "color-mix(in oklab, var(--gold) 20%, transparent)"
                            : "transparent",
                        }}
                      >
                        {n.label}
                      </Link>
                    );
                  })}
                  <Link
                    to="/ContYoutube"
                    className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-3 text-[12px] uppercase tracking-widest"
                    style={{ background: "var(--ink)", color: "var(--cream)" }}
                  >
                    Youtube
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!hideChrome && (
        <footer style={{ background: "var(--ink)", color: "var(--cream)" }}>
          <div className="container-clinic py-16 grid gap-10 md:grid-cols-3">
            <div>
              <Logo tone="cream" img="/img/logo2.png" size={56} />
              <p className="mt-6 text-sm opacity-70 leading-relaxed max-w-xs">
                Espacio de encuentro, formación y difusión de la terapia Gestalt de campo. Fundado
                por Dany R. Mora B.
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-4">
                Navegación
              </div>
              <ul className="space-y-2 text-sm">
                {nav.map((n) => {
                  if (n.items) {
                    return (
                      <li key={n.to}>
                        <Link to={n.to} className="opacity-80 hover:opacity-100">
                          {n.label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={n.to}>
                      <Link to={n.to} className="opacity-80 hover:opacity-100">
                        {n.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-4">
                Atención terapéutica
              </div>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <span className="font-semibold">Lugar del consultorio:</span> Barrio Simón
                  Bolívar, Medellín, Antioquia, Colombia
                </li>
                <li>
                  <span className="font-semibold">Horarios:</span>
                </li>
                <li>
                  <span className="font-semibold">Lunes a viernes:</span> 9 am a 12 m / 3 pm a 8 pm
                </li>
                <li>
                  <span className="font-semibold">Sábados:</span> 9 am a 12 m (hora Colombia)
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="container-clinic py-6 flex flex-wrap justify-between items-center gap-4 text-xs opacity-60">
              <span>© {new Date().getFullYear()} Comunidad Gestáltica</span>
              <span>Estudios de Gestalt de Campo · Dany Mora Bracho</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
