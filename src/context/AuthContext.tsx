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
  loading: boolean;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  hasPaidAccess: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    hasPaidAccess: null,
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
          loading: false,
        });
      } else {
        setState({ session: null, user: null, hasPaidAccess: false, loading: false });
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
          loading: false,
        });
      } else {
        setState({ session: null, user: null, hasPaidAccess: false, loading: false });
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
export function useRequireAuth(redirectTo: string = "/admin") {
  const auth = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      nav({ to: redirectTo });
    }
  }, [auth.loading, auth.user, nav, redirectTo]);

  return auth;
}
