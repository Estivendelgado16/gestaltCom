-- ============================================================
-- Actividades & Espacios de Encuentro
-- Consolidado de:
--   20260917000001_create_actividades.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.actividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    featured_notice TEXT,
    status_badges TEXT[] DEFAULT '{}'::text[],
    cta_text TEXT NOT NULL,
    cta_link TEXT,
    image_url TEXT,
    image_alt TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.actividades ENABLE ROW LEVEL SECURITY;

-- Publico anónimo: solo actividades publicadas
DROP POLICY IF EXISTS "Actividades publicadas son legibles por todos" ON public.actividades;
CREATE POLICY "Actividades publicadas son legibles por todos"
ON public.actividades FOR SELECT TO public
USING (is_published = true);

-- Admin (mismo criterio que approve_user_payment / admin_content_policies)
DROP POLICY IF EXISTS "Admin gestiona actividades" ON public.actividades;
CREATE POLICY "Admin gestiona actividades"
ON public.actividades FOR ALL TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- Seed: las 3 actividades que hoy están hardcodeadas en ActividadesPage.
WITH seed AS (
  SELECT * FROM json_to_recordset(
    '[
      {
        "title": "El padre que quiero ser: grupo online de reflexión sobre la paternidad",
        "category": "Grupo online · Reflexión & paternidad",
        "description": "Un espacio íntimo, dialógico y consciente para explorar las luces, dudas y transformaciones del rol paterno desde la perspectiva del campo relacional y de la psicoterapia Gestalt.",
        "featured_notice": "Última sesión gratuita de presentación: 14 de septiembre a las 19:30 h.",
        "status_badges": ["En curso", "Próximo inicio"],
        "cta_text": "ZOOM →",
        "cta_link": "#",
        "image_url": "/img/lineaFotos1.png",
        "image_alt": "Afiche del grupo online sobre paternidad",
        "is_featured": true,
        "is_published": true,
        "sort_order": 0
      },
      {
        "title": "Clínica en acto: seminario de caso desde la Gestalt de Campo",
        "category": "Seminario online · Clínica",
        "description": "Una instancia de diálogo clínico para abordar casos reales desde la perspectiva de campo, la fenomenología y el encuentro terapéutico.",
        "featured_notice": null,
        "status_badges": ["Próximo inicio"],
        "cta_text": "ZOOM →",
        "cta_link": "#",
        "image_url": "/img/lineaFotos2.png",
        "image_alt": "Afiche del seminario de clínica",
        "is_featured": false,
        "is_published": true,
        "sort_order": 1
      },
      {
        "title": "Supervisión y entrenamiento clínico en grupo",
        "category": "Taller online · Supervisión",
        "description": "Encuentro mensual de co-vigil clínica y supervisión grupal para terapeutas, centrado en el cuidado y la profundización de la práctica.",
        "featured_notice": null,
        "status_badges": ["Próximo inicio"],
        "cta_text": "ZOOM →",
        "cta_link": "#",
        "image_url": "/img/lineaFotos2.png",
        "image_alt": "Afiche del taller de supervisión",
        "is_featured": false,
        "is_published": true,
        "sort_order": 2
      }
    ]'::json
  ) AS x(
    title text,
    category text,
    description text,
    featured_notice text,
    status_badges text[],
    cta_text text,
    cta_link text,
    image_url text,
    image_alt text,
    is_featured boolean,
    is_published boolean,
    sort_order integer
  )
)
INSERT INTO public.actividades
  (title, category, description, featured_notice, status_badges, cta_text, cta_link, image_url, image_alt, is_featured, is_published, sort_order)
SELECT
  title, category, description, featured_notice, status_badges, cta_text, cta_link, image_url, image_alt, is_featured, is_published, sort_order
FROM seed
ON CONFLICT DO NOTHING;
