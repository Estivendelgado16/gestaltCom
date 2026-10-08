import { supabase } from "@/lib/supabaseClient";
import type { Actividad } from "@/types";

export const actividadService = {
  async getActividades(filters?: { soloPublicadas?: boolean }): Promise<Actividad[]> {
    let query = supabase.from("actividades").select("*");

    if (filters?.soloPublicadas) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query.order("sort_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async createActividad(payload: Omit<Actividad, "id" | "created_at">): Promise<Actividad> {
    const { data, error } = await supabase.from("actividades").insert(payload).select().single();

    if (error) throw error;
    return data;
  },

  async updateActividad(
    id: string,
    payload: Partial<Omit<Actividad, "id" | "created_at">>,
  ): Promise<Actividad> {
    const { data, error } = await supabase
      .from("actividades")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteActividad(id: string): Promise<void> {
    const { error } = await supabase.from("actividades").delete().eq("id", id);

    if (error) throw error;
  },

  async getActividadById(id: string): Promise<Actividad | null> {
    const { data, error } = await supabase.from("actividades").select("*").eq("id", id).single();

    if (error) throw error;
    return data ?? null;
  },
};
