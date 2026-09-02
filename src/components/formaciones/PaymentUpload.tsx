import { useDialog } from "@/components/ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { useFormacionById } from "@/services/formacion.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/sonner";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, CheckCircle, Clock, XCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export function PaymentUpload({ formacionId }: { formacionId: string }) {
  const navigate = useNavigate();
  const formacion = useFormacionById(formacionId);
  const { open: openToast, close: closeToast } = useToast();
  const { user, loading: authLoading } = useAuth();

  if (!user) {
    openToast("Error", "Debes iniciar sesión primero", { description: "Intenta de nuevo" });
    setTimeout(() => {}, 1500);
    return;
  };

  const [file, setFile] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [existingPayment, setExistingPayment] = useState<
    | { status: "PENDING"; reference_number: string | null; created_at: string }
    | null
  >(null);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  // Verificar último pago
  useEffect(() => {
    const fetchPayment = async () => {
      const { data } = await supabase
        .from("manual_payments")
        .select("status, formacion_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.formacion_id === formacionId) {
        setExistingPayment({
          id: "",
          status: data.status,
          reference_number: data.reference_number,
          created_at: new Date().toISOString(),
        });
        setStatus("success");
        setCheckingPayment(false);
      } else {
        setStatus("idle");
        setCheckingPayment(false);
      }
    };

    if (authLoading) return;
    fetchPayment();
  }, [user, formacionId, authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file || !user) return;

    setStatus("uploading");

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, file);

    if (uploadError) {
      setStatus("error");
      openToast("Error", "Error al subir comprobante", { description: uploadError.message });
      return;
    }

    const { data: urlData } = supabase.storage.from("receipts").getPublicUrl(filePath);

    await supabase.from("manual_payments").insert({
      user_id: user.id,
      formacion_id: formacionId,
      receipt_url: urlData.publicUrl,
      reference_number: referenceNumber.trim() || null,
      status: "PENDING",
    });

    setStatus("success");
    openToast("Éxito", "Comprobante enviado", {
      description: "Tu pago está pendiente de revisión por el administrador.",
    });

    setFile(null);
    setReferenceNumber("");
    setStatus("idle");
    closeToast();
  };

  if (authLoading) {
    return (
      <div className="container-clinic pt-32 pb-20 text-center">
        <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (status === "success" || existingPayment) {
    const payment =
      existingPayment ??
      { status: "PENDING", reference_number: null, created_at: new Date().toISOString() };

    return (
      <div className="container-clinic pt-32 pb-20 max-w-lg">
        <div className="text-center space-y-6">
          {payment.status === "APPROVED" ? (
            <>
              <CheckCircle className="w-16 h-16 mx-auto" style={{ color: "var(--gold)" }} />
              <h1 className="text-3xl" style={{ color: "var(--ink)" }}>
                Pago aprobado
              </h1>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Tu acceso ha sido habilitado. Puedes acceder a las clases.
              </p>
              <Link
                to={`/formaciones/${formacionId}/clases`}
                className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest"
                style={{ background: "var(--ink)", color: "var(--cream)" }}
              >
                <CheckCircle className="w-4 h-4" /> Ver clases
              </Link>
            </>
          ) : payment.status === "REJECTED" ? (
            <XCircle className="w-16 h-16 mx-auto" style={{ color: "var(--destructive)" }} />
            <h1 className="text-3xl" style={{ color: "var(--ink)" }}>
              Pago rechazado
            </h1>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              Tu comprobante fue rechazado. Por favor sube uno nuevo.
            </p>
            <button
              onClick={() => {
                setExistingPayment(null);
                setStatus("idle");
              }}
              className="text-sm uppercase tracking-widest underline"
              style={{ color: "var(--ink-soft)" }}
            >
              Enviar otro comprobante
            </button>
          ) : (
            <>
              <Clock className="w-16 h-16 mx-auto" style={{ color: "var(--gold)" }} />
              <h1 className="text-3xl" style={{ color: "var(--ink)" }}>
                Pago en revisión
              </h1>
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Hemos recibido tu comprobante. El administrador lo revisará pronto.
              </p>
              {payment.reference_number && (
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Referencia: <code>{payment.reference_number}</code>
                </p>
              )}
              <div className="pt-4">
                <button
                  onClick={() => {
                    setExistingPayment(null);
                    setStatus("idle");
                  }}
                  className="text-sm uppercase tracking-widest underline"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Enviar otro comprobante
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-clinic pt-32 pb-20 max-w-lg">
      <div
        className="text-[11px] uppercase tracking-[0.35em] mb-4"
        style={{ color: "var(--ink-soft)" }}
      >
        Formulario de pago
      </div>
      <h1 className="text-4xl mb-2" style={{ color: "var(--ink)" }}>
        Subir comprobante
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--ink-soft)" }}>
        Adjunta tu comprobante de transferencia y el número de referencia para que el
        administrador verifique tu pago.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Número de referencia
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Ej: ABC123456"
            className="mt-1 w-full bg-transparent border-b py-3 outline-none focus:border-[var(--gold)]"
            style={{
              borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)",
              color: "var(--ink)",
            }}
          /></div>

          <div>
            <label
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--ink-soft)" }}
            >
              Imagen del comprobante
            </label>
            <div
              className="mt-2 relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors hover:border-[var(--gold)]"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)" }}
            >
              <Upload className="w-8 h-8 mb-3" style={{ color: "var(--ink-soft)" }} />
              {file ? (
                <p className="text-sm" style={{ color: "var(--ink)" }}>
                  {file.name}
                </p>
              ) : (
                <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                  Haz clic o arrastra una imagen
                </p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              /></div>
          </div>

          <button
            type="submit"
            disabled={status === "uploading" || !file}
            className="w-full inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ background: "var(--ink)", color: "var(--cream)" }}
          >
            {status === "uploading" ? "Enviando..." : "Enviar comprobante"}
          </button>
        </form>

        <div className="mt-10 flex items-center gap-3">
          <lockIcon className="w-4 h-4" style={{ color: "var(--ink-soft)" }} />
          <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Sesión de: <strong>{user.email}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}