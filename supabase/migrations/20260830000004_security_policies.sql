-- Habilitar Row Level Security (RLS) en todas las tablas
ALTER TABLE public.manual_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Politicas para manual_payments:
-- Los usuarios autenticados pueden ver sus propios pagos
CREATE POLICY "Usuarios ven sus propios pagos" 
ON public.manual_payments FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Los usuarios autenticados pueden registrar comprobantes
CREATE POLICY "Usuarios suben sus propios pagos" 
ON public.manual_payments FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Politicas para user_access:
-- El usuario puede consultar su propio estado de acceso
CREATE POLICY "Usuarios ven su propio estado de acceso" 
ON public.user_access FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Politicas para lessons (Protección de Videos/PDFs):
-- Solo usuarios con pago aprobado pueden ver las lecciones publicadas
CREATE POLICY "Ver clases solo usuarios pagados"
ON public.lessons FOR SELECT TO authenticated
USING (
    is_published = true AND (
        EXISTS (
            SELECT 1 FROM public.user_access
            WHERE user_access.user_id = auth.uid()
            AND user_access.has_paid_access = true
        )
    )
);