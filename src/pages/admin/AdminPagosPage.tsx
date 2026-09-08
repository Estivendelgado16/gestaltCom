import { useEffect, useState } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { useRequireAdmin } from "@/context/AuthContext";
import { paymentService } from "@/services/payment.service";
import { toast } from "sonner";
import { CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

interface PaymentRow {
  id: string;
  user_id: string;
  receipt_url: string | null;
  reference_number: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  user_email?: string;
}

function fmt(d: string) {
  try {
    return new Date(d).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

const statusConfig: Record<string, { label: string; bg: string; fg: string }> = {
  PENDING: { label: "Pendiente", bg: "var(--sand-light)", fg: "var(--ink)" },
  APPROVED: { label: "Aprobado", bg: "var(--gold)", fg: "var(--ink)" },
  REJECTED: { label: "Rechazado", bg: "var(--destructive)", fg: "var(--destructive-foreground)" },
};

export function AdminPagosPage() {
  const { user, isAdmin, loading } = useRequireAdmin();
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  const fetchPayments = async () => {
    setFetching(true);
    const { data, error } = await paymentService.getAllPayments();

    if (error) {
      toast.error("Error al cargar pagos", { description: error.message });
      setFetching(false);
      return;
    }

    setPayments(data ?? []);
    setFetching(false);
  };

  useEffect(() => {
    if (user) fetchPayments();
  }, [user]);

  async function handleApprove(paymentId: string, userId: string) {
    setApproving(paymentId);

    const { error } = await paymentService.approvePayment(paymentId, userId);

    if (error) {
      toast.error("Error al aprobar", { description: error.message });
      setApproving(null);
      return;
    }

    toast.success("Pago aprobado", {
      description: "El usuario ahora tiene acceso a las clases.",
    });

    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "APPROVED" } : p)));
    setApproving(null);
  }

  async function handleReject(paymentId: string) {
    setApproving(paymentId);

    const { error } = await paymentService.rejectPayment(paymentId);

    if (error) {
      toast.error("Error al rechazar", { description: error.message });
      setApproving(null);
      return;
    }

    toast.success("Pago rechazado");
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "REJECTED" } : p)));
    setApproving(null);
  }

  if (loading || !user || !isAdmin) return null;

  const pending = payments.filter((p) => p.status === "PENDING");
  const processed = payments.filter((p) => p.status !== "PENDING");

  return (
    <AdminShell>
      <header className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div
            className="text-[10px] uppercase tracking-[0.35em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Pagos
          </div>
          <h1 className="mt-2 text-4xl" style={{ color: "var(--ink)" }}>
            Comprobantes de pago
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
            {pending.length} pendiente{pending.length === 1 ? "" : "s"} · {processed.length}{" "}
            procesado{processed.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={fetchPayments}
          disabled={fetching}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border"
          style={{
            borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
            color: "var(--ink-soft)",
          }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${fetching ? "animate-spin" : ""}`} /> Actualizar
        </button>
      </header>

      {fetching && payments.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          Cargando comprobantes...
        </div>
      ) : payments.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: "var(--ink-soft)" }}>
          No hay comprobantes registrados.
        </div>
      ) : (
        <>
          {/* Pendientes */}
          {pending.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg mb-4" style={{ color: "var(--ink)" }}>
                Pendientes de revisión
              </h2>
              <div className="space-y-4">
                {pending.map((p) => (
                  <PaymentCard
                    key={p.id}
                    payment={p}
                    onApprove={() => handleApprove(p.id, p.user_id)}
                    onReject={() => handleReject(p.id)}
                    approving={approving === p.id}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Procesados */}
          {processed.length > 0 && (
            <section>
              <h2 className="text-lg mb-4" style={{ color: "var(--ink)" }}>
                Procesados
              </h2>
              <div
                className="rounded-sm overflow-hidden border"
                style={{
                  borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
                  background: "var(--background)",
                }}
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="text-left text-[10px] uppercase tracking-[0.3em]"
                      style={{
                        color: "var(--ink-soft)",
                        background: "color-mix(in oklab, var(--ink) 4%, transparent)",
                      }}
                    >
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Referencia</th>
                      <th className="px-6 py-4">Fecha</th>
                      <th className="px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processed.map((p) => {
                      const s = statusConfig[p.status] ?? statusConfig.PENDING;
                      return (
                        <tr
                          key={p.id}
                          className="border-t"
                          style={{ borderColor: "color-mix(in oklab, var(--ink) 8%, transparent)" }}
                        >
                          <td className="px-6 py-4 text-xs" style={{ color: "var(--ink-soft)" }}>
                            {p.user_id.slice(0, 8)}...
                          </td>
                          <td className="px-6 py-4" style={{ color: "var(--ink)" }}>
                            {p.reference_number || "—"}
                          </td>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-xs"
                            style={{ color: "var(--ink-soft)" }}
                          >
                            {fmt(p.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full"
                              style={{ background: s.bg, color: s.fg }}
                            >
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </AdminShell>
  );
}

function PaymentCard({
  payment,
  onApprove,
  onReject,
  approving,
}: {
  payment: PaymentRow;
  onApprove: () => void;
  onReject: () => void;
  approving: boolean;
}) {
  return (
    <div
      className="rounded-sm border p-6"
      style={{
        borderColor: "color-mix(in oklab, var(--ink) 12%, transparent)",
        background: "var(--background)",
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="text-xs" style={{ color: "var(--ink-soft)" }}>
            Usuario: <code className="text-[11px]">{payment.user_id}</code>
          </div>
          {payment.reference_number && (
            <div className="text-sm mt-1" style={{ color: "var(--ink)" }}>
              Referencia: <strong>{payment.reference_number}</strong>
            </div>
          )}
          <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
            {fmt(payment.created_at)}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            disabled={approving}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--gold)", color: "var(--ink)" }}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Aprobar
          </button>
          <button
            onClick={onReject}
            disabled={approving}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest border transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{
              borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
              color: "var(--ink-soft)",
            }}
          >
            <XCircle className="w-3.5 h-3.5" /> Rechazar
          </button>
        </div>
      </div>
      {payment.receipt_url && (
        <a
          href={payment.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs underline"
          style={{ color: "var(--ink-soft)" }}
        >
          <ExternalLink className="w-3 h-3" /> Ver comprobante
        </a>
      )}
    </div>
  );
}
