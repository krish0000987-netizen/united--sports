"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Save, Loader2, X, Trash2, Edit, ArrowUp, ArrowDown, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { useConfirm } from "@/components/admin/ConfirmDialog"
import { toast } from "@/components/ui/toast"
import {
  createFooterSection,
  updateFooterSection,
  deleteFooterSection,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  createActivityLog,
  getCurrentUser,
} from "@/lib/cms/client-actions"
import { FooterSection, FooterLink } from "@/lib/cms/types"

export function FooterManager({ sections }: { sections: FooterSection[] }) {
  const router = useRouter()
  const [showNewSection, setShowNewSection] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [linkSectionId, setLinkSectionId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const { confirm, dialog } = useConfirm()

  async function moveSection(section: FooterSection, dir: -1 | 1) {
    setBusy(section.id)
    const idx = sections.findIndex((s) => s.id === section.id)
    const target = sections[idx + dir]
    if (!target) {
      setBusy(null)
      return
    }
    await Promise.all([
      updateFooterSection(section.id, { display_order: target.display_order }),
      updateFooterSection(target.id, { display_order: section.display_order }),
    ])
    setBusy(null)
    const user = await getCurrentUser()
    await createActivityLog({
      admin_user_id: user?.id || null,
      admin_email: user?.email || null,
      action: "reorder",
      entity_type: "footer_section",
      entity_id: section.id,
      description: `${section.title} moved ${dir === 1 ? "down" : "up"}`,
    })
    router.refresh()
  }

  async function toggleSection(section: FooterSection) {
    setBusy(section.id)
    const { error } = await updateFooterSection(section.id, { is_active: !section.is_active })
    setBusy(null)
    if (error) {
      toast.error(error)
    } else {
      toast.success(section.is_active ? "Section deactivated" : "Section activated")
      router.refresh()
    }
  }

  async function removeSection(section: FooterSection) {
    const ok = await confirm({
      title: "Delete section",
      message: `Delete "${section.title}" and all its links? This cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
    })
    if (!ok) return
    setBusy(section.id)
    const { error } = await deleteFooterSection(section.id)
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
      entity_type: "footer_section",
      entity_id: section.id,
      description: section.title,
    })
    toast.success("Section deleted")
    router.refresh()
  }

  async function moveLink(link: FooterLink, section: FooterSection, dir: -1 | 1) {
    setBusy(link.id)
    const links = section.links || []
    const idx = links.findIndex((l) => l.id === link.id)
    const target = links[idx + dir]
    if (!target) {
      setBusy(null)
      return
    }
    await Promise.all([
      updateFooterLink(link.id, { display_order: target.display_order }),
      updateFooterLink(target.id, { display_order: link.display_order }),
    ])
    setBusy(null)
    router.refresh()
  }

  async function removeLink(link: FooterLink) {
    const ok = await confirm({
      title: "Delete link",
      message: `Delete "${link.label}"? This cannot be undone.`,
      variant: "danger",
      confirmText: "Delete",
    })
    if (!ok) return
    setBusy(link.id)
    const { error } = await deleteFooterLink(link.id)
    setBusy(null)
    if (error) {
      toast.error(error)
      return
    }
    await createActivityLog({
      admin_user_id: null,
      admin_email: null,
      action: "delete",
      entity_type: "footer_link",
      entity_id: link.id,
      description: link.label,
    })
    toast.success("Link deleted")
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => setShowNewSection(true)} variant="primary">
          <Plus size={14} /> New Section
        </Button>
      </div>

      {showNewSection && (
        <div className="mb-4">
          <SectionEditor
            sections={sections}
            onClose={() => setShowNewSection(false)}
            onSaved={() => {
              setShowNewSection(false)
              router.refresh()
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {sections.length === 0 && !showNewSection && (
          <Card>
            <div className="p-8 text-center text-sm text-slate-500">
              No footer sections yet. Create your first section above.
            </div>
          </Card>
        )}

        {sections.map((section, sIdx) => (
          <Card key={section.id}>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>{section.title}</CardTitle>
                <Badge variant={section.is_active ? "success" : "default"}>
                  {section.is_active ? "Active" : "Inactive"}
                </Badge>
                <span className="text-xs text-slate-500">Order: {section.display_order}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveSection(section, -1)}
                  disabled={busy === section.id || sIdx === 0}
                  className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  onClick={() => moveSection(section, 1)}
                  disabled={busy === section.id || sIdx === sections.length - 1}
                  className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => toggleSection(section)}
                  disabled={busy === section.id}
                  className="h-8 px-2 grid place-items-center rounded-lg text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                >
                  {busy === section.id ? <Loader2 size={14} className="animate-spin" /> : section.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => setEditingSectionId(section.id)}
                  className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => removeSection(section)}
                  disabled={busy === section.id}
                  className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </CardHeader>
            <CardBody>
              {editingSectionId === section.id && (
                <div className="mb-4">
                  <SectionEditor
                    sections={sections}
                    section={section}
                    onClose={() => setEditingSectionId(null)}
                    onSaved={() => {
                      setEditingSectionId(null)
                      router.refresh()
                    }}
                  />
                </div>
              )}

              {linkSectionId === section.id && (
                <div className="mb-4">
                  <LinkEditor
                    section={section}
                    onClose={() => setLinkSectionId(null)}
                    onSaved={() => {
                      setLinkSectionId(null)
                      router.refresh()
                    }}
                  />
                </div>
              )}

              {(section.links || []).length === 0 && linkSectionId !== section.id ? (
                <div className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                  No links yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                  {(section.links || []).map((link, lIdx) => (
                    <div key={link.id}>
                      {editingLinkId === link.id ? (
                        <div className="p-3 bg-slate-50">
                          <LinkEditor
                            section={section}
                            link={link}
                            onClose={() => setEditingLinkId(null)}
                            onSaved={() => {
                              setEditingLinkId(null)
                              router.refresh()
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3 px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm font-medium text-slate-900 truncate">{link.label}</span>
                            <span className="text-xs text-slate-500 truncate">{link.href}</span>
                            {link.is_external && <ExternalLink size={12} className="text-slate-400 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => moveLink(link, section, -1)}
                              disabled={busy === link.id || lIdx === 0}
                              className="h-7 w-7 grid place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={() => moveLink(link, section, 1)}
                              disabled={busy === link.id || lIdx === (section.links?.length || 0) - 1}
                              className="h-7 w-7 grid place-items-center rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown size={12} />
                            </button>
                            <button
                              onClick={() => setEditingLinkId(link.id)}
                              className="h-7 w-7 grid place-items-center rounded text-slate-500 hover:bg-slate-100"
                              title="Edit"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => removeLink(link)}
                              disabled={busy === link.id}
                              className="h-7 w-7 grid place-items-center rounded text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {linkSectionId !== section.id && (
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => setLinkSectionId(section.id)} variant="outline" size="sm">
                    <Plus size={12} /> Add Link
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
      {dialog}
    </>
  )
}

function SectionEditor({
  section,
  sections,
  onClose,
  onSaved,
}: {
  section?: FooterSection
  sections: FooterSection[]
  onClose: () => void
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: section?.title || "",
    display_order: section?.display_order ?? Math.max(0, ...sections.map((s) => s.display_order)) + 1,
    is_active: section?.is_active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function save() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Title is required"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    const payload = {
      title: form.title,
      display_order: form.display_order,
      is_active: form.is_active,
    }
    let error: string | null = null
    let savedId: string | null = section?.id || null
    if (section) {
      const res = await updateFooterSection(section.id, payload)
      error = res.error
    } else {
      const res = await createFooterSection(payload)
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
      action: section ? "update" : "create",
      entity_type: "footer_section",
      entity_id: savedId,
      description: form.title,
    })
    toast.success(section ? "Section updated" : "Section created")
    onSaved()
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{section ? "Edit Section" : "New Section"}</CardTitle>
        <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-slate-100">
          <X size={14} />
        </button>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} required />
          <Input
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
        <div className="flex justify-end gap-2">
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

function LinkEditor({
  section,
  link,
  onClose,
  onSaved,
}: {
  section: FooterSection
  link?: FooterLink
  onClose: () => void
  onSaved: () => void
}) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    label: link?.label || "",
    href: link?.href || "",
    is_external: link?.is_external || false,
    display_order: link?.display_order ?? Math.max(0, ...(section.links || []).map((l) => l.display_order)) + 1,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function save() {
    const errs: Record<string, string> = {}
    if (!form.label.trim()) errs.label = "Label is required"
    if (!form.href.trim()) errs.href = "Href is required"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    const payload = {
      section_id: section.id,
      label: form.label,
      href: form.href,
      is_external: form.is_external,
      display_order: form.display_order,
    }
    let error: string | null = null
    let savedId: string | null = link?.id || null
    if (link) {
      const res = await updateFooterLink(link.id, payload)
      error = res.error
    } else {
      const res = await createFooterLink(payload)
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
      action: link ? "update" : "create",
      entity_type: "footer_link",
      entity_id: savedId,
      description: form.label,
    })
    toast.success(link ? "Link updated" : "Link created")
    onSaved()
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} error={errors.label} required />
        <Input label="Href" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} error={errors.href} placeholder="/about or https://..." required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <Input
          label="Display Order"
          type="number"
          value={form.display_order}
          onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
        />
        <label className="flex items-center gap-2 text-sm text-slate-700 pb-2">
          <input
            type="checkbox"
            checked={form.is_external}
            onChange={(e) => setForm({ ...form, is_external: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          External link
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} variant="outline" size="sm" type="button">
          Cancel
        </Button>
        <Button onClick={save} variant="primary" size="sm" disabled={saving}>
          <Save size={12} /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}