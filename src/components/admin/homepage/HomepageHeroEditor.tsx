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

type Hero = {
  id: string
  heading: string
  subheading: string | null
  button_text: string | null
  button_url: string | null
  background_image: string | null
  overlay_opacity: number | null
  is_enabled: boolean
}

export function HomepageHeroEditor({ hero }: { hero: Hero | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    heading: hero?.heading || "",
    subheading: hero?.subheading || "",
    button_text: hero?.button_text || "",
    button_url: hero?.button_url || "",
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
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Button Text"
            value={form.button_text}
            onChange={(e) => update("button_text", e.target.value)}
            placeholder="e.g. Get Involved"
          />
          <Input
            label="Button URL"
            value={form.button_url}
            onChange={(e) => update("button_url", e.target.value)}
            placeholder="/get-involved or https://..."
          />
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
