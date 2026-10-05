"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createTeam, updateTeam, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Team } from "@/lib/cms/types"

export function TeamForm({ team }: { team: Team | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: team?.name || "",
    slug: team?.slug || "",
    sport: team?.sport || "",
    description: team?.description || "",
    logo: team?.logo || null,
    cover_image: team?.cover_image || null,
    status: team?.status || "active",
    display_order: team?.display_order ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!team && form.name && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }))
    }
  }, [form.name, team, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save() {
    if (!validate()) {
      toast.error("Please fix the errors before saving")
      return
    }
    setSaving(true)
    try {
      const user = await getCurrentUser()
      const payload = {
        ...form,
        sport: form.sport || null,
        description: form.description || null,
        logo: form.logo || null,
        cover_image: form.cover_image || null,
      }
      if (team) {
        const { error } = await updateTeam(team.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "team",
          entity_id: team.id,
          description: form.name,
        })
        toast.success("Team updated")
        router.push("/admin/teams")
      } else {
        const { data, error } = await createTeam(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "team",
          entity_id: data?.id || null,
          description: form.name,
        })
        toast.success("Team created")
        router.push("/admin/teams")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {team && team.status === "published" && (
          <Button asChild href={`/teams/${team.slug}`} variant="outline">
            <Eye size={14} /> Preview
          </Button>
        )}
        <Button onClick={save} variant="primary" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                error={errors.name}
                required
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                error={errors.slug}
                hint="URL-friendly identifier"
                required
              />
              <Input
                label="Sport"
                value={form.sport}
                onChange={(e) => update("sport", e.target.value)}
                placeholder="e.g. Football, Cricket, Basketball"
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={6}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.cover_image}
                onChange={(url) => update("cover_image", url)}
                folder="teams"
                aspectRatio="wide"
                hint="Recommended size: 1920x600px"
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as any)}
                options={[
                  { value: "active", label: "Active (Published)" },
                  { value: "inactive", label: "Inactive (Draft)" },
                ]}
              />
              <Input
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(e) => update("display_order", parseInt(e.target.value) || 0)}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.logo}
                onChange={(url) => update("logo", url)}
                folder="teams"
                aspectRatio="square"
                hint="Square logo, recommended 512x512px"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}