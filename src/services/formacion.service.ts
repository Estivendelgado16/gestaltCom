import { supabase } from "@/lib/supabaseClient";
import type { Formacion, UserEnrollment } from "@/types";

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

  async getFormacionById(id: string): Promise<Formacion | null> {
    const { data, error } = await supabase
      .from("formaciones")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data ?? null;
  },

  async getFormacionModules(formacionId: string): Promise<Module[]> {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("formacion_id", formacionId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getUserEnrollment(
    userId: string,
    formacionId: string
  ): Promise<UserEnrollment | null> {
    const { data, error } = await supabase
      .from("user_enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("formacion_id", formacionId)
      .single();

    if (error) throw error;
    return data ?? null;
  },

  async enrollUser(userId: string, formacionId: string): Promise<UserEnrollment> {
    const { data, error } = await supabase
      .from("user_enrollments")
      .insert({ user_id: userId, formacion_id: formacionId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async checkEnrollmentStatus(userId: string, formacionId: string): Promise<boolean> {
    const enrollment = await this.getUserEnrollment(userId, formacionId);
    return enrollment?.is_active ?? false;
  },
};