-- Fix security findings: remove public read/insert exposure on citizen records.
-- All application access moves to validated server functions using the service role.

-- 1. Drop every existing policy on both tables (names vary; drop dynamically)
do $$
declare p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public' and tablename in ('applications', 'grievances')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- 2. Revoke all direct Data API access from anonymous and signed-in browser roles
revoke select, insert, update, delete on public.applications from anon, authenticated;
revoke select, insert, update, delete on public.grievances from anon, authenticated;

-- 3. Keep RLS enabled with no permissive policies = default deny for any
--    non-service role. Only the server-side service role (server functions)
--    can read or write these tables now.
alter table public.applications enable row level security;
alter table public.grievances enable row level security;