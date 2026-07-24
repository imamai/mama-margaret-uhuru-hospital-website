-- 0003: Core CMS primitives — settings, pages, menus, hero slides, announcements,
-- homepage/footer builders, and homepage statistics.

-- ---------------------------------------------------------------------------
-- Settings (key/value; drives hospital name, mission, branding, SEO defaults,
-- social links, email/SMS/integration config)
-- ---------------------------------------------------------------------------

create table margaret_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb not null default '{}'::jsonb,
  setting_group text not null default 'general'
    check (setting_group in ('general', 'branding', 'seo', 'email', 'sms', 'social', 'integrations')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create trigger trg_margaret_settings_updated_at
  before update on margaret_settings
  for each row execute function margaret_set_updated_at();

alter table margaret_settings enable row level security;

create policy margaret_settings_public_read on margaret_settings for select using (true);

create policy margaret_settings_admin_write on margaret_settings for all
  using (margaret_has_permission('settings.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('settings.manage') or margaret_is_super_admin());

-- ---------------------------------------------------------------------------
-- Pages (About subpages, Policies, Patient Rights, static content, etc.)
-- ---------------------------------------------------------------------------

create table margaret_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  parent_id uuid references margaret_pages(id) on delete set null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  featured_image_url text,
  template text not null default 'default',
  seo_title text,
  seo_description text,
  seo_og_image_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_pages_slug on margaret_pages(slug) where deleted_at is null;

create index idx_margaret_pages_parent on margaret_pages(parent_id);

select margaret_bootstrap_content_table('margaret_pages', 'pages');

-- ---------------------------------------------------------------------------
-- Menus (Navigation Builder)
-- ---------------------------------------------------------------------------

create table margaret_menus (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_menus', 'menus');

create table margaret_menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references margaret_menus(id) on delete cascade,
  parent_id uuid references margaret_menu_items(id) on delete cascade,
  label text not null,
  url text,
  page_id uuid references margaret_pages(id) on delete set null,
  icon text,
  sort_order integer not null default 0,
  open_in_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create index idx_margaret_menu_items_menu on margaret_menu_items(menu_id);

create index idx_margaret_menu_items_parent on margaret_menu_items(parent_id);

select margaret_bootstrap_lookup_table('margaret_menu_items', 'menus');

-- ---------------------------------------------------------------------------
-- Hero slides
-- ---------------------------------------------------------------------------

create table margaret_hero_slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  video_url text,
  cta_label text,
  cta_url text,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

create index idx_margaret_hero_slides_sort on margaret_hero_slides(sort_order);

select margaret_bootstrap_content_table('margaret_hero_slides', 'hero_slides');

-- ---------------------------------------------------------------------------
-- Announcements (site-wide banners)
-- ---------------------------------------------------------------------------

create table margaret_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  announcement_type text not null default 'info'
    check (announcement_type in ('info', 'warning', 'emergency', 'success')),
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  deleted_at timestamptz
);

select margaret_bootstrap_content_table('margaret_announcements', 'announcements');

-- ---------------------------------------------------------------------------
-- Homepage builder (toggle/reorder/configure homepage sections)
-- ---------------------------------------------------------------------------

create table margaret_homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create trigger trg_margaret_homepage_sections_updated_at
  before update on margaret_homepage_sections
  for each row execute function margaret_set_updated_at();

alter table margaret_homepage_sections enable row level security;

create policy margaret_homepage_sections_public_read on margaret_homepage_sections for select using (true);

create policy margaret_homepage_sections_admin_write on margaret_homepage_sections for all
  using (margaret_has_permission('homepage.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('homepage.manage') or margaret_is_super_admin());

-- ---------------------------------------------------------------------------
-- Footer builder
-- ---------------------------------------------------------------------------

create table margaret_footer_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_footer_sections', 'footer');

-- ---------------------------------------------------------------------------
-- Homepage statistics ("60+ years", "2000+ beds", ...)
-- ---------------------------------------------------------------------------

create table margaret_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  icon text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_stats', 'homepage');
