-- Careers and Tenders each get their own place in the primary navigation,
-- alongside News and Contact, and the "Get Involved" group that held them goes.
--
-- Order matters: menu items cascade on delete, so the two children are moved
-- to the top level before their parent is removed. Matched by URL rather than
-- id, so this is safe on any copy of the database and a no-op when re-run.
--
-- Resulting order: Home, About, Medical Care, Patients, News, Careers,
-- Tenders, Contact. All of it stays editable under Admin → Menus.

with nav as (select id from margaret_menus where slug = 'primary-nav')
update margaret_menu_items i
   set parent_id = null,
       sort_order = case i.url when '/careers' then 6 else 7 end,
       updated_at = now()
  from nav
 where i.menu_id = nav.id
   and i.url in ('/careers', '/tenders');

with nav as (select id from margaret_menus where slug = 'primary-nav')
delete from margaret_menu_items i
 using nav
 where i.menu_id = nav.id
   and i.label = 'Get Involved'
   and i.url is null
   and not exists (select 1 from margaret_menu_items c where c.parent_id = i.id);

with nav as (select id from margaret_menus where slug = 'primary-nav')
update margaret_menu_items i
   set sort_order = 8, updated_at = now()
  from nav
 where i.menu_id = nav.id
   and i.parent_id is null
   and i.url = '/contact';
