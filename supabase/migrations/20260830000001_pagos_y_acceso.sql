-- ============================================================
-- Pagos y Acceso (manual_payments, user_access, aprobación)
-- Consolidado de:
--   20260830000001_create_payments_and_access.sql
--   20260830000002_create_approval_function.sql
--   20260830000004_security_policies.sql (pagos/acceso)
--   20260906000001_fix_rls_security.sql (función de aprobación)
--   20260911000001_receipts_bucket_and_admin_payments.sql
--   20260914000001_enable_realtime_user_access.sql
--   20261007000002_manual_payments_user_info.sql
--   20261008000001_medio_pago_fecha.sql
-- ============================================================

-- 1. Tabla de comprobantes de pago reportados
CREATE TABLE IF NOT EXISTS public.manual_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receipt_url TEXT,                 -- URL de la imagen en Supabase Storage
    reference_number VARCHAR(100),    -- Código de comprobante/transacción
    medio_pago TEXT,                  -- Método usado (Bancolombia, Wompi, PayPal, etc.)
    fecha_pago TEXT,                  -- Fecha en la que el usuario realizó el pago
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_name TEXT,
    user_email TEXT
);

-- 2. Tabla de accesos confirmados
CREATE TABLE IF NOT EXISTS public.user_access (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    has_paid_access BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_manual_payments_user_id ON public.manual_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_manual_payments_status ON public.manual_payments(status);

-- 3. Función almacenada para que el Admin apruebe pagos
--    Solo usuarios con rol 'admin' en app_metadata pueden aprobar pagos.
--    app_metadata solo es modificable con service key / SQL (seguro).
CREATE OR REPLACE FUNCTION public.approve_user_payment(target_user_id UUID, payment_id UUID)
RETURNS VOID AS $$
BEGIN
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
REVOKE EXECUTE ON FUNCTION public.approve_user_payment(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_user_payment(UUID, UUID) TO authenticated;

-- Asignar rol admin a la cuenta principal
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE lower(email) = 'danymora@gmail.com';

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.manual_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;

-- Politicas para manual_payments:
-- Los usuarios autenticados pueden ver sus propios pagos
DROP POLICY IF EXISTS "Usuarios ven sus propios pagos" ON public.manual_payments;
CREATE POLICY "Usuarios ven sus propios pagos"
ON public.manual_payments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Los usuarios autenticados pueden registrar comprobantes
DROP POLICY IF EXISTS "Usuarios suben sus propios pagos" ON public.manual_payments;
CREATE POLICY "Usuarios suben sus propios pagos"
ON public.manual_payments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Politicas para user_access:
-- El usuario puede consultar su propio estado de acceso
DROP POLICY IF EXISTS "Usuarios ven su propio estado de acceso" ON public.user_access;
CREATE POLICY "Usuarios ven su propio estado de acceso"
ON public.user_access FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 5. El admin ve y actualiza todos los pagos (mismo criterio que approve_user_payment)
DROP POLICY IF EXISTS "Admin ve todos los pagos" ON public.manual_payments;
CREATE POLICY "Admin ve todos los pagos"
ON public.manual_payments FOR SELECT TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

DROP POLICY IF EXISTS "Admin actualiza pagos" ON public.manual_payments;
CREATE POLICY "Admin actualiza pagos"
ON public.manual_payments FOR UPDATE TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

-- 6. Bucket para comprobantes de pago (público: el admin ve los recibos vía URL pública)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Usuarios autenticados pueden subir sus comprobantes al bucket receipts
DROP POLICY IF EXISTS "Usuarios autenticados suben comprobantes" ON storage.objects;
CREATE POLICY "Usuarios autenticados suben comprobantes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Lectura pública de los comprobantes
DROP POLICY IF EXISTS "Comprobantes legibles publicamente" ON storage.objects;
CREATE POLICY "Comprobantes legibles publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'receipts');

-- 7. Realtime sobre user_access para reflejar la aprobación al instante
DO $$
BEGIN
  -- La publicación supabase_realtime la crea la plataforma; si no existe
  -- (entornos mínimos), no hacemos nada en lugar de fallar.
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1
       FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime'
         AND schemaname = 'public'
         AND tablename = 'user_access'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_access;
  END IF;
END $$;
