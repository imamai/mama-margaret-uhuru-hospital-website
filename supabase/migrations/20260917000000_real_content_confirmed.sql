-- Replace seeded sample content with the hospital's real content.
--
-- Source: MMUH_Website_Content_(w0updated.xlsx, returned by the hospital.
--
-- This migration carries ONLY the parts of that workbook that are unambiguous.
-- Departments, clinics, doctors, the gallery, news and events are all held back
-- because they need decisions the workbook does not answer — which department a
-- consultant belongs to, whether a blank "keep on site" means yes, where the
-- consultant schedule lives, and what to do about photographs that were never
-- sent. Guessing any of those would file real people under the wrong department
-- and be harder to unpick later than leaving them alone now.
--
-- Everything here is idempotent: run it twice and the second run changes
-- nothing. Sample rows are retired with deleted_at rather than deleted, so the
-- site stops showing them immediately and nothing is unrecoverable.

/* ------------------------------------------------------------- archive -- */

create table if not exists margaret_archive_seed_content (
  id          uuid primary key default gen_random_uuid(),
  archived_at timestamptz not null default now(),
  reason      text,
  payload     jsonb not null
);

alter table margaret_archive_seed_content enable row level security;

drop policy if exists "archive admin only" on margaret_archive_seed_content;
create policy "archive admin only" on margaret_archive_seed_content
  for all to authenticated
  using (margaret_is_super_admin())
  with check (margaret_is_super_admin());

insert into margaret_archive_seed_content (reason, payload)
select
  'Seeded sample content, before the hospital''s real content replaced it',
  jsonb_build_object(
    'stats',        (select jsonb_agg(to_jsonb(t)) from margaret_stats t),
    'testimonials', (select jsonb_agg(to_jsonb(t)) from margaret_testimonials t),
    'partners',     (select jsonb_agg(to_jsonb(t)) from margaret_partners t),
    'insurance',    (select jsonb_agg(to_jsonb(t)) from margaret_insurance_partners t),
    'awards',       (select jsonb_agg(to_jsonb(t)) from margaret_awards t),
    'events',       (select jsonb_agg(to_jsonb(t)) from margaret_events t),
    'settings',     (select jsonb_agg(to_jsonb(t)) from margaret_settings t)
  )
where not exists (
  select 1 from margaret_archive_seed_content
  where reason like 'Seeded sample content%'
);

/* --------------------------------------------------------------- stats -- */

-- The four labels already match the workbook, so these are corrections, not
-- new rows. Written exactly as the hospital gave them: the previous values
-- carried a "+" the workbook does not, and "1M+" overstated the real 86,940
-- by more than tenfold on the homepage.

update margaret_stats set value = '2',      updated_at = now() where label = 'Years of Service';
update margaret_stats set value = '450',    updated_at = now() where label = 'Bed Capacity';
update margaret_stats set value = '86,940', updated_at = now() where label = 'Outpatients Annually';
update margaret_stats set value = '11',     updated_at = now() where label = 'Specialist Doctors';

/* -------------------------------------------------------- testimonials -- */

-- All six carry written permission in the workbook.

update margaret_testimonials
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and patient_name in ('Jane K.', 'Samuel M.');

insert into margaret_testimonials (patient_name, quote, rating, sort_order, status)
select v.patient_name, v.quote, 5, v.sort_order, 'active'
from (values
  ('Phoebe Owino',    'The services are good, thank you for saving my baby, SHALOM!', 1),
  ('Kennedy Wambua',  'The hospital is very clean and the services are very good, next time I prefer to come again', 2),
  ('Peter',           'Excellent Services and the staff were very helpful', 3),
  ('Jose Kioko',      'I appreciate the medics for perfect services', 4),
  ('Sharon Odhiambo', 'I am satisfied with the services offered at Mama Margaret Uhuru Hospital, the doctors are very diligent with their work, I would like to give the hospital a five star rank. Great Services!', 5),
  ('Brian Kevin',     'Since my wife was admitted and discharged, the services offered were fantastic, thank you very much Mama Margaret hospital staff God Bless You!', 6)
) as v(patient_name, quote, sort_order)
where not exists (
  select 1 from margaret_testimonials t
  where t.patient_name = v.patient_name and t.deleted_at is null
);

/* ---------------------------------------------------------- insurance -- */

update margaret_insurance_partners
   set name = 'SHA (Social Health Authority)', updated_at = now()
 where name = 'SHA';

insert into margaret_insurance_partners (name, sort_order, status)
select 'APA Insurance', 2, 'active'
where not exists (
  select 1 from margaret_insurance_partners where lower(name) like 'apa%'
);

/* ----------------------------------------------------------- partners -- */

-- The four seeded rows are literally titled "Sample Partner".

update margaret_partners
   set status = 'inactive', updated_at = now()
 where name like 'Sample Partner%';

insert into margaret_partners (name, partner_type, sort_order, status)
select v.name, v.partner_type, v.sort_order, 'active'
from (values
  ('MSF',                       'ngo',      1),
  ('Jhpiego',                   'ngo',      2),
  ('UNICEF',                    'ngo',      3),
  ('CIHEB',                     'ngo',      4),
  ('KMTC',                      'academic', 5),
  ('Pumwani Maternity School',  'academic', 6)
) as v(name, partner_type, sort_order)
where not exists (
  select 1 from margaret_partners p where lower(p.name) = lower(v.name)
);

/* --------------------------------------------------- obvious placeholders -- */

-- These say "Sample ... Add Your Real ..." on a live hospital site. There is no
-- replacement in the workbook — the Awards sheet came back empty and the one
-- event has no date or venue — so the sections will be empty until the hospital
-- sends content. An empty section is better than a visible placeholder.

update margaret_awards
   set deleted_at = now(), updated_at = now()
 where deleted_at is null and title like 'Sample Award%';

update margaret_events
   set deleted_at = now(), updated_at = now()
 where deleted_at is null and title like 'Sample Event%';

/* ----------------------------------------------------------- settings -- */

-- emergency_phone matters most: the site has been publishing 999, which does
-- not reach this hospital. It renders in the header bar, the footer and the
-- emergency banner.

update margaret_settings set setting_value = to_jsonb('0794-416-498'::text),                       updated_at = now() where setting_key = 'emergency_phone';
update margaret_settings set setting_value = to_jsonb('Outering Road, Off Kamunde Road, Nairobi'::text), updated_at = now() where setting_key = 'address';
update margaret_settings set setting_value = to_jsonb('To be the premier institution for value-based healthcare services in Nairobi'::text), updated_at = now() where setting_key = 'vision';
update margaret_settings set setting_value = to_jsonb('To provide accessible, comprehensive, client-centred healthcare through equitable, quality, evidence-based and efficient services, supported by continuous improvement, innovation, training, research and strategic partnerships'::text), updated_at = now() where setting_key = 'mission';
