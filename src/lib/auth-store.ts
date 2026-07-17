import { useSyncExternalStore } from "react";

const KEY = "cg:admin:v1";
const listeners = new Set<() => void>();

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

function emit() {
  listeners.forEach((l) => l());
}

export function login(email: string, password: string): boolean {
  // Simulated auth for Dany Mora
  const ok =
    email.trim().toLowerCase() === "dany@comunidadgestaltica.com" &&
    password === "gestalt2026";
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(KEY, "1");
    emit();
  }
  return ok;
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  emit();
}

export function useAuth() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => read(),
    () => false,
  );
}
