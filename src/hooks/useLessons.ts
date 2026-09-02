import { useQuery } from "@tanstack/react-query";
import { lessonService } from "@/services/lesson.service";
import type { Lesson, Module } from "@/types";

export function useLessons(formacionId?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["lessons", formacionId],
    queryFn: async () => {
      const { data, error } = await lessonService.getPublishedLessons(formacionId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!formacionId, // Solo si viene formacionId, sino usar useEffect manual
  });
}

export function useModules(formacionId?: string) {
  return useQuery<Module[]>({
    queryKey: ["modules", formacionId],
    queryFn: async () => {
      const { data, error } = await lessonService.getModules(formacionId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!formacionId,
  });
}
