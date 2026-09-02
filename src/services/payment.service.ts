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

    return query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  },

  async getAllPayments(formacionId?: string) {
    let query = supabase.from("manual_payments").select("*");

    if (formacionId) {
      query = query.eq("formacion_id", formacionId);
    }

    return query.order("created_at", { ascending: false });
  },

  async uploadReceipt(userId: string, file: File, referenceNumber: string | null, formacionId?: string) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("receipts").upload(filePath, file);

    if (uploadError) return { error: uploadError };

    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);

    return supabase.from("manual_payments").insert({
      user_id: userId,
      receipt_url: urlData.publicUrl,
      reference_number: referenceNumber,
      status: "PENDING",
      formacion_id: formacionId,
    });
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
