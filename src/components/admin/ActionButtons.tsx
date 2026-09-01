"use client"
import { Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/components/admin/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import { createActivityLog, getCurrentUser } from "@/lib/cms/data"

interface ActionButtonsProps {
  id: string
  title: string
  editHref: string
  viewHref?: string | null
  onDelete: () => Promise<{ error: string | null }>
  entityType: string
}

export function ActionButtons({ id, title, editHref, viewHref, onDelete, entityType }: ActionButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { confirm, dialog } = useConfirm()

  async function handleDelete() {
    const ok = await confirm({
      title: `Delete ${entityType}`,
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
    })
    if (!ok) return
    setLoading(true)
    const { error } = await onDelete()
    setLoading(false)
    if (error) {
      toast.error(error)
    } else {
      const user = await getCurrentUser()
      await createActivityLog({
        admin_user_id: user?.id || null,
        admin_email: user?.email || null,
        action: "delete",
        entity_type: entityType,
        entity_id: id,
        description: title,
      })
      toast.success(`${entityType} deleted`)
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {viewHref && (
          <a
            href={viewHref}
            target="_blank"
            rel="noreferrer"
            className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
            title="View on website"
          >
            <Eye size={14} />
          </a>
        )}
        <a
          href={editHref}
          className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          title="Edit"
        >
          <Edit size={14} />
        </a>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Delete"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
      {dialog}
    </>
  )
}