-- 0006: Careers portal — jobs, applications, and applicant document uploads.

create table margaret_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department_id uuid references margaret_departments(id) on delete set null,
  location text not null,
  contract_type text not null
    check (contract_type in ('full_time', 'part_time', 'contract', 'internship', 'locum')),
  qualifications text,
  experience_required text,
  responsibilities text,
  salary_range text,
  description text,
  application_deadline date not null,
  positions_available integer not null default 1,
  attachments text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_jobs_slug on margaret_jobs(slug) where deleted_at is null;

create index idx_margaret_jobs_deadline on margaret_jobs(application_deadline);

create index idx_margaret_jobs_department on margaret_jobs(department_id);

select margaret_bootstrap_content_table('margaret_jobs', 'careers');

create table margaret_job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references margaret_jobs(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  cover_letter text,
  interview_date timestamptz,
  interview_notes text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'submitted'
    check (status in ('submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'rejected', 'hired')),
  deleted_at timestamptz
);

create index idx_margaret_job_applications_job on margaret_job_applications(job_id);

create index idx_margaret_job_applications_status on margaret_job_applications(status);

create trigger trg_margaret_job_applications_updated_at
  before update on margaret_job_applications
  for each row execute function margaret_set_updated_at();

alter table margaret_job_applications enable row level security;

create policy margaret_job_applications_insert_public on margaret_job_applications for insert with check (true);

create policy margaret_job_applications_read_admin on margaret_job_applications for select
  using (margaret_has_permission('careers.manage') or margaret_is_super_admin());

create policy margaret_job_applications_update_admin on margaret_job_applications for update
  using (margaret_has_permission('careers.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('careers.manage') or margaret_is_super_admin());

create policy margaret_job_applications_delete_admin on margaret_job_applications for delete
  using (margaret_has_permission('careers.manage') or margaret_is_super_admin());

create table margaret_job_application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references margaret_job_applications(id) on delete cascade,
  document_type text not null
    check (document_type in ('cv', 'certificate', 'cover_letter', 'id', 'professional_license', 'passport_photo', 'other')),
  file_url text not null,
  file_name text,
  created_at timestamptz not null default now()
);

create index idx_margaret_job_application_documents_app on margaret_job_application_documents(application_id);

alter table margaret_job_application_documents enable row level security;

create policy margaret_job_application_documents_insert_public on margaret_job_application_documents for insert with check (true);

create policy margaret_job_application_documents_read_admin on margaret_job_application_documents for select
  using (margaret_has_permission('careers.manage') or margaret_is_super_admin());

create policy margaret_job_application_documents_delete_admin on margaret_job_application_documents for delete
  using (margaret_has_permission('careers.manage') or margaret_is_super_admin());
