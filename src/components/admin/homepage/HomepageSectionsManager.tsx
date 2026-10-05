"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Input, Textarea } from "@/components/ui/form"
import { Card, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { toast } from "@/components/ui/toast"
import { updateHomepageSection, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
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

  const isFocus = section.section_key === "focus"
  const defaultPillars = [
    { n: "01", title: "Sports Development", text: "Supporting athletes across India in their journey from potential to national performance.", img: "/assets/support.jpg", alt: "Sports training and athletics development" },
    { n: "02", title: "Facilities", text: "Helping athletes access quality sports infrastructure and world-class training environments.", img: "/assets/facility.jpg", alt: "Modern indoor sports arena" },
    { n: "03", title: "Equipment", text: "Providing access to essential tournament-grade sports equipment and resources.", img: "/assets/equipment.jpg", alt: "Sports equipment" },
    { n: "04", title: "Opportunities", text: "Creating pathways for youth to showcase talent and compete in state and national championships.", img: "/assets/community.jpg", alt: "Athletes in a huddle" },
  ]
  const [pillars, setPillars] = useState<any[]>(
    isFocus && Array.isArray(section.content?.pillars) && section.content.pillars.length > 0
      ? section.content.pillars
      : defaultPillars
  )
  const [tab, setTab] = useState<"visual" | "raw">("visual")

  async function handleSave() {
    let parsedContent: Record<string, any> = {}
    if (isFocus && tab === "visual") {
      parsedContent = { pillars }
    } else if (contentText.trim()) {
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
            <Input label="Section Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input label="Subtitle / Eyebrow" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <Textarea label="Description / Summary" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
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

          {isFocus && (
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Four Focus Pillars
                </span>
                <div className="flex bg-slate-100 p-0.5 rounded text-xs">
                  <button
                    type="button"
                    onClick={() => setTab("visual")}
                    className={`px-2.5 py-1 rounded ${tab === "visual" ? "bg-white font-bold shadow-sm" : "text-slate-500"}`}
                  >
                    Visual Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setContentText(JSON.stringify({ pillars }, null, 2))
                      setTab("raw")
                    }}
                    className={`px-2.5 py-1 rounded ${tab === "raw" ? "bg-white font-bold shadow-sm" : "text-slate-500"}`}
                  >
                    Raw JSON
                  </button>
                </div>
              </div>

              {tab === "visual" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {pillars.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>Pillar {p.n || `#${idx + 1}`}</span>
                      </div>
                      <Input
                        label="Pillar Title"
                        value={p.title}
                        onChange={(e) => {
                          const copy = [...pillars]
                          copy[idx] = { ...copy[idx], title: e.target.value }
                          setPillars(copy)
                        }}
                      />
                      <Textarea
                        label="Description"
                        value={p.text}
                        onChange={(e) => {
                          const copy = [...pillars]
                          copy[idx] = { ...copy[idx], text: e.target.value }
                          setPillars(copy)
                        }}
                        rows={2}
                      />
                      <Input
                        label="Image URL"
                        value={p.img}
                        onChange={(e) => {
                          const copy = [...pillars]
                          copy[idx] = { ...copy[idx], img: e.target.value }
                          setPillars(copy)
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(!isFocus || tab === "raw") && (
            <Textarea
              label="Section Content (JSON)"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={8}
              className="font-mono text-xs"
              hint="JSON object with section-specific fields"
            />
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} variant="primary" disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? "Saving..." : "Save Section"}
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  )
}