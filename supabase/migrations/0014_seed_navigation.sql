-- 0014: Seed primary/footer navigation menus. Phase 1 only ships the Home
-- page, so items point at in-page sections; point these at real routes as
-- each page ships in later phases (editable via the CMS, no code change).

insert into margaret_menus (name, slug, status) values
  ('Primary Navigation', 'primary-nav', 'active'),
  ('Footer Navigation', 'footer-nav', 'active')
on conflict (slug) do nothing;

insert into margaret_menu_items (menu_id, label, url, sort_order, status)
select m.id, v.label, v.url, v.sort_order, 'active'
from margaret_menus m
cross join (values
  ('Home', '/', 1),
  ('Departments', '/#departments', 2),
  ('Our Doctors', '/#doctors', 3),
  ('News', '/#news', 4),
  ('Contact', '/#contact', 5)
) as v(label, url, sort_order)
where m.slug = 'primary-nav';
