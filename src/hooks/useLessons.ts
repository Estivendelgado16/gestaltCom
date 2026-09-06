import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/lesson.service";
import type { Lesson, Module } from "@/types";

export function useLessons(formacionId?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", formacionId],
    queryFn: () => lessonService.getPublishedLessons(formacionId),
  });
}

export function useModules(formacionId?: string) {
  return useQuery<Module[]>({
    queryKey: ["modules", formacionId],
    queryFn: () => lessonService.getModules(formacionId),
  });
}
