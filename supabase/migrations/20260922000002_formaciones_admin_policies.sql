-- ============================================================
-- Migración: Políticas de admin para la tabla formaciones
-- Efecto: Habilita INSERT/UPDATE/DELETE/SELECT completo para el
--   admin (app_metadata.role = 'admin') sobre public.formaciones.
--   Antes solo existía SELECT público de las publicadas, por lo
--   que "Guardar cambios" / "Publicar formación" fallaban por RLS.
-- ============================================================

-- 1. El admin gestiona (crea/edita/borra) todas las formaciones
DROP POLICY IF EXISTS "Admin gestiona formaciones" ON public.formaciones;
CREATE POLICY "Admin gestiona formaciones"
ON public.formaciones FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 2. El admin puede leer TODAS las formaciones (incluidas las no
--    publicadas, necesarias para abrirlas en el editor /admin/editar).
DROP POLICY IF EXISTS "Admin lee todas las formaciones" ON public.formaciones;
CREATE POLICY "Admin lee todas las formaciones"
ON public.formaciones FOR SELECT TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
