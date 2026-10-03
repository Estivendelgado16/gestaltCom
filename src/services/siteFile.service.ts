import { supabase } from "@/lib/supabaseClient";
import { uploadService } from "@/services/upload.service";

export interface SiteFile {
  key: string;
  storage_path: string;
  public_url: string;
  file_name: string | null;
  updated_at: string;
}

/** Clave del único archivo "Lista de entrevistas" de la página de YouTube. */
export const YOUTUBE_LISTA_KEY = "youtube-lista-entrevistas";

export const siteFileService = {
  async get(key: string): Promise<SiteFile | null> {
    const { data, error } = await supabase
      .from("site_files")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Sube un archivo al bucket "site-files" y reemplaza el anterior.
   * Usa una ruta con timestamp para evitar problemas de caché al
   * reemplazar, y borra el objeto anterior si existía.
   */
  async upload(key: string, file: File): Promise<SiteFile> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const safeName = file.name.replace(/[^\w.-]/g, "_");
    const path = `${key}/${Date.now()}-${safeName}`;

    const previous = await this.get(key);

    const publicUrl = await uploadService.uploadToSupabaseStorage(file, path, "site-files");

    const { data, error } = await supabase.rpc("upsert_site_file", {
      p_key: key,
      p_storage_path: path,
      p_public_url: publicUrl,
      p_file_name: file.name,
    });

    if (error) throw error;

    if (previous && previous.storage_path !== path) {
      await supabase.storage
        .from("site-files")
        .remove([previous.storage_path])
        .then(({ error: rmError }) => {
          if (rmError) console.error("No se pudo borrar el archivo anterior:", rmError.message);
        });
    }

    return data;
  },
};
