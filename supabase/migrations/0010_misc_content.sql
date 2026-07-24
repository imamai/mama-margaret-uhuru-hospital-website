-- 0010: Testimonials, insurance partners, awards, partners, contact directory,
-- and the two cross-cutting polymorphic tables used across every module:
-- margaret_gallery (images/videos) and margaret_downloads (documents).

create table margaret_testimonials (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  photo_url text,
  quote text not null,
  rating smallint check (rating between 1 and 5),
  department_id uuid references margaret_departments(id) on delete set null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

select margaret_bootstrap_content_table('margaret_testimonials', 'testimonials');

create table margaret_insurance_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_insurance_partners', 'partners');

create table margaret_awards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  awarding_body text,
  doctor_id uuid references margaret_doctors(id) on delete cascade,
  department_id uuid references margaret_departments(id) on delete set null,
  image_url text,
  description text,
  awarded_year integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

select margaret_bootstrap_content_table('margaret_awards', 'awards');

create table margaret_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  partner_type text not null default 'general'
    check (partner_type in ('general', 'academic', 'ngo', 'government', 'corporate')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_partners', 'partners');

create table margaret_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_type text not null default 'department'
    check (contact_type in ('department', 'emergency', 'general', 'media')),
  department_id uuid references margaret_departments(id) on delete set null,
  phone text,
  alternate_phone text,
  email text,
  location text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_contacts', 'contacts');

-- Polymorphic gallery: module + reference_id lets Home, Departments, Media
-- Centre and Events all share one image/video library table.
create table margaret_gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  file_url text not null,
  thumbnail_url text,
  module text not null default 'general',
  reference_id uuid,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_gallery_module on margaret_gallery(module, reference_id);

select margaret_bootstrap_content_table('margaret_gallery', 'gallery');

-- Polymorphic downloads: same pattern, used by Departments, Lab, Radiology,
-- About, Library, Careers, Tenders, etc.
create table margaret_downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  file_type text,
  file_size_kb integer,
  module text not null default 'general',
  reference_id uuid,
  category text,
  sort_order integer not null default 0,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_downloads_module on margaret_downloads(module, reference_id);

select margaret_bootstrap_content_table('margaret_downloads', 'downloads');
