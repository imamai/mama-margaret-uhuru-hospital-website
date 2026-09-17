-- Put every department description into one format.
--
-- They arrived in five: bullets marked "•", "-", "*", ".", numbered lists, and
-- bare lines with no marker at all. Some opened with a heading repeating the
-- department's own name, some ended mid-sentence, and two were pasted out of a
-- chat window -- Orthopaedics opened "This is the department that handles your
-- kind of problem", addressing one person rather than the hospital's visitors,
-- and Farewell Services was framed as an answer ("Here are its full roles",
-- "In short: ..."). The detail page printed all of it as pre-wrapped text, so
-- no list was ever a list.
--
-- Every description now follows the same shape:
--
--   an opening paragraph saying what the department does
--   ### a section heading, only where the content genuinely divides
--   - a service, one per line, "- Term -- detail" where a term carries detail
--
-- That is the syntax the page editor already uses, so the admin textarea is
-- the same to write in here as it is on About, and the site renders it through
-- the same component.
--
-- Facts are the hospital's throughout: nothing is added, and nothing is
-- dropped except the chat framing and one duplicated heading line. Spelling
-- and grammar are corrected. Three corrections are judgements rather than
-- typos, and are listed so they can be checked:
--
--   "complimentary feeding"  -> "complementary feeding" (the IYCF term)
--   "antihelmiths"           -> "deworming (anthelmintics)"
--   "PdHear"                 -> "Positive Deviance Hearth", the malnutrition
--                               approach the abbreviation appears to name
--
-- The six departments with no description -- Dental Services, Maternity,
-- Medical Ward, Newborn Unit, Paediatric Ward, Surgical Ward -- stay blank,
-- to be written when the hospital sends them.

-- The hospital's original wording, kept recoverable: this migration rewrites
-- text people in those departments wrote themselves.
insert into margaret_archive_seed_content (reason, payload)
select
  'Department descriptions before reformatting, 18 September 2026',
  (select jsonb_agg(jsonb_build_object('slug', slug, 'description', description))
     from margaret_departments
    where deleted_at is null and coalesce(description, '') <> '')
where not exists (
  select 1 from margaret_archive_seed_content where reason like 'Department descriptions before reformatting%'
);

update margaret_departments set description = $d$The Accident and Emergency Department operates 24 hours a day and provides immediate, life-saving care to patients with acute illness, severe injuries or sudden medical trauma.$d$, updated_at = now() where slug = 'accident-and-emergency';

update margaret_departments set description = $d$The Biomedical Engineering Department is responsible for the management, maintenance, safety and optimal functioning of medical equipment and health technologies in the hospital. It supports clinical departments so that care stays reliable and safe.

### Services
- Equipment installation
- Preventive and corrective maintenance
- Calibration
- User training
- Technical assessment
- Equipment lifecycle management$d$, updated_at = now() where slug = 'biomedical-engineering';

update margaret_departments set description = $d$The Comprehensive Care Clinic provides HIV care and treatment, together with the laboratory investigations needed to monitor it.

### Services
- Care and treatment
- HIV testing, including provider-initiated testing and counselling (PITC)
- CD4 count
- Viral load
- Adherence treatment$d$, updated_at = now() where slug = 'comprehensive-care-clinic';

update margaret_departments set description = $d$The mortuary has a larger role than keeping bodies: it is part of patient care, of the law and of public health. It protects the dignity of the dead, gives families answers about the cause of death, protects the living from infection and serves the courts.

