import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { logout } from "@/lib/auth-store";
import { LayoutDashboard, PlusCircle, LogOut, ExternalLink, FileJson } from "lucide-react";
import { Logo } from "@/components/site/Logo";

export function AdminShell({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/admin/dashboard", label: "Cursos", icon: LayoutDashboard },
    { to: "/admin/nuevo", label: "Nuevo curso", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]" style={{ background: "var(--cream)" }}>
      <aside className="border-r flex flex-col" style={{ background: "var(--ink)", color: "var(--cream)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="p-6 border-b border-white/10">
          <Logo tone="cream" />
          <div className="mt-4 text-[10px] uppercase tracking-[0.3em] opacity-60">Decap CMS · Panel</div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {items.map((it) => {
            const active = pathname === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  background: active ? "rgba(201,169,130,0.15)" : "transparent",
                  color: active ? "var(--gold)" : "var(--cream)",
                }}
              >
                <Icon className="w-4 h-4" /> {it.label}
              </Link>
            );
          })}
          <div className="mt-6 pt-6 border-t border-white/10 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm opacity-70 hover:opacity-100">
              <ExternalLink className="w-4 h-4" /> Ver sitio público
            </Link>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs opacity-50">
              <FileJson className="w-4 h-4" /> /src/data/courses.json
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs mb-2 opacity-70">Dany Mora Bracho</div>
          <button
            onClick={() => {
              logout();
              nav({ to: "/admin" });
            }}
            className="w-full inline-flex items-center gap-2 text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="p-8 md:p-14 overflow-auto">{children}</main>
    </div>
  );
}
