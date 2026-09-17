-- Let the hospital run its own staff accounts.
--
-- The roles, the permissions and the checks around them have been here since
-- 0004: nine roles, sixty-one permissions, RLS on every table, and a
-- Procurement role scoped to tenders, suppliers, bids and awards. What was
-- missing was any way to use it. Roles could only be granted by editing the
-- database directly, so both existing accounts are super admins and nobody
-- else can be given access at all.
--
-- Two functions are added here, both SECURITY DEFINER because they read
-- auth.users, which no ordinary role may touch.
--
-- Tenant isolation matters more than usual in this project: this Supabase
-- project is shared with several unrelated sites, so auth.users holds accounts
-- that have nothing to do with this hospital. Both functions join through
-- margaret_user_roles, so the hospital's administrators only ever see the
-- people they themselves have given a role. Neither function can create,
-- disable or delete an account.

/* ------------------------------------------------------------- the list -- */

create or replace function margaret_list_staff()
returns table (
  user_id uuid,
  email text,
  full_name text,
  last_sign_in_at timestamptz,
  created_at timestamptz,
  roles jsonb
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not (margaret_has_permission('users.view') or margaret_is_super_admin()) then
    raise exception 'You do not have permission to view staff.' using errcode = '42501';
  end if;

  return query
  select
    u.id,
    u.email::text,
    coalesce(u.raw_user_meta_data ->> 'full_name', '')::text,
    u.last_sign_in_at,
    u.created_at,
    coalesce(
      jsonb_agg(jsonb_build_object('id', r.id, 'name', r.name, 'slug', r.slug) order by r.name)
        filter (where r.id is not null),
      '[]'::jsonb
    )
  from auth.users u
  -- An inner join, deliberately: a person with no role on this site is not
  -- this site's staff, whatever else they may be in this Supabase project.
  join margaret_user_roles ur on ur.user_id = u.id
  join margaret_roles r on r.id = ur.role_id
  group by u.id, u.email, u.raw_user_meta_data, u.last_sign_in_at, u.created_at
  order by u.email;
end;
$$;

revoke all on function margaret_list_staff() from public, anon;
grant execute on function margaret_list_staff() to authenticated;

/* ------------------------------------------------- finding someone known -- */

-- For giving access to an account that already exists -- a doctor who already
-- signs in elsewhere, or a member of staff whose account was created before.
-- It answers only for the exact address typed, and only for someone who may
-- already grant roles, so it cannot be used to enumerate the project's users.
create or replace function margaret_find_user_by_email(p_email text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  found_id uuid;
begin
  if not (margaret_has_permission('users.manage') or margaret_is_super_admin()) then
    raise exception 'You do not have permission to manage staff.' using errcode = '42501';
  end if;

  select u.id into found_id
    from auth.users u
   where lower(u.email) = lower(trim(p_email))
   limit 1;

  return found_id;
end;
$$;

revoke all on function margaret_find_user_by_email(text) from public, anon;
grant execute on function margaret_find_user_by_email(text) to authenticated;
