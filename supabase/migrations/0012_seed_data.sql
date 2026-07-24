-- 0012: Seed data — the 9 spec'd roles with their permission sets, default
-- settings/homepage config, storage buckets, and a handful of sample records
-- so the Home page renders real content immediately after migration.
-- Sample departments/doctors/news/testimonials are demo content — replace or
-- delete them from the admin CMS once real content is ready.

-- ---------------------------------------------------------------------------
-- Permissions: <module>.view / <module>.manage for every module, generated
-- from one list instead of ~60 repeated INSERT statements.
-- ---------------------------------------------------------------------------

insert into margaret_permissions (key, module, description)
select module || '.' || action, module, initcap(replace(module, '_', ' ')) || ' - ' || action
from unnest(array[
  'users', 'roles', 'pages', 'menus', 'hero_slides', 'announcements', 'homepage', 'footer',
  'settings', 'departments', 'services', 'doctors', 'clinics', 'facilities', 'appointments',
  'forms', 'careers', 'tenders', 'news', 'events', 'media', 'research', 'library',
  'testimonials', 'awards', 'partners', 'contacts', 'downloads', 'gallery', 'notifications'
]) as module
cross join unnest(array['view', 'manage']) as action
union all
select 'audit_logs.view', 'audit_logs', 'Audit Logs - view'
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------

insert into margaret_roles (name, slug, description, is_system) values
  ('Super Admin', 'super-admin', 'Full unrestricted access to every module.', true),
  ('Editor', 'editor', 'Manages site content: pages, menus, hero slides, announcements, homepage, footer, news, events.', true),
  ('HR', 'hr', 'Manages the careers portal: job postings and applications.', true),
  ('Procurement', 'procurement', 'Manages the tenders portal: tenders, suppliers, bids and awards.', true),
  ('Media Officer', 'media-officer', 'Manages news, press releases and the media gallery.', true),
  ('Doctor', 'doctor', 'Read access to the doctor directory; manages own profile.', true),
  ('Department Manager', 'department-manager', 'Manages departments, services and facilities.', true),
  ('Research Officer', 'research-officer', 'Manages research publications, clinical trials and the library.', true),
  ('Content Editor', 'content-editor', 'Manages general pages, announcements and testimonials.', true)
on conflict (slug) do nothing;

-- Super Admin also gets every permission explicitly (in addition to the
-- margaret_is_super_admin() RLS bypass) so the admin UI can list them.
insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r cross join margaret_permissions p
where r.slug = 'super-admin'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module in ('pages', 'menus', 'hero_slides', 'announcements', 'homepage', 'footer', 'news', 'events')
where r.slug = 'editor'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module = 'careers'
where r.slug = 'hr'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module = 'tenders'
where r.slug = 'procurement'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module in ('media', 'news', 'gallery')
where r.slug = 'media-officer'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.key = 'doctors.view'
where r.slug = 'doctor'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module in ('departments', 'services', 'facilities') or p.key = 'doctors.view'
where r.slug = 'department-manager'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module in ('research', 'library')
where r.slug = 'research-officer'
on conflict do nothing;

insert into margaret_role_permissions (role_id, permission_id)
select r.id, p.id from margaret_roles r
join margaret_permissions p on p.module = 'pages' or p.key in ('announcements.manage', 'announcements.view', 'testimonials.manage', 'testimonials.view')
where r.slug = 'content-editor'
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Default settings
-- ---------------------------------------------------------------------------

