import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { paymentService } from "@/services/payment.service";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, LogIn } from "lucide-react";

type PaymentStatus = "idle" | "submitting" | "success" | "error";

interface ExistingPayment {
  id: string;
  status: string;
  reference_number: string | null;
  medio_pago: string | null;
  fecha_pago: string | null;
  created_at: string;
}

export function PagosPage() {
  const { user, hasPaidAccess, loading: authLoading } = useRequireAuth("/login");
  const nav = useNavigate();

  // Cuando el admin aprueba el pago (el flag se actualiza por realtime),
  // el usuario sale automáticamente de /pagos hacia sus clases.
  useEffect(() => {
    if (!authLoading && user && hasPaidAccess === true) {
      nav({ to: "/usuarios/clases" });
    }
  }, [authLoading, user, hasPaidAccess, nav]);

  const [medioPago, setMedioPago] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [existingPayment, setExistingPayment] = useState<ExistingPayment | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  useEffect(() => {
    if (!user) return;

    paymentService.getLatestPayment(user.id).then(({ data }) => {
      setExistingPayment(data);
      setCheckingPayment(false);
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !medioPago.trim() || !fechaPago.trim()) return;

    setStatus("submitting");

    const { error } = await paymentService.submitPayment({
      userId: user.id,
      medioPago: medioPago.trim(),
      fechaPago: fechaPago.trim(),
      userName: (user.user_metadata?.full_name as string | undefined) ?? null,
      userEmail: user.email ?? null,
    });

    if (error) {
      toast.error("Error al enviar la referencia", { description: error.message });
      setStatus("error");
      return;
    }

    setStatus("success");
    toast.success("Referencia enviada", {
      description: "Tu pago está pendiente de revisión por el administrador.",
    });
  }

  if (authLoading || checkingPayment) {
    return <PageLoading hideChrome />;
  }

  if (!user) return null;

  if (status === "success" || existingPayment) {
    const payment = existingPayment ?? {
      status: "PENDING",
      reference_number: null,
      medio_pago: medioPago,
      fecha_pago: fechaPago,
      created_at: new Date().toISOString(),
    };
    return (
      <SiteLayout hideChrome>
        <div className="container-clinic pt-10 pb-20 max-w-lg">
          <div className="text-center space-y-6">
            {payment.status === "REJECTED" ? (
              <>
                <XCircle className="w-16 h-16 mx-auto text-gold" />
                <h1 className="text-3xl text-ink">Pago rechazado</h1>
                <p className="text-sm text-ink-soft">
                  Tu referencia no pudo ser verificada. Revisa que el número de transacción sea
                  correcto y vuelve a enviarlo.
                </p>
                <button
                  onClick={() => {
                    setExistingPayment(null);
                    setStatus("idle");
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm uppercase tracking-widest bg-ink text-cream"
                >
                  Enviar nueva referencia
                </button>
              </>
            ) : payment.status === "APPROVED" ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-gold" />
                <h1 className="text-3xl text-ink">Pago aprobado</h1>
                <p className="text-sm text-ink-soft">
                  Tu acceso ha sido habilitado. Puedes acceder a las clases.
                </p>
                <Link
                  to="/usuarios/clases"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm uppercase tracking-widest bg-ink text-cream"
                >
                  Ver clases
                </Link>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 mx-auto text-gold" />
                <h1 className="text-3xl text-ink">Pago en revisión</h1>
                <p className="text-sm text-ink-soft">
                  Hemos recibido tu referencia. El administrador la revisará pronto.
                </p>
                {payment.medio_pago && (
                  <p className="text-xs text-ink-soft">
                    Medio de pago: <code>{payment.medio_pago}</code>
                  </p>
                )}
                {payment.fecha_pago && (
                  <p className="text-xs text-ink-soft">
                    Fecha: <code>{payment.fecha_pago}</code>
                  </p>
                )}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setExistingPayment(null);
                      setStatus("idle");
                    }}
                    className="text-xs uppercase tracking-widest underline text-ink-soft"
                  >
                    Enviar otra referencia
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout hideChrome>
      <div className="container-clinic pt-10 pb-20 max-w-lg">
        <div className="text-[11px] uppercase tracking-[0.35em] mb-4 text-ink-soft">
          Formulario de pago
        </div>
        <h1 className="text-4xl mb-2 text-ink">Registrar curso</h1>
        <p className="text-sm mb-10 text-ink-soft">
          Ingresa el número de referencia de tu transferencia para que el administrador verifique tu
          pago.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Medio de pago (Bancolombia, Wompi, PayPal, etc.)
            </label>
            <input
              type="text"
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
              placeholder="Ej: Bancolombia"
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-gold border-ink/25 text-ink"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Fecha de pago
            </label>
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-gold border-ink/25 text-ink"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !medioPago.trim() || !fechaPago.trim()}
            className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50 bg-ink text-cream"
          >
            {status === "submitting" ? "Enviando..." : "Enviar pago"}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-3">
          <LogIn className="w-4 h-4 text-ink-soft" />
          <span className="text-xs text-ink-soft">
            Sesión de: <strong>{user.email}</strong>
          </span>
        </div>
      </div>
    </SiteLayout>
  );
}
