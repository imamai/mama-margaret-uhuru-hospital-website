-- Temporary diagnostic RPC — will be dropped once the RLS issue is identified.
create or replace function margaret_debug_policies(p_table text)
returns table (policyname text, cmd text, roles text[], qual text, with_check text)
language sql
security definer
as $$
  select polname, case polcmd when 'r' then 'select' when 'a' then 'insert' when 'w' then 'update' when 'd' then 'delete' else '*' end,
    (select array_agg(rolname) from pg_roles where oid = any(polroles)) ,
    pg_get_expr(polqual, polrelid), pg_get_expr(polwithcheck, polrelid)
  from pg_policy
  where polrelid = p_table::regclass;
$$;

grant execute on function margaret_debug_policies(text) to anon, authenticated;
