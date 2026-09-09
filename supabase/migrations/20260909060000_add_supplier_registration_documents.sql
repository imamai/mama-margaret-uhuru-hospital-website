-- Supplier registration documents (KRA PIN certificate, business
-- registration certificate, tax compliance certificate, etc.) uploaded at
-- signup time, mirroring the tender_documents / bid_documents pattern.

create table margaret_supplier_documents (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references margaret_suppliers(id) on delete cascade,
  document_type text not null check (document_type in ('kra_pin_certificate', 'business_registration_certificate', 'tax_compliance_certificate', 'other')),
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create index idx_margaret_supplier_documents_supplier on margaret_supplier_documents(supplier_id);

alter table margaret_supplier_documents enable row level security;

-- Public insert with check(true): mirrors margaret_suppliers_insert_public --
-- registration can happen before a session exists if email confirmation is
-- required, so this can't be gated on auth.uid().
create policy margaret_supplier_documents_insert_public on margaret_supplier_documents for insert with check (true);

create policy margaret_supplier_documents_read on margaret_supplier_documents for select
  using (
    exists (select 1 from margaret_suppliers s where s.id = supplier_id and s.user_id = auth.uid())
    or margaret_has_permission('tenders.manage') or margaret_is_super_admin()
  );

create policy margaret_supplier_documents_delete_admin on margaret_supplier_documents for delete
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

-- Storage bucket + policies, matching the job-attachments/tender-documents
-- private-bucket pattern from 0012_seed_data.sql.
insert into storage.buckets (id, name, public) values
  ('supplier-documents', 'supplier-documents', false)
on conflict (id) do nothing;

create policy "margaret_supplier_documents_bucket_public_upload"
  on storage.objects for insert
  with check (bucket_id = 'supplier-documents');

create policy "margaret_supplier_documents_bucket_admin_manage"
  on storage.objects for all
  using (bucket_id = 'supplier-documents' and (margaret_has_permission('tenders.manage') or margaret_is_super_admin()))
  with check (bucket_id = 'supplier-documents' and (margaret_has_permission('tenders.manage') or margaret_is_super_admin()));
