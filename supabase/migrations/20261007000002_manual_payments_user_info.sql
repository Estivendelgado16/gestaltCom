-- ============================================================
-- Migración: nombre y email del usuario en manual_payments
-- Efecto: El admin puede ver el nombre del usuario y el número
--         de transacción sin necesidad de consultar auth.users.
--         El comprobante deja de ser obligatorio (solo referencia).
-- ============================================================

ALTER TABLE public.manual_payments
    ADD COLUMN IF NOT EXISTS user_name TEXT,
    ADD COLUMN IF NOT EXISTS user_email TEXT;
