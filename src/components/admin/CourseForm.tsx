import { useState } from "react";
import { z } from "zod";
import { type Course, type CourseStatus, saveCourse, slugify } from "@/lib/courses-store";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const schema = z.object({
  title: z.string().trim().min(3, "Título requerido").max(120),
  startDate: z.string().min(1, "Fecha requerida"),
  shortDescription: z.string().trim().min(10, "Descripción muy corta").max(400),
  status: z.enum(["Próximo", "En Curso", "Finalizado"]),
  location: z.string().max(80).optional(),
  duration: z.string().max(40).optional(),
});

const STATUSES: CourseStatus[] = ["Próximo", "En Curso", "Finalizado"];

export function CourseForm({ initial }: { initial?: Course }) {
  const nav = useNavigate();
  const [values, setValues] = useState<Course>(
    initial ?? {
      id: "",
      title: "",
      startDate: "",
      shortDescription: "",
      status: "Próximo",
      location: "",
      duration: "",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEdit = Boolean(initial);

  function set<K extends keyof Course>(k: K, v: Course[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message;
      setErrors(errs);
      return;
    }
    const id = values.id || slugify(values.title) || `curso-${Date.now()}`;
    saveCourse({ ...parsed.data, id });
    toast.success(isEdit ? "Curso actualizado" : "Curso creado", {
      description: "Simulando commit a src/data/courses.json…",
    });
    nav({ to: "/admin/dashboard" });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-8">
      <Field label="Título" error={errors.title}>
        <input value={values.title} onChange={(e) => set("title", e.target.value)} className="input" />
      </Field>
      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Fecha de inicio" error={errors.startDate}>
          <input type="date" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} className="input" />
        </Field>
        <Field label="Estado" error={errors.status}>
          <div className="mt-1 flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set("status", s)}
                className="text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-colors"
                style={{
                  background: values.status === s ? "var(--ink)" : "transparent",
                  color: values.status === s ? "var(--cream)" : "var(--ink-soft)",
                  borderColor: "color-mix(in oklab, var(--ink) 20%, transparent)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <Field label="Descripción corta" error={errors.shortDescription}>
        <textarea rows={4} value={values.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} className="input resize-none" />
      </Field>
      <div className="grid md:grid-cols-2 gap-8">
        <Field label="Ubicación (opcional)">
          <input value={values.location ?? ""} onChange={(e) => set("location", e.target.value)} className="input" />
        </Field>
        <Field label="Duración (opcional)">
          <input value={values.duration ?? ""} onChange={(e) => set("duration", e.target.value)} className="input" placeholder="ej. 24 meses" />
        </Field>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" className="inline-flex items-center rounded-full px-8 py-3 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5" style={{ background: "var(--ink)", color: "var(--cream)" }}>
          {isEdit ? "Guardar cambios" : "Publicar curso"}
        </button>
        <button type="button" onClick={() => nav({ to: "/admin/dashboard" })} className="text-sm uppercase tracking-widest opacity-70">
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs mt-1 block" style={{ color: "var(--destructive)" }}>{error}</span>}
    </label>
  );
}
