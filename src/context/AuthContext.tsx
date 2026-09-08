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

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  hasPaidAccess: null,
  isAdmin: false,
  loading: true,
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
    const { data } = await supabase
      .from("user_access")
      .select("has_paid_access")
      .eq("user_id", userId)
      .maybeSingle();

    return data?.has_paid_access ?? false;
  }, []);

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

  const value = useMemo(() => state, [state]);

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
      nav({ to: "/clases" });
    }
  }, [auth.loading, auth.user, auth.isAdmin, nav]);

  return auth;
}
