# Getting back into the admin

Four ways in, in the order to try them. Each one works when the one above it
has failed, and the last one works even if every account on the site is gone.

The short version: **whoever controls the Supabase project controls the site.**
Nothing that happens inside the admin can take that away. That is the real
recovery path, and it is why the application does not need — and should not
have — a hidden account or a bypass route.

## 1. You forgot your password

Sign-in page → **Forgot your password?** → enter your address. The emailed link
signs you in once and asks for a new password.

Requires the project to be able to send email (see *Prerequisites* below).

## 2. The email never arrives

Any administrator with `users.manage` can set a password for you:
**Admin → Staff → the key icon on your row → Generate → hand it over.**

You then change it yourself under **Admin → My Account**.

## 3. Nobody left can sign in, but your account still exists

Go to the Supabase dashboard → **Authentication → Users**, find the address, and
use the row menu to send a recovery link or set a password directly.

This needs no working admin account — only access to the Supabase project.

## 4. The account itself has been deleted

Create a new one and give it the role, both from the Supabase dashboard.

1. **Authentication → Users → Add user.** Set an email and password, and tick
   *Auto Confirm User* so no email is needed.
2. **SQL Editor**, then run this, with the address you just used:

```sql
insert into margaret_user_roles (user_id, role_id)
select u.id, r.id
  from auth.users u
  cross join margaret_roles r
 where lower(u.email) = lower('you@example.com')
   and r.slug = 'super-admin'
   and not exists (
     select 1 from margaret_user_roles ur
      where ur.user_id = u.id and ur.role_id = r.id
   );
```

3. Sign in at `/admin/login`. You are a super admin.

Optionally keep it off the hospital's staff list:

```sql
insert into margaret_maintenance_accounts (user_id, note)
select u.id, 'Recovery account, <date>'
  from auth.users u
 where lower(u.email) = lower('you@example.com')
on conflict (user_id) do nothing;
```

To check who currently holds the role:

```sql
select u.email, r.name
  from margaret_user_roles ur
  join auth.users u on u.id = ur.user_id
  join margaret_roles r on r.id = ur.role_id
 order by u.email;
```

## What protects you in the meantime

- **The site cannot lose its last super admin.** Removing the role from the only
  person who holds it, or revoking their access, is refused with a message
  saying to give someone else the role first. Scenario 4 is therefore something
  that has to be done deliberately in the database, not something the hospital
  can do by accident from the admin.
- **Nobody can remove their own access or change their own roles**, so a
  mis-click cannot lock you out of the screen you are standing on.
- **Maintenance accounts are hidden, not protected.** Being off the staff list
  keeps an account out of the way of a tidy-up; it does not make it
  undeletable, and a super admin can reveal and remove one at will. That is
  deliberate: it is the hospital's site.

## Keep this working

Two things to hold on to, neither of which lives in this repository:

1. **Access to the Supabase project** — the account that owns it, or an
   organisation member with admin rights. This is the master key. If it is tied
   to one personal login, add a second owner.
2. **Access to the Vercel project and the GitHub repository** — for deployments
   and environment variables.

If all three were lost at once, the site itself would still be running, but
nobody could administer or redeploy it. Adding a second owner to each is the
whole mitigation and takes about five minutes.

## Prerequisites

- **Email delivery.** Password recovery needs the project to send mail. Supabase's
  built-in sender is heavily rate-limited and is not meant for production; if
  recovery emails are slow or missing, configure SMTP under
  *Project Settings → Authentication → SMTP Settings*. Routes 2, 3 and 4 do not
  depend on email.
- **Redirect allow-list.** The recovery link returns to `/admin/auth/callback`.
  That address must be listed under *Authentication → URL Configuration →
  Redirect URLs*, for the live domain and for `http://localhost:3000` if
  recovery is to be tested locally.
- **`SUPABASE_SERVICE_ROLE_KEY`.** Needed for creating accounts and for route 2.
  Set it in `.env.local` and in the Vercel project's environment variables.
