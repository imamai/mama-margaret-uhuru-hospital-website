-- 0018: Careers now has real routes (Phase 3) — add it to the primary nav.

insert into margaret_menu_items (menu_id, label, url, sort_order, status)
select m.id, 'Careers', '/careers', 5, 'active'
from margaret_menus m
where m.slug = 'primary-nav';

update margaret_menu_items set sort_order = 6 where menu_id = (select id from margaret_menus where slug = 'primary-nav') and url = '/#news';

update margaret_menu_items set sort_order = 7 where menu_id = (select id from margaret_menus where slug = 'primary-nav') and url = '/#contact';
