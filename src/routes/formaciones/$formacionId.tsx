import { useFormacionById } from "@/services/formacion.service";
import { useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/ui/sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { FeaturedCourseCard } from "@/components/site/CourseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/context/AuthContext";
import { Lock, CheckCircle, Clock, Upload } from "lucide-react";

export function FormacionDetallePage() {
  const router = useRouterState();
  const params = router.params;
  const formacionId = params.formacionId as string;

  const formacion = useFormacionById(formacionId);
  const navigate = useNavigate();
  const { user, loading: authLoading, hasPaidAccess } = useAuth();
  const { open: openToast, close: closeToast } = useToast();

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="container-clinic pt-32 pb-20 text-center">
          <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Cargando...
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!formacion) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-5xl">Formación no encontrada</h1>
        </div>
      </SiteLayout>
    );
  }

  const isDiplomado = formacion.tipo === "DIPLOMADO";
  const enrollment = formacion.user_enrollments?.find(
    (e: any) => e.user_id === user?.id
  );

  // Verificar si el usuario tiene acceso pagado a esta formación
  const tieneAcceso = enrollment?.is_active === true;

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header de la formación */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--ink)" }}>
            {formacion.titulo}
          </h2>
          <p className="text-sm uppercase tracking-widest" style={{ color: "var(--gold)" }}>
            {formacion.tipo}
          </p>
        </div>

        {/* Información general */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
              Fecha de inicio
            </p>
            <p className="mt-1" style={{ color: "var(--ink)" }}>
              {formacion.fecha_inicio
                ? new Date(formacion.fecha_inicio).toLocaleDateString("es-ES")
                : "No especificada"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--ink-soft)" }}>
              Modalidad
            </p>
            <p className="mt-1" style={{ color: "var(--ink)" }}>
              {formacion.modalidad}
            </p>
          </div>
        </div>

        {/* Flyer / Afiche */}
        {formacion.flyer_url && (
          <div className="mb-6 rounded-sm overflow-hidden shadow-lg">
            <img
              src={formacion.flyer_url}
              alt={`${formacion.titulo} - afiche publicitario`}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Lógica por tipo de formación */}
        {isDiplomado ? (
          <div className="mt-6">
            {/* Mostrar estado de inscripción */}
            {enrollment ? (
              <div className="p-4 rounded-sm bg-green-500/10 border border-green-500/20 mb-4">
                <p className="text-sm" style={{ color: "var(--green)" }}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Inscrito y acceso desbloqueado
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                  Pago aprobado. Puedes acceder a los módulos.
                </p>
                <Link
                  to="/formaciones/clases"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--ink)", color: "var(--cream)" }}
                >
                  <CheckCircle className="w-4 h-4" /> Ver módulos
                </Link>
              </div>
            ) : (
              // Usuario logueado pero sin inscripción
              user?.id ? (
                <div className="p-4 rounded-sm bg-yellow-500/10 border border-yellow-500/20 mb-4">
                  <p className="text-sm" style={{ color: "var(--amber)" }}>
                    <Clock className="w-4 h-4 mr-2" /> Inscripción pendiente
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                    Para acceder, necesitas inscribirte y subir comprobante de pago.
                  </p>
                  <button
                    onClick={() =>
                      navigate({ to: `/formaciones/${formacionId}/payment` })}
                    className="w-full inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--ink)", color: "var(--cream)" }}
                  >
                    Inscribirme y subir comprobante
                  </button>
                </div>
              ) : (
                // Usuario no logueado
                <div className="p-4 rounded-sm bg-blue-500/10 border border-blue-500/20 mb-4">
                  <p className="text-sm" style={{ color: "var(--blue)" }}>
                    <Lock className="w-4 h-4 mr-2" /> Inicia sesión
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                    Necesitas iniciar sesión para inscribirte.
                  </p>
                  <button
                    onClick={() => navigate({ to: "/admin" })}
                    className="w-full inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--ink)", color: "var(--cream)" }}
                  >
                    Iniciar sesión
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          // Para talleres y cursos (informativos)
          <FeaturedCourseCard
            course={
              {
                id: formacion.id,
                title: formacion.titulo,
                startDate: formacion.fecha_inicio || "",
                shortDescription: formacion.descripcion,
                status: formacion.is_published ? "En Curso" : "Finalizado",
                location: formacion.modalidad,
                duration: formacion.duracion,
              } as any
            }
            delay={0}
          />
        )}

        {/* Módulos y lecciones para diplomados con acceso */}
        {isDiplomado && tieneAcceso && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--ink)" }}>
              Módulos del diplomado
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
              Accede a los módulos y lecciones del diplomado.
            </p>
            <ul className="space-y-4">
              {formacion.galeria_fotos?.length > 0 ? (
                <li className="flex items-center gap-3">
                  <img
                    src={formacion.galeria_fotos[0]}
                    alt={`${formacion.titulo} - Módulo 1`}
                    className="w-20 h-14 rounded-sm object-cover"
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                    Módulo 1
                  </span>
                </li>
              ) : (
                <li className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  No hay módulos disponibles aún.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}