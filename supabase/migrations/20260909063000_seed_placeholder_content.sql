-- Seed one clearly-labeled placeholder row into homepage sections that are
-- currently empty (and therefore hidden -- see SECTION_COMPONENTS in
-- app/(public)/page.tsx, which renders nothing for a zero-row section).
-- Each row has no image_url/logo_url/featured_image_url, so the public site
-- renders the branded SmartImage/PlaceholderImage fallback for it. All of
-- this is normal admin-editable content: edit or delete it from
-- Admin -> Awards / Partners / Events once real content is available.

insert into margaret_awards (title, awarding_body, description, awarded_year, status, sort_order)
values (
  'Sample Award -- Replace With a Real Accreditation',
  'Add the awarding body here',
  'This is placeholder content so you can preview how the Awards & Accreditations section looks. Edit or delete this from Admin -> Awards once you add the hospital''s real awards and accreditations.',
  2026,
  'published',
  0
);

insert into margaret_partners (name, partner_type, status, sort_order)
values (
  'Sample Partner -- Add Your Real Partners',
  'general',
  'active',
  0
);

insert into margaret_events (title, slug, event_type, description, location, starts_at, status)
values (
  'Sample Event -- Add Your Real Upcoming Events',
  'sample-event-placeholder',
  'event',
  'This is placeholder content so you can preview how the Upcoming Events section looks. Edit or delete this from Admin -> Events once you add real events.',
  'To be announced',
  now() + interval '30 days',
  'published'
);
