"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { useConfirm } from "@/components/admin/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import { updateAdminProfile, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { AdminProfile } from "@/lib/cms/types"

export function AdminUserRow({ profile }: { profile: AdminProfile }) {
  const router = useRouter()
  const [role, setRole] = useState(profile.role)
  const [isActive, setIsActive] = useState(profile.is_active)
  const [busy, setBusy] = useState(false)
  const { confirm, dialog } = useConfirm()

  async function save() {
    const ok = await confirm({
      title: "Save changes",
      message: `Update ${profile.email || "this user"} to role "${role}"${isActive ? "" : " (inactive)"}?`,
      variant: "info",
      confirmText: "Save",
    })
    if (!ok) return
    setBusy(true)
    const { error } = await updateAdminProfile(profile.id, { role, is_active: isActive })
    setBusy(false)
    if (error) {
      toast.error(error)
      return
    }
    const user = await getCurrentUser()
    await createActivityLog({
      admin_user_id: user?.id || null,
      admin_email: user?.email || null,
      action: "update",
      entity_type: "admin_profile",
      entity_id: profile.id,
      description: `${profile.email} → ${role}${isActive ? "" : " (inactive)"}`,
    })
    toast.success("User updated")
    router.refresh()
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[180px]">
          <p className="text-sm font-medium text-slate-900">{profile.full_name || profile.email || "—"}</p>
          <p className="text-xs text-slate-500">{profile.email || "—"}</p>
        </div>
        <div className="w-44">
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            options={[
              { value: "super_admin", label: "Super Admin" },
              { value: "admin", label: "Admin" },
              { value: "editor", label: "Editor" },
            ]}
          />
        </div>
        <div className="w-28">
          <Select
            value={isActive ? "active" : "inactive"}
            onChange={(e) => setIsActive(e.target.value === "active")}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
        <Button onClick={save} variant="primary" size="sm" disabled={busy}>
          {busy ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </Button>
      </div>
      {dialog}
    </>
  )
}