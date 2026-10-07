-- ============================================================
-- Migración: Permisos de admin para youtube_playlist
-- Efecto: El admin (app_metadata.role = 'admin') puede crear,
--         editar y borrar videos de /admin/youtube. Antes solo
--         existía una política SELECT pública, por lo que las
--         escrituras fallaban (RLS) y no se podía editar.
-- ============================================================

DROP POLICY IF EXISTS "Admin gestiona youtube_playlist" ON public.youtube_playlist;
CREATE POLICY "Admin gestiona youtube_playlist"
ON public.youtube_playlist FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
