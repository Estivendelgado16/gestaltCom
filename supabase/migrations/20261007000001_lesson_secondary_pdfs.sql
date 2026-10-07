-- ============================================================
-- Migración: PDFs secundarios por lección (hasta 4)
-- Efecto: Agrega una columna JSONB para almacenar hasta 4 PDFs
--         secundarios además del PDF principal (pdf_url).
--         Cada entrada es { "name": string, "url": string }.
-- ============================================================

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS secondary_pdf_urls JSONB NOT NULL DEFAULT '[]'::jsonb;
