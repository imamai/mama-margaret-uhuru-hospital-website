-- 0011: Audit logging, in-app notifications, and email/SMS templates.

create table margaret_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_margaret_audit_logs_actor on margaret_audit_logs(actor_id);

create index idx_margaret_audit_logs_table_record on margaret_audit_logs(table_name, record_id);

create index idx_margaret_audit_logs_created on margaret_audit_logs(created_at desc);

alter table margaret_audit_logs enable row level security;

create policy margaret_audit_logs_read_admin on margaret_audit_logs for select
  using (margaret_has_permission('audit_logs.view') or margaret_is_super_admin());

create policy margaret_audit_logs_insert on margaret_audit_logs for insert with check (true);

create table margaret_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  link_url text,
  notification_type text not null default 'info' check (notification_type in ('info', 'success', 'warning', 'error')),
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_margaret_notifications_recipient on margaret_notifications(recipient_id, is_read);

alter table margaret_notifications enable row level security;

create policy margaret_notifications_read_self on margaret_notifications for select using (auth.uid() = recipient_id);

create policy margaret_notifications_update_self on margaret_notifications for update
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

create policy margaret_notifications_insert on margaret_notifications for insert
  with check (auth.uid() is not null);

create policy margaret_notifications_delete_self on margaret_notifications for delete using (auth.uid() = recipient_id);

create table margaret_email_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  subject text not null,
  body_html text not null,
  variables text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create trigger trg_margaret_email_templates_updated_at
  before update on margaret_email_templates
  for each row execute function margaret_set_updated_at();

alter table margaret_email_templates enable row level security;

create policy margaret_email_templates_admin_all on margaret_email_templates for all
  using (margaret_has_permission('settings.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('settings.manage') or margaret_is_super_admin());

create table margaret_sms_templates (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  body text not null,
  variables text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create trigger trg_margaret_sms_templates_updated_at
  before update on margaret_sms_templates
  for each row execute function margaret_set_updated_at();

alter table margaret_sms_templates enable row level security;

create policy margaret_sms_templates_admin_all on margaret_sms_templates for all
  using (margaret_has_permission('settings.manage') or margaret_is_super_admin())
  with check (margaret_has_permission('settings.manage') or margaret_is_super_admin());
