"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Save, Loader2, X, ArrowUp, ArrowDown, Edit, Trash2 } from "lucide-react"
import { Input, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { useConfirm } from "@/components/admin/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import { createNavigationItem, updateNavigationItem, deleteNavigationItem, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { NavigationItem } from "@/lib/cms/types"

export function NavigationManager({ items }: { items: NavigationItem[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { confirm, dialog } = useConfirm()

  async function toggleActive(item: NavigationItem) {
    setBusy(item.id)
    const { error } = await updateNavigationItem(item.id, { is_active: !item.is_active })
    setBusy(null)
    if (error) {
      toast.error(error)
    } else {
      toast.success(`Item ${item.is_active ? "deactivated" : "activated"}`)
      router.refresh()
    }
  }

  async function move(item: NavigationItem, direction: -1 | 1) {
    setBusy(item.id)
    const currentIndex = items.findIndex((i) => i.id === item.id)
    const targetIndex = currentIndex + direction
    if (targetIndex < 0 || targetIndex >= items.length) {
      setBusy(null)
      return
    }
    const target = items[targetIndex]
    await Promise.all([
      updateNavigationItem(item.id, { display_order: target.display_order }),
      updateNavigationItem(target.id, { display_order: item.display_order }),
    ])
    setBusy(null)
    const user = await getCurrentUser()
    await createActivityLog({
      admin_user_id: user?.id || null,
      admin_email: user?.email || null,
      action: "reorder",
      entity_type: "navigation_item",
      entity_id: item.id,
      description: `${item.label} moved ${direction === 1 ? "down" : "up"}`,
    })
    toast.success("Order updated")
    router.refresh()
  }

  async function remove(item: NavigationItem) {
    const ok = await confirm({
      title: "Delete navigation item",
      message: `Delete "${item.label}"? This cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
    })
    if (!ok) return
    setBusy(item.id)
    const { error } = await deleteNavigationItem(item.id)
    setBusy(null)
    if (error) {
      toast.error(error)
      return
    }
    const user = await getCurrentUser()
    await createActivityLog({
      admin_user_id: user?.id || null,
      admin_email: user?.email || null,
      action: "delete",
      entity_type: "navigation_item",
      entity_id: item.id,
      description: item.label,
    })
    toast.success("Navigation item deleted")
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => setShowNew(true)} variant="primary">
          <Plus size={14} /> New Item
        </Button>
      </div>

      {showNew && (
        <div className="mb-4">
          <NavigationEditor
            existingItems={items}
            onClose={() => setShowNew(false)}
            onSaved={() => {
              setShowNew(false)
              router.refresh()
            }}
          />
        </div>
      )}

      <Card>
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No navigation items yet. Create your first item above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={item.id} className="p-4">
                {editingId === item.id ? (
                  <NavigationEditor
                    existingItems={items}
                    item={item}
                    onClose={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null)
                      router.refresh()
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{item.label}</span>
                        <Badge variant={item.is_active ? "success" : "default"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {item.is_external && <Badge variant="info">External</Badge>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">{item.href}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Order: {item.display_order}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => move(item, -1)}
                        disabled={busy === item.id || idx === 0}
                        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => move(item, 1)}
                        disabled={busy === item.id || idx === items.length - 1}
                        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(item)}
                        disabled={busy === item.id}
                        className="h-8 px-2 grid place-items-center rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                      >
                        {busy === item.id ? <Loader2 size={14} className="animate-spin" /> : item.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => remove(item)}
                        disabled={busy === item.id}
                        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      {dialog}
    </>
  )
}

function NavigationEditor({
  item,
  existingItems,
  onClose,
  onSaved,
}: {
  item?: NavigationItem
  existingItems: NavigationItem[]
  onClose: () => void
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    label: item?.label || "",
    href: item?.href || "",
    parent_id: item?.parent_id || "",
    is_external: item?.is_external || false,
    is_active: item?.is_active ?? true,
    display_order: item?.display_order ?? Math.max(0, ...existingItems.map((i) => i.display_order)) + 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.label.trim()) errs.label = "Label is required"
    if (!form.href.trim()) errs.href = "Href is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save() {
    if (!validate()) {
      toast.error("Please fix the errors")
      return
    }
    setSaving(true)
    const payload = {
      label: form.label,
      href: form.href,
      parent_id: form.parent_id || null,
      is_external: form.is_external,
      is_active: form.is_active,
      display_order: form.display_order,
    }
    let error: string | null = null
    let savedId: string | null = item?.id || null
    if (item) {
      const res = await updateNavigationItem(item.id, payload)
      error = res.error
    } else {
      const res = await createNavigationItem(payload)
      error = res.error
      savedId = res.data?.id || null
    }
    setSaving(false)
    if (error) {
      toast.error(error)
      return
    }
    const user = await getCurrentUser()
    await createActivityLog({
      admin_user_id: user?.id || null,
      admin_email: user?.email || null,
      action: item ? "update" : "create",
      entity_type: "navigation_item",
      entity_id: savedId,
      description: form.label,
    })
    toast.success(item ? "Item updated" : "Item created")
    onSaved()
  }

  const parentOptions = existingItems.filter((i) => i.id !== item?.id)

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{item ? "Edit Item" : "New Navigation Item"}</CardTitle>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100" title="Close">
          <X size={14} />
        </button>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Label" value={form.label} onChange={(e) => update("label", e.target.value)} error={errors.label} required />
          <Input label="Href" value={form.href} onChange={(e) => update("href", e.target.value)} error={errors.href} placeholder="/about or https://..." required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Parent Item"
            value={form.parent_id}
            onChange={(e) => update("parent_id", e.target.value)}
            options={[
              { value: "", label: "— No parent (top level) —" },
              ...parentOptions.map((p) => ({ value: p.id, label: p.label })),
            ]}
          />
          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) => update("display_order", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.is_external} onChange={(e) => update("is_external", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            External link
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.is_active} onChange={(e) => update("is_active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Active
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={onClose} variant="outline" type="button">
            Cancel
          </Button>
          <Button onClick={save} variant="primary" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}