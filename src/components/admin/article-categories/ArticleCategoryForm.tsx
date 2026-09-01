"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"
import { Input, Textarea } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { toast } from "@/components/ui/toast"
import { createArticleCategory, updateArticleCategory, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { slugify } from "@/lib/utils"
import { ArticleCategory } from "@/lib/cms/types"

export function ArticleCategoryForm({ category }: { category: ArticleCategory | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!category && form.name && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }))
    }
  }, [form.name, category, form.slug])

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
        name: form.name,
        slug: form.slug,
        description: form.description || null,
      }
      if (category) {
        const { error } = await updateArticleCategory(category.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "article_category",
          entity_id: category.id,
          description: form.name,
        })
        toast.success("Category updated")
        router.push("/admin/article-categories")
      } else {
        const { data, error } = await createArticleCategory(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "article_category",
          entity_id: data?.id || null,
          description: form.name,
        })
        toast.success("Category created")
        router.push("/admin/article-categories")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        <Button onClick={save} variant="primary" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
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
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
          />
        </CardBody>
      </Card>
    </div>
  )
}