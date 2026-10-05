"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createTestimonial, updateTestimonial, createActivityLog, getCurrentUser } from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Testimonial } from "@/lib/cms/types"

export function TestimonialForm({ testimonial }: { testimonial: Testimonial | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: testimonial?.name || "",
    slug: testimonial?.slug || "",
    role: testimonial?.role || "",
    photo: testimonial?.photo || null,
    quote: testimonial?.quote || "",
    status: testimonial?.status || "active",
    display_order: testimonial?.display_order ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!testimonial && form.name && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }))
    }
  }, [form.name, testimonial, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Name is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    if (!form.quote.trim()) errs.quote = "Quote is required"
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
        role: form.role || null,
        photo: form.photo || null,
      }
      if (testimonial) {
        const { error } = await updateTestimonial(testimonial.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "testimonial",
          entity_id: testimonial.id,
          description: form.name,
        })
        toast.success("Testimonial updated")
        router.push("/admin/testimonials")
      } else {
        const { data, error } = await createTestimonial(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "testimonial",
          entity_id: data?.id || null,
          description: form.name,
        })
        toast.success("Testimonial created")
        router.push("/admin/testimonials")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        <Button onClick={save} variant="primary" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonial Details</CardTitle>
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
                label="Role / Title"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="e.g. Parent, Athlete, Coach"
              />
              <Textarea
                label="Quote"
                value={form.quote}
                onChange={(e) => update("quote", e.target.value)}
                error={errors.quote}
                rows={6}
                required
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
                folder="testimonials"
                aspectRatio="square"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}