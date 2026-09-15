-- Vista de previsualización de lecciones para usuarios CON pago aprobado:
-- expone la estructura completa (títulos de todas las clases, publicadas o no)
-- SIN las URLs de video/PDF, para que el frontend muestre el contenido
-- "bloqueado" (opaco) hasta que el admin lo publique (is_published = true).
create or replace view public.lesson_previews
with (security_invoker = false) as
select
  id,
  module_id,
  title,
  description,
  is_published,
  created_at,
  (coalesce(video_url, '') <> '') as has_video,
  (pdf_url is not null and pdf_url <> '') as has_pdf
from public.lessons;

grant select on public.lesson_previews to authenticated;
