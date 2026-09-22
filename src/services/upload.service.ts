import { supabase } from "@/lib/supabaseClient";

/**
 * Sube un archivo a un bucket de Supabase Storage.
 * @param file El archivo a subir.
 * @param path La ruta donde guardar el archivo (ej. "lessonId-pdf.pdf").
 * @param bucketName Nombre del bucket destino. Por defecto: "videos".
 *   Usa "modules-pdfs" para PDFs de módulo, "videos" para videos de clase,
 *   "receipts" para comprobantes de pago.
 */
export const uploadService = {
  async uploadToSupabaseStorage(
    file: File,
    path: string,
    bucketName: string = "videos",
  ): Promise<string> {
    const { error } = await supabase.storage.from(bucketName).upload(path, file);

    if (error) throw new Error(error.message ?? "No se pudo subir el archivo");

    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);

    if (!urlData?.publicUrl) throw new Error("No se pudo obtener la URL pública");

    return urlData.publicUrl;
  },

  /**
   * Sube un flyer al bucket "flyers" y lo registra en la tabla `flyers`
   * con fecha de expiración a 3 meses (la limpia pg_cron automáticamente).
   * @returns La URL pública del flyer.
   */
  async uploadFlyer(file: File, formacionId?: string): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const path = `flyer-${Date.now()}-${safeName}`;

    const publicUrl = await this.uploadToSupabaseStorage(file, path, "flyers");

    const { error: insertError } = await supabase.from("flyers").insert({
      storage_path: path,
      public_url: publicUrl,
      formacion_id: formacionId || null,
      expires_at: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (insertError) {
      // No debe romper la subida; solo avisamos.
      console.error("No se pudo registrar el flyer en la tabla:", insertError.message);
    }

    return publicUrl;
  },
};
