"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Eye, EyeOff } from "lucide-react"
import { Input, Textarea } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { updateHomepageHero, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"

import { HomepageHero } from "@/lib/cms/types"

export function HomepageHeroEditor({ hero }: { hero: HomepageHero | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    heading: hero?.heading || "",
    subheading: hero?.subheading || "",
    button_text: hero?.button_text || "",
    button_url: hero?.button_url || "",
    secondary_button_text: hero?.secondary_button_text || "",
    secondary_button_url: hero?.secondary_button_url || "",
    stat_1_val: hero?.stat_1_val || "14+",
    stat_1_lbl: hero?.stat_1_lbl || "Sporting disciplines",
    stat_2_val: hero?.stat_2_val || "6",
    stat_2_lbl: hero?.stat_2_lbl || "Core programmes",
    stat_3_val: hero?.stat_3_val || "1",
    stat_3_lbl: hero?.stat_3_lbl || "Athlete-first promise",
    background_image: hero?.background_image || null,
    overlay_opacity: hero?.overlay_opacity ?? 0.5,
    is_enabled: hero?.is_enabled ?? true,
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    if (!hero) {
      toast.error("No hero record found. Run the database seed to create one.")
      return
    }
    if (!form.heading.trim()) {
      toast.error("Heading is required")
      return
    }
    setSaving(true)
    try {
      const { error } = await updateHomepageHero(hero.id, {
        heading: form.heading,
        subheading: form.subheading || null,
        button_text: form.button_text || null,
        button_url: form.button_url || null,
        secondary_button_text: form.secondary_button_text || null,
        secondary_button_url: form.secondary_button_url || null,
        stat_1_val: form.stat_1_val || null,
        stat_1_lbl: form.stat_1_lbl || null,
        stat_2_val: form.stat_2_val || null,
        stat_2_lbl: form.stat_2_lbl || null,
        stat_3_val: form.stat_3_val || null,
        stat_3_lbl: form.stat_3_lbl || null,
        background_image: form.background_image || null,
        overlay_opacity: form.overlay_opacity,
        is_enabled: form.is_enabled,
      })
      if (error) {
        toast.error(error)
        return
      }
      const user = await getCurrentUser()
      await createActivityLog({
        admin_user_id: user?.id || null,
        admin_email: user?.email || null,
        action: "update",
        entity_type: "homepage_hero",
        entity_id: hero.id,
        description: form.heading,
      })
      toast.success("Hero updated")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Hero Section</CardTitle>
        <Badge variant={form.is_enabled ? "success" : "default"}>
          {form.is_enabled ? "Visible" : "Hidden"}
        </Badge>
      </CardHeader>
      <CardBody className="space-y-4">
        <Input
          label="Heading"
          value={form.heading}
          onChange={(e) => update("heading", e.target.value)}
          required
        />
        <Textarea
          label="Subheading"
          value={form.subheading}
          onChange={(e) => update("subheading", e.target.value)}
          rows={3}
        />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Primary Action Button
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Primary Button Text"
              value={form.button_text}
              onChange={(e) => update("button_text", e.target.value)}
              placeholder="e.g. Get Involved"
            />
            <Input
              label="Primary Button URL"
              value={form.button_url}
              onChange={(e) => update("button_url", e.target.value)}
              placeholder="/get-involved or https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Secondary Action Button (Optional)
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Secondary Button Text"
              value={form.secondary_button_text}
              onChange={(e) => update("secondary_button_text", e.target.value)}
              placeholder="e.g. Explore Opportunities"
            />
            <Input
              label="Secondary Button URL"
              value={form.secondary_button_url}
              onChange={(e) => update("secondary_button_url", e.target.value)}
              placeholder="/programmes or https://..."
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Hero Highlight Counters (Below Buttons)
          </label>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Stat 1</span>
              <Input
                label="Number / Metric"
                value={form.stat_1_val}
                onChange={(e) => update("stat_1_val", e.target.value)}
                placeholder="14+"
              />
              <Input
                label="Label"
                value={form.stat_1_lbl}
                onChange={(e) => update("stat_1_lbl", e.target.value)}
                placeholder="Sporting disciplines"
              />
            </div>
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Stat 2</span>
              <Input
                label="Number / Metric"
                value={form.stat_2_val}
                onChange={(e) => update("stat_2_val", e.target.value)}
                placeholder="6"
              />
              <Input
                label="Label"
                value={form.stat_2_lbl}
                onChange={(e) => update("stat_2_lbl", e.target.value)}
                placeholder="Core programmes"
              />
            </div>
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Stat 3</span>
              <Input
                label="Number / Metric"
                value={form.stat_3_val}
                onChange={(e) => update("stat_3_val", e.target.value)}
                placeholder="1"
              />
              <Input
                label="Label"
                value={form.stat_3_lbl}
                onChange={(e) => update("stat_3_lbl", e.target.value)}
                placeholder="Athlete-first promise"
              />
            </div>
          </div>
        </div>

        <ImageUploader
          value={form.background_image}
          onChange={(url) => update("background_image", url)}
          folder="homepage"
          aspectRatio="wide"
          hint="Background image for the hero (1920x1080 recommended)"
        />
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Overlay Opacity: {Math.round(form.overlay_opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={form.overlay_opacity}
              onChange={(e) => update("overlay_opacity", parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => update("is_enabled", !form.is_enabled)}
            className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 pb-2"
          >
            {form.is_enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            {form.is_enabled ? "Visible on homepage" : "Hidden from homepage"}
          </button>
        </div>
        <div className="flex justify-end">
          <Button onClick={save} variant="primary" disabled={saving}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving..." : "Save Hero"}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
