import { supabase } from "@/lib/supabaseClient";

export const paymentService = {
  async getLatestPayment(userId: string, formacionId?: string) {
    let query = supabase
      .from("manual_payments")
      .select("id, status, reference_number, created_at")
      .eq("user_id", userId);

    if (formacionId) {
      query = query.eq("formacion_id", formacionId);
    }

    return query.order("created_at", { ascending: false }).limit(1).maybeSingle();
  },

  async getAllPayments(formacionId?: string) {
    let query = supabase.from("manual_payments").select("*");

    if (formacionId) {
      query = query.eq("formacion_id", formacionId);
    }

    return query.order("created_at", { ascending: false });
  },

  async uploadReceipt(
    userId: string,
    file: File,
    referenceNumber: string | null,
    formacionId?: string,
  ) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file);

    if (uploadError) return { error: uploadError };

    // Bucket privado: se guarda la ruta del storage (no una URL pública).
    // La visualización se hace con URLs firmadas (ver getReceiptSignedUrl).
    return supabase.from("manual_payments").insert({
      user_id: userId,
      receipt_url: filePath,
      reference_number: referenceNumber,
      status: "PENDING",
      formacion_id: formacionId,
    });
  },

  /**
   * Genera una URL firmada (válida 5 min) para ver un comprobante.
   * Acepta rutas del storage ("<uid>_<ts>.<ext>") y URLs públicas heredadas
   * (les extrae la ruta). Si no puede firmar, devuelve el valor original.
   */
  async getReceiptSignedUrl(receipt: string): Promise<string> {
    const match = receipt.match(/\/receipts\/(.+)$/);
    const path = match?.[1] ?? (receipt.startsWith("http") ? null : receipt);
    if (!path) return receipt;

    const { data, error } = await supabase.storage.from("receipts").createSignedUrl(path, 60 * 5);

    if (error || !data?.signedUrl) return receipt;
    return data.signedUrl;
  },

  async approvePayment(paymentId: string, userId: string) {
    return supabase.rpc("approve_user_payment", {
      target_user_id: userId,
      payment_id: paymentId,
    });
  },

  async rejectPayment(paymentId: string) {
    return supabase.from("manual_payments").update({ status: "REJECTED" }).eq("id", paymentId);
  },
};
