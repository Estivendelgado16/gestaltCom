import { supabase } from "@/lib/supabaseClient";
import type { Lesson, LessonPreview, Module } from "@/types";

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

  /**
   * Previsualización de TODAS las lecciones (publicadas o no) sin URLs de
   * video/PDF. Permite mostrar la estructura "bloqueada" a usuarios pagados
   * hasta que el admin publique cada clase. Usa la vista `lesson_previews`.
   */
  async getLessonPreviews(formacionId?: string): Promise<LessonPreview[]> {
    if (formacionId) {
      const modules = await this.getModules(formacionId);
      const moduleIds = modules.map((m) => m.id);
      if (moduleIds.length === 0) return [];

      const { data, error } = await supabase
        .from("lesson_previews")
        .select("*")
        .in("module_id", moduleIds)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
    }

    const { data, error } = await supabase
      .from("lesson_previews")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Todas las lecciones (publicadas o no) de un módulo. Solo para admin. */
  async getLessonForAdmin(moduleIds: string[]): Promise<Lesson[]> {
    if (moduleIds.length === 0) return [];
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .in("module_id", moduleIds)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Publicar/ocultar una lección. */
  async setLessonPublished(lessonId: string, isPublished: boolean): Promise<void> {
    const { error } = await supabase
      .from("lessons")
      .update({ is_published: isPublished })
      .eq("id", lessonId);

    if (error) throw error;
  },

  /** Publicar/ocultar todas las lecciones de un módulo a la vez. */
  async setModulePublished(moduleId: string, isPublished: boolean): Promise<void> {
    const { error } = await supabase
      .from("lessons")
      .update({ is_published: isPublished })
      .eq("module_id", moduleId);

    if (error) throw error;
  },

  /** Crear un módulo dentro de una formación. Solo admin. */
  async createModule(input: {
    formacionId: string;
    title: string;
    description?: string;
    orderIndex: number;
  }): Promise<Module> {
    const { data, error } = await supabase
      .from("modules")
      .insert({
        formacion_id: input.formacionId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        order_index: input.orderIndex,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Crear una lección dentro de un módulo. Video opcional (se sube después de la clase). */
  async createLesson(input: {
    moduleId: string;
    title: string;
    description?: string;
  }): Promise<Lesson> {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: input.moduleId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        video_url: "",
        is_published: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Actualizar URLs de una lección (PDF o video). */
  async updateLessonUrls(
    lessonId: string,
    urls: { pdf_url?: string | null; video_url?: string | null },
  ): Promise<void> {
    const { error } = await supabase.from("lessons").update(urls).eq("id", lessonId);

    if (error) throw error;
  },
};
