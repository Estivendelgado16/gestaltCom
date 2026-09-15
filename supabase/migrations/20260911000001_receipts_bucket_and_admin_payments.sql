-- ============================================================
-- Fix: subida de comprobantes (/pagos) y lectura en /admin/pagos
--
-- 1. Crea el bucket público "receipts" en Supabase Storage
--    (payment.service.ts usa supabase.storage.from("receipts")
--    y getPublicUrl, por lo que el bucket debe existir y ser público).
-- 2. Políticas de storage.objects para que usuarios autenticados
--    puedan subir a "receipts".
-- 3. Políticas para que el admin (app_metadata.role = 'admin')
--    pueda ver y actualizar TODOS los pagos en manual_payments
--    (antes solo se podía ver/insertar los propios).
-- ============================================================

-- 1. Bucket para comprobantes de pago (público: el admin ve los recibos vía URL pública)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Usuarios autenticados pueden subir sus comprobantes al bucket receipts
DROP POLICY IF EXISTS "Usuarios autenticados suben comprobantes" ON storage.objects;
CREATE POLICY "Usuarios autenticados suben comprobantes"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts');

-- Lectura pública de los comprobantes (el bucket ya es público, política explícita por claridad)
DROP POLICY IF EXISTS "Comprobantes legibles publicamente" ON storage.objects;
CREATE POLICY "Comprobantes legibles publicamente"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'receipts');

-- 3. El admin ve y actualiza todos los pagos (usa el mismo criterio que approve_user_payment)
DROP POLICY IF EXISTS "Admin ve todos los pagos" ON public.manual_payments;
CREATE POLICY "Admin ve todos los pagos"
ON public.manual_payments FOR SELECT TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

DROP POLICY IF EXISTS "Admin actualiza pagos" ON public.manual_payments;
CREATE POLICY "Admin actualiza pagos"
ON public.manual_payments FOR UPDATE TO authenticated
USING (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
WITH CHECK (COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