### What the department does
- Preservation of bodies — kept at 2–4 °C to delay decomposition until the family collects the body or burial is arranged, with freezer storage at −10 to −20 °C for unidentified bodies and long stays
- Identification and documentation — bodies are received from the ward with proper tags, and the time of death, ward and patient details are recorded, so that identification is correct and mix-ups are avoided. A mortuary register is kept, as the law requires
- Family support and viewing — a dignified, private place for families to view and identify a loved one, with social work and security supporting the bereaved
- Post-mortem examination — clinical autopsies with the family's consent, to establish the true cause of death, and medico-legal autopsies for deaths that are sudden, unnatural, accidental, suicide, homicide or unknown, which the law requires for the police and the courts
- Medico-legal work — working with the police, the DCI and the pathologist, preserving evidence such as clothes, bullets and samples, and storing unclaimed or unidentified bodies while relatives are traced
- Infection control — safe handling of highly infectious bodies, including TB, COVID-19 and haemorrhagic fevers, with proper disinfection and waste disposal, so that staff and the community are protected
- Release and disposal — release to the family with a mortuary release form and burial permit. Unclaimed bodies are buried by the county after the legal waiting period and a court order
- Teaching and research — training medical students, nurses and morticians$d$, updated_at = now() where slug = 'farewell-services';

update margaret_departments set description = $d$Health Information Systems is the backbone of patient data management at the hospital. The department tracks performance indicators, interprets and shares them, and uses them to inform decisions.

### What the department does
- Records management
- Clinical coding of diseases
- Coordination of data systems (EMR) — overseeing deployment of the system and troubleshooting errors
- Data protection — keeping the department's work in accordance with the Data Protection Act (2019)
- Vital statistics — processing all birth and death notifications occurring in the hospital
- Teaching — hosting students on attachment and internship programmes$d$, updated_at = now() where slug = 'health-information-systems';

update margaret_departments set description = $d$The Laboratory at MMUH provides comprehensive diagnostic testing to support accurate diagnosis, treatment and patient management. It operates 24 hours a day, seven days a week, so that inpatients, outpatients and emergencies have timely access to critical diagnostic services.

We are committed to quality and patient safety. The laboratory is implementing a robust Quality Management System (QMS) in line with international standards, as part of our journey towards full laboratory accreditation.

### Services
- Haematology — full blood count, erythrocyte sedimentation rate (ESR), coagulation profile
- Blood transfusion services — blood grouping, crossmatching, direct Coombs test, indirect Coombs test, Du test
- Parasitology — stool for ova and cysts, salmonella antigen (SAT), faecal occult blood (FOB), V. cholerae antigen, blood slide for malaria parasites, VDRL, rheumatoid factor, ASOT, serum CrAg, CSF CrAg, urinalysis
- Routine clinical chemistry — serum albumin, alkaline phosphatase, alanine aminotransferase, aspartate aminotransferase, calcium, gamma-glutamyl transferase, glucose, HDL cholesterol, LDL cholesterol, magnesium, phosphorus, total bilirubin, total cholesterol, triglycerides, total protein, total protein in urine and CSF, uric acid, urea and creatinine, urine multi-drug toxicology screening
- Immunoassays and serology — thyroid function tests (TFTs), HbA1c, HBsAg, HAV, HCV
- Microbiology — Gram stain, Ziehl-Neelsen (ZN), wet preparation, urine microscopy, India ink, cell count, CSF and serum CrAg, ASOT, Helicobacter pylori, GeneXpert and TB LAM, CSF analysis
- HIV testing services — viral load, CD4 count and early infant diagnosis (EID)

Our team of qualified and experienced laboratory personnel is dedicated to delivering accurate, reliable and timely results.$d$, updated_at = now() where slug = 'laboratory-services';

update margaret_departments set description = $d$The Medical Social Work Department provides psychosocial, emotional and socioeconomic support to patients and their families, with a focus on vulnerable clients.

### Services
- Social assessments
- Counselling
- Case management
- Referrals
- Discharge planning
- Linkage to community support services$d$, updated_at = now() where slug = 'medical-social-work';

update margaret_departments set description = $d$The Mother, Child Health and Family Planning (MCH/FP) Department provides integrated health services that promote the health and well-being of women, mothers, newborns, children and families. The department focuses on prevention, early detection, treatment, health education and appropriate referrals.

### Services
- Antenatal and postnatal care
- Safe delivery and maternity services
- Newborn and child health services
- Immunisation
- Growth monitoring and nutrition services
- Family planning and reproductive health services
- Prevention and management of maternal and child illnesses
- Health education and counselling
- Referral and follow-up of clients requiring specialised care

The overall goal is to reduce maternal, newborn and child illness and death, while promoting healthy families and responsible reproductive choices.$d$, updated_at = now() where slug = 'mother-child-health-family-planning';

update margaret_departments set description = $d$Proper nutrition during a hospital stay shortens recovery, prevents complications and builds immune resilience, so nutrition care runs alongside medical treatment in the wards and in our outpatient clinics.

### Inpatient clinical nutrition
- Nutritional assessment and care planning — universal screening of patients on admission, to identify, prevent and treat malnutrition
- Critical care and specialised nutrition — precise enteral (tube feeding) and nutrition regimens for patients in the medical and surgical wards
- Therapeutic hospital menus — meals produced with our hospitality department and customised to specific therapeutic needs, such as low-sodium, texture-modified and diabetic diets
- Pre- and post-operative nutritional optimisation — building nutrient reserves before major surgery, and managing diet through post-surgical recovery

### Outpatient nutrition and dietetic clinics
- Metabolic and lifestyle diseases — diet plans to reverse, manage or stall the progression of type 2 diabetes, hypertension and similar conditions
- Gastrointestinal and food allergy care — practical dietary tracking for conditions such as irritable bowel syndrome (IBS), peptic ulcers and food intolerances
- Sustainable weight management — scientific, practical programmes for healthy weight loss or weight gain, tailored to the individual

### Maternal, infant and child nutrition
- Prenatal and gestational support — nutritional tracking for expectant mothers, covering acceptable gestational weight gain and the prevention and management of nutritional deficiencies, gestational diabetes and eclampsia
- Infant and young child feeding (IYCF) — one-to-one support for exclusive breastfeeding through the first six months, management of breastfeeding difficulties, and complementary feeding from 6 to 59 months for growth and development
- Growth monitoring and promotion — including vitamin A supplementation and deworming (anthelmintics)
- Malnutrition clinic (OTC) — management of acute malnutrition and rehabilitation through personalised nutrition counselling, therapeutic feeds and approaches such as Positive Deviance Hearth

One-to-one counselling and long-term monitoring are available to walk-in patients and to medical referrals.$d$, updated_at = now() where slug = 'nutrition-clinic';

update margaret_departments set description = $d$The Occupational Therapy Department at MMUH helps patients regain independence in the activities of everyday life.

### Services
- Activities of daily living training — helping people regain independence in feeding, toileting, bathing, dressing and grooming
- Neonatal screening — identifying and diagnosing needs early, and scheduling timely follow-up for babies born in or referred to our facility
- Paediatric care — assessment and play-based therapy for children with physical, cognitive, developmental and learning challenges
- Assistive devices — assessing, recommending and fabricating splints and custom-made adaptive tools to aid mobility and function$d$, updated_at = now() where slug = 'occupational-therapy';

update margaret_departments set description = $d$The Eye Department provides screening, treatment and referral for conditions affecting the eyes.

### Services
- Screening
- Treatment
- Screening for patients with diabetes and hypertension
- Informed referrals
- Spectacle prescription
- Student mentorship and training
- Health education$d$, updated_at = now() where slug = 'ophthalmology';

update margaret_departments set description = $d$The Orthopaedic Technology Department at Mama Margaret Uhuru Hospital provides specialised, patient-centred services in the assessment, design, fabrication, fitting and maintenance of prosthetic and orthotic devices, and of other supportive assistive devices, for people with physical disabilities and conditions affecting movement and function. Customised solutions and follow-up help improve mobility, function, comfort, independence and quality of life.

### Conditions we manage
- Bow legs
- Clubfoot
- Diabetic foot
- Post-polio paralysis
- Limb loss
- Foot and ankle deformities
- Other musculoskeletal and neurological conditions$d$, updated_at = now() where slug = 'orthopaedic-technology';

