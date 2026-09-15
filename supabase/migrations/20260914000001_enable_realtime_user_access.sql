-- Habilita Supabase Realtime sobre user_access para que el frontend
-- refleje al instante la aprobación de pagos sin cerrar sesión.
do $$
begin
  -- La publicación supabase_realtime la crea la plataforma; si no existe
  -- (entornos mínimos), no hacemos nada en lugar de fallar.
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1
       from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'user_access'
     ) then
    alter publication supabase_realtime add table public.user_access;
  end if;
end $$;
