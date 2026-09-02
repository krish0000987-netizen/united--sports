"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createProgramme, updateProgramme, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Programme } from "@/lib/cms/types"

export function ProgrammeForm({ programme }: { programme: Programme | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: programme?.title || "",
    slug: programme?.slug || "",
    description: programme?.description || "",
    content: programme?.content || "",
    image: programme?.image || null,
    status: programme?.status || "draft",
    display_order: programme?.display_order ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!programme && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, programme, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Title is required"
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
        description: form.description || null,
        content: form.content || null,
        image: form.image || null,
      }
      if (programme) {
        const { error } = await updateProgramme(programme.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "programme",
          entity_id: programme.id,
          description: form.title,
        })
        toast.success("Programme updated")
        router.push("/admin/programmes")
      } else {
        const { data, error } = await createProgramme(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "programme",
          entity_id: data?.id || null,
          description: form.title,
        })
        toast.success("Programme created")
        router.push("/admin/programmes")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {programme && programme.status === "published" && (
          <Button asChild href={`/programmes/${programme.slug}`} variant="outline">
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
              <CardTitle>Programme Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Title" value={form.title} onChange={(e) => update("title", e.target.value)} error={errors.title} required />
              <Input label="Slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} error={errors.slug} required />
              <Textarea label="Short Description" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
              <Textarea label="Full Content" value={form.content} onChange={(e) => update("content", e.target.value)} rows={10} className="font-mono text-xs" />
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
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
              <Input
                label="Display Order"
                type="number"
                value={form.display_order}
                onChange={(e) => update("display_order", parseInt(e.target.value) || 0)}
                hint="Lower numbers appear first"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.image}
                onChange={(url) => update("image", url)}
                folder="programmes"
                aspectRatio="video"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}