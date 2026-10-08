-- ============================================================
-- Formaciones (formaciones, user_enrollments, flyers, galería)
-- Consolidado de:
--   20260902000001_create_formaciones.sql
--   20260919000001_flyers_expiration.sql
--   20260922000001_flyers_galeria_storage_policies.sql
--   20260922000002_formaciones_admin_policies.sql
-- ============================================================

-- 1. Tabla principal de formaciones
CREATE TABLE IF NOT EXISTS public.formaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('DIPLOMADO', 'CURSO', 'TALLER', 'OTRO')),
    fecha_inicio DATE,
    fecha_fin DATE,
    horarios TEXT,
    modalidad TEXT DEFAULT 'Presencial' CHECK (modalidad IN ('Presencial', 'Virtual', 'Híbrido')),
    duracion TEXT,
    flyer_url TEXT,
    galeria_fotos TEXT[],
    precio NUMERIC(10, 2),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de inscripciones de usuarios a formaciones
CREATE TABLE IF NOT EXISTS public.user_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    formacion_id UUID REFERENCES public.formaciones(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, formacion_id)
);

-- 3. Agregar formacion_id a manual_payments y modules (para asociar a formación específica)
ALTER TABLE public.manual_payments ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id);
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id) ON DELETE CASCADE;

ALTER TABLE public.formaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- 4. Políticas para formaciones
-- Las formaciones publicadas son legibles por todos los usuarios (incluidos anónimos)
DROP POLICY IF EXISTS "Formaciones publicadas son legibles por todos" ON public.formaciones;
CREATE POLICY "Formaciones publicadas son legibles por todos"
ON public.formaciones FOR SELECT TO public
USING (is_published = true);

-- Los usuarios autenticados pueden insertar sus propias inscripciones
DROP POLICY IF EXISTS "Usuarios pueden inscribirse a formaciones" ON public.user_enrollments;
CREATE POLICY "Usuarios pueden inscribirse a formaciones"
ON public.user_enrollments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden ver sus propias inscripciones
DROP POLICY IF EXISTS "Usuarios ven sus propias inscripciones" ON public.user_enrollments;
CREATE POLICY "Usuarios ven sus propias inscripciones"
ON public.user_enrollments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 5. Políticas de administración de formaciones
DROP POLICY IF EXISTS "Admin gestiona formaciones" ON public.formaciones;
CREATE POLICY "Admin gestiona formaciones"
ON public.formaciones FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

DROP POLICY IF EXISTS "Admin lee todas las formaciones" ON public.formaciones;
CREATE POLICY "Admin lee todas las formaciones"
ON public.formaciones FOR SELECT TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 6. Seed data: migrar los 5 cursos actuales de courses.json como formaciones
WITH seed_data AS (
  SELECT *
  FROM json_to_recordset(
    '[
      {"id":"diplomado-internacional-2026-2027","title":"Diplomado Internacional en Gestalt de Campo 2026-2027","startDate":"2026-03-14","shortDescription":"Formación intensiva de dos años en Terapia Gestalt de Campo, con inmersiones presenciales, supervisión clínica y comunidad de práctica internacional.","status":"Próximo","location":"Maracaibo · Modalidad híbrida","duration":"24 meses"},
      {"id":"seminario-contacto-2026","title":"Seminario: El Contacto como Fenómeno de Campo","startDate":"2026-01-20","shortDescription":"Ciclo de ocho encuentros quincenales sobre teoría del contacto, self y ajuste creativo desde la perspectiva de campo.","status":"En Curso","location":"Online en vivo","duration":"4 meses"},
      {"id":"taller-corporalidad-2025","title":"Taller: Corporalidad y Awareness","startDate":"2025-09-05","shortDescription":"Exploración vivencial del cuerpo como lugar de contacto y regulación en el proceso terapéutico.","status":"Finalizado","location":"Presencial","duration":"3 días"},
      {"id":"diplomado-2023-2024","title":"Diplomado en Gestalt de Campo 2023-2024","startDate":"2023-04-01","shortDescription":"Primera edición del diplomado internacional. 42 profesionales formados en 8 países.","status":"Finalizado","location":"Híbrido","duration":"18 meses"},
      {"id":"supervision-clinica-2024","title":"Grupo de Supervisión Clínica","startDate":"2024-02-10","shortDescription":"Espacio mensual de supervisión de casos para terapeutas gestálticos en ejercicio.","status":"Finalizado","location":"Online","duration":"10 meses"}
    ]'::json
  ) AS x(
    id text,
    title text,
    "startDate" text,
    "shortDescription" text,
    status text,
    location text,
    duration text
  )
)
INSERT INTO public.formaciones (id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, horarios, modalidad, duracion, flyer_url, galeria_fotos, precio, is_published)
SELECT
  gen_random_uuid(),
  title,
  "shortDescription",
  CASE
    WHEN title LIKE 'Diplomado%' THEN 'DIPLOMADO'
    WHEN title LIKE 'Taller%' THEN 'TALLER'
    ELSE 'CURSO'
  END,
  "startDate"::date,
  NULL::date,
  NULL,
  CASE
    WHEN location LIKE '%híbrido%' OR location LIKE '%Híbrido%' THEN 'Híbrido'
    WHEN location LIKE '%online%' OR location LIKE '%Online%' THEN 'Virtual'
    ELSE 'Presencial'
  END,
  duration,
  NULL,
  '{}'::text[],
  0::numeric,
  false
