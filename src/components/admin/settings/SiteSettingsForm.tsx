"use client"
import { useState } from "react"
import { Save, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { updateSiteSettings, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { SiteSettings } from "@/lib/cms/types"

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    site_name: settings.site_name || "",
    description: settings.description || "",
    email: settings.email || "",
    phone: settings.phone || "",
    address: settings.address || "",
    whatsapp: settings.whatsapp || "",
    logo_url: settings.logo_url || null,
    favicon_url: settings.favicon_url || null,
    facebook_url: settings.facebook_url || "",
    instagram_url: settings.instagram_url || "",
    youtube_url: settings.youtube_url || "",
    twitter_url: settings.twitter_url || "",
    linkedin_url: settings.linkedin_url || "",
    primary_color: settings.primary_color || "",
    secondary_color: settings.secondary_color || "",
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function save() {
    if (!form.site_name.trim()) {
      toast.error("Site name is required")
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        site_name: form.site_name,
        description: form.description || null,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        whatsapp: form.whatsapp || null,
        logo_url: form.logo_url || null,
        favicon_url: form.favicon_url || null,
        facebook_url: form.facebook_url || null,
        instagram_url: form.instagram_url || null,
        youtube_url: form.youtube_url || null,
        twitter_url: form.twitter_url || null,
        linkedin_url: form.linkedin_url || null,
        primary_color: form.primary_color || null,
        secondary_color: form.secondary_color || null,
      }
      const { error } = await updateSiteSettings(settings.id, payload)
      if (error) {
        toast.error(error)
        return
      }
      const user = await getCurrentUser()
      await createActivityLog({
        admin_user_id: user?.id || null,
        admin_email: user?.email || null,
        action: "update",
        entity_type: "site_settings",
        entity_id: settings.id,
        description: form.site_name,
      })
      toast.success("Site settings updated")
    } catch (err) {
      toast.error("Failed to update site settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        <Button onClick={save} variant="primary" disabled={saving}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Site Name"
                value={form.site_name}
                onChange={(e) => update("site_name", e.target.value)}
                required
              />
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                hint="Short tagline or description used in metadata"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="info@example.com"
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 98765 43210"
              />
              <Input
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                placeholder="+919876543210 (with country code, no spaces)"
              />
              <Input
                label="Address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Full postal address"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Facebook"
                value={form.facebook_url}
                onChange={(e) => update("facebook_url", e.target.value)}
                placeholder="https://facebook.com/..."
              />
              <Input
                label="Instagram"
                value={form.instagram_url}
                onChange={(e) => update("instagram_url", e.target.value)}
                placeholder="https://instagram.com/..."
              />
              <Input
                label="YouTube"
                value={form.youtube_url}
                onChange={(e) => update("youtube_url", e.target.value)}
                placeholder="https://youtube.com/..."
              />
              <Input
                label="Twitter / X"
                value={form.twitter_url}
                onChange={(e) => update("twitter_url", e.target.value)}
                placeholder="https://twitter.com/..."
              />
              <Input
                label="LinkedIn"
                value={form.linkedin_url}
                onChange={(e) => update("linkedin_url", e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.logo_url}
                onChange={(url) => update("logo_url", url)}
                folder="site"
                aspectRatio="video"
                hint="Recommended: 400x100px (transparent PNG)"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favicon</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.favicon_url}
                onChange={(url) => update("favicon_url", url)}
                folder="site"
                aspectRatio="square"
                hint="Square icon, 512x512px ideal"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.primary_color || "#0B1D3A"}
                    onChange={(e) => update("primary_color", e.target.value)}
                    className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <Input
                    value={form.primary_color}
                    onChange={(e) => update("primary_color", e.target.value)}
                    placeholder="#0B1D3A"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.secondary_color || "#C9A227"}
                    onChange={(e) => update("secondary_color", e.target.value)}
                    className="h-10 w-14 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <Input
                    value={form.secondary_color}
                    onChange={(e) => update("secondary_color", e.target.value)}
                    placeholder="#C9A227"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}