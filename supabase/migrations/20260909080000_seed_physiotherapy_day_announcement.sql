-- World Physiotherapy Day announcement, transcribed from the hospital's
-- poster (Friday 11th -- Movement for Better Health: physical activity in
-- cardiovascular and stroke management). Runs through the event date.
insert into margaret_announcements (title, message, announcement_type, starts_at, ends_at, status)
values (
  'World Physiotherapy Day -- Friday 11th',
  'Movement for Better Health: join us for a special activity on physical activity in cardiovascular and stroke management. Stay active, keep your heart healthy, and support recovery.',
  'info',
  now(),
  '2026-09-12 00:00:00+00',
  'published'
);
