"use client"
import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteArticle } from "@/lib/cms/data"
import { toast } from "@/components/ui/toast"
import { useConfirm, ConfirmDialog } from "@/components/admin/ConfirmDialog"

export function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { confirm, dialog } = useConfirm()

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete Article",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
    })
    if (!ok) return
    setLoading(true)
    const { error } = await deleteArticle(id)
    setLoading(false)
    if (error) {
      toast.error(error)
    } else {
      toast.success("Article deleted")
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        title="Delete"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>
      {dialog}
    </>
  )
}