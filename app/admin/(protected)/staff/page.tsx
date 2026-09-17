import { KeyRound, Plus, ShieldCheck, UserPlus } from "lucide-react"

import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/admin/data-table"
import { DeleteButton } from "@/components/admin/delete-button"
import { EntityFormDialog, type EntityFieldConfig } from "@/components/admin/entity-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  createStaff,
  grantExistingUser,
  resetStaffPassword,
  revokeStaffAccess,
  setStaffRoles,
} from "@/lib/actions/admin/staff"
import { canCreateAccounts } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

type StaffRow = {
  user_id: string
  email: string
  full_name: string
  last_sign_in_at: string | null
  created_at: string
  roles: { id: string; name: string; slug: string }[]
}

type Role = { id: string; name: string; description: string | null }

function when(value: string | null): string {
  if (!value) return "Never"
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

/**
 * Staff accounts and their roles.
 *
 * A role is the unit of access: Procurement covers tenders, suppliers, bids
 * and awards, HR covers the careers portal, and so on down the nine roles the
 * site ships with. Somebody can hold more than one.
 *
 * "Remove access" strips every role rather than deleting the login, which is
 * both the right meaning -- they are no longer staff here -- and the safe one,
 * since this Supabase project is shared with other sites.
 */
export default async function AdminStaffPage() {
  const supabase = await createClient()

  const [{ data: staffData, error }, { data: roleData }] = await Promise.all([
    supabase.rpc("margaret_list_staff"),
    supabase.from("margaret_roles").select("id, name, description").eq("status", "active").order("name"),
  ])

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Staff</h1>
        <p className="mt-2 text-muted-foreground">You don&apos;t have permission to view staff accounts.</p>
      </div>
    )
  }

  const staff = (staffData ?? []) as StaffRow[]
  const roles = (roleData ?? []) as Role[]
  const accountsCreatable = canCreateAccounts()

  /** One checkbox per role; the action reads every field named "role:<id>". */
  function roleFields(selected: string[] = []): EntityFieldConfig[] {
    return roles.map((role) => ({
      name: `role:${role.id}`,
      label: role.name,
      type: "checkbox" as const,
      defaultValue: selected.includes(role.id) ? "true" : "",
      hint: role.description ?? undefined,
    }))
  }

  const newStaffFields: EntityFieldConfig[] = [
    { name: "fullName", label: "Full name", required: true, defaultValue: "" },
    { name: "email", label: "Email address", required: true, defaultValue: "", hint: "This is what they sign in with." },
    {
      name: "password",
      label: "Starting password",
      type: "password",
      offerGenerator: true,
      required: true,
      hint: "At least 10 characters. Generate one, hand it over directly, and they can change it under My Account.",
    },
    ...roleFields(),
  ]

  const existingUserFields: EntityFieldConfig[] = [
    {
      name: "email",
      label: "Email address",
      required: true,
      defaultValue: "",
      hint: "The address on the account they already have.",
    },
    ...roleFields(),
  ]

  const columns: DataTableColumn[] = [
    { key: "person", label: "Person" },
    { key: "roles", label: "Roles" },
    { key: "lastSignIn", label: "Last signed in" },
  ]

  const rows: DataTableRow[] = staff.map((person) => ({
    id: person.user_id,
    searchText: `${person.full_name} ${person.email} ${person.roles.map((r) => r.name).join(" ")}`.toLowerCase(),
    cells: [
      <div key="who">
        <div className="font-medium">{person.full_name || "—"}</div>
        <div className="text-xs text-muted-foreground">{person.email}</div>
      </div>,
      <div key="roles" className="flex flex-wrap gap-1">
        {person.roles.map((role) => (
          <Badge key={role.id} variant={role.slug === "super-admin" ? "default" : "secondary"}>
            {role.name}
          </Badge>
        ))}
      </div>,
      when(person.last_sign_in_at),
    ],
    actions: (
      <div className="flex justify-end gap-1">
        <EntityFormDialog
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label="Change roles">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </Button>
          }
          title={`Roles for ${person.full_name || person.email}`}
          fields={roleFields(person.roles.map((r) => r.id))}
          action={setStaffRoles}
          hiddenFields={{ userId: person.user_id }}
        />

        {accountsCreatable ? (
          <EntityFormDialog
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label="Reset password">
                <KeyRound className="size-4" aria-hidden="true" />
              </Button>
            }
            title={`Set a new password for ${person.full_name || person.email}`}
            fields={[
              {
                name: "password",
                label: "New password",
                type: "password",
                offerGenerator: true,
                required: true,
                hint: "At least 10 characters. Tell them to change it once they are in.",
              },
            ]}
            action={resetStaffPassword}
            hiddenFields={{ userId: person.user_id }}
          />
        ) : null}

        <DeleteButton
          id={person.user_id}
          action={revokeStaffAccess}
          confirmMessage={`Remove every role from ${person.full_name || person.email}? They will keep their login but will not be able to manage anything here.`}
        />
      </div>
    ),
  }))

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-muted-foreground">
            Who can sign in to the admin, and what each of them may manage.
          </p>
        </div>
        <div className="flex gap-2">
          <EntityFormDialog
            trigger={
              <Button variant="outline" size="sm">
                <UserPlus className="size-4" aria-hidden="true" /> Existing account
              </Button>
            }
            title="Give access to an existing account"
            fields={existingUserFields}
            action={grantExistingUser}
          />
          {accountsCreatable ? (
            <EntityFormDialog
              trigger={
                <Button size="sm">
                  <Plus className="size-4" aria-hidden="true" /> Add staff
                </Button>
              }
              title="Add a member of staff"
              fields={newStaffFields}
              action={createStaff}
            />
          ) : null}
        </div>
      </div>

      {!accountsCreatable ? (
        <p className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          New logins can&apos;t be created until the <code>SUPABASE_SERVICE_ROLE_KEY</code> setting is configured.
          Until then you can still give access to someone who already has an account, change roles and remove access.
        </p>
      ) : null}

      <DataTable columns={columns} rows={rows} searchable />

      <section className="mt-10">
        <h2 className="mb-1 text-lg font-bold">What each role can do</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Give someone the smallest role that covers their work. Anyone can change their own password under My
          Account.
        </p>
        <dl className="grid gap-3 sm:grid-cols-2">
          {roles.map((role) => (
            <div key={role.id} className="rounded-xl border p-4">
              <dt className="font-semibold">{role.name}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{role.description ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
