import { supabase } from "@/lib/supabaseClient";
import type { Formacion } from "@/types";

export const formacionService = {
  async getFormaciones(filters?: {
    tipo?: "DIPLOMADO" | "CURSO" | "TALLER" | "OTRO";
    soloPublicadas?: boolean;
  }): Promise<Formacion[]> {
    let query = supabase.from("formaciones").select("*");

    if (filters?.tipo) {
      query = query.eq("tipo", filters.tipo);
    }

    if (filters?.soloPublicadas) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async createFormacion(payload: Omit<Formacion, "id" | "created_at">): Promise<Formacion> {
    const { data, error } = await supabase.from("formaciones").insert(payload).select().single();

    if (error) throw error;
    return data;
  },

  async updateFormacion(
    id: string,
    payload: Partial<Omit<Formacion, "id" | "created_at">>,
  ): Promise<Formacion> {
    const { data, error } = await supabase
      .from("formaciones")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFormacion(id: string): Promise<void> {
    const { error } = await supabase.from("formaciones").delete().eq("id", id);

    if (error) throw error;
  },

  async getFormacionById(id: string): Promise<Formacion | null> {
    const { data, error } = await supabase.from("formaciones").select("*").eq("id", id).single();

    if (error) throw error;
    return data ?? null;
  },
};