FROM seed_data;

-- 7. Flyers: expiración automática (3 meses)
CREATE TABLE IF NOT EXISTS public.flyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE, -- ruta dentro del bucket "flyers"
  public_url text NOT NULL,
  formacion_id uuid REFERENCES public.formaciones(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '3 months'),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Buckets públicos de flyers y galería
INSERT INTO storage.buckets (id, name, public)
VALUES ('flyers', 'flyers', true),
       ('galeria', 'galeria', true)
ON CONFLICT (id) DO UPDATE SET public = true;

ALTER TABLE public.flyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Flyers lectura pública" ON public.flyers;
CREATE POLICY "Flyers lectura pública"
ON public.flyers FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Flyers inserción autenticada" ON public.flyers;
CREATE POLICY "Flyers inserción autenticada"
ON public.flyers FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Flyers borrado autenticado" ON public.flyers;
CREATE POLICY "Flyers borrado autenticado"
ON public.flyers FOR DELETE TO authenticated
USING (true);

-- Función RPC (SECURITY DEFINER) para registrar un flyer.
CREATE OR REPLACE FUNCTION public.register_flyer(
  p_storage_path text,
  p_public_url text,
  p_expires_at timestamptz
)
RETURNS public.flyers
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_flyer public.flyers;
BEGIN
  INSERT INTO public.flyers (storage_path, public_url, expires_at)
  VALUES (p_storage_path, p_public_url, p_expires_at)
  ON CONFLICT (storage_path) DO UPDATE SET
    public_url = EXCLUDED.public_url,
    expires_at = EXCLUDED.expires_at
  RETURNING * INTO v_flyer;

  RETURN v_flyer;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_flyer(text, text, timestamptz) TO public;
GRANT EXECUTE ON FUNCTION public.register_flyer(text, text, timestamptz) TO authenticated;

-- Función de limpieza: borra expirados de la tabla Y del storage
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
    DELETE FROM storage.objects
    WHERE bucket_id = 'flyers' AND name = r.storage_path;

    DELETE FROM public.flyers WHERE id = r.id;

    deleted_count := deleted_count + 1;
  END LOOP;

  RETURN deleted_count;
END;
$$;

-- Programar el job con pg_cron (diario a medianoche)
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

-- 8. Políticas de storage.objects para flyers y galeria
DROP POLICY IF EXISTS "Flyers legibles publicamente" ON storage.objects;
CREATE POLICY "Flyers legibles publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'flyers');

DROP POLICY IF EXISTS "Galeria legible publicamente" ON storage.objects;
CREATE POLICY "Galeria legible publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'galeria');

DROP POLICY IF EXISTS "Subir flyers" ON storage.objects;
CREATE POLICY "Subir flyers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'flyers');

DROP POLICY IF EXISTS "Subir galeria" ON storage.objects;
CREATE POLICY "Subir galeria"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'galeria');
