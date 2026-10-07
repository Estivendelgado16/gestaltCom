-- ============================================================
-- Migración: nombres editables para PDF y video de cada lección.
-- Efecto: Agrega columnas opcionales para mostrar una etiqueta
--         personalizada en lugar de "PDF" / "Video".
-- ============================================================

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS pdf_name TEXT;

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS video_name TEXT;
