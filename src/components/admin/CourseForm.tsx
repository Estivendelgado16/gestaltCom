import { useState } from "react";
import { z } from "zod";
import { Upload } from "lucide-react";
import { type Formacion, type FormacionTipo } from "@/types";
import { formacionService } from "@/services/formacion.service";
import { uploadService } from "@/services/upload.service";
import { supabase } from "@/lib/supabaseClient";
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
  galeria_fotos: z.array(z.string().url()).default([]).refine(
    (val) => val.length <= 9,
    "Máximo 9 fotos en la galería"
  ),
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
  const [flyerUploading, setFlyerUploading] = useState(false);
  const [galeriaUploading, setGaleriaUploading] = useState(false);
  const isEdit = Boolean(initial);

  function set<K extends keyof Formacion>(k: K, v: Formacion[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  const [submitting, setSubmitting] = useState(false);

  async function uploadFlyer(file: File) {
    setFlyerUploading(true);
    try {
      const path = `flyer-${new Date().toISOString().slice(0, 10)}-${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const publicUrl = await uploadService.uploadToSupabaseStorage(file, path, "flyers");

      // Registra la subida en la tabla `flyers` con expiración a 3 meses
      // (el job de pg_cron la eliminará junto con el archivo).
      const { error } = await supabase.from("flyers").insert({
        storage_path: path,
        public_url: publicUrl,
        expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });
      if (error) throw error;

      set("flyer_url", publicUrl);
      toast.success("Afiche subido correctamente");
    } catch (err) {
      toast.error("No se pudo subir el afiche", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setFlyerUploading(false);
    }
  }

  async function uploadGalleryFiles(files: FileList) {
    setGaleriaUploading(true);
    try {
      const maxTotal = 9;
      const actualTotal = values.galeria_fotos.length + files.length;
      if (actualTotal > maxTotal) {
        toast.error("Máximo 9 fotos en la galería", {
          description: `Ya tienes ${values.galeria_fotos.length} foto(s). Sube como máximo ${maxTotal - values.galeria_fotos.length} más.`,
        });
        setGaleriaUploading(false);
        return;
      }

      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `galeria-${new Date().toISOString().slice(0, 10)}-${Date.now()}-${i}-${file.name.replace(/[^\w.\-]/g, "_")}`;
        const publicUrl = await uploadService.uploadToSupabaseStorage(file, path, "galeria");
        newUrls.push(publicUrl);

        // Registra en la tabla `flyers` con expiración a 3 meses
        const { error } = await supabase.from("flyers").insert({
          storage_path: path,
          public_url: publicUrl,
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        });
        if (error) throw error;
      }
      // Agrega las nuevas URLs al estado existente
      set("galeria_fotos", [...values.galeria_fotos, ...newUrls]);
      toast.success(`${newUrls.length} foto(s) subida(s) correctamente`);
    } catch (err) {
      toast.error("No se pudieron subir las fotos", {
        description: err instanceof Error ? err.message : "Error desconocido",
      });
    } finally {
      setGaleriaUploading(false);
    }
  }

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
        <Field label="Flyer / Afiche (opcional)" error={errors.flyer_url}>
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors hover:opacity-80"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}>
              <Upload className="w-4 h-4" />
              {flyerUploading ? "Subiendo..." : "Subir imagen desde el PC"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={flyerUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFlyer(file);
                }}
              />
            </label>
            {values.flyer_url ? (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={values.flyer_url}
                  alt="Vista previa del flyer"
                  className="w-20 h-28 object-cover rounded-sm border"
                  style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
                />
                <button
                  type="button"
                  onClick={() => set("flyer_url", "")}
                  className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
                >
                  Quitar
                </button>
              </div>
            ) : (
              !flyerUploading && (
                <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                  Sube una imagen del afiche. También puedes pegarla de internet como URL.
                </p>
              )
            )}
          </div>
        </Field>

        <Field label="Galeria de fotos (opcional)" error={errors.galeria_fotos}>
          <div className="mt-2">
            {galeriaUploading ? (
              <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                Subiendo fotos...
              </p>
            ) : values.galeria_fotos.length === 0 && (
              <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                Sube fotos desde el PC. También puedes pegarlas como URLs.
              </p>
            )}
            {values.galeria_fotos.map((url, idx) => (
              <div
                key={url}
                className="mt-2 flex items-center gap-2"
                style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
              >
                <img
                  src={url}
                  alt="Foto de la clase"
                  className="w-20 h-14 object-cover rounded-sm border"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newGaleria = values.galeria_fotos.filter((u, i) => i !== idx);
                    set("galeria_fotos", newGaleria);
                  }}
                  className="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
                >
                  Quitar
                </button>
              </div>
            ))}
            <label className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors hover:opacity-80"
              style={{ borderColor: "color-mix(in oklab, var(--ink) 25%, transparent)" }}
            >
              <Upload className="w-4 h-4" />
              {galeriaUploading ? "Subiendo..." : "Subir fotos desde el PC"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={galeriaUploading}
                onChange={(e) => {
                  const files = e.target.files as FileList;
                  if (files.length > 0) uploadGalleryFiles(files);
                }}
              />
            </label>
          </div>
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
