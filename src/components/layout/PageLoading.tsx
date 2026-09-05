import { SiteLayout } from "@/components/layout/SiteLayout";

/** Estado de carga estándar para páginas dentro del SiteLayout. */
export function PageLoading({ message = "Cargando..." }: { message?: string }) {
  return (
    <SiteLayout>
      <div className="container-clinic pt-10 pb-20 text-center">
        <div className="text-sm text-ink-soft">{message}</div>
      </div>
    </SiteLayout>
  );
}
