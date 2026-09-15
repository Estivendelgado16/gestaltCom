-- ============================================================
-- Migración: Bucket videos (videos de las clases)
-- Efecto: Crea el bucket y las políticas RLS necesarias.
-- Nota: El bucket ya existía en el panel, esta migración lo
--       asegura y le agrega las políticas si no estaban presentes.
-- ============================================================

-- 1. Aseguramos que el bucket existe y es público (para getPublicUrl)
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Política: usuarios autenticados pueden subir videos
DROP POLICY IF EXISTS "Usuarios suben videos" ON storage.objects;
CREATE POLICY "Usuarios suben videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'videos');


-- ============================================================
-- Comentario: La seguridad de lectura la gestiona la política RLS
-- de la tabla 'lessons' (solo usuarios con pago aprobado y
-- módulo desbloqueado pueden ver la fila y la URL del video).
-- ============================================================