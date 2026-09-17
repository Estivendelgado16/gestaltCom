import { useState } from "react";
import { z } from "zod";
import { type Formacion, type FormacionTipo } from "@/types";
import { formacionService } from "@/services/formacion.service";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  titulo: z.string().trim().min(3, "Título requerido").max(120),
  tipo: z.enum(["DIPLOMADO", "CURSO", "TALLER", "OTRO"]),
  fecha_inicio: z.string().min(1, "Fecha requerida"),
  descripcion: z.string().trim().min(10, "Descripción muy corta").max(400),
  horarios: z.string().optional(),
  modalidad: z.enum(["Presencial", "Virtual", "Híbrido"]).default("Presencial"),
  duracion: z.string().max(40).optional(),
  flyer_url: z.string().url("URL inválida").or(z.literal("")).optional(),
  galeria_fotos: z.array(z.string().url()).default([]),
  precio: z.number().optional(),
});

const STATUSES: FormacionTipo[] = ["DIPLOMADO", "CURSO", "TALLER", "OTRO"];

export function CourseForm({ initial }: { initial?: Formacion }) {
  const nav = useNavigate();
  const [values, setValues] = useState<Formacion>(
    initial ?? {
      id: "",
      titulo: "",
      descripcion: "",
      tipo: "CURSO",
      fecha_inicio: "",
      fecha_fin: null,
      horarios: "",
      modalidad: "Presencial",
      duracion: "",
      flyer_url: "",
      galeria_fotos: [],
      precio: 0,
      is_published: true,
      created_at: "",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = Boolean(initial);

  function set<K extends keyof Formacion>(k: K, v: Formacion[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }

    const payload = {
      titulo: values.titulo.trim(),
      descripcion: values.descripcion.trim(),
      tipo: values.tipo,
      fecha_inicio: values.fecha_inicio || null,
      fecha_fin: values.fecha_fin || null,
      horarios: values.horarios?.trim() || null,
      modalidad: values.modalidad,
      duracion: values.duracion?.trim() || null,
      flyer_url: values.flyer_url?.trim() || null,
      galeria_fotos: values.galeria_fotos,
      precio: values.precio ?? 0,
      is_published: values.is_published,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await formacionService.updateFormacion(values.id, payload);
      } else {
        await formacionService.createFormacion(payload);
      }
      toast.success(isEdit ? "Formación actualizada" : "Formación creada", {
        description: "Guardado en Supabase",
      });
      nav({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error("No se pudo guardar", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      <Field label="Título" error={errors.titulo}>
        <input
          value={values.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Tipo" error={errors.tipo}>
          <div className="mt-1 flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("tipo", s)}
                className="text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-colors"
                style={{
                  background: values.tipo === s ? "var(--ink)" : "transparent",
                  color: values.tipo === s ? "var(--cream)" : "var(--ink-soft)",
                  borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Fecha de inicio" error={errors.fecha_inicio}>
          <input
            type="date"
            value={values.fecha_inicio ?? ""}
            onChange={(e) => set("fecha_inicio", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Fecha de fin">
          <input
            type="date"
            value={values.fecha_fin ?? ""}
            onChange={(e) => set("fecha_fin", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Modalidad" error={errors.modalidad}>
          <div className="mt-1 flex gap-2 flex-wrap">
            {["Presencial", "Virtual", "Híbrido"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set("modalidad", m)}
                className="text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-colors"
                style={{
                  background: values.modalidad === m ? "var(--ink)" : "transparent",
                  color: values.modalidad === m ? "var(--cream)" : "var(--ink-soft)",
                  borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <Field label="Descripción corta" error={errors.descripcion}>
        <textarea
          rows={4}
          value={values.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          className="input resize-none"
        />
      </Field>

      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Horarios (opcional)">
          <input
            value={values.horarios ?? ""}
            onChange={(e) => set("horarios", e.target.value)}
            className="input"
            placeholder="ej. Lunes a Viernes 9:00-14:00"
          />
        </Field>

        <Field label="Duración (opcional)">
          <input
            value={values.duracion ?? ""}
            onChange={(e) => set("duracion", e.target.value)}
            className="input"
            placeholder="ej. 40 horas, 3 meses"
          />
        </Field>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Flyer / Afiche (URL, opcional)" error={errors.flyer_url}>
          <input
            value={values.flyer_url ?? ""}
            onChange={(e) => set("flyer_url", e.target.value)}
            type="url"
            className="input"
            placeholder="https://..."
          />
        </Field>

        <Field label="Galeria de fotos (URLs)" error={errors.galeria_fotos}>
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-2"
            style={{ color: "var(--ink-soft)" }}
          >
            Agrega URLs de las fotos de la clase (una por línea)
          </p>
          <textarea
            rows={3}
            value={values.galeria_fotos.join("\n")}
            onChange={(e) => {
              const urls = e.target.value
                .split("\n")
                .filter((u) => u.trim())
                .map((u) => u.trim());
              set("galeria_fotos", urls);
            }}
            className="input resize-none w-full"
            placeholder="https://ejemplo.com/foto1.jpg
https://ejemplo.com/foto2.jpg"
          />
        </Field>

        <Field label="Precio (opcional)">
          <input
            value={values.precio ?? ""}
            onChange={(e) => set("precio", Number(e.target.value) || 0)}
            type="number"
            className="input"
            placeholder="0"
          />
        </Field>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-full px-8 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar formación"}
        </button>
        <button
          type="button"
          onClick={() => nav({ to: "/admin/dashboard" })}
          className="text-sm uppercase tracking-widest opacity-70"
        >
          Cancelar
        </button>
      </div>

      <style>{`
        .input { width: 100%; background: transparent; border: none; border-bottom: 1px solid color-mix(in oklab, var(--ink) 25%, transparent); padding: 10px 2px; font-size: 15px; color: var(--ink); outline: none; transition: border-color .2s; }
        .input:focus { border-color: var(--gold); }
      `}</style>
    </form>
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
