-- ============================================================
-- Permisos de administración para módulos y lecciones
--
-- El dashboard (/admin) crea módulos, crea lecciones y publica/
-- desbloquea contenido, pero no existían políticas de escritura:
-- - modules: RLS con solo SELECT para usuarios pagados.
-- - lessons: solo SELECT para usuarios pagados.
-- Aquí se habilita RLS en modules (por consistencia) y se da al
-- admin (app_metadata.role = 'admin', mismo criterio que
-- approve_user_payment) acceso de escritura completo.
-- ============================================================

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin gestiona modulos" ON public.modules;
CREATE POLICY "Admin gestiona modulos"
ON public.modules FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

DROP POLICY IF EXISTS "Admin gestiona lecciones" ON public.lessons;
CREATE POLICY "Admin gestiona lecciones"
ON public.lessons FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