insert into margaret_settings (setting_key, setting_value, setting_group) values
  ('hospital_name', '"Mama Margaret Uhuru Hospital"', 'general'),
  ('hospital_short_name', '"MMUH"', 'general'),
  ('mission', '"To provide accessible, high-quality, patient-centred healthcare to all."', 'general'),
  ('vision', '"To be a leading centre of excellence in healthcare, teaching and research in the region."', 'general'),
  ('brand_colors', '{"primary":"#1496E8","deep":"#0D5EA6","accent":"#19B5FE","dark_grey":"#3E4348","light_grey":"#F6F7F9"}', 'branding'),
  ('logo_url', 'null', 'branding'),
  ('favicon_url', 'null', 'branding'),
  ('emergency_phone', '"999"', 'general'),
  ('ambulance_phone', '"0700 000000"', 'general'),
  ('address', '"Nairobi, Kenya"', 'general'),
  ('social_links', '{"facebook":"","twitter":"","instagram":"","youtube":"","linkedin":""}', 'social'),
  ('seo_defaults', '{"title":"Mama Margaret Uhuru Hospital","description":"World-class, patient-centred healthcare.","og_image":""}', 'seo'),
  ('google_analytics_id', '""', 'integrations'),
  ('google_maps_embed_url', '""', 'integrations')
on conflict (setting_key) do nothing;

insert into margaret_homepage_sections (section_key, title, is_visible, sort_order) values
  ('hero', 'Hero', true, 1),
  ('emergency', 'Emergency Banner', true, 2),
  ('stats', 'Hospital Statistics', true, 3),
  ('departments', 'Departments', true, 4),
  ('doctors', 'Our Doctors', true, 5),
  ('clinics', 'Specialized Clinics', true, 6),
  ('news', 'Latest News', true, 7),
  ('events', 'Upcoming Events', true, 8),
  ('testimonials', 'Patient Testimonials', true, 9),
  ('insurance', 'Insurance Partners', true, 10),
  ('gallery', 'Gallery', true, 11),
  ('awards', 'Awards', true, 12),
  ('partners', 'Partners', true, 13)
on conflict (section_key) do nothing;

-- ---------------------------------------------------------------------------
-- Sample content (safe to edit/delete via the CMS)
-- ---------------------------------------------------------------------------

insert into margaret_stats (label, value, icon, sort_order) values
  ('Years of Service', '60+', 'calendar', 1),
  ('Bed Capacity', '2000+', 'bed', 2),
  ('Outpatients Annually', '1M+', 'users', 3),
  ('Specialist Doctors', '200+', 'stethoscope', 4)
on conflict do nothing;

insert into margaret_departments (name, slug, description, status, sort_order) values
  ('Emergency Medicine', 'emergency-medicine', '24/7 emergency and trauma care with a dedicated resuscitation unit.', 'published', 1),
  ('Maternity & Newborn', 'maternity', 'Comprehensive antenatal, delivery, postnatal and NICU services.', 'published', 2),
  ('Surgery', 'surgery', 'General and specialized surgical services across multiple theatres.', 'published', 3),
  ('Paediatrics', 'paediatrics', 'Specialist care for infants, children and adolescents.', 'published', 4),
  ('Oncology', 'oncology', 'Cancer screening, diagnosis, treatment and palliative care.', 'published', 5),
  ('Cardiology', 'cardiology', 'Heart disease diagnosis, treatment and rehabilitation.', 'published', 6)
on conflict (slug) do nothing;

insert into margaret_doctors (full_name, slug, title, specialization, department_id, languages, biography, years_experience, status, sort_order)
select 'Dr. Amina Njoroge', 'amina-njoroge', 'Dr.', 'Emergency Medicine Consultant', d.id,
  array['English', 'Kiswahili'], 'Consultant in emergency medicine with over a decade of trauma care experience.', 12, 'published', 1
from margaret_departments d where d.slug = 'emergency-medicine'
on conflict (slug) do nothing;

insert into margaret_doctors (full_name, slug, title, specialization, department_id, languages, biography, years_experience, status, sort_order)
select 'Dr. Peter Otieno', 'peter-otieno', 'Dr.', 'Obstetrics & Gynaecology', d.id,
  array['English', 'Kiswahili'], 'Specialist obstetrician focused on safe motherhood and high-risk pregnancies.', 15, 'published', 2
from margaret_departments d where d.slug = 'maternity'
on conflict (slug) do nothing;

insert into margaret_doctors (full_name, slug, title, specialization, department_id, languages, biography, years_experience, status, sort_order)
select 'Dr. Grace Wambui', 'grace-wambui', 'Dr.', 'Paediatric Consultant', d.id,
  array['English', 'Kiswahili'], 'Dedicated to compassionate, evidence-based care for children.', 9, 'published', 3
