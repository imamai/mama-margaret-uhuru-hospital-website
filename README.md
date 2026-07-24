# Mama Margaret Uhuru Hospital -- Website & CMS

Enterprise hospital website and content management system, built with Next.js 15+ (App Router),
TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, and Supabase (Postgres, Auth, Storage).

Every piece of content -- departments, doctors, news, jobs, homepage sections, navigation, branding --
is stored in Supabase and editable by an admin without a code deploy. See `ROADMAP.md` for what's
built versus what's still on the punch list.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS v4, shadcn/ui (Radix primitives), Framer Motion, next-themes
- **Backend:** Supabase Postgres (project `edos_websites`, tables prefixed `margaret_`), Supabase Auth, Supabase Storage
- **Validation:** Zod, react-hook-form

## Prerequisites

- Node.js 20+ and npm
- Access to the `edos_websites` Supabase project (org **EDOS CENTRE1**)

## Installation

```bash
npm install
cp .env.example .env.local   # then fill in the two Supabase values below
npm run dev
```

## Environment variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard -> Project Settings -> API -> Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard -> Project Settings -> API -> anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | The public URL this site is deployed at (used for metadata, sitemap, OG tags) |

No service-role key is used anywhere in this app. All reads/writes go through the anon key and rely
entirely on the database's Row Level Security policies (public read on published content, permission-gated
admin read/write via the `margaret_has_permission()` / `margaret_is_super_admin()` RPCs).

## Project structure

```
app/
  (public)/        Public site: layout with Header/Footer, homepage, all content modules
  admin/
    login/         Unauthenticated admin sign-in
    (protected)/   Auth + RBAC-gated admin CMS (route group keeps login out of the auth check)
  sitemap.ts, robots.ts, manifest.ts, not-found.tsx
components/
  layout/          Header, Footer, MobileNav, EmergencyBar, ThemeToggle
  sections/        Homepage section components (one per margaret_homepage_sections row)
  common/          SmartImage/PlaceholderImage, SectionHeading, BlockContent, social icons
  forms/           Public-facing forms (Contact, Appointment, Job Application, Clarification, Bid, Supplier Registration)
  admin/           Reusable admin CRUD building blocks (DataTable, EntityFormDialog, DeleteButton, StatusSelect, Sidebar)
  ui/              shadcn/ui primitives
lib/
  supabase/        Browser/server/middleware Supabase clients + generated database.types.ts
  data/            Server-only, cached read functions per module (one file per content area)
  actions/         Server Actions: public form submissions, auth, admin CRUD
  auth/            Permission/role helpers wrapping the RBAC RPCs
proxy.ts           Session refresh + /admin route protection (Next.js 16's renamed middleware.ts)
supabase/migrations/  Local mirror of every migration applied to the remote project (see its own README)
```

## The reusable admin CRUD pattern

Departments, Doctors, and Careers/Jobs demonstrate the pattern every future admin module should follow:

1. A typed row shape + Zod schema in `lib/actions/admin/<module>.ts` with `create`/`update`/`delete` Server Actions.
2. A page under `app/admin/(protected)/<module>/page.tsx` that fetches rows with the authenticated Supabase
   client (RLS already scopes what that user can see/write) and renders `<DataTable>` with an
   `<EntityFormDialog>` for create/edit and `<DeleteButton>` for soft-delete.

Adding a new module means writing those two files, not new shared components.

## The Supplier Portal (a second auth flow)

Unlike everything else in this app, tender bidding requires a *public* auth flow: suppliers self-register
at `/suppliers/register`, which calls `supabase.auth.signUp()` and inserts a `margaret_suppliers` row
(`status: 'pending'`) in the same Server Action. RLS requires `auth.uid() = supplier.user_id` **and**
`status = 'approved'` before a bid insert is allowed, so an admin must approve the supplier
(`/admin/suppliers`) before `/suppliers/dashboard` will let them submit a bid. This is the same Supabase
Auth mechanism as admin login, just exposed to public signup instead of admin-only accounts -- see
`lib/actions/suppliers.ts`.

## Known limitation of this build environment

The admin CRUD screens (auth, RBAC-gated sidebar, create/edit/delete dialogs) and the Supplier Portal's
signup/login/bid-submission flow have been built and compile/typecheck cleanly, but have **not been
click-tested in a real browser with a logged-in user** in this environment (no browser was available,
only an HTTP client). Before relying on them: sign in with a real Super Admin or Editor account and walk
through create/edit/delete on each admin module; and separately, register a test supplier, confirm the
account if this Supabase project requires email confirmation, approve it from `/admin/suppliers`, log in,
and submit a bid with a file attached.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint
```

## Deployment

Deploy to any Node-compatible host (Vercel is the path of least resistance for Next.js). Set the three
environment variables above in the hosting platform. No database migration step is required at deploy
time -- the schema already lives in the `edos_websites` Supabase project.
