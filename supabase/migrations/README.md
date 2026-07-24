# Migrations (mirrored from the remote Supabase project)

These 23 files are a direct copy of every migration already applied to the `edos_websites` Supabase
project (`sedsjjmjnikppfaecaya`, org EDOS CENTRE1), pulled from `supabase_migrations.schema_migrations`
(where Supabase's migration tooling stores the exact statement list for each applied migration) and
written out with one file per migration, in the same order they were applied.

They exist here for **version control and local reference only**. They were not applied to the database
by running these files -- the schema already exists remotely; this is a mirror, not a source of truth.

- `0001`-`0021`: the original schema build-out (extensions/helpers, RBAC, CMS core, hospital structure,
  patients/forms, careers, tenders, news/media/events, research/library, misc content,
  notifications/audit, seed data, RPC helpers, nav seeding, and a few small fixes).
- `20260724074617_harden_audit_log_insert` and `20260724074629_function_search_path_hardening`: the two
  security fixes applied during this project's Phase 1 session (see `ROADMAP.md`).

This was pulled via direct SQL access through the Supabase MCP connector, not the Supabase CLI (`supabase
db pull`), since no database password was available in this environment. If you set up the Supabase CLI
locally with a linked project, you can use `supabase db pull` going forward to keep this directory in sync
the standard way, and `supabase migration new <name>` for anything new -- these files are compatible with
that workflow (Supabase CLI migration files are also just plain numbered/timestamped `.sql` files run in
order).
