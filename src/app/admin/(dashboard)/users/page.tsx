import { Card } from "@/components/ui/admin"
import { PageHeader } from "@/components/admin/PageHeader"
import { AdminUserRow } from "@/components/admin/users/AdminUserRow"
import { getAllAdminProfiles } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const profiles = await getAllAdminProfiles()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Admin Users"
        description="Manage roles and access for admin team members."
      />

      <Card>
        {profiles.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No admin profiles found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {profiles.map((p) => (
              <div key={p.id} className="p-4">
                <AdminUserRow profile={p} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}