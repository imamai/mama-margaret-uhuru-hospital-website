-- 0008: News, press releases, and events.

create table margaret_news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_news_categories', 'news');

create table margaret_news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category_id uuid references margaret_news_categories(id) on delete set null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  featured_image_url text,
  author_id uuid references auth.users(id),
  author_name text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_breaking boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_news_slug on margaret_news(slug) where deleted_at is null;

create index idx_margaret_news_category on margaret_news(category_id);

create index idx_margaret_news_published on margaret_news(published_at desc);

create index idx_margaret_news_tags on margaret_news using gin(tags);

select margaret_bootstrap_content_table('margaret_news', 'news');

create table margaret_news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references margaret_news(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  comment text not null,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'spam', 'rejected'))
);

create index idx_margaret_news_comments_news on margaret_news_comments(news_id);

alter table margaret_news_comments enable row level security;

create policy margaret_news_comments_read on margaret_news_comments for select using (status = 'approved');

create policy margaret_news_comments_insert_public on margaret_news_comments for insert with check (true);

create policy margaret_news_comments_moderate on margaret_news_comments for update
  using (margaret_has_permission('news.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('news.manage') or margaret_is_super_admin());

create policy margaret_news_comments_delete on margaret_news_comments for delete
  using (margaret_has_permission('news.manage') or margaret_is_super_admin());

create table margaret_press_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content jsonb not null default '{}'::jsonb,
  file_url text,
  media_contact_name text,
  media_contact_email text,
  media_contact_phone text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_press_releases_slug on margaret_press_releases(slug) where deleted_at is null;

select margaret_bootstrap_content_table('margaret_press_releases', 'media');

create table margaret_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  event_type text not null default 'event'
    check (event_type in ('conference', 'medical_camp', 'training', 'webinar', 'event')),
  description text,
  featured_image_url text,
  location text,
  is_virtual boolean not null default false,
  virtual_link text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  registration_required boolean not null default false,
  registration_deadline timestamptz,
  capacity integer,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'cancelled', 'completed', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_events_slug on margaret_events(slug) where deleted_at is null;

create index idx_margaret_events_starts_at on margaret_events(starts_at);

select margaret_bootstrap_content_table('margaret_events', 'events');

create table margaret_event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references margaret_events(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  created_at timestamptz not null default now(),
  status text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled', 'attended'))
);

create index idx_margaret_event_registrations_event on margaret_event_registrations(event_id);

alter table margaret_event_registrations enable row level security;

create policy margaret_event_registrations_insert_public on margaret_event_registrations for insert with check (true);

create policy margaret_event_registrations_read_admin on margaret_event_registrations for select
  using (margaret_has_permission('events.manage') or margaret_is_super_admin());

create policy margaret_event_registrations_update_admin on margaret_event_registrations for update
  using (margaret_has_permission('events.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('events.manage') or margaret_is_super_admin());

create policy margaret_event_registrations_delete_admin on margaret_event_registrations for delete
  using (margaret_has_permission('events.manage') or margaret_is_super_admin());
