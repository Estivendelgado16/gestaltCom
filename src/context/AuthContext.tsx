/* eslint-disable react-refresh/only-export-components -- exporta variantes/utilidades junto al componente (patrón shadcn/context) */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabaseClient";

interface AuthState {
  session: Session | null;
  user: User | null;
  hasPaidAccess: boolean | null;
  isAdmin: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  /** Vuelve a consultar `user_access` en Supabase y actualiza el estado. */
  refreshPaidAccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  hasPaidAccess: null,
  isAdmin: false,
  loading: true,
  refreshPaidAccess: async () => {},
});

function resolveRole(user: User | null): boolean {
  if (!user) return false;
  return (user.app_metadata?.role as string | undefined) === "admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    hasPaidAccess: null,
    isAdmin: false,
    loading: true,
  });

  const fetchPaidAccess = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_access")
      .select("has_paid_access")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error consultando user_access:", error.message);
    }
    return data?.has_paid_access ?? false;
  }, []);

  const refreshPaidAccess = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;
    const paid = await fetchPaidAccess(session.user.id);
    setState((prev) => (prev.user ? { ...prev, hasPaidAccess: paid } : prev));
  }, [fetchPaidAccess]);

  // Suscripción realtime: si el admin aprueba el pago (o cambia user_access)
  // mientras el usuario tiene la sesión abierta, el acceso se refleja al instante.
  useEffect(() => {
    const userId = state.user?.id;
    if (!userId) return;

    const channel = supabase
      .channel(`user-access-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_access",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const next = payload.new as { has_paid_access?: boolean } | null;
          setState((prev) =>
            prev.user ? { ...prev, hasPaidAccess: next?.has_paid_access ?? false } : prev,
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.user?.id]);

  // Reconsulta al volver a la pestaña (por si el evento realtime se perdió).
  useEffect(() => {
    if (!state.user) return;
    const onFocus = () => {
      void refreshPaidAccess();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [state.user, refreshPaidAccess]);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;
      if (session) {
        const paid = await fetchPaidAccess(session.user.id);
        if (cancelled) return;
        setState({
          session,
          user: session.user,
          hasPaidAccess: paid,
          isAdmin: resolveRole(session.user),
          loading: false,
        });
      } else {
        setState({
          session: null,
          user: null,
          hasPaidAccess: false,
          isAdmin: false,
          loading: false,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      if (session) {
        const paid = await fetchPaidAccess(session.user.id);
        if (cancelled) return;
        setState({
          session,
          user: session.user,
          hasPaidAccess: paid,
          isAdmin: resolveRole(session.user),
          loading: false,
        });
      } else {
        setState({
          session: null,
          user: null,
          hasPaidAccess: false,
          isAdmin: false,
          loading: false,
        });
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchPaidAccess]);

  const value = useMemo(() => ({ ...state, refreshPaidAccess }), [state, refreshPaidAccess]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Guard de autenticación para páginas privadas.
 * Redirige a `redirectTo` (login) cuando no hay sesión activa.
 * Devuelve el estado de auth para renderizar loading / contenido.
 */
export function useRequireAuth(redirectTo: string = "/login") {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      nav({ to: redirectTo });
    }
  }, [auth.loading, auth.user, nav, redirectTo]);

  return auth;
}

/**
 * Guard para páginas exclusivas de administrador.
 * Redirige a la página de login cuando no hay sesión, o fuera del panel
 * cuando el usuario está autenticado pero no es admin.
 */
export function useRequireAdmin() {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      nav({ to: "/login" });
    } else if (!auth.isAdmin) {
      nav({ to: "/usuarios/clases" });
    }
  }, [auth.loading, auth.user, auth.isAdmin, nav]);

  return auth;
}
