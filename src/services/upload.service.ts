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
};
