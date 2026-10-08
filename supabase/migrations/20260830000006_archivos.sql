-- ============================================================
-- Archivos únicos editables (site_files)
-- Consolidado de:
--   20260930000001_site_files.sql
-- ============================================================

-- 1. Bucket público para estos archivos
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-files', 'site-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Políticas de storage.objects
DROP POLICY IF EXISTS "Site files legibles publicamente" ON storage.objects;
CREATE POLICY "Site files legibles publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'site-files');

DROP POLICY IF EXISTS "Admin sube site files" ON storage.objects;
CREATE POLICY "Admin sube site files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-files');

DROP POLICY IF EXISTS "Admin actualiza site files" ON storage.objects;
CREATE POLICY "Admin actualiza site files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-files')
WITH CHECK (bucket_id = 'site-files');

DROP POLICY IF EXISTS "Admin borra site files" ON storage.objects;
CREATE POLICY "Admin borra site files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-files');

-- 3. Tabla clave-valor: una fila por archivo ("componente de un único archivo")
CREATE TABLE IF NOT EXISTS public.site_files (
    key text PRIMARY KEY,
    storage_path text NOT NULL,
    public_url text NOT NULL,
    file_name text,
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site files lectura publica" ON public.site_files;
CREATE POLICY "Site files lectura publica"
ON public.site_files FOR SELECT TO public
USING (true);

-- 4. RPC SECURITY DEFINER para guardar/reemplazar el archivo desde el
--    frontend (análogo a register_flyer). Solo admins pueden invocarla.
CREATE OR REPLACE FUNCTION public.upsert_site_file(
    p_key text,
    p_storage_path text,
    p_public_url text,
    p_file_name text
)
RETURNS public.site_files
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_file public.site_files;
BEGIN
    IF COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' THEN
        RAISE EXCEPTION 'No autorizado: solo administradores pueden gestionar archivos';
    END IF;

    INSERT INTO public.site_files (key, storage_path, public_url, file_name, updated_at)
    VALUES (p_key, p_storage_path, p_public_url, p_file_name, now())
    ON CONFLICT (key) DO UPDATE SET
        storage_path = EXCLUDED.storage_path,
        public_url = EXCLUDED.public_url,
        file_name = EXCLUDED.file_name,
        updated_at = now()
    RETURNING * INTO v_file;

    RETURN v_file;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_site_file(text, text, text, text) TO authenticated;
