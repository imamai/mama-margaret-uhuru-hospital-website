-- Expand the homepage placeholder content so Awards/Partners/Events fill
-- their grid layouts instead of showing a single lonely card, and Gallery
-- fills a clean 2x4 grid. Same convention as the earlier seed migrations:
-- clearly labeled sample content, admin-editable, meant to be replaced.

insert into margaret_awards (title, awarding_body, description, awarded_year, status, sort_order)
values
  ('Sample Award -- Excellence in Patient Safety', 'Add the awarding body here', 'Placeholder content -- edit or delete from Admin -> Awards.', 2025, 'published', 1),
  ('Sample Award -- Community Health Impact', 'Add the awarding body here', 'Placeholder content -- edit or delete from Admin -> Awards.', 2024, 'published', 2);

insert into margaret_partners (name, partner_type, status, sort_order)
values
  ('Sample Partner -- Academic Institution', 'academic', 'active', 1),
  ('Sample Partner -- NGO Health Program', 'ngo', 'active', 2),
  ('Sample Partner -- Corporate Sponsor', 'corporate', 'active', 3);

insert into margaret_events (title, slug, event_type, description, location, starts_at, status)
values
  ('Sample Event -- Free Community Health Camp', 'sample-event-health-camp', 'medical_camp', 'Placeholder content -- edit or delete from Admin -> Events.', 'Hospital Grounds', now() + interval '45 days', 'published'),
  ('Sample Event -- Maternal Health Webinar', 'sample-event-maternal-webinar', 'webinar', 'Placeholder content -- edit or delete from Admin -> Events.', 'Online', now() + interval '60 days', 'published');

insert into margaret_gallery (title, media_type, file_url, thumbnail_url, caption, status, sort_order)
values
  ('Our care team', 'image', '/placeholders/gallery-7.jpg', '/placeholders/gallery-7.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 6),
  ('Clinical consultations', 'image', '/placeholders/gallery-8.jpg', '/placeholders/gallery-8.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 7);
