-- Mama Margaret Uhuru Hospital Website (edos_website)
-- 0001: Extensions and shared helper functions used by every margaret_ table.

create extension if not exists pgcrypto;

create extension if not exists citext;

-- Shared trigger: keeps updated_at current on every margaret_ table.
create or replace function margaret_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function margaret_set_updated_at() is
  'Shared BEFORE UPDATE trigger that stamps updated_at = now() on margaret_ tables.';
