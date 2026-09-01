"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, X, ChevronDown, ChevronUp } from "lucide-react"
import { Input, Textarea } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { toast } from "@/components/ui/toast"
import { updateHomepageSection, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { HomepageSection } from "@/lib/cms/types"

export function HomepageSectionsManager({ sections }: { sections: HomepageSection[] }) {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {sections.length === 0 && (
        <Card>
          <div className="p-8 text-center text-sm text-slate-500">
            No homepage sections configured.
          </div>
        </Card>
      )}

      {sections.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          expanded={expandedId === section.id}
          onToggle={() => setExpandedId(expandedId === section.id ? null : section.id)}
          saving={busy === section.id}
          onSave={async (payload) => {
            setBusy(section.id)
            const { error } = await updateHomepageSection(section.id, payload)
            setBusy(null)
            if (error) {
              toast.error(error)
              return
            }
            const user = await getCurrentUser()
            await createActivityLog({
              admin_user_id: user?.id || null,
              admin_email: user?.email || null,
              action: "update",
              entity_type: "homepage_section",
              entity_id: section.id,
              description: section.section_key,
            })
            toast.success(`${section.section_key} updated`)
            router.refresh()
          }}
        />
      ))}
    </div>
  )
}

function SectionEditor({
  section,
  expanded,
  onToggle,
  saving,
  onSave,
}: {
  section: HomepageSection
  expanded: boolean
  onToggle: () => void
  saving: boolean
  onSave: (payload: Partial<HomepageSection>) => Promise<void>
}) {
  const [title, setTitle] = useState(section.title || "")
  const [subtitle, setSubtitle] = useState(section.subtitle || "")
  const [description, setDescription] = useState(section.description || "")
  const [isVisible, setIsVisible] = useState(section.is_visible)
  const [displayOrder, setDisplayOrder] = useState(section.display_order)
  const [contentText, setContentText] = useState(
    section.content ? JSON.stringify(section.content, null, 2) : ""
  )

  async function handleSave() {
    let parsedContent: Record<string, any> = {}
    if (contentText.trim()) {
      try {
        parsedContent = JSON.parse(contentText)
      } catch {
        toast.error("Content must be valid JSON")
        return
      }
    }
    await onSave({
      title: title || null,
      subtitle: subtitle || null,
      description: description || null,
      is_visible: isVisible,
      display_order: displayOrder,
      content: parsedContent,
    })
  }

  return (
    <Card>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
          <div>
            <p className="font-semibold text-slate-900">{section.title || section.section_key}</p>
            <p className="text-xs text-slate-500 mt-0.5">{section.section_key} · {section.subtitle || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={section.is_visible ? "success" : "default"}>
            {section.is_visible ? "Visible" : "Hidden"}
          </Badge>
          <span className="text-xs text-slate-500">Order: {section.display_order}</span>
        </div>
      </button>

      {expanded && (
        <CardBody className="border-t border-slate-100 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700 pb-2">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Visible on homepage
            </label>
          </div>
          <Textarea
            label="Content (JSON)"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            rows={10}
            className="font-mono text-xs"
            hint="JSON object with section-specific fields (e.g. items, cta, etc.)"
          />
          <div className="flex justify-end">
            <Button onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  )
}