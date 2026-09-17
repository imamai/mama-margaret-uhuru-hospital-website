import { ChangePasswordForm } from "@/components/admin/change-password-form"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser, getMyPermissions, getMyRoles, isSuperAdmin } from "@/lib/auth/permissions"

/**
 * Your own account: who the site thinks you are, what you may do, and the
 * password change.
 *
 * The permission list is shown because "why can't I see Tenders?" is the
 * question this page exists to answer -- staff can read their own access and
 * ask for what is missing by name, rather than guessing.
 */
export default async function AdminAccountPage() {
  const [user, roles, permissions, superAdmin] = await Promise.all([
    getCurrentUser(),
    getMyRoles(),
    getMyPermissions(),
    isSuperAdmin(),
  ])

  const modules = [...new Set(permissions.map((key) => key.split(".")[0]))].sort()

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-muted-foreground">Your sign-in details and what your account can do.</p>
      </div>

      <section className="rounded-xl border p-5">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Signed in as</h2>
        <p className="mt-1 font-medium">{user?.email}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {superAdmin ? (
            <Badge>Super Admin</Badge>
          ) : roles.length > 0 ? (
            roles.map((role) => (
              <Badge key={role.role_slug} variant="secondary">
                {role.role_name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No role yet. An administrator can give you one.</span>
          )}
        </div>

        {!superAdmin && modules.length > 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            You can work in: {modules.join(", ").replace(/_/g, " ")}.
          </p>
        ) : null}
        {superAdmin ? (
          <p className="mt-4 text-sm text-muted-foreground">You have full access to every module.</p>
        ) : null}
      </section>

      <section className="mt-8 rounded-xl border p-5">
        <h2 className="mb-1 text-lg font-bold">Change password</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          You will stay signed in on this device. Anyone signed in as you elsewhere will need the new password next
          time.
        </p>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
