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

-- 3. Agregar formacion_id a manual_payments (para asociar pago a formación específica)
ALTER TABLE public.manual_payments ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id);

-- 4. Agregar formacion_id a modules (para asociar módulos a formación específica)
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id) ON DELETE CASCADE;

-- 5. Habilitar RLS en todas las tablas nuevas
ALTER TABLE public.formaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- 6. Políticas para formaciones
-- Las formaciones publicadas son legibles por todos los usuarios (incluidos anónimos)
CREATE POLICY "Formaciones publicadas son legibles por todos"
ON public.formaciones FOR SELECT TO public
USING (is_published = true);

-- Los usuarios autenticados pueden insertar sus propias inscripciones
CREATE POLICY "Usuarios pueden inscribirse a formaciones"
ON public.user_enrollments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden ver sus propias inscripciones
CREATE POLICY "Usuarios ven sus propias inscripciones"
ON public.user_enrollments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 7. Políticas para manual_payments (agregando filtro por formacion_id si existe)
-- Los usuarios autenticados pueden ver sus propios pagos
CREATE POLICY "Usuarios ven sus propios pagos"
ON public.manual_payments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios autenticados pueden registrar sus propios comprobantes
CREATE POLICY "Usuarios suben sus propios pagos"
ON public.manual_payments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8. Seed data: migrar los 5 cursos actuales de courses.json como formaciones
-- Diplomado Internacional en Gestalt de Campo 2026-2027 → DIPLOMADO
-- Seminario: El Contacto como Fenómeno de Campo → CURSO
-- Taller: Corporalidad y Awareness → TALLER
-- Diplomado en Gestalt de Campo 2023-2024 → DIPLOMADO
-- Grupo de Supervisión Clínica → OTRO (por ser un grupo de supervisión, no un curso/taller/diplomado formal)

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
    startDate text,
    shortDescription text,
    status text,
    location text,
    duration text
  )
)
INSERT INTO public.formaciones (id, titulo, descripcion, tipo, fecha_inicio, fecha_fin, horarios, modalidad, duracion, flyer_url, galeria_fotos, precio, is_published)
SELECT
  gen_random_uuid(),
  title,
  shortDescription,
  CASE
    WHEN title LIKE 'Diplomado%' THEN 'DIPLOMADO'
    WHEN title LIKE 'Taller%' THEN 'TALLER'
    ELSE 'CURSO'
  END,
  startDate::date,
  NULL::date,
  NULL, -- horarios no tenía datos originales en JSON, se dejara NULL
  CASE
    WHEN location LIKE '%híbrido%' OR location LIKE '%Híbrido%' THEN 'Híbrido'
    WHEN location LIKE '%online%' OR location LIKE '%Online%' THEN 'Virtual'
    ELSE 'Presencial'
  END,
  duration,
  NULL, -- flyer_url inicial
  '{}'::text[], -- galeria_fotos inicial
  0::numeric, -- precio inicial
  false -- is_published inicial (se activara cuando el admin lo publique)
FROM seed_data;