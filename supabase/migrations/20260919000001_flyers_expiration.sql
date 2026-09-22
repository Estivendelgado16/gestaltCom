-- ============================================================
-- Migración: Expiración automática de flyers (3 meses)
-- Efecto:
--   1. Crea la tabla `flyers` para registrar cada subida con su
--      fecha de expiración.
--   2. Crea el bucket `flyers` (público) si no existe.
--   3. Función SQL (SECURITY DEFINER) que borra los flyers
--      expirados: la fila de la tabla + el archivo físico del
--      storage.
--   4. Programa el job de pg_cron (diario a medianoche).
-- ============================================================

-- 1. Tabla de flyers
CREATE TABLE IF NOT EXISTS public.flyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE, -- ruta dentro del bucket "flyers"
  public_url text NOT NULL,
  formacion_id uuid REFERENCES public.formaciones(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 months'),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Buckets públicos
INSERT INTO storage.buckets (id, name, public)
VALUES ('flyers', 'flyers', true),
       ('galeria', 'galeria', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. RLS: Enable row level security and create policies with TO public
--    This allows anonymous (anon) key from frontend to insert rows
ALTER TABLE public.flyers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (idempotent - safe to run multiple times)
DROP POLICY IF EXISTS "Flyers lectura pública" ON public.flyers;
CREATE POLICY "Flyers lectura pública"
ON public.flyers FOR SELECT
USING (true); -- Public read access

DROP POLICY IF EXISTS "Flyers inserción autenticada" ON public.flyers;
CREATE POLICY "Flyers inserción autenticada"
ON public.flyers FOR INSERT TO public  -- KEY: "public" allows anon key, not just "authenticated"
WITH CHECK (true); -- Allow all inserts

DROP POLICY IF EXISTS "Flyers borrado autenticado" ON public.flyers;
CREATE POLICY "Flyers borrado autenticado"
ON public.flyers FOR DELETE TO authenticated
USING (true);

-- 4. Función de limpieza: borra expirados de la tabla Y del storage
CREATE OR REPLACE FUNCTION public.delete_expired_flyers()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r record;
  deleted_count integer := 0;
BEGIN
  FOR r IN
    SELECT id, storage_path
    FROM public.flyers
    WHERE expires_at <= now()
  LOOP
    -- Borra el objeto físico del bucket "flyers"
    DELETE FROM storage.objects
    WHERE bucket_id = 'flyers' AND name = r.storage_path;

    -- Borra la fila
    DELETE FROM public.flyers WHERE id = r.id;

    deleted_count := deleted_count + 1;
  END LOOP;

  RETURN deleted_count;
END;
$$;

-- 5. Programar el job con pg_cron (diario a medianoche)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'delete-expired-flyers-job',
      '0 0 * * *',
      'SELECT public.delete_expired_flyers();'
    );
  END IF;
END;
$$;