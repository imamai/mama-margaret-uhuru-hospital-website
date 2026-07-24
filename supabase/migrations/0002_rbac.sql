-- 0002: Role-based access control core, user profiles, and reusable RLS bootstrap helpers.

-- ---------------------------------------------------------------------------
-- Roles / permissions
-- ---------------------------------------------------------------------------

create table margaret_roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'active' check (status in ('active', 'inactive')),
  deleted_at timestamptz
);

create trigger trg_margaret_roles_updated_at
  before update on margaret_roles
  for each row execute function margaret_set_updated_at();

create table margaret_permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_margaret_permissions_module on margaret_permissions(module);

create trigger trg_margaret_permissions_updated_at
  before update on margaret_permissions
  for each row execute function margaret_set_updated_at();

create table margaret_role_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references margaret_roles(id) on delete cascade,
  permission_id uuid not null references margaret_permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (role_id, permission_id)
);

create index idx_margaret_role_permissions_role on margaret_role_permissions(role_id);

create index idx_margaret_role_permissions_permission on margaret_role_permissions(permission_id);

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users) and role assignment
-- ---------------------------------------------------------------------------

create table margaret_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  job_title text,
  department_id uuid, -- FK added in 0004 once margaret_departments exists
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  deleted_at timestamptz
);

create trigger trg_margaret_profiles_updated_at
  before update on margaret_profiles
  for each row execute function margaret_set_updated_at();

create table margaret_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references margaret_roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  unique (user_id, role_id)
);

create index idx_margaret_user_roles_user on margaret_user_roles(user_id);

create index idx_margaret_user_roles_role on margaret_user_roles(role_id);

-- ---------------------------------------------------------------------------
-- Permission-check helpers (security definer so RLS policies can call them)
-- ---------------------------------------------------------------------------

create or replace function margaret_has_permission(permission_key text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from margaret_user_roles ur
    join margaret_role_permissions rp on rp.role_id = ur.role_id
    join margaret_permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid()
      and p.key = permission_key
  );
$$;

create or replace function margaret_is_super_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from margaret_user_roles ur
    join margaret_roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.slug = 'super-admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Reusable RLS bootstrap helpers, applied to every module table from 0003+.
-- Keeps ~40 content tables from repeating the same policy boilerplate.
-- ---------------------------------------------------------------------------

-- For publishable content tables (have status draft/published/archived + deleted_at):
-- public can read published rows, permission holders / super admin can do everything.
create or replace function margaret_bootstrap_content_table(p_table regclass, p_permission_prefix text)
returns void
language plpgsql
as $$
declare
  t text := replace(p_table::text, '.', '_');
begin
  execute format('alter table %s enable row level security', p_table);

  execute format(
    'create trigger trg_%s_updated_at before update on %s for each row execute function margaret_set_updated_at()',
    t, p_table
  );

  execute format(
    'create policy %I on %s for select using (status = ''published'' and deleted_at is null)',
    t || '_public_read', p_table
  );

  execute format(
    'create policy %I on %s for select using (margaret_has_permission(%L) or margaret_is_super_admin())',
    t || '_admin_read', p_table, p_permission_prefix || '.view'
  );

  execute format(
    'create policy %I on %s for insert with check (margaret_has_permission(%L) or margaret_is_super_admin())',
    t || '_admin_insert', p_table, p_permission_prefix || '.manage'
  );

  execute format(
    'create policy %I on %s for update using (margaret_has_permission(%L) or margaret_is_super_admin()) with check (margaret_has_permission(%L) or margaret_is_super_admin())',
    t || '_admin_update', p_table, p_permission_prefix || '.manage', p_permission_prefix || '.manage'
  );

  execute format(
    'create policy %I on %s for delete using (margaret_has_permission(%L) or margaret_is_super_admin())',
    t || '_admin_delete', p_table, p_permission_prefix || '.manage'
  );
end;
$$;

-- For simple lookup/reference tables (status active/inactive, no deleted_at):
-- public can read active rows, permission holders / super admin manage everything.
create or replace function margaret_bootstrap_lookup_table(p_table regclass, p_permission_prefix text)
returns void
language plpgsql
as $$
declare
  t text := replace(p_table::text, '.', '_');
begin
  execute format('alter table %s enable row level security', p_table);

  execute format(
    'create trigger trg_%s_updated_at before update on %s for each row execute function margaret_set_updated_at()',
    t, p_table
  );

  execute format(
    'create policy %I on %s for select using (status = ''active'')',
    t || '_public_read', p_table
  );

  execute format(
    'create policy %I on %s for all using (margaret_has_permission(%L) or margaret_is_super_admin()) with check (margaret_has_permission(%L) or margaret_is_super_admin())',
    t || '_admin_write', p_table, p_permission_prefix || '.manage', p_permission_prefix || '.manage'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS on RBAC tables themselves
-- ---------------------------------------------------------------------------

alter table margaret_roles enable row level security;

alter table margaret_permissions enable row level security;

alter table margaret_role_permissions enable row level security;

alter table margaret_profiles enable row level security;

alter table margaret_user_roles enable row level security;

create policy margaret_roles_read on margaret_roles
  for select using (auth.role() = 'authenticated');

create policy margaret_roles_write on margaret_roles
  for all using (margaret_has_permission('roles.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('roles.manage') or margaret_is_super_admin());

create policy margaret_permissions_read on margaret_permissions
  for select using (auth.role() = 'authenticated');

create policy margaret_permissions_write on margaret_permissions
  for all using (margaret_is_super_admin())
  with check (margaret_is_super_admin());

create policy margaret_role_permissions_read on margaret_role_permissions
  for select using (auth.role() = 'authenticated');

create policy margaret_role_permissions_write on margaret_role_permissions
  for all using (margaret_has_permission('roles.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('roles.manage') or margaret_is_super_admin());

create policy margaret_profiles_read on margaret_profiles
  for select using (auth.uid() = id or margaret_has_permission('users.view') or margaret_is_super_admin());

create policy margaret_profiles_update on margaret_profiles
  for update using (auth.uid() = id or margaret_has_permission('users.manage') or margaret_is_super_admin())
  with check (auth.uid() = id or margaret_has_permission('users.manage') or margaret_is_super_admin());

create policy margaret_profiles_insert on margaret_profiles
  for insert with check (auth.uid() = id or margaret_has_permission('users.manage') or margaret_is_super_admin());

create policy margaret_profiles_delete on margaret_profiles
  for delete using (margaret_has_permission('users.manage') or margaret_is_super_admin());

create policy margaret_user_roles_read on margaret_user_roles
  for select using (auth.uid() = user_id or margaret_has_permission('users.view') or margaret_is_super_admin());

create policy margaret_user_roles_write on margaret_user_roles
  for all using (margaret_has_permission('users.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('users.manage') or margaret_is_super_admin());

-- Auto-create a margaret_profiles row whenever a new auth.users row appears.
create or replace function margaret_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into margaret_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger trg_auth_user_created
  after insert on auth.users
  for each row execute function margaret_handle_new_user();
