"use client"
import { Eye, Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useConfirm } from "@/components/admin/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import { createActivityLog, getCurrentUser } from "@/lib/cms/data"

interface EnquiryActionButtonsProps {
  id: string
  title: string
  viewHref: string
  onDelete: () => Promise<{ error: string | null }>
}

export function EnquiryActionButtons({ id, title, viewHref, onDelete }: EnquiryActionButtonsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { confirm, dialog } = useConfirm()

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete enquiry",
      message: `Are you sure you want to delete the enquiry from "${title}"? This action cannot be undone.`,
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
        entity_type: "enquiry",
        entity_id: id,
        description: title,
      })
      toast.success("Enquiry deleted")
      router.refresh()
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <a
          href={viewHref}
          className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
          title="View"
        >
          <Eye size={14} />
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