update margaret_departments set description = $d$The Orthopaedic and Trauma Department treats injuries and conditions of the bones, joints and spine — fractures, joint injuries, road traffic accidents, falls and back pain.

### Services
- Trauma — fractures, dislocations, open wounds, road traffic and boda boda injuries and falls, with 24-hour casualty cover
- Spine — back pain, tingling, sciatica, disc problems, screening for TB of the spine, and referral for MRI
- Orthopaedics — arthritis, bone infections, clubfoot clinic, casting and plaster, and minor orthopaedic surgery
- Rehabilitation — working with Physiotherapy on back exercises, traction and post-operative rehabilitation$d$, updated_at = now() where slug = 'orthopaedics-trauma';

update margaret_departments set description = $d$The Pharmacy Department at Mama Margaret Uhuru Hospital is committed to ensuring safe, effective and affordable access to medicines for all patients. We support clinical care through accurate dispensing, patient counselling and close collaboration with doctors, nurses and staff across all departments.

### Drug availability
- Over 90% availability of essential medicines, as per the Kenya Essential Medicines List
- All tracer medicines for maternity, paediatrics, non-communicable diseases and emergency care in stock

### Clinical services
- 24-hour dispensing for inpatient and outpatient services
- Daily ward rounds and prescription review in the medical, paediatric, surgical and maternity wards
- Patient medication counselling for chronic illnesses, TB and HIV
- Dose adjustment and drug interaction checks
- Antimicrobial stewardship support

### Safety and quality
- Every prescription screened for errors and interactions
- Monthly expiry audits, with no expired drugs on active shelves
- Proper cold-chain maintenance for insulin and other medicines needing cold storage
- Reporting of adverse drug reactions and poor-quality medicines to the Pharmacy and Poisons Board
- Strict control of narcotics and controlled substances (DDA)

### Updates and alerts
- Antibiotic prescribing guidelines implemented to reduce antimicrobial resistance (AMR)
- All patients are advised to carry a valid prescription for refills$d$, updated_at = now() where slug = 'pharmacy-services';

update margaret_departments set description = $d$“Healing through motion, empowering recovery.” At Mama Margaret Uhuru Hospital, our Physiotherapy Department is dedicated to helping patients regain strength, mobility and independence. Through personalised care and evidence-based practice, we support recoveries that restore confidence and improve quality of life. Services are offered on both an inpatient and an outpatient basis.

### Services
- Musculoskeletal rehabilitation — restoring function and reducing the pain of muscle, ligament and soft tissue injuries
- Neurological physiotherapy — for disorders affecting the brain, spinal cord and nervous system
- Paediatric physiotherapy — developmental delays, movement and posture correction
- Sports physiotherapy — injury prevention, rehabilitation and performance training for athletes
- Geriatric physiotherapy — healthy ageing, with mobility, balance and fall prevention
- Post-surgical care — recovery after surgery, preventing complications, and scar mobilisation
- Women's health physiotherapy — pelvic floor rehabilitation, prenatal and postnatal care, and menopause-related support
- Disability assessment — specialised physical assessments carried out with other departments
- Training, research and continuous medical education (CME) — staff development contributing to evidence-based physiotherapy practice$d$, updated_at = now() where slug = 'physiotherapy';

update margaret_departments set description = $d$The Radiology Department is a specialised medical unit that uses imaging technology to diagnose and treat disease. Our radiologists, radiographers and support staff are committed to patient safety, quality imaging and precise diagnosis.

### Services
- X-ray
- Ultrasound$d$, updated_at = now() where slug = 'radiology-services';

update margaret_departments set description = $d$Tumaini Clinic provides specialised support and services to clients affected by sexual and gender-based violence (SGBV).

### Services
- Counselling
- Referral
- Follow-up
- Coordination of appropriate care$d$, updated_at = now() where slug = 'sgbv-centre-tumaini-clinic';

update margaret_departments set description = $d$Supply Chain Management keeps the hospital supplied, so that essential medicines, consumables, equipment and services are available when they are needed.$d$, updated_at = now() where slug = 'supply-chain-management';
