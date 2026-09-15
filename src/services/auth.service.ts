import { supabase } from "@/lib/supabaseClient";

export const authService = {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string) {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
  },

  async signInWithGoogle() {
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
  },

  async resetPassword(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  async updatePassword(newPassword: string) {
    return supabase.auth.updateUser({ password: newPassword });
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  getSession() {
    return supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
