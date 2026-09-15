import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/lesson.service";
import type { Lesson, LessonPreview, Module } from "@/types";

export function useLessons(formacionId?: string, enabled = true) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", formacionId],
    queryFn: () => lessonService.getPublishedLessons(formacionId),
    enabled,
  });
}

export function useModules(formacionId?: string, enabled = true) {
  return useQuery<Module[]>({
    queryKey: ["modules", formacionId],
    queryFn: () => lessonService.getModules(formacionId),
    enabled,
  });
}

/** Estructura completa de clases (publicadas y bloqueadas) sin URLs sensibles. */
export function useLessonPreviews(formacionId?: string, enabled = true) {
  return useQuery<LessonPreview[]>({
    queryKey: ["lesson-previews", formacionId],
    queryFn: () => lessonService.getLessonPreviews(formacionId),
    enabled,
  });
}
