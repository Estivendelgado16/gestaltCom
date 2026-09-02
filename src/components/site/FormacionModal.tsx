import { dialog, useDialog } from "@/components/ui/dialog";
import { useFormacionById } from "@/services/formacion.service";
import { useToast } from "@/components/ui/sonner";
import { X } from "lucide-react";

export function FormacionModal({ formacionId }: { formacionId: string }) {
  const formacion = useFormacionById(formacionId);
  const { open, close } = useToast();

  if (!formacion) {
    return null;
  }

  const handleOpen = dialog.open({
    title: formacion.titulo,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {/* Flyer / Afiche */}
        {formacion.flyer_url && (
          <div className="round-sm overflow-hidden shadow-lg">
            <img
              src={formacion.flyer_url}
              alt={`${formacion.titulo} - afiche`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-black/60 text-white text-center">
              <p className="text-sm uppercase tracking-widest">{formacion.tipo}</p>
              <h3 className="mt-2">{formacion.titulo}</h3>
            </div>
          </div>
        )}

        {/* Galeria de fotos */}
        {formacion.galeria_fotos && formacion.galeria_fotos.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--ink)" }}>
              Fotos de la clase
            </p>
            <div className="grid grid-cols-2 gap-2">
              {formacion.galeria_fotos.slice(0, 4).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Foto clase ${i + 1} - ${formacion.titulo}`}
                  className="rounded-sm h-24 object-cover"
                />
              ))}
            </div>
            {formacion.galeria_fotos.length > 4 && (
              <p className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                +{formacion.galeria_fotos.length - 4} fotos más
              </p>
            )}
          </div>
        )}

        {/* Información de la formación */}
        <div>
          <p className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>
            <strong>Descripción:</strong> {formacion.descripcion}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--ink-soft)" }}>
                Modalidad
              </p>
              <p style={{ color: "var(--ink)" }}>{formacion.modalidad}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--ink-soft)" }}>
                Duración
              </p>
              <p style={{ color: "var(--ink)" }}>{formacion.duracion}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "var(--ink-soft)" }}>
                Precio
              </p>
              <p style={{ color: "var(--ink)" }}>{formacion.precio ? `$${formacion.precio}` : "Consultar"}
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    footer: (
      <div className="flex gap-3">
        <button
          onClick={close}
          className="flex-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          Cerrar
        </button>
        <button
          onClick={() => {
            close();
            open(
              "Más información",
              `<p className="mb-4">¿Quieres más detalles? Contáctanos por WhatsApp o completa nuestro formulario de contacto.</p>`,
              [
                {
                  label: "Ir a WhatsApp",
                  onClick: () => {
                    close();
                    // Aquí iría el enlace a WhatsApp
                  },
                },
                {
                  label: "Formulario de contacto",
                  onClick: () => {
                    close();
                    // navigate to contacto
                  },
                },
              ]
            );
          }}
          className="flex-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--gold)", color: "var(--ink)" }}
        >
          Más información
        </button>
      </div>
    ),
    cancel: false,
    maxWidth: "lg",
  });

  return handleOpen;
}