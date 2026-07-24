-- 0007: Procurement portal — tenders, documents, clarifications, addenda,
-- awards, supplier registration, and bid submissions.

create table margaret_supplier_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

select margaret_bootstrap_lookup_table('margaret_supplier_categories', 'tenders');

create table margaret_suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  registration_number text,
  category_id uuid references margaret_supplier_categories(id) on delete set null,
  contact_person text not null,
  email text not null,
  phone text not null,
  address text,
  kra_pin text,
  documents text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  deleted_at timestamptz
);

create index idx_margaret_suppliers_category on margaret_suppliers(category_id);

create index idx_margaret_suppliers_status on margaret_suppliers(status);

create trigger trg_margaret_suppliers_updated_at
  before update on margaret_suppliers
  for each row execute function margaret_set_updated_at();

alter table margaret_suppliers enable row level security;

create policy margaret_suppliers_insert_public on margaret_suppliers for insert with check (true);

create policy margaret_suppliers_read on margaret_suppliers for select
  using (auth.uid() = user_id or margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create policy margaret_suppliers_update on margaret_suppliers for update
  using (auth.uid() = user_id or margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (auth.uid() = user_id or margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create policy margaret_suppliers_delete_admin on margaret_suppliers for delete
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_tenders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  tender_number text not null unique,
  category_id uuid references margaret_supplier_categories(id) on delete set null,
  description text,
  eligibility text,
  closing_date timestamptz not null,
  opening_date timestamptz,
  evaluation_stage text not null default 'not_started'
    check (evaluation_stage in ('not_started', 'technical', 'financial', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'awarded', 'cancelled')),
  deleted_at timestamptz
);

create index idx_margaret_tenders_slug on margaret_tenders(slug) where deleted_at is null;

create index idx_margaret_tenders_closing on margaret_tenders(closing_date);

select margaret_bootstrap_content_table('margaret_tenders', 'tenders');

create table margaret_tender_documents (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references margaret_tenders(id) on delete cascade,
  title text not null,
  file_url text not null,
  document_type text not null default 'tender_document'
    check (document_type in ('tender_document', 'addendum', 'clarification', 'opening_result', 'award_notice')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index idx_margaret_tender_documents_tender on margaret_tender_documents(tender_id);

alter table margaret_tender_documents enable row level security;

create policy margaret_tender_documents_read on margaret_tender_documents for select using (true);

create policy margaret_tender_documents_write on margaret_tender_documents for all
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_tender_clarifications (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references margaret_tenders(id) on delete cascade,
  question text not null,
  answer text,
  asked_by_name text,
  asked_by_email text,
  answered_by uuid references auth.users(id),
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'answered', 'published'))
);

create index idx_margaret_tender_clarifications_tender on margaret_tender_clarifications(tender_id);

alter table margaret_tender_clarifications enable row level security;

create policy margaret_tender_clarifications_read on margaret_tender_clarifications for select
  using (status = 'published' or margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create policy margaret_tender_clarifications_insert_public on margaret_tender_clarifications for insert with check (true);

create policy margaret_tender_clarifications_update_admin on margaret_tender_clarifications for update
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create policy margaret_tender_clarifications_delete_admin on margaret_tender_clarifications for delete
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_tender_addenda (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references margaret_tenders(id) on delete cascade,
  title text not null,
  description text,
  file_url text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index idx_margaret_tender_addenda_tender on margaret_tender_addenda(tender_id);

alter table margaret_tender_addenda enable row level security;

create policy margaret_tender_addenda_read on margaret_tender_addenda for select using (true);

create policy margaret_tender_addenda_write on margaret_tender_addenda for all
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_tender_awards (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references margaret_tenders(id) on delete cascade,
  awarded_supplier_id uuid references margaret_suppliers(id) on delete set null,
  awarded_supplier_name text,
  award_amount numeric(14, 2),
  award_notice_url text,
  awarded_at date,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create index idx_margaret_tender_awards_tender on margaret_tender_awards(tender_id);

alter table margaret_tender_awards enable row level security;

create policy margaret_tender_awards_read on margaret_tender_awards for select using (true);

create policy margaret_tender_awards_write on margaret_tender_awards for all
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_bids (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references margaret_tenders(id) on delete cascade,
  supplier_id uuid not null references margaret_suppliers(id) on delete cascade,
  bid_amount numeric(14, 2),
  technical_score numeric(5, 2),
  financial_score numeric(5, 2),
  notes text,
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  status text not null default 'submitted'
    check (status in ('submitted', 'under_evaluation', 'shortlisted', 'rejected', 'awarded')),
  unique (tender_id, supplier_id)
);

create index idx_margaret_bids_tender on margaret_bids(tender_id);

create index idx_margaret_bids_supplier on margaret_bids(supplier_id);

alter table margaret_bids enable row level security;

create policy margaret_bids_insert_supplier on margaret_bids for insert
  with check (exists (
    select 1 from margaret_suppliers s
    where s.id = supplier_id and s.user_id = auth.uid() and s.status = 'approved'
  ));

create policy margaret_bids_read on margaret_bids for select
  using (
    exists (select 1 from margaret_suppliers s where s.id = supplier_id and s.user_id = auth.uid())
    or margaret_has_permission('tenders.manage') or margaret_is_super_admin()
  );

create policy margaret_bids_update_admin on margaret_bids for update
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create policy margaret_bids_delete_admin on margaret_bids for delete
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin());

create table margaret_bid_documents (
  id uuid primary key default gen_random_uuid(),
  bid_id uuid not null references margaret_bids(id) on delete cascade,
  title text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create index idx_margaret_bid_documents_bid on margaret_bid_documents(bid_id);

alter table margaret_bid_documents enable row level security;

create policy margaret_bid_documents_insert on margaret_bid_documents for insert
  with check (exists (
    select 1 from margaret_bids b
    join margaret_suppliers s on s.id = b.supplier_id
    where b.id = bid_id and s.user_id = auth.uid()
  ));

create policy margaret_bid_documents_read on margaret_bid_documents for select
  using (
    exists (
      select 1 from margaret_bids b
      join margaret_suppliers s on s.id = b.supplier_id
      where b.id = bid_id and s.user_id = auth.uid()
    )
    or margaret_has_permission('tenders.manage') or margaret_is_super_admin()
  );

create policy margaret_bid_documents_delete_admin on margaret_bid_documents for delete
  using (margaret_has_permission('tenders.manage') or margaret_is_super_admin());
