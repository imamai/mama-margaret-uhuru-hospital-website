# Roadmap

This tracks what the original brief asked for against what's actually built, so the next work session
has a clear punch list instead of re-auditing from scratch.

## Done (Phase 1)

- Supabase audit: confirmed the `edos_websites` project (`sedsjjmjnikppfaecaya`, org EDOS CENTRE1)
  already has the full `margaret_*` schema (21 migrations, RBAC, CMS core, hospital structure, careers,
  tenders, news/media/events, research/library, notifications/audit) plus seed data.
- Two security fixes applied: `margaret_audit_logs` insert policy tightened (was publicly forgeable),
  `search_path` hardened on 3 trigger functions.
- Next.js 15+ (actually Next 16) app scaffolded: TypeScript, Tailwind v4, shadcn/ui, Framer Motion, next-themes.
- Supabase client wiring (`@supabase/ssr`), generated TypeScript types from the live schema.
- Runtime-driven design system: brand colors/hospital name/logo/SEO defaults come from `margaret_settings`
  at request time, not hardcoded -- admins can rebrand without a deploy.
- Shared layout: Header (logo, nav from `margaret_menus`, emergency bar, dark mode), Footer (footer nav,
  social links, insurance partners, footer sections), mobile nav drawer.
- Homepage assembled dynamically from `margaret_homepage_sections` (respects visibility/order): hero
  carousel, emergency banner, stats, departments, doctors, clinics, news, events, testimonials, insurance
  partners, gallery, awards, partners.
- Fully wired public modules (list + detail where applicable): Departments, Doctors, News, Careers
  (incl. apply form with document uploads to the private `job-attachments` bucket), Appointments booking
  form, Contact form.
- SEO basics: per-page metadata, JSON-LD (Hospital on home, NewsArticle on articles), dynamic `sitemap.xml`,
  `robots.txt`, PWA manifest.
- Admin CMS shell: Supabase Auth login, RBAC-aware sidebar (via `margaret_get_my_permissions`), and a
  reusable generic `DataTable` + `EntityFormDialog` CRUD pattern demonstrated on Departments, Doctors,
  and Careers/Jobs.
- Accessibility basics: skip link, focus-visible rings, `prefers-reduced-motion` handling, semantic
  landmarks, branded placeholder-image component for every missing photo.

## Done (Phase 2)

- Admin Settings screens (tabs for General/Branding/Social/SEO/Integrations), writing straight to
  `margaret_settings` -- rebranding the whole site is now a form, not a code change.
- Admin Homepage Builder: toggle visibility and reorder `margaret_homepage_sections` from the UI.
- Admin Menu Builder: create/edit/delete/reorder items in both `margaret_menus` (Primary/Footer nav).
- Careers pipeline admin: per-job applications view (`/admin/jobs/[id]/applications`) with applicant
  count on the jobs list, signed-URL document downloads from the private `job-attachments` bucket,
  status transitions (submitted -> under_review -> shortlisted -> interview_scheduled -> rejected/hired),
  and CSV export.
- Public modules: About (`/about`, backed by a new `margaret_pages` row), Patients hub (`/patients`,
  admissions/discharge/billing/insurance/visitor info/patient rights/FAQ content + a working Feedback
  form + a "Patient Portal -- coming soon" placeholder), Clinics list + detail (`/clinics`,
  `/clinics/[slug]`, 3 clinics seeded), Services (`/services`, searchable, 2 categories/4 services seeded).
- Nav cleanup: added About/Patients links, fixed a duplicate `sort_order` (Clinics and Our Doctors were
  both `3`), fixed News/Contact pointing at stale homepage anchors (`/#news`, `/#contact`) now that real
  pages exist.
- New reusable admin primitives: `SettingsForm` (inline, non-dialog sibling of `EntityFormDialog`),
  row-level reorder pattern (`HomepageSectionRow`, `MenuItemRow` with up/down + `useTransition`),
  `ApplicationStatusSelect`, `ExportCsvButton`.
- New reusable public primitives: `getPageBySlug` (generic `margaret_pages` fetch + its downloads) --
  reuse this for any future static CMS page (Strategic Plan, Policies, Quality Assurance, etc.) instead
  of building bespoke tables.

## Done (Phase 3)

- **Tenders portal, public side**: `/tenders` list, `/tenders/[slug]` detail (description, eligibility,
  documents, published clarifications Q&A, award notice if awarded), an "ask a clarification" form
  (public, no auth -- `margaret_tender_clarifications`).
- **Supplier registration + auth portal** -- the schema (`margaret_suppliers.user_id`, RLS requiring
  `auth.uid() = supplier.user_id` + `status = 'approved'` to insert a bid) makes this a real auth flow,
  not just a form: `/suppliers/register` calls `supabase.auth.signUp()` *and* inserts the
  `margaret_suppliers` row (status `pending`) in the same action; `/suppliers/login`; `/suppliers/dashboard`
  (redirects to login if unauthenticated) shows approval status and, once `approved`, lists open tenders
  with a **Submit Bid** dialog (amount, notes, multi-file upload to the private `tender-documents` bucket
  under `bids/{bid_id}/...`).
- **Admin tenders**: `/admin/tenders` DataTable CRUD (title, number, dates, evaluation stage, status);
  `/admin/tenders/[id]` detail screen -- document upload (to the **public** `downloads` bucket, since
  bidders need to actually download tender documents/addenda/award notices; the private
  `tender-documents` bucket is reserved for supplier-submitted bid files, mirroring `job-attachments`),
  clarification answering (publishes the Q&A pair), bids table (supplier name, amount, signed-URL
  document downloads, editable technical/financial scores, status dropdown), and a "Record Award" dialog
  that also flips the tender to `status = 'awarded'`.
