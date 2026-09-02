"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createAthlete, updateAthlete, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Athlete } from "@/lib/cms/types"

export function AthleteForm({ athlete }: { athlete: Athlete | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: athlete?.name || "",
    slug: athlete?.slug || "",
    sport: athlete?.sport || "",
    category: athlete?.category || "",
    nationality: athlete?.nationality || "",
    biography: athlete?.biography || "",
    achievements: athlete?.achievements || "",
    photo: athlete?.photo || null,
    status: athlete?.status || "published",
    display_order: athlete?.display_order ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!athlete && form.name && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }))
    }
  }, [form.name, athlete, form.slug])

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
    if (!validate()) return
    setSaving(true)
    try {
      const user = await getCurrentUser()
      const payload = {
        ...form,
        sport: form.sport || null,
        category: form.category || null,
        nationality: form.nationality || null,
        biography: form.biography || null,
        achievements: form.achievements || null,
        photo: form.photo || null,
      }
      if (athlete) {
        const { error } = await updateAthlete(athlete.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "athlete",
          entity_id: athlete.id,
          description: form.name,
        })
        toast.success("Athlete updated")
        router.push("/admin/athletes")
      } else {
        const { data, error } = await createAthlete(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "athlete",
          entity_id: data?.id || null,
          description: form.name,
        })
        toast.success("Athlete created")
        router.push("/admin/athletes")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {athlete && athlete.status === "published" && (
          <Button asChild href={`/athletes/${athlete.slug}`} variant="outline">
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
              <CardTitle>Athlete Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Name" value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} required />
              <Input label="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} error={errors.slug} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Sport" value={form.sport} onChange={(e) => update("sport", e.target.value)} placeholder="e.g. Football, Cricket" />
                <Input label="Category" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. Senior, Junior" />
              </div>
              <Input label="Nationality" value={form.nationality} onChange={(e) => update("nationality", e.target.value)} placeholder="e.g. India" />
              <Textarea label="Biography" value={form.biography} onChange={(e) => update("biography", e.target.value)} rows={6} />
              <Textarea label="Achievements" value={form.achievements} onChange={(e) => update("achievements", e.target.value)} rows={4} placeholder="e.g. National Champion 2024, Olympic Medalist" />
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
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
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
              <CardTitle>Photo</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.photo}
                onChange={(url) => update("photo", url)}
                folder="athletes"
                aspectRatio="square"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}