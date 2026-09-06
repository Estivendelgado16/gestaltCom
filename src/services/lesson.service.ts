import { supabase } from "@/lib/supabaseClient";
import type { Lesson, Module } from "@/types";

export const lessonService = {
  async getPublishedLessons(formacionId?: string): Promise<Lesson[]> {
    let query = supabase.from("lessons").select("*").eq("is_published", true);

    if (formacionId) {
      // First get modules for this formation, then filter lessons by those module IDs
      const { data: modules } = await supabase
        .from("modules")
        .select("id")
        .eq("formacion_id", formacionId);
      const moduleIds = modules?.map((m) => m.id) ?? [];

      if (moduleIds.length > 0) {
        query = query.in("module_id", moduleIds);
      } else {
        // No modules found, return empty
        return [];
      }
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getModules(formacionId?: string): Promise<Module[]> {
    let query = supabase.from("modules").select("*");

    if (formacionId) {
      query = query.eq("formacion_id", formacionId);
    }

    const { data, error } = await query.order("order_index", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },
};