- **Admin suppliers**: `/admin/suppliers` approval queue (pending -> approved/rejected/suspended).
- New reusable admin primitive: `StatusSelect<T>` (generic version of the pattern first written as
  `ApplicationStatusSelect` -- use this one for any future status-dropdown-with-server-action need).
- Seeded demo data: 4 supplier categories, 1 open tender (`MMUH/T/2026/001`).
- Nav: added "Tenders" link to primary nav.
- **All 23 Supabase migrations mirrored locally** in `supabase/migrations/` (pulled the exact applied SQL
  from `supabase_migrations.schema_migrations.statements`, not reconstructed/guessed) -- see that
  directory's own README for details. This was previously listed as blocked on the Supabase CLI + DB
  password; it turned out the exact statements were queryable directly, so it's done.

## Not built yet (tracked, not forgotten)

### Public site
- Leadership/Board/Management team profiles and an Org Chart -- no dedicated schema exists (About page
  currently covers History/Mission/Vision/Core Values/a leadership message/Quality Assurance as CMS page
  content, not individual profiles). Decide whether these reuse the Doctors table shape or need their own.
- Laboratory, Radiology, Pharmacy, Maternity, dedicated Emergency page
- Events: public `/events` list + `/events/[slug]` detail + registration form (homepage grid exists, read-only)
- Media Centre (press releases, video library), Research (publications, clinical trials, ethics), Library
- Remaining online forms: Complaints, Volunteer, Internship, Research Request, Medical Camp Registration
  (Feedback, Contact, Appointment, Supplier Registration, and Tender Clarification are all done)
- Patient Portal (needs a patient-account schema decision -- `margaret_profiles` is staff-shaped; note
  this is now the *only* remaining portal-style gap, since the Supplier Portal shipped this session)
- Multilingual (Kiswahili) support

### Admin CMS
- Footer Builder (footer nav already covered by Menu Builder; `margaret_footer_sections` still has no UI)
- Roles & Permissions matrix editor
- Email candidates from the careers pipeline (status changes work; no email is actually sent -- needs
  the Edge Functions item below). Same gap applies to suppliers (no email on approval/rejection) and
  tenders (no email when a clarification is answered).
- News/Events/Research/Library/Gallery/Testimonials/Awards/Partners/Clinics/Services admin screens (same
  DataTable pattern as Departments/Doctors/Jobs -- see README's "reusable admin CRUD pattern")
- Audit log viewer, Notifications, Email/SMS template management

### Infrastructure
- Supabase Edge Functions for email/SMS notifications (job application received, appointment confirmed,
  tender clarification answered, supplier approved, bid status changed, etc.) -- none deployed yet
- PWA offline support (manifest exists; no service worker/offline page)
- CI/CD pipeline
- Automated tests (unit/integration/e2e) -- none yet
- CAPTCHA / spam detection beyond the honeypot field already on public forms
- Performance cleanup: the security/performance advisor flagged 58 `auth_rls_initplan` and 384
  `multiple_permissive_policies` warnings across `margaret_*` tables (all pre-existing, not introduced
  this pass). Not urgent at current scale, but worth a dedicated RLS-policy consolidation pass before
  the site sees real traffic.
- Going forward, use the Supabase CLI (`supabase migration new <name>`) to add new migrations into
  `supabase/migrations/` so the local mirror and the remote project stay in sync by convention, since
  there's no automated sync -- this session's migrations were pulled manually.

## Known issue observed in a previous session

Next.js dev mode (Turbopack) occasionally threw a generic `Jest worker encountered N child process
exceptions` 500 on a route that works fine in a production build (`npm run build && npm run start`) --
seen once on `/clinics/[slug]` after the `.next` directory had been rebuilt while a stale dev server was
still running against it. If a route 500s only in `next dev`, try killing the dev server, deleting
`.next`, and restarting before assuming the code is broken -- check `npm run build && npm run start` first.

## Untested this session

The Supplier Portal's auth flow (`signUp` -> pending row -> admin approval -> login -> bid submission with
file upload) is code-complete, builds and type-checks cleanly, and its public pages all render correctly
in a production server run -- but the actual signup/login/bid-submission interactions have **not** been
click-tested in a real browser (no browser tool available in this environment, only HTTP status checks).
Before relying on it, walk through: register a test supplier, confirm the account (check whether email
confirmation is enabled on this Supabase project -- if so, the confirmation link is required before login
works), approve it from `/admin/suppliers`, log in, and submit a bid with a file attached.

## Suggested next session order

1. Laboratory/Radiology/Pharmacy/Maternity/Emergency pages -- same pattern as Clinics, likely need their
   own small tables or can reuse `margaret_pages` + `margaret_services` depending on how structured the
   content needs to be
2. Events public pages + registration form (data/grid already exist)
3. Edge Functions for notifications -- unlocks "email candidates/suppliers/clarification answers" across
   Careers, Tenders, and Suppliers all at once
4. Remaining admin CRUD screens (News, Events, Research, Library, Gallery, Testimonials, Awards, Partners,
   Clinics, Services) -- mechanical, follow the documented DataTable pattern
5. PWA/offline, CI/CD, tests
