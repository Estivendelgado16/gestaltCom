-- ============================================================
-- Migración: eliminar almacenamiento de video en lecciones.
-- Efecto: Ya no se suben videos de clase, así que se eliminan las
--         columnas video_url y video_name y se recrea la vista
--         lesson_previews sin la columna has_video.
-- ============================================================

-- 1. Recrear la vista sin la columna has_video (que dependía de
--    video_url) antes de soltar las columnas.
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

-- 2. Soltar las columnas de video.
ALTER TABLE public.lessons DROP COLUMN IF EXISTS video_url;
ALTER TABLE public.lessons DROP COLUMN IF EXISTS video_name;
