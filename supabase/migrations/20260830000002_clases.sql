-- ============================================================
-- Clases (modules, lessons, buckets de videos/PDFs)
-- Consolidado de:
--   20260830000003_create_lessons_and_docs.sql
--   20260830000004_security_policies.sql (lessons)
--   20260906000001_fix_rls_security.sql (política de modules)
--   20260911000002_admin_content_policies.sql
--   20260915000001_lesson_previews.sql
--   20260916000002_videos_bucket.sql
--   20260916000003_modules_pdfs_bucket.sql
--   20261007000001_lesson_secondary_pdfs.sql
--   20261007000005_lesson_file_names.sql
--   20261007000006_storage_upsert_delete_policies.sql
--   20261007000007_remove_video_columns.sql
-- ============================================================

-- 1. Tabla para registrar módulos o cursos
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla para almacenar las clases (PDFs, sin video)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    pdf_url TEXT,                       -- URL del material complementario en PDF
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    secondary_pdf_urls JSONB NOT NULL DEFAULT '[]'::jsonb, -- hasta 4 PDFs secundarios
    pdf_name TEXT                       -- etiqueta personalizada del PDF
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de lectura para usuarios pagados
-- Solo usuarios con pago aprobado pueden ver las lecciones publicadas
DROP POLICY IF EXISTS "Ver clases solo usuarios pagados" ON public.lessons;
CREATE POLICY "Ver clases solo usuarios pagados"
ON public.lessons FOR SELECT TO authenticated
USING (
    is_published = true AND (
        EXISTS (
            SELECT 1 FROM public.user_access
            WHERE user_access.user_id = auth.uid()
            AND user_access.has_paid_access = true
        )
    )
);

DROP POLICY IF EXISTS "Usuarios pagados ven modulos" ON public.modules;
CREATE POLICY "Usuarios pagados ven modulos"
ON public.modules FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_access
        WHERE user_access.user_id = auth.uid()
        AND user_access.has_paid_access = true
    )
);

-- 4. Permisos de administración (mismo criterio que approve_user_payment)
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

-- 5. Vista de previsualización (sin URLs de PDF, para contenido "bloqueado")
DROP VIEW IF EXISTS public.lesson_previews;
CREATE OR REPLACE VIEW public.lesson_previews
WITH (security_invoker = false) AS
SELECT
  id,
  module_id,
  title,
  description,
  is_published,
  created_at,
  (pdf_url IS NOT NULL AND pdf_url <> '') AS has_pdf
FROM public.lessons;

GRANT SELECT ON public.lesson_previews TO authenticated;

-- 6. Bucket videos (histórico; la seguridad de lectura la gestiona la RLS de lessons)
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Usuarios suben videos" ON storage.objects;
CREATE POLICY "Usuarios suben videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Actualizar videos" ON storage.objects;
CREATE POLICY "Actualizar videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Eliminar videos" ON storage.objects;
CREATE POLICY "Eliminar videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'videos');

-- 7. Bucket modules-pdfs (PDFs de apoyo por módulo)
INSERT INTO storage.buckets (id, name, public)
VALUES ('modules-pdfs', 'modules-pdfs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Usuarios suben PDFs módulo" ON storage.objects;
CREATE POLICY "Usuarios suben PDFs módulo"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'modules-pdfs');

DROP POLICY IF EXISTS "Cualquiera lee PDFs módulo" ON storage.objects;
CREATE POLICY "Cualquiera lee PDFs módulo"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'modules-pdfs');

DROP POLICY IF EXISTS "Actualizar PDFs módulo" ON storage.objects;
CREATE POLICY "Actualizar PDFs módulo"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'modules-pdfs')
WITH CHECK (bucket_id = 'modules-pdfs');

DROP POLICY IF EXISTS "Eliminar PDFs módulo" ON storage.objects;
CREATE POLICY "Eliminar PDFs módulo"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'modules-pdfs');
