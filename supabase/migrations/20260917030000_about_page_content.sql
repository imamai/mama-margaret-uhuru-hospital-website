-- The About page: history, motto, quality statement and core values.
--
-- All four were supplied in the hospital's workbook and none had anywhere to
-- go. They belong on the About page rather than in settings, because that page
-- already renders a content body the hospital can edit from the admin.
--
-- The source text needed a read. What follows is a best reading: spelling,
-- capitalisation, punctuation and grammar corrected, every fact left exactly as
-- the hospital stated it. The corrections are listed here so they can be
-- checked against the workbook rather than taken on trust:
--
--   "ama margaret uhuru hospital"     -> "Mama Margaret Uhuru Hospital"
--   "latter unveiled"                 -> "later unveiled"
--   "stalled for 30yrs"               -> "stalled for 30 years"
--   "alevel 6"                        -> "a Level 6"
--   "the national govermrnformely"    -> "the national government formally"
--   "governour"                       -> "Governor"
--   "turning it in to"                -> "turning it into"
--   "broader populaion"               -> "broader population"
--   "promotative"                     -> "promotive"
--   "safety, dignity ... is a priority" -> "are our priority"
--   "Compassionate" (as a value name) -> "Compassion", for parallel with the others
--
-- Two things were left alone because they are the hospital's to settle, not
-- ours to guess:
--
--   * The services sentence listed "preventive" twice. The duplicate is
--     dropped; nothing else about the list is changed.
--   * The text says the hospital is a Level 5 facility and that it was
--     originally established as a Level 6 paediatric annex. Both statements are
--     kept as written — the change of level is plausible given the handover
--     from Kenyatta National Hospital to the county, but it reads as a
--     contradiction and is worth confirming.
--
-- The quality statement opened with a quotation mark that was never closed, so
-- a sentence may be missing from the end of it. It is published closed, as it
-- stands, and flagged.

update margaret_pages
   set content = $json${
  "blocks": [
    { "type": "paragraph", "data": { "text": "Mama Margaret Uhuru Hospital is a Level 5 facility located along Outering Road, off Kamunde Road. It is situated in Embakasi North Sub-County, within Kariobangi Ward. The facility serves as a main referral hospital in Nairobi County and beyond." } },
    { "type": "paragraph", "data": { "text": "The hospital has a bed capacity of 450 and 260 staff, and is expected to serve a catchment population of 203,509." } },

    { "type": "header", "data": { "level": 2, "text": "Our history" } },
    { "type": "paragraph", "data": { "text": "The facility was officially opened on 18th March 2022 as a paediatric hospital under Kenyatta National Hospital, and was later unveiled by Nairobi City County on 14th June 2024. Construction originally began in 1990 but stalled for 30 years due to severe administrative challenges. It was named Mama Margaret Uhuru Hospital in honour of the First Lady." } },
    { "type": "paragraph", "data": { "text": "The facility was originally established as a Level 6 paediatric hospital, managed as an annex of Kenyatta National Hospital. In a major administrative shift, the national government formally handed the facility over to the Nairobi City County Government. The County Governor, Johnson Sakaja, subsequently expanded its scope, turning it into a general hospital serving a broader population." } },

    { "type": "header", "data": { "level": 2, "text": "Our services" } },
    { "type": "paragraph", "data": { "text": "The hospital provides preventive, promotive, curative, inpatient and rehabilitative services. We are home to a dedicated and experienced medical team that combines advanced expertise with compassionate patient care." } },

    { "type": "header", "data": { "level": 2, "text": "Our motto" } },
    { "type": "paragraph", "data": { "text": "Huduma Bora, Jamii Imara" } },

    { "type": "header", "data": { "level": 2, "text": "Quality statement" } },
    { "type": "paragraph", "data": { "text": "Our hospital is committed to providing world-class, client-centred care where the safety, dignity and well-being of our patients are our priority. In line with the Constitution of Kenya 2010, and in steadfast support of Kenya's Universal Health Coverage vision, we will deliver accessible, equitable and exceptional healthcare, driven by evidence-based standards. We pledge to protect patient trust through secure digital health innovations, empower our communities through robust Primary Care Networks, and foster a culture of continuous improvement." } },

    { "type": "header", "data": { "level": 2, "text": "Our core values" } },
    { "type": "list", "data": { "style": "ordered", "items": [
      "Professionalism — competence, discipline, and respect for the roles we hold",
      "Teamwork — one multidisciplinary family working toward shared outcomes",
      "Integrity — upholding the highest ethical standards, transparency, and honesty in every service",
      "Accountability and Transparency — taking ownership of our actions, resources and patient outcomes, maintaining open communication and trustworthy stewardship of public health resources",
      "Compassion — treating every patient with empathy, dignity and respect"
    ] } }
  ]
}$json$::jsonb,
       updated_at = now()
 where slug = 'about';

-- The page already exists and is published, but create it if that ever changes
-- so this migration does not silently do nothing.
insert into margaret_pages (slug, title, content, status)
select 'about', 'About Us', '{"blocks": []}'::jsonb, 'published'
where not exists (select 1 from margaret_pages where slug = 'about');
