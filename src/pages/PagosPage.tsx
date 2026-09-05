import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/context/AuthContext";
import { paymentService } from "@/services/payment.service";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { toast } from "sonner";
import { Upload, CheckCircle, Clock, LogIn } from "lucide-react";

type PaymentStatus = "idle" | "uploading" | "success" | "error";

interface ExistingPayment {
  id: string;
  status: string;
  reference_number: string | null;
  created_at: string;
}

export function PagosPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [referenceNumber, setReferenceNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
    if (!user || !file) return;

    setStatus("uploading");

    const { error } = await paymentService.uploadReceipt(
      user.id,
      file,
      referenceNumber.trim() || null,
    );

    if (error) {
      toast.error("Error al subir comprobante", { description: error.message });
      setStatus("error");
      return;
    }

    setStatus("success");
    toast.success("Comprobante enviado", {
      description: "Tu pago está pendiente de revisión por el administrador.",
    });
  }

  if (authLoading || checkingPayment) {
    return <PageLoading />;
  }

  if (!user) return null;

  if (status === "success" || existingPayment) {
    const payment = existingPayment ?? {
      status: "PENDING",
      reference_number: referenceNumber,
      created_at: new Date().toISOString(),
    };
    return (
      <SiteLayout>
        <div className="container-clinic pt-10 pb-20 max-w-lg">
          <div className="text-center space-y-6">
            {payment.status === "APPROVED" ? (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-gold" />
                <h1 className="text-3xl text-ink">
                  Pago aprobado
                </h1>
                <p className="text-sm text-ink-soft">
                  Tu acceso ha sido habilitado. Puedes acceder a las clases.
                </p>
                <Link
                  to="/clases"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm uppercase tracking-widest bg-ink text-cream"
                >
                  Ver clases
                </Link>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 mx-auto text-gold" />
                <h1 className="text-3xl text-ink">
                  Pago en revisión
                </h1>
                <p className="text-sm text-ink-soft">
                  Hemos recibido tu comprobante. El administrador lo revisará pronto.
                </p>
                {payment.reference_number && (
                  <p className="text-xs text-ink-soft">
                    Referencia: <code>{payment.reference_number}</code>
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
                    Enviar otro comprobante
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
    <SiteLayout>
      <div className="container-clinic pt-10 pb-20 max-w-lg">
        <div
          className="text-[11px] uppercase tracking-[0.35em] mb-4 text-ink-soft"
        >
          Formulario de pago
        </div>
        <h1 className="text-4xl mb-2 text-ink">
          Subir comprobante
        </h1>
        <p className="text-sm mb-10 text-ink-soft">
          Adjunta tu comprobante de transferencia y el número de referencia para que el
          administrador verifique tu pago.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              className="text-[10px] uppercase tracking-[0.3em] text-ink-soft"
            >
              Número de referencia
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Ej: ABC123456"
              className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)] border-ink/25 text-ink"
            />
          </div>

          <div>
            <label
              className="text-[10px] uppercase tracking-[0.3em] text-ink-soft"
            >
              Imagen del comprobante
            </label>
            <div
              className="mt-2 relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors hover:border-[var(--gold)] border-ink/20"
            >
              <Upload className="w-8 h-8 mb-3 text-ink-soft" />
              {file ? (
                <p className="text-sm text-ink">
                  {file.name}
                </p>
              ) : (
                <p className="text-xs text-ink-soft">
                  Haz clic o arrastra una imagen
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "uploading" || !file}
            className="w-full inline-flex justify-center items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50 bg-ink text-cream"
          >
            {status === "uploading" ? "Enviando..." : "Enviar comprobante"}
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
