-- 0005: Patient appointments and the generic online-forms engine (feedback,
-- complaints, volunteer, internship, contact, research request, medical camp
-- registration, ...). Structured, high-value forms (jobs, tenders) get their
-- own dedicated tables in later migrations.

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------

create table margaret_appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_email text,
  patient_phone text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  department_id uuid references margaret_departments(id) on delete set null,
  doctor_id uuid references margaret_doctors(id) on delete set null,
  preferred_date date not null,
  preferred_time time,
  reason text,
  is_insured boolean not null default false,
  insurance_provider text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  deleted_at timestamptz
);

create index idx_margaret_appointments_status on margaret_appointments(status);

create index idx_margaret_appointments_doctor on margaret_appointments(doctor_id);

create index idx_margaret_appointments_department on margaret_appointments(department_id);

create trigger trg_margaret_appointments_updated_at
  before update on margaret_appointments
  for each row execute function margaret_set_updated_at();

alter table margaret_appointments enable row level security;

create policy margaret_appointments_insert_public on margaret_appointments for insert with check (true);

create policy margaret_appointments_read_admin on margaret_appointments for select
  using (margaret_has_permission('appointments.view') or margaret_is_super_admin());

create policy margaret_appointments_update_admin on margaret_appointments for update
  using (margaret_has_permission('appointments.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('appointments.manage') or margaret_is_super_admin());

create policy margaret_appointments_delete_admin on margaret_appointments for delete
  using (margaret_has_permission('appointments.manage') or margaret_is_super_admin());

-- ---------------------------------------------------------------------------
-- Generic online forms engine
-- ---------------------------------------------------------------------------

create table margaret_form_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  schema jsonb not null default '{}'::jsonb,
  notify_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_form_types', 'forms');

create table margaret_form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type_id uuid not null references margaret_form_types(id) on delete restrict,
  submitted_by_name text,
  submitted_by_email text,
  submitted_by_phone text,
  data jsonb not null default '{}'::jsonb,
  ip_address inet,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  status text not null default 'new'
    check (status in ('new', 'in_review', 'resolved', 'archived', 'spam')),
  deleted_at timestamptz
);

create index idx_margaret_form_submissions_type on margaret_form_submissions(form_type_id);

create index idx_margaret_form_submissions_status on margaret_form_submissions(status);

create trigger trg_margaret_form_submissions_updated_at
  before update on margaret_form_submissions
  for each row execute function margaret_set_updated_at();

alter table margaret_form_submissions enable row level security;

create policy margaret_form_submissions_insert_public on margaret_form_submissions for insert with check (true);

create policy margaret_form_submissions_read_admin on margaret_form_submissions for select
  using (margaret_has_permission('forms.manage') or margaret_is_super_admin());

create policy margaret_form_submissions_update_admin on margaret_form_submissions for update
  using (margaret_has_permission('forms.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('forms.manage') or margaret_is_super_admin());

create policy margaret_form_submissions_delete_admin on margaret_form_submissions for delete
  using (margaret_has_permission('forms.manage') or margaret_is_super_admin());
