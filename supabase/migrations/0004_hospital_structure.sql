-- 0004: Hospital structure — departments, services, doctors, clinics, facilities.

-- ---------------------------------------------------------------------------
-- Departments
-- ---------------------------------------------------------------------------

create table margaret_departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  banner_image_url text,
  description text,
  operating_hours jsonb not null default '{}'::jsonb,
  phone text,
  email text,
  location text,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_departments_slug on margaret_departments(slug) where deleted_at is null;

select margaret_bootstrap_content_table('margaret_departments', 'departments');

-- Now that margaret_departments exists, wire up the FK deferred from 0002.
alter table margaret_profiles
  add constraint fk_margaret_profiles_department
  foreign key (department_id) references margaret_departments(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

create table margaret_service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_service_categories', 'services');

create table margaret_services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references margaret_service_categories(id) on delete set null,
  department_id uuid references margaret_departments(id) on delete set null,
  description text,
  image_url text,
  price_info text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_services_slug on margaret_services(slug) where deleted_at is null;

create index idx_margaret_services_category on margaret_services(category_id);

create index idx_margaret_services_department on margaret_services(department_id);

select margaret_bootstrap_content_table('margaret_services', 'services');

-- ---------------------------------------------------------------------------
-- Doctors
-- ---------------------------------------------------------------------------

create table margaret_doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  slug text not null unique,
  photo_url text,
  title text,
  specialization text not null,
  department_id uuid references margaret_departments(id) on delete set null,
  qualifications text[] not null default '{}',
  languages text[] not null default '{}',
  biography text,
  years_experience integer,
  email text,
  phone text,
  linkedin_url text,
  twitter_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_doctors_slug on margaret_doctors(slug) where deleted_at is null;

create index idx_margaret_doctors_department on margaret_doctors(department_id);

select margaret_bootstrap_content_table('margaret_doctors', 'doctors');

-- Secondary department affiliations (a doctor may consult across departments)
create table margaret_department_doctors (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references margaret_departments(id) on delete cascade,
  doctor_id uuid not null references margaret_doctors(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (department_id, doctor_id)
);

create index idx_margaret_department_doctors_department on margaret_department_doctors(department_id);

create index idx_margaret_department_doctors_doctor on margaret_department_doctors(doctor_id);

alter table margaret_department_doctors enable row level security;

create policy margaret_department_doctors_read on margaret_department_doctors for select using (true);

create policy margaret_department_doctors_write on margaret_department_doctors for all
  using (margaret_has_permission('doctors.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('doctors.manage') or margaret_is_super_admin());

create table margaret_doctor_publications (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references margaret_doctors(id) on delete cascade,
  title text not null,
  publication_url text,
  published_year integer,
  created_at timestamptz not null default now()
);

create index idx_margaret_doctor_publications_doctor on margaret_doctor_publications(doctor_id);

alter table margaret_doctor_publications enable row level security;

create policy margaret_doctor_publications_read on margaret_doctor_publications for select using (true);

create policy margaret_doctor_publications_write on margaret_doctor_publications for all
  using (margaret_has_permission('doctors.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('doctors.manage') or margaret_is_super_admin());

create table margaret_doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references margaret_doctors(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  location text,
  created_at timestamptz not null default now()
);

create index idx_margaret_doctor_availability_doctor on margaret_doctor_availability(doctor_id);

alter table margaret_doctor_availability enable row level security;

create policy margaret_doctor_availability_read on margaret_doctor_availability for select using (true);

create policy margaret_doctor_availability_write on margaret_doctor_availability for all
  using (margaret_has_permission('doctors.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('doctors.manage') or margaret_is_super_admin());

-- ---------------------------------------------------------------------------
-- Specialized clinics
-- ---------------------------------------------------------------------------

create table margaret_clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  department_id uuid references margaret_departments(id) on delete set null,
  banner_image_url text,
  description text,
  services text[] not null default '{}',
  operating_hours jsonb not null default '{}'::jsonb,
  seo_title text,
  seo_description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_clinics_slug on margaret_clinics(slug) where deleted_at is null;

select margaret_bootstrap_content_table('margaret_clinics', 'clinics');

-- ---------------------------------------------------------------------------
-- Facilities (operating theatres, labs, radiology suites, etc.)
-- ---------------------------------------------------------------------------

create table margaret_facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  facility_type text not null default 'general'
    check (facility_type in ('operating_theatre', 'laboratory', 'radiology', 'pharmacy', 'maternity', 'emergency', 'general')),
  department_id uuid references margaret_departments(id) on delete set null,
  description text,
  image_url text,
  equipment text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_facilities_slug on margaret_facilities(slug) where deleted_at is null;

create index idx_margaret_facilities_type on margaret_facilities(facility_type);

select margaret_bootstrap_content_table('margaret_facilities', 'facilities');
