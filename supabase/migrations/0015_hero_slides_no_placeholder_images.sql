-- 0015: The seeded hero slides referenced placeholder image paths that don't
-- exist on disk yet. Clear them so Hero renders its gradient background
-- cleanly until an admin uploads real photography via the hero-media bucket.

update margaret_hero_slides
set image_url = ''
where image_url in ('/images/hero/hero-1.jpg', '/images/hero/hero-2.jpg');
