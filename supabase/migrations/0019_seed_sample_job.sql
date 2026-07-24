-- 0019: One sample job posting so the Careers page has content to verify
-- against immediately. Safe to edit/delete via the admin CMS.

insert into margaret_jobs (
  title, slug, department_id, location, contract_type, qualifications,
  experience_required, responsibilities, salary_range, description,
  application_deadline, positions_available, status
)
select
  'Registered Nurse - Emergency Department',
  'registered-nurse-emergency-department',
  d.id,
  'Nairobi, Kenya',
  'full_time',
  'Diploma or Bachelor''s degree in Nursing; valid Nursing Council of Kenya license.',
  '2+ years in emergency or critical care nursing.',
  'Provide direct patient care in the emergency department, triage incoming patients, collaborate with the multidisciplinary care team, and maintain accurate patient records.',
  'Competitive, based on experience',
  'We are looking for a compassionate, skilled Registered Nurse to join our Emergency Department, providing high-quality, patient-centred care around the clock.',
  (current_date + interval '30 days')::date,
  2,
  'published'
from margaret_departments d
where d.slug = 'emergency-medicine'
on conflict (slug) do nothing;
