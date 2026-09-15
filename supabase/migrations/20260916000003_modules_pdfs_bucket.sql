-- ============================================================
-- Migración: Bucket modules-pdfs (PDFs de apoyo por módulo)
-- Efecto: Crea el bucket y las políticas RLS necesarias.
-- ============================================================

-- 1. Aseguramos que el bucket existe y es público (para getPublicUrl)
INSERT INTO storage.buckets (id, name, public)
VALUES ('modules-pdfs', 'modules-pdfs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Política: usuarios autenticados pueden subir PDFs a modules-pdfs
DROP POLICY IF EXISTS "Usuarios suben PDFs módulo" ON storage.objects;
CREATE POLICY "Usuarios suben PDFs módulo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'modules-pdfs');

-- 3. Política: cualquier usuario autenticado puede leer los PDFs.
--    Si querés restringirlo solo a usuarios pagados, podrías añadir
--    una condición extra en el USING, pero por ahora está abierta
--    para que el contenido sea accesible sin bloqueos adicionales.
DROP POLICY IF EXISTS "Cualquiera lee PDFs módulo" ON storage.objects;
CREATE POLICY "Cualquiera lee PDFs módulo"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'modules-pdfs');

-- Opcional: Si querés que sea visible para "public" (sin login), descomenta:
-- CREATE POLICY "PDFs módulo públicos son legibles" ON storage.objects FOR SELECT TO public USING (bucket_id = 'modules-pdfs');