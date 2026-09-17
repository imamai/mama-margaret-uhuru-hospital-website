-- Keep the developer's account off the hospital's staff list.
--
-- It is a maintenance account, not a member of staff: it exists so the site
-- can be worked on, and listing it beside the hospital's own people invites
-- someone to remove it during a tidy-up and lock the site's maintainer out.
--
-- Hidden, deliberately, is not the same as secret. An account with full access
-- that the hospital cannot see or revoke is a finding in any security review,
-- and it is their site. So:
--
--   * the staff list says how many accounts it is not showing;
--   * any super admin can list them with one click, and then change or remove
--     them exactly like anybody else;
--   * hiding is a row in an ordinary table, visible to anyone who looks at the
--     database, not a special case buried in application code.
--
-- What it buys is a clean list for the people who use it daily, and one fewer
-- way to break the site by accident.

create table if not exists margaret_maintenance_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

comment on table margaret_maintenance_accounts is
  'Accounts kept off the staff list: developers and support, not hospital staff. Visible to any super admin on request.';

alter table margaret_maintenance_accounts enable row level security;

drop policy if exists margaret_maintenance_accounts_read on margaret_maintenance_accounts;
create policy margaret_maintenance_accounts_read
  on margaret_maintenance_accounts for select
  using (margaret_has_permission('users.view') or margaret_is_super_admin());

-- Only a super admin marks an account as maintenance, or stops it being one.
-- users.manage is not enough: this decides what other administrators can see.
drop policy if exists margaret_maintenance_accounts_write on margaret_maintenance_accounts;
create policy margaret_maintenance_accounts_write
  on margaret_maintenance_accounts for all
  using (margaret_is_super_admin())
  with check (margaret_is_super_admin());

/* ---------------------------------------------------------- the listing -- */

-- Replaces the version from 20260919000000: same tenant isolation, now with
-- maintenance accounts withheld unless a super admin asks for them.
create or replace function margaret_list_staff(p_include_hidden boolean default false)
returns table (
  user_id uuid,
  email text,
  full_name text,
  last_sign_in_at timestamptz,
  created_at timestamptz,
  roles jsonb,
  hidden boolean
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  show_hidden boolean;
begin
  if not (margaret_has_permission('users.view') or margaret_is_super_admin()) then
    raise exception 'You do not have permission to view staff.' using errcode = '42501';
  end if;

  -- Asking to see them is only granted to a super admin; anyone else gets the
  -- ordinary list rather than an error, because they did not ask for this.
  show_hidden := coalesce(p_include_hidden, false) and margaret_is_super_admin();

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
    ),
    (m.user_id is not null)
  from auth.users u
  join margaret_user_roles ur on ur.user_id = u.id
  join margaret_roles r on r.id = ur.role_id
  left join margaret_maintenance_accounts m on m.user_id = u.id
  where show_hidden or m.user_id is null
  group by u.id, u.email, u.raw_user_meta_data, u.last_sign_in_at, u.created_at, m.user_id
  order by u.email;
end;
$$;

revoke all on function margaret_list_staff(boolean) from public, anon;
grant execute on function margaret_list_staff(boolean) to authenticated;

/* ----------------------------------------------------- what is withheld -- */

-- So the staff page can say "one account is not shown" rather than quietly
-- showing a shorter list than the truth.
create or replace function margaret_hidden_staff_count()
returns integer
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  n integer;
begin
  if not (margaret_has_permission('users.view') or margaret_is_super_admin()) then
    return 0;
  end if;

  select count(distinct m.user_id) into n
    from margaret_maintenance_accounts m
    join margaret_user_roles ur on ur.user_id = m.user_id;

  return coalesce(n, 0);
end;
$$;

revoke all on function margaret_hidden_staff_count() from public, anon;
grant execute on function margaret_hidden_staff_count() to authenticated;

/* ------------------------------------------------------ the one account -- */

-- The developer's account, marked at the hospital's request. Matched by
-- address so this does nothing on a database where it is absent, and written
-- once so re-running never overwrites a later decision to unhide it.
insert into margaret_maintenance_accounts (user_id, note)
select u.id, 'Developer. Hidden from the staff list at the hospital''s request, 20 September 2026.'
  from auth.users u
 where lower(u.email) = 'imamai.w@gmail.com'
   and not exists (select 1 from margaret_maintenance_accounts m where m.user_id = u.id);
