import { useSyncExternalStore } from "react";
import seed from "@/data/courses.json";
import type { Course } from "@/types";

const STORAGE_KEY = "cg:courses:v1";
const listeners = new Set<() => void>();

function read(): Course[] {
  if (typeof window === "undefined") return seed as Course[];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed as Course[];
    return JSON.parse(raw) as Course[];
  } catch {
    return seed as Course[];
  }
}

function write(next: Course[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCourses(): Course[] {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => read(),
    () => seed as Course[],
  );
}

export function getCourses(): Course[] {
  return read();
}

export function saveCourse(course: Course) {
  const all = read();
  const idx = all.findIndex((c) => c.id === course.id);
  if (idx >= 0) all[idx] = course;
  else all.unshift(course);
  write(all);
}

export function deleteCourse(id: string) {
  write(read().filter((c) => c.id !== id));
}

export function resetCourses() {
  write(seed as Course[]);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
