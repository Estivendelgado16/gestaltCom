-- ============================================================
-- Migración: políticas UPDATE y DELETE para storage.objects
-- Efecto: Permite que el admin pueda sobrescribir (upsert) y
--         eliminar los PDFs/videos de clase en los buckets
--         modules-pdfs y videos. Antes solo existían INSERT y
--         SELECT, por lo que el upsert fallaba con
--         "new row violates row-level security policy".
-- ============================================================

-- modules-pdfs: sobrescribir (upsert) y eliminar
DROP POLICY IF EXISTS "Actualizar PDFs módulo" ON storage.objects;
CREATE POLICY "Actualizar PDFs módulo"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'modules-pdfs')
WITH CHECK (bucket_id = 'modules-pdfs');

DROP POLICY IF EXISTS "Eliminar PDFs módulo" ON storage.objects;
CREATE POLICY "Eliminar PDFs módulo"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'modules-pdfs');

-- videos: sobrescribir (upsert) y eliminar
DROP POLICY IF EXISTS "Actualizar videos" ON storage.objects;
CREATE POLICY "Actualizar videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Eliminar videos" ON storage.objects;
CREATE POLICY "Eliminar videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'videos');
