-- ============================================================
-- Migración: Políticas de storage.objects para flyers y galeria
-- Efecto: Los buckets "flyers" y "galeria" ya eran públicos
--   (public = true), pero faltaban las políticas RLS de
--   storage.objects. Sin una política SELECT, leer las imágenes
--   devolvía 400 aunque el archivo existiera.
-- ============================================================

-- 1. Lectura pública de los flyers (imagen de afiche)
DROP POLICY IF EXISTS "Flyers legibles publicamente" ON storage.objects;
CREATE POLICY "Flyers legibles publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'flyers');

-- 2. Lectura pública de la galería de fotos
DROP POLICY IF EXISTS "Galeria legible publicamente" ON storage.objects;
CREATE POLICY "Galeria legible publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'galeria');

-- 3. Subida de flyers (admin autenticado)
DROP POLICY IF EXISTS "Subir flyers" ON storage.objects;
CREATE POLICY "Subir flyers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'flyers');

-- 4. Subida de fotos de galería (admin autenticado)
DROP POLICY IF EXISTS "Subir galeria" ON storage.objects;
CREATE POLICY "Subir galeria"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'galeria');
