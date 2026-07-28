-- 0022: Lets admins choose which part of a hero photo stays in frame when it's
-- cropped to fill the banner (object-position), instead of always centering.

alter table margaret_hero_slides
  add column focal_point text not null default 'center'
    check (focal_point in (
      'left top', 'top', 'right top',
      'left', 'center', 'right',
      'left bottom', 'bottom', 'right bottom'
    ));
