import { SiteLayout } from "@/components/layout/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(120),
  topic: z.string().trim().min(2, "Motivo requerido").max(80),
  message: z.string().trim().min(10, "Cuenta un poco más").max(1000),
});

const WHATSAPP = "573127897914";

export function ContactPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    topic: "Consulta terapéutica",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Mensaje enviado", {
      description: "Te redirigimos a WhatsApp para continuar la conversación.",
    });
    setSending(false);
    const text = `Hola Dany, soy ${parsed.data.name}. Motivo: ${parsed.data.topic}. ${parsed.data.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <SiteLayout>
      <section className="container-clinic pt-6 pb-16 grid md:grid-cols-12 gap-16 items-start">
        <div className="md:col-span-7">
          <div
            className="text-[11px] uppercase tracking-[0.35em]"
            style={{ color: "var(--ink-soft)" }}
          >
            Contacto
          </div>
          <h1 className="mt-8 text-3xl md:text-6xl max-w-2xl leading-[0.98] space-y-3">
            <span className="block">Información,</span>
            <span className="block" style={{ color: "var(--gold)" }}>
              Solicitudes,
            </span>
            <span className="block">Inscripciones.</span>
          </h1>

          <form onSubmit={onSubmit} className="mt-14 md:max-w-xl space-y-6" noValidate>
            <Field label="Nombre y apellido" error={errors.name}>
              <input
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                className="input"
                autoComplete="name"
              />
            </Field>
            <Field label="Correo" error={errors.email}>
              <input
                type="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                className="input"
                autoComplete="email"
              />
            </Field>
            <Field label="Motivo" error={errors.topic}>
              <select
                value={values.topic}
                onChange={(e) => setValues({ ...values, topic: e.target.value })}
                className="input"
              >
                <option>Consulta terapéutica</option>
                <option>Supervisión clínica</option>
                <option>Formación / Diplomado</option>
                <option>Conferencias / Instituciones</option>
                <option>Otro</option>
              </select>
            </Field>
            <Field label="Mensaje" error={errors.message}>
              <textarea
                rows={6}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                className="input resize-none"
              />
            </Field>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: "var(--ink)", color: "var(--cream)" }}
            >
              {sending ? "Enviando…" : "Enviar"}
            </button>
          </form>
        </div>

        <aside className="md:col-span-5 space-y-8">
          <img
            src="/img/imgContact1.jpg"
            alt="Consulta de psicoterapia"
            className="w-full rounded-xl shadow-lg object-cover"
          />
          <div className="p-8 rounded-sm" style={{ background: "var(--sand-light)" }}>
            <div
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "var(--ink-soft)" }}
            >
              Consulta
            </div>
            <p className="mt-4 text-lg" style={{ color: "var(--ink)" }}>
              Presencial en Medellín y online para el resto del mundo hispanoparlante.
            </p>
          </div>
          <div className="space-y-3 text-sm" style={{ color: "var(--ink-soft)" }}>
            <div>
              <span
                className="uppercase tracking-widest text-[10px] block mb-1"
                style={{ color: "var(--gold)" }}
              >
                Email
              </span>{" "}
              comunidadgestaltica.co@gmail.com
            </div>
            <div>
              <span
                className="uppercase tracking-widest text-[10px] block mb-1"
                style={{ color: "var(--gold)" }}
              >
                WhatsApp
              </span>{" "}
              +57 3127897914
            </div>
            <div>
              <span
                className="uppercase tracking-widest text-[10px] block mb-1"
                style={{ color: "var(--gold)" }}
              >
                Instagram
              </span>{" "}
              @comunidadgestaltica
            </div>
          </div>
        </aside>
      </section>

      <a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          "Hola Dany, ¿qué tal? Estoy interesado en la terapia gestalt, me gustaría obtener más información.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="whatsapp-float"
      >
        <img src="/img/whatsapp.png" alt="WhatsApp" />
      </a>

      <style>{`
        .whatsapp-float {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 9999;
          display: grid;
          place-items: center;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #25d366;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: transform 0.2s;
        }
        .whatsapp-float:hover { transform: scale(1.08); }
        .whatsapp-float img {
          width: 36px;
          height: 36px;
        }
        .input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid color-mix(in oklab, var(--ink) 25%, transparent);
          padding: 12px 2px;
          font-size: 16px;
          color: var(--ink);
          outline: none;
          transition: border-color .2s;
        }
        .input:focus { border-color: var(--gold); }
      `}</style>
    </SiteLayout>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
        {label}
      </span>
      <div className="mt-1">{children}</div>
      {error && (
        <span className="text-xs mt-1 block" style={{ color: "var(--destructive)" }}>
          {error}
        </span>
      )}
    </label>
  );
}
