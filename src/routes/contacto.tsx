import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Comunidad Gestáltica" },
      { name: "description", content: "Escribe a Dany Mora Bracho para agendar una consulta o inscribirte en un programa." },
      { property: "og:title", content: "Contacto — Comunidad Gestáltica" },
      { property: "og:description", content: "Agenda tu consulta o pide información sobre nuestras formaciones." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nombre requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(120),
  topic: z.string().trim().min(2, "Motivo requerido").max(80),
  message: z.string().trim().min(10, "Cuenta un poco más").max(1000),
});

const WHATSAPP = "584240000000"; // format for wa.me

function Contact() {
  const [values, setValues] = useState({ name: "", email: "", topic: "Consulta terapéutica", message: "" });
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
    // Simulated email service
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Mensaje enviado", { description: "Te redirigimos a WhatsApp para continuar la conversación." });
    setSending(false);
    const text = `Hola Dany, soy ${parsed.data.name}. Motivo: ${parsed.data.topic}. ${parsed.data.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <SiteLayout>
      <section className="container-clinic pt-24 pb-16">
        <div className="text-[11px] uppercase tracking-[0.35em]" style={{ color: "var(--ink-soft)" }}>
          Contacto
        </div>
        <h1 className="mt-8 text-5xl md:text-7xl max-w-4xl leading-[0.98]">
          Escribe, con <span style={{ color: "var(--gold)" }}>tiempo</span>.
        </h1>
        <p className="mt-8 max-w-xl text-lg" style={{ color: "var(--ink-soft)" }}>
          Responderé personalmente en 24-48 horas hábiles.
        </p>
      </section>

      <section className="container-clinic pb-28 grid md:grid-cols-12 gap-16">
        <form onSubmit={onSubmit} className="md:col-span-7 space-y-6" noValidate>
          <Field label="Nombre" error={errors.name}>
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
            {sending ? "Enviando…" : "Enviar y abrir WhatsApp"}
          </button>
        </form>

        <aside className="md:col-span-5 space-y-8">
          <div className="p-8 rounded-sm" style={{ background: "var(--sand-light)" }}>
            <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>Consulta</div>
            <p className="mt-4 text-lg" style={{ color: "var(--ink)" }}>Presencial en Maracaibo y online para el resto del mundo hispanoparlante.</p>
          </div>
          <div className="space-y-3 text-sm" style={{ color: "var(--ink-soft)" }}>
            <div><span className="uppercase tracking-widest text-[10px] block mb-1" style={{ color: "var(--gold)" }}>Email</span> hola@comunidadgestaltica.com</div>
            <div><span className="uppercase tracking-widest text-[10px] block mb-1" style={{ color: "var(--gold)" }}>WhatsApp</span> +58 424 000 0000</div>
            <div><span className="uppercase tracking-widest text-[10px] block mb-1" style={{ color: "var(--gold)" }}>Instagram</span> @comunidadgestaltica</div>
          </div>
        </aside>
      </section>

      <style>{`
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs mt-1 block" style={{ color: "var(--destructive)" }}>{error}</span>}
    </label>
  );
}
