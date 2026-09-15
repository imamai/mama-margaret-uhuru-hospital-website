-- Named slots for the forms a tender requires back.
--
-- The RFQ template this hospital issues demands nine specific signed and
-- stamped forms — Form of Quotation, Price Schedule, Disclosure of Interest,
-- Certificate of Independent Quotation Determination, Self-Declaration, the
-- Confidential Business Questionnaire, SD1 and SD2 — and its own preliminary
-- examination disqualifies a bid that is missing any of them.
--
-- Until now a bid carried an unnamed pile of files. Nobody could tell whether
-- SD2 had been submitted without opening every attachment, so the system could
-- not support the evaluation it exists to run.
--
-- The fix is naming, not new machinery. A document the hospital publishes can
-- now be marked "the supplier must return this signed", and a returned file
-- points back at the slot it fills.

alter table margaret_tender_documents
  add column if not exists is_required_return boolean not null default false,
  add column if not exists sort_order integer not null default 0;

comment on column margaret_tender_documents.is_required_return is
  'The supplier must download this, sign and stamp it, and upload it back.';

alter table margaret_bid_documents
  add column if not exists document_type text,
  add column if not exists tender_document_id uuid
    references margaret_tender_documents (id) on delete set null,
  -- Bid returns move to their own bucket: what the hospital publishes and what
  -- a supplier sends back have different sensitivity and different retention,
  -- and they should not share a namespace. Rows written before this migration
  -- keep pointing at where their file actually is.
  add column if not exists bucket text not null default 'bid-documents';

update margaret_bid_documents set bucket = 'tender-documents' where created_at < now();

-- One file per slot per bid: re-uploading replaces rather than accumulates, so
-- the checklist cannot show a form as both missing and submitted twice.
create unique index if not exists margaret_bid_documents_slot_idx
  on margaret_bid_documents (bid_id, tender_document_id)
  where tender_document_id is not null;

create index if not exists margaret_tender_documents_tender_idx
  on margaret_tender_documents (tender_id, sort_order);

/* ------------------------------------------------------------- storage -- */

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bid-documents', 'bid-documents', false, 26214400,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

drop policy if exists "margaret_bid_documents_bucket_admin_manage" on storage.objects;
create policy "margaret_bid_documents_bucket_admin_manage" on storage.objects
  for all
  using (
    bucket_id = 'bid-documents'
    and (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  )
  with check (
    bucket_id = 'bid-documents'
    and (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  );

-- A supplier has an account, so this is narrower than the anonymous upload the
-- older private buckets still allow. They may write; only procurement reads.
drop policy if exists "margaret_bid_documents_bucket_supplier_upload" on storage.objects;
create policy "margaret_bid_documents_bucket_supplier_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'bid-documents');
