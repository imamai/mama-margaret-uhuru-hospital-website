-- The consultant clinic timetable.
--
-- The hospital runs named clinics on fixed days — Chest Clinic on Monday at
-- 08:00 with Mutuku, MOPC on Tuesday with Dr Obare, and eleven more. That
-- timetable is the single most useful thing on the clinics page for a patient
-- deciding which day to travel, and it had nowhere to live.
--
-- It is a table rather than a block of text on a page so the hospital can
-- change one line from the admin without re-typing the whole week, and so the
-- clinics page can show each clinic only its own days.
--
-- specialist_name is free text on purpose. Four of the consultants running
-- these clinics — Mutuku, Jane Kamau, Lilian, Dr Wambugu — are not on the
-- hospital's own doctors list, and a timetable that could only name doctors
-- with profiles would silently drop a third of the week. doctor_id links the
-- ones who do have profiles, so their pages can show the clinics they run.

create table if not exists margaret_clinic_schedule (
  id               uuid primary key default gen_random_uuid(),

  -- The clinic as the timetable names it. Kept even when clinic_id is set, so
  -- a row still reads correctly if a clinic is renamed or removed.
  clinic_label     text not null,
  clinic_id        uuid references margaret_clinics (id) on delete set null,

  day_of_week      smallint not null check (day_of_week between 1 and 7),
  start_time       time not null,
  end_time         time,

  specialist_name  text,
  specialist_role  text,
  doctor_id        uuid references margaret_doctors (id) on delete set null,

  room             text,
  notes            text,

  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references auth.users (id) on delete set null,
  updated_by       uuid references auth.users (id) on delete set null,
  status           text not null default 'published'
                     check (status in ('draft', 'published', 'archived')),
  deleted_at       timestamptz
);

-- One sitting per clinic per day per start time.
create unique index if not exists margaret_clinic_schedule_slot_idx
  on margaret_clinic_schedule (lower(clinic_label), day_of_week, start_time)
  where deleted_at is null;

create index if not exists margaret_clinic_schedule_day_idx
  on margaret_clinic_schedule (day_of_week, start_time)
  where deleted_at is null;

-- Row-level security, the updated_at trigger and the five standard policies,
-- under the permission the clinics screens already use. Anyone who can edit a
-- clinic can edit its timetable; nobody new has to be granted anything.
select margaret_bootstrap_content_table('margaret_clinic_schedule', 'clinics');
