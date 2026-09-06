-- ============================================================
-- Correcciones de seguridad RLS / reglas de negocio
-- Auditoría 2026-09-06
-- ============================================================

-- ------------------------------------------------------------
-- 1. CRÍTICO: approve_user_payment era ejecutable por cualquiera
--    (anon incluido) vía /rpc y aprobaba pagos sin control.
--    Se revoca el EXECUTE y se exige email de admin.
-- ------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.approve_user_payment(UUID, UUID)
FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.approve_user_payment(target_user_id UUID, payment_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Solo usuarios con rol 'admin' en app_metadata pueden aprobar pagos.
    -- app_metadata solo es modificable con service key / SQL (seguro).
    -- Para hacer admin a un usuario nuevo:
    --   UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
    --   WHERE email = 'nuevo@admin.com';
    -- Para quitar el rol: ... || '{"role":"user"}' (o eliminar la clave).
    IF COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' THEN
        RAISE EXCEPTION 'No autorizado: solo administradores pueden aprobar pagos';
    END IF;

    -- Actualizar el registro del pago a APROBADO
    UPDATE public.manual_payments
    SET status = 'APPROVED'
    WHERE id = payment_id;

    -- Insertar o actualizar el acceso del usuario
    INSERT INTO public.user_access (user_id, has_paid_access)
    VALUES (target_user_id, true)
    ON CONFLICT (user_id)
    DO UPDATE SET has_paid_access = true, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Solo usuarios autenticados pueden invocarla (el filtro fino es el rol admin)
GRANT EXECUTE ON FUNCTION public.approve_user_payment(UUID, UUID) TO authenticated;

-- Asignar rol admin a la cuenta principal
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE lower(email) = 'danymora@gmail.com';

-- ------------------------------------------------------------
-- 2. modules no tenía NINGUNA política: nadie podía leerlo,
--    ni siquiera usuarios con acceso pagado.
-- ------------------------------------------------------------

CREATE POLICY "Usuarios pagados ven modulos"
ON public.modules FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_access
        WHERE user_access.user_id = auth.uid()
        AND user_access.has_paid_access = true
    )
);

-- ------------------------------------------------------------
-- 3. formaciones y user_enrollments no existen en el proyecto
--    remoto: se re-aplica la migración 20260902000001 de forma
--    idempotente (IF NOT EXISTS / OR REPLACE donde aplica).
-- ------------------------------------------------------------

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

CREATE TABLE IF NOT EXISTS public.user_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    formacion_id UUID REFERENCES public.formaciones(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, formacion_id)
);

ALTER TABLE public.formaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

-- Políticas (DROP + CREATE para que la migración sea re-ejecutable)
DROP POLICY IF EXISTS "Formaciones publicadas son legibles por todos" ON public.formaciones;
CREATE POLICY "Formaciones publicadas son legibles por todos"
ON public.formaciones FOR SELECT TO public
USING (is_published = true);

DROP POLICY IF EXISTS "Usuarios pueden inscribirse a formaciones" ON public.user_enrollments;
CREATE POLICY "Usuarios pueden inscribirse a formaciones"
ON public.user_enrollments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios ven sus propias inscripciones" ON public.user_enrollments;
CREATE POLICY "Usuarios ven sus propias inscripciones"
ON public.user_enrollments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Columnas agregadas en la migración original (idempotente)
ALTER TABLE public.manual_payments
    ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id);
ALTER TABLE public.modules
    ADD COLUMN IF NOT EXISTS formacion_id UUID REFERENCES public.formaciones(id) ON DELETE CASCADE;
