"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createPage, updatePage, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { slugify } from "@/lib/utils"
import { Page } from "@/lib/cms/types"

export function PageForm({ page }: { page: Page | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    excerpt: page?.excerpt || "",
    content: page?.content || "",
    featured_image: page?.featured_image || null,
    status: page?.status || "draft",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!page && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, page, form.slug])

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
    if (!validate()) {
      toast.error("Please fix the errors before saving")
      return
    }
    setSaving(true)
    try {
      const user = await getCurrentUser()
      const payload: any = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        featured_image: form.featured_image || null,
        status: form.status,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      }
      if (page) {
        const { error } = await updatePage(page.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "page",
          entity_id: page.id,
          description: form.title,
        })
        toast.success("Page updated")
        router.push("/admin/pages")
      } else {
        const { data, error } = await createPage(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "page",
          entity_id: data?.id || null,
          description: form.title,
        })
        toast.success("Page created")
        router.push("/admin/pages")
      }
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = page?.status === "published" ? `/${page.slug}` : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {previewUrl && (
          <Button asChild href={previewUrl} variant="outline">
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
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                error={errors.title}
                required
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                error={errors.slug}
                hint="URL-friendly identifier (e.g. about-us)"
                required
              />
              <Textarea
                label="Excerpt"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={3}
              />
              <Textarea
                label="Content"
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                rows={16}
                className="font-mono text-xs"
                hint="HTML or plain text content"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => update("meta_title", e.target.value)}
              />
              <Textarea
                label="Meta Description"
                value={form.meta_description}
                onChange={(e) => update("meta_description", e.target.value)}
                rows={3}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                value={form.status}
                onChange={(e) => update("status", e.target.value as any)}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.featured_image}
                onChange={(url) => update("featured_image", url)}
                folder="pages"
                aspectRatio="video"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}