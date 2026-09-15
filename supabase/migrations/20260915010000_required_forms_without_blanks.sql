-- A required form does not always come with a blank to download.
--
-- The RFQ pack this hospital issues is a single PDF containing all nine forms
-- the supplier must sign and return. Procurement cannot upload nine separate
-- blanks, but they still need nine named slots back — otherwise the supplier
-- sees one "choose files" box and has no idea what is being asked of them,
-- which is exactly what happened.
--
-- So a tender document may now declare a required form by name alone. Attach a
-- blank later if there is one; the slot works either way.

alter table margaret_tender_documents alter column file_url drop not null;

comment on column margaret_tender_documents.file_url is
  'Null when this row only names a form the supplier must return — the blank '
  'lives inside the RFQ pack rather than as its own upload.';
