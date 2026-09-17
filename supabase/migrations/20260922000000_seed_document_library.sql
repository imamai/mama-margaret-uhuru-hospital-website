-- The standard RFQ forms, in the document library.
--
-- The hospital uploaded the full pack itself; these are the twelve individual
-- forms cut from it, so a tender can go out with only the forms it needs.
--
-- Their files ship with the site under /procurement rather than sitting in
-- Supabase storage, because that is the only way to put them there without a
-- person uploading each one by hand. Nothing else about them is special: they
-- are ordinary library rows, edited, reordered, deactivated or deleted from
-- Admin -> Document Library like any other. Replacing one through the admin
-- uploads the new file to storage in the normal way and leaves the shipped
-- copy unused.
--
-- Titles match the nine names the "Add standard RFQ forms" button uses, so a
-- tender that has these attached is not then offered the same form twice.
--
-- Matched on file_url so re-running changes nothing, and so a title the
-- hospital edits later is never overwritten.

insert into margaret_document_library (title, description, file_url, file_name, content_type, category, sort_order, status)
select * from (values
  (
    'Form of Quotation',
    'The tenderer''s offer and the declarations that go with it. Signed and stamped by the authorised signatory.',
    '/procurement/01-form-of-quotation.pdf',
    '01-form-of-quotation.pdf', 'application/pdf', 'rfq_form', 2, 'active'
  ),
  (
    'Price Schedule Form',
    'Schedule of Requirements priced by the tenderer: unit cost and total cost per item.',
    '/procurement/02-price-schedule-form.pdf',
    '02-price-schedule-form.pdf', 'application/pdf', 'rfq_form', 3, 'active'
  ),
  (
    'Table B — Quotation Submission Table',
    'The priced offer the Form of Quotation and the contract both refer to. Add rows to suit the requirement.',
    '/procurement/02b-quotation-submission-table-b.pdf',
    '02b-quotation-submission-table-b.pdf', 'application/pdf', 'rfq_form', 4, 'active'
  ),
  (
    'Schedule of Requirements — conformity to technical specifications',
    'Table A. The procuring entity fills in the items; the tenderer answers YES or NO against each specification.',
    '/procurement/03-schedule-of-requirements-technical-specifications.pdf',
    '03-schedule-of-requirements-technical-specifications.pdf', 'application/pdf', 'rfq_form', 5, 'active'
  ),
  (
    'Form for Disclosure of Interest',
    'Interest of the firm in the hospital, and the nine conflict-of-interest questions.',
    '/procurement/04-form-for-disclosure-of-interest.pdf',
    '04-form-for-disclosure-of-interest.pdf', 'application/pdf', 'rfq_form', 6, 'active'
  ),
  (
    'Certificate of Independent Quotation Determination',
    'Certifies the quotation was arrived at independently, with no consultation with a competitor.',
    '/procurement/05-certificate-of-independent-quotation-determination.pdf',
    '05-certificate-of-independent-quotation-determination.pdf', 'application/pdf', 'rfq_form', 7, 'active'
  ),
  (
    'Self-Declaration Form',
    'Declaration against corrupt, fraudulent and collusive practice, and against debarment.',
    '/procurement/06-self-declaration-form.pdf',
    '06-self-declaration-form.pdf', 'application/pdf', 'rfq_form', 8, 'active'
  ),
  (
    'Confidential Business Questionnaire (S33)',
    'The tenderer''s particulars: registration, address, directors and shareholding.',
    '/procurement/07-confidential-business-questionnaire.pdf',
    '07-confidential-business-questionnaire.pdf', 'application/pdf', 'rfq_form', 9, 'active'
  ),
  (
    'Form SD1 — not debarred under the Public Procurement and Asset Disposal Act',
    'Self-declaration that the bidder, its directors and subcontractors are not debarred under Part IV of the Act.',
    '/procurement/08-form-sd1.pdf',
    '08-form-sd1.pdf', 'application/pdf', 'rfq_form', 10, 'active'
  ),
  (
    'Form SD2 — no corrupt or fraudulent practice',
    'Self-declaration that the bidder will not engage in corrupt, fraudulent or coercive practice.',
    '/procurement/09-form-sd2.pdf',
    '09-form-sd2.pdf', 'application/pdf', 'rfq_form', 11, 'active'
  ),
  (
    'Contract Agreement and Conditions of Contract',
    'Part 3 of the pack: the agreement to be executed on award, and the conditions that govern it.',
    '/procurement/11-contract-agreement-and-conditions.pdf',
    '11-contract-agreement-and-conditions.pdf', 'application/pdf', 'contract', 12, 'active'
  ),
  (
    'Foreign Tenderer 40% Rule',
    'Attach only where a foreign tenderer may bid. Marked not applicable on the hospital''s standard quotations.',
    '/procurement/10-foreign-tenderer-40-percent-rule.pdf',
    '10-foreign-tenderer-40-percent-rule.pdf', 'application/pdf', 'rfq_form', 13, 'active'
  )
) as seed(title, description, file_url, file_name, content_type, category, sort_order, status)
where not exists (
  select 1 from margaret_document_library existing where existing.file_url = seed.file_url
);
