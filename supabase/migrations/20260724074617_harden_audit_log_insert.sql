
drop policy if exists margaret_audit_logs_insert on public.margaret_audit_logs;

create policy margaret_audit_logs_insert
on public.margaret_audit_logs
for insert
with check (
  auth.uid() is not null
  and (actor_id is null or actor_id = auth.uid())
);
