import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import type { PaymentRow, ExistingPayment } from "@/types";

export function useLatestPayment(userId: string | undefined, formacionId?: string) {
  return useQuery<ExistingPayment | null>({
    queryKey: ["payment", "latest", userId, formacionId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await paymentService.getLatestPayment(userId, formacionId);
      return data;
    },
    enabled: !!userId,
  });
}

export function useAllPayments(formacionId?: string) {
  return useQuery<PaymentRow[]>({
    queryKey: ["payments", "all", formacionId],
    queryFn: async () => {
      const { data, error } = await paymentService.getAllPayments(formacionId);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUploadReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      file,
      referenceNumber,
      formacionId,
    }: {
      userId: string;
      file: File;
      referenceNumber: string | null;
      formacionId?: string;
    }) => paymentService.uploadReceipt(userId, file, referenceNumber, formacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
  });
}

export function useApprovePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, userId }: { paymentId: string; userId: string }) =>
      paymentService.approvePayment(paymentId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useRejectPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => paymentService.rejectPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