from margaret_departments d where d.slug = 'paediatrics'
on conflict (slug) do nothing;

insert into margaret_hero_slides (title, subtitle, image_url, cta_label, cta_url, sort_order, status) values
  ('World-Class Care, Close to Home', 'Compassionate, patient-centred healthcare for every stage of life.', '/images/hero/hero-1.jpg', 'Book an Appointment', '/patients/appointments', 1, 'published'),
  ('24/7 Emergency & Trauma Care', 'Our emergency department is always open, always ready.', '/images/hero/hero-2.jpg', 'Emergency Contacts', '/emergency', 2, 'published')
on conflict do nothing;

insert into margaret_news (title, slug, excerpt, content, is_featured, status, published_at) values
  ('Hospital Launches New Maternity Wing', 'hospital-launches-new-maternity-wing', 'A state-of-the-art maternity and newborn unit now open to serve more mothers.', '{"blocks":[]}', true, 'published', now())
on conflict (slug) do nothing;

insert into margaret_testimonials (patient_name, quote, rating, status) values
  ('Jane K.', 'The care I received was exceptional — the staff were attentive and professional throughout my stay.', 5, 'published'),
  ('Samuel M.', 'From admission to discharge, everything was smooth and well organized.', 5, 'published')
on conflict do nothing;

insert into margaret_insurance_partners (name, sort_order, status) values
  ('NHIF', 1, 'active'),
  ('AAR Insurance', 2, 'active'),
  ('Jubilee Insurance', 3, 'active'),
  ('CIC Insurance', 4, 'active')
on conflict do nothing;

insert into margaret_form_types (name, slug, notify_email, status) values
  ('Appointment', 'appointment', null, 'active'),
  ('Feedback', 'feedback', null, 'active'),
  ('Complaints', 'complaints', null, 'active'),
  ('Volunteer', 'volunteer', null, 'active'),
  ('Internship', 'internship', null, 'active'),
  ('Supplier Registration', 'supplier-registration', null, 'active'),
  ('Tender Submission', 'tender-submission', null, 'active'),
  ('Contact', 'contact', null, 'active'),
  ('Research Request', 'research-request', null, 'active'),
  ('Medical Camp Registration', 'medical-camp-registration', null, 'active')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('hero-media', 'hero-media', true),
  ('department-media', 'department-media', true),
  ('gallery', 'gallery', true),
  ('downloads', 'downloads', true),
  ('job-attachments', 'job-attachments', false),
  ('tender-documents', 'tender-documents', false)
on conflict (id) do nothing;

create policy "margaret_public_buckets_read"
  on storage.objects for select
  using (bucket_id in ('avatars', 'hero-media', 'department-media', 'gallery', 'downloads'));

create policy "margaret_public_buckets_authenticated_write"
  on storage.objects for insert
  with check (bucket_id in ('avatars', 'hero-media', 'department-media', 'gallery', 'downloads') and auth.role() = 'authenticated');

create policy "margaret_public_buckets_admin_manage"
  on storage.objects for update
  using (bucket_id in ('avatars', 'hero-media', 'department-media', 'gallery', 'downloads') and auth.role() = 'authenticated');

create policy "margaret_public_buckets_admin_delete"
  on storage.objects for delete
  using (bucket_id in ('avatars', 'hero-media', 'department-media', 'gallery', 'downloads') and auth.role() = 'authenticated');

create policy "margaret_private_buckets_public_upload"
  on storage.objects for insert
  with check (bucket_id in ('job-attachments', 'tender-documents'));

create policy "margaret_private_buckets_admin_manage"
  on storage.objects for all
  using (
    bucket_id in ('job-attachments', 'tender-documents')
    and (margaret_has_permission('careers.manage') or margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  )
  with check (
    bucket_id in ('job-attachments', 'tender-documents')
    and (margaret_has_permission('careers.manage') or margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  );
