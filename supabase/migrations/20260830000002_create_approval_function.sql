-- Función almacenada para que el Admin apruebe pagos
CREATE OR REPLACE FUNCTION approve_user_payment(target_user_id UUID, payment_id UUID)
RETURNS VOID AS $$
BEGIN
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