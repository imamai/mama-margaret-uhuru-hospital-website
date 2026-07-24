-- 0013: Single-round-trip RPCs for the app's auth context (avoids deep nested
-- PostgREST embeds when the frontend just needs "what can this user do").

create or replace function margaret_get_my_roles()
returns table (role_slug text, role_name text)
language sql
security definer
stable
set search_path = public
as $$
  select r.slug, r.name
  from margaret_user_roles ur
  join margaret_roles r on r.id = ur.role_id
  where ur.user_id = auth.uid();
$$;

create or replace function margaret_get_my_permissions()
returns table (permission_key text)
language sql
security definer
stable
set search_path = public
as $$
  select distinct p.key
  from margaret_user_roles ur
  join margaret_role_permissions rp on rp.role_id = ur.role_id
  join margaret_permissions p on p.id = rp.permission_id
  where ur.user_id = auth.uid();
$$;

grant execute on function margaret_get_my_roles() to authenticated;

grant execute on function margaret_get_my_permissions() to authenticated;

grant execute on function margaret_has_permission(text) to authenticated, anon;

grant execute on function margaret_is_super_admin() to authenticated, anon;
