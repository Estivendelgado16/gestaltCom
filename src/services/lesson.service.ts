import { supabase } from "@/lib/supabaseClient";

export const lessonService = {
  async getPublishedLessons(formacionId?: string) {
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
        return { data: [], error: null };
      }
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getModules(formacionId?: string) {
    if (formacionId) {
      return supabase
        .from("modules")
        .select("*")
        .eq("formacion_id", formacionId)
        .order("order_index", { ascending: true });
    }
    return supabase.from("modules").select("*").order("order_index", { ascending: true });
  },
};
