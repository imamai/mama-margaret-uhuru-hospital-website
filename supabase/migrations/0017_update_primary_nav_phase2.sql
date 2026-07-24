-- 0017: Departments/Doctors/Clinics/Services now have real routes (Phase 2) —
-- point the primary nav at them instead of Home-page anchors, and add the
-- two new sections that didn't exist yet.

update margaret_menu_items
set url = '/departments'
where menu_id = (select id from margaret_menus where slug = 'primary-nav')
  and url = '/#departments';

update margaret_menu_items
set url = '/doctors'
where menu_id = (select id from margaret_menus where slug = 'primary-nav')
  and url = '/#doctors';

insert into margaret_menu_items (menu_id, label, url, sort_order, status)
select m.id, v.label, v.url, v.sort_order, 'active'
from margaret_menus m
cross join (values
  ('Clinics', '/clinics', 3),
  ('Services', '/services', 4)
) as v(label, url, sort_order)
where m.slug = 'primary-nav';

-- Bump the news/contact anchors down to keep a sensible left-to-right order.
update margaret_menu_items set sort_order = 5 where menu_id = (select id from margaret_menus where slug = 'primary-nav') and url = '/#news';

update margaret_menu_items set sort_order = 6 where menu_id = (select id from margaret_menus where slug = 'primary-nav') and url = '/#contact';
