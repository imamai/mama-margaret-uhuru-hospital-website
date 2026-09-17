-- Take every piece of invented content off the site.
--
-- The hospital's instruction: real content only, and where there is none yet,
-- leave it blank to be filled later. So everything that was seeded to make the
-- site look populated at launch is retired here.
--
-- Every row is named explicitly. None of this is matched by pattern: on a live
-- hospital site, "anything that looks like a sample" is too loose a rule to act
-- on, and a real department that happened to share a word with a seeded one
-- would disappear. Each is soft-deleted, so it leaves the site and the admin
-- lists immediately but can still be restored, and all of it is archived first.
--
-- Kept deliberately:
--   * Dr. Job Okemwa — seeded, but renamed to a real consultant, and the
--     hospital asked for him to stay. His address is corrected below.
--   * The two published homepage slides. Their photographs are the hospital's
--     own uploads; only the headlines are generic, and removing them would leave
--     the homepage with no hero at all.
--   * Site structure — menus, roles, permissions, homepage layout. That is
--     plumbing, not content.

insert into margaret_archive_seed_content (reason, payload)
select
  'Sample content retired at the hospital''s request, 17 September 2026',
  jsonb_build_object(
    'departments', (select jsonb_agg(to_jsonb(t)) from margaret_departments t
                     where slug in ('cardiology','emergency-medicine','oncology','paediatrics','surgery','maternity')),
    'clinics',     (select jsonb_agg(to_jsonb(t)) from margaret_clinics t
                     where slug in ('cardiac-care-clinic','oncology-cancer-care-clinic','paediatric-growth-wellness-clinic')),
    'services',    (select jsonb_agg(to_jsonb(t)) from margaret_services t where deleted_at is null),
    'gallery',     (select jsonb_agg(to_jsonb(t)) from margaret_gallery t where file_url like '/placeholders/%'),
    'hero_slides', (select jsonb_agg(to_jsonb(t)) from margaret_hero_slides t where title like '%placeholder%'),
    'news',        (select jsonb_agg(to_jsonb(t)) from margaret_news t where title = 'Hospital Launches New Maternity Wing'),
    'jobs',        (select jsonb_agg(to_jsonb(t)) from margaret_jobs t where title = 'Registered Nurse - Emergency Department'),
    'tenders',     (select jsonb_agg(to_jsonb(t)) from margaret_tenders t where title in ('dqadwwqw','fdsghsrgs')),
    'pages',       (select jsonb_agg(to_jsonb(t)) from margaret_pages t where slug = 'patients'),
    'doctors',     (select jsonb_agg(to_jsonb(t)) from margaret_doctors t where full_name = 'Dr. Job Okemwa')
  )
where not exists (
  select 1 from margaret_archive_seed_content where reason like 'Sample content retired%'
);

/* ---------------------------------------------------------- departments -- */

-- Seeded before the hospital sent its list. Three overlap real departments —
-- Emergency Medicine with Accident and Emergency, Paediatrics with Paediatric
-- Ward, Surgery with Surgical Ward — so patients were seeing both. "Medical
-- Records" is a renamed seed that still carries the address /oncology.
update margaret_departments
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and slug in ('cardiology', 'emergency-medicine', 'oncology', 'paediatrics', 'surgery');

-- Maternity is real, but its description was the seed's, kept only because the
-- workbook left the cell blank. Blank until the hospital writes one.
update margaret_departments
   set description = null, updated_at = now()
 where slug = 'maternity'
   and description = 'Comprehensive antenatal, delivery, postnatal and NICU services.';

/* -------------------------------------------------------------- clinics -- */

update margaret_clinics
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and slug in ('cardiac-care-clinic', 'oncology-cancer-care-clinic', 'paediatric-growth-wellness-clinic');

/* ------------------------------------------------------------- services -- */

-- All four were seeded; none came from the hospital.
update margaret_services
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and name in ('Complete Blood Count (CBC)', 'Full Body Ultrasound',
                'General Outpatient Consultation', 'Specialist Consultation');

/* -------------------------------------------------------------- gallery -- */

-- Stock photographs bundled with the site, not pictures of this hospital.
update margaret_gallery
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and file_url like '/placeholders/gallery-%';

/* ---------------------------------------------------------- hero slides -- */

update margaret_hero_slides
   set deleted_at = now(), updated_at = now()
 where deleted_at is null
   and title in ('New Slide 1 (placeholder — edit me)', 'New Slide 2 (placeholder — edit me)');

/* --------------------------------------------------------- news & jobs -- */

-- The hospital has not launched a new maternity wing; the story was invented.
update margaret_news
   set deleted_at = now(), updated_at = now()
 where deleted_at is null and title = 'Hospital Launches New Maternity Wing';

update margaret_jobs
   set deleted_at = now(), updated_at = now()
 where deleted_at is null and title = 'Registered Nurse - Emergency Department';

/* -------------------------------------------------------------- tenders -- */

-- Test entries made while building the bid checklist, published on the live
-- tenders page. Their test bids stay attached and recoverable.
update margaret_tenders
   set deleted_at = now(), updated_at = now()
 where deleted_at is null and title in ('dqadwwqw', 'fdsghsrgs');

/* ---------------------------------------------------------------- pages -- */

-- Patient Information was written for the template, not by the hospital:
-- generic visiting hours, an ICU the workbook never mentions, card payments.
-- The page stays so its link keeps working, with an empty body until real
-- content is supplied.
update margaret_pages
   set content = '{"blocks": []}'::jsonb, updated_at = now()
 where slug = 'patients';

/* -------------------------------------------------------------- doctors -- */

-- Kept, but his profile address was still the seed's /doctors/amina-njoroge.
update margaret_doctors
   set slug = 'dr-job-okemwa', updated_at = now()
 where full_name = 'Dr. Job Okemwa'
   and slug = 'amina-njoroge'
   and not exists (select 1 from margaret_doctors where slug = 'dr-job-okemwa');
