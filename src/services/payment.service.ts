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

  /**
   * Registra un pago solo con la referencia de la transacción (sin comprobante).
   * Guarda también el nombre y email del usuario para que el admin lo identifique.
   */
  async submitReference(input: {
    userId: string;
    referenceNumber: string;
    userName?: string | null;
    userEmail?: string | null;
    formacionId?: string;
  }) {
    return supabase.from("manual_payments").insert({
      user_id: input.userId,
      reference_number: input.referenceNumber,
      user_name: input.userName ?? null,
      user_email: input.userEmail ?? null,
      status: "PENDING",
      formacion_id: input.formacionId,
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
