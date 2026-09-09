-- Seed the Gallery homepage section with branded placeholder tiles.
-- margaret_gallery.file_url is NOT NULL, so (unlike Awards/Partners/Events)
-- this section can't render on a null image_url fallback -- it needs an
-- actual file. These reference generated on-brand illustration files
-- checked into public/placeholders/ (not real hospital photos), so the
-- section shows something clearly-provisional rather than staying hidden.
-- Replace each row's file from Admin -> Gallery once real photos exist.

insert into margaret_gallery (title, media_type, file_url, thumbnail_url, caption, status, sort_order)
values
  ('Hospital campus', 'image', '/placeholders/gallery-1.jpg', '/placeholders/gallery-1.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 0),
  ('Emergency & trauma care', 'image', '/placeholders/gallery-2.jpg', '/placeholders/gallery-2.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 1),
  ('Patient monitoring', 'image', '/placeholders/gallery-3.jpg', '/placeholders/gallery-3.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 2),
  ('Compassionate care', 'image', '/placeholders/gallery-4.jpg', '/placeholders/gallery-4.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 3),
  ('Laboratory & diagnostics', 'image', '/placeholders/gallery-5.jpg', '/placeholders/gallery-5.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 4),
  ('Safety & infection control', 'image', '/placeholders/gallery-6.jpg', '/placeholders/gallery-6.jpg', 'Placeholder image -- replace from Admin -> Gallery.', 'published', 5);
