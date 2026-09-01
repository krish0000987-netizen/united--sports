"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createGalleryItem, updateGalleryItem, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { slugify } from "@/lib/utils"
import { GalleryItem } from "@/lib/cms/types"

export function GalleryForm({ item }: { item: GalleryItem | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: item?.title || "",
    slug: item?.slug || "",
    image_url: item?.image_url || "",
    description: item?.description || "",
    category: item?.category || "",
    status: item?.status || "active",
    display_order: item?.display_order ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!item && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, item, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.image_url) errs.image_url = "Image is required"
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
        title: form.title || null,
        slug: form.slug || null,
        image_url: form.image_url || "",
        description: form.description || null,
        category: form.category || null,
        status: form.status,
        display_order: form.display_order,
      }
      if (item) {
        const { error } = await updateGalleryItem(item.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "gallery_item",
          entity_id: item.id,
          description: form.title || "Untitled",
        })
        toast.success("Gallery item updated")
        router.push("/admin/gallery")
      } else {
        const { data, error } = await createGalleryItem(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "gallery_item",
          entity_id: data?.id || null,
          description: form.title || "Untitled",
        })
        toast.success("Gallery item created")
        router.push("/admin/gallery")
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
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardBody>
              {errors.image_url && <p className="text-xs text-red-600 mb-2">{errors.image_url}</p>}
              <ImageUploader
                value={form.image_url || null}
                onChange={(url) => update("image_url", url || "")}
                folder="gallery"
                aspectRatio="video"
                hint="Recommended size: 1200x800px"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                hint="URL-friendly identifier (auto-generated from title)"
              />
              <Input
                label="Category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                placeholder="e.g. Training, Matches, Events"
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
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
                  { value: "active", label: "Active" },
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
        </div>
      </div>
    </div>
  )
}