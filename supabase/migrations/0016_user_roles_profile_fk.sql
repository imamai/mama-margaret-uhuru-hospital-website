-- 0016: margaret_user_roles.user_id already references auth.users(id), but
-- PostgREST can't auto-detect the margaret_profiles <-> margaret_user_roles
-- relationship needed for nested embeds (e.g. "profiles(...user_roles(role))")
-- without a direct FK between the two margaret_ tables. Since
-- margaret_profiles.id IS auth.users(id) 1:1, adding this FK is safe and
-- enables that embed.

alter table margaret_user_roles
  add constraint fk_margaret_user_roles_profile
  foreign key (user_id) references margaret_profiles(id) on delete cascade;
