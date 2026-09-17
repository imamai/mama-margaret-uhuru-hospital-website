-- A library of documents procurement can reuse, instead of browsing the PC
-- for the same forms on every tender.
--
-- The nine standard RFQ forms, the conditions of contract, the confidential
-- business questionnaire: the same files go out with tender after tender. They
-- are uploaded once here and attached to a tender by ticking a box, with
-- "select all" for the usual pack. Uploading a fresh file from the PC stays,
-- for anything specific to one tender.
--
-- Attaching copies the file's address onto the tender rather than pointing at
-- the library row. That matters in procurement: what was published with a
-- tender must stay exactly what was published, so replacing a form in the
-- library next year cannot quietly rewrite what last year's bidders were sent.
-- library_document_id records where it came from, and nothing more.

create table if not exists margaret_document_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_name text,
  file_size bigint,
  content_type text,
  -- Loose on purpose: procurement names its own groupings over time.
  category text not null default 'rfq_form',
  sort_order integer not null default 0,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  deleted_at timestamptz
);

comment on table margaret_document_library is
  'Reusable procurement documents. Attached to tenders by copying the file address, so a published tender never changes when the library does.';

create index if not exists idx_margaret_document_library_active
  on margaret_document_library (category, sort_order)
  where deleted_at is null;

alter table margaret_document_library enable row level security;

-- Not public: this is procurement's cupboard. What a supplier sees is the copy
-- attached to a tender, which is published with that tender.
drop policy if exists margaret_document_library_read on margaret_document_library;
create policy margaret_document_library_read
  on margaret_document_library for select
  using (margaret_has_permission('tenders.view') or margaret_is_super_admin());

drop policy if exists margaret_document_library_write on margaret_document_library;
create policy margaret_document_library_write
  on margaret_document_library for all
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

-- Provenance only. Null for a file uploaded straight onto the tender, and set
-- to null rather than cascading if the library row is later removed, because
-- the tender's own copy must survive.
alter table margaret_tender_documents
  add column if not exists library_document_id uuid
    references margaret_document_library(id) on delete set null;
