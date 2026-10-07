-- ============================================================
-- Migración 2026-10-07: permitir cualquier valor en youtube_playlist.part
-- Se elimina el CHECK (part IN ('I','II','III')) para que el admin
-- pueda escribir libremente la "parte" (p. ej. IV, V, etc.).
-- ============================================================

DO $$
DECLARE
    cname text;
BEGIN
    SELECT conname INTO cname
    FROM pg_constraint
    WHERE conrelid = 'public.youtube_playlist'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%part%';

    IF cname IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.youtube_playlist DROP CONSTRAINT %I', cname);
    END IF;
END $$;
