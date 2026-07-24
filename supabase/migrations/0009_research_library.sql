-- 0009: Research publications, clinical trials, and the document library.

create table margaret_research (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  abstract text,
  authors text[] not null default '{}',
  doctor_id uuid references margaret_doctors(id) on delete set null,
  department_id uuid references margaret_departments(id) on delete set null,
  publication_url text,
  file_url text,
  published_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_research_slug on margaret_research(slug) where deleted_at is null;

create index idx_margaret_research_doctor on margaret_research(doctor_id);

select margaret_bootstrap_content_table('margaret_research', 'research');

create table margaret_clinical_trials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  trial_phase text,
  condition_studied text,
  principal_investigator text,
  department_id uuid references margaret_departments(id) on delete set null,
  description text,
  eligibility_criteria text,
  ethics_approval_number text,
  starts_at date,
  ends_at date,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'recruiting', 'closed', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_clinical_trials_slug on margaret_clinical_trials(slug) where deleted_at is null;

select margaret_bootstrap_content_table('margaret_clinical_trials', 'research');

create table margaret_library_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  item_type text not null default 'publication'
    check (item_type in ('publication', 'guideline', 'manual', 'annual_report')),
  description text,
  file_url text not null,
  published_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_library_items_slug on margaret_library_items(slug) where deleted_at is null;

create index idx_margaret_library_items_type on margaret_library_items(item_type);

select margaret_bootstrap_content_table('margaret_library_items', 'library');
