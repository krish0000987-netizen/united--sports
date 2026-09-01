"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, Send } from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import { createArticle, updateArticle, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { slugify } from "@/lib/utils"
import { Article, ArticleCategory } from "@/lib/cms/types"

export function ArticleForm({ article, categories }: { article: Article | null; categories: ArticleCategory[] }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    featured_image: article?.featured_image || null,
    status: article?.status || "draft",
    published_at: article?.published_at ? article.published_at.split("T")[0] : "",
    category_id: article?.category_id || "",
    meta_title: article?.meta_title || "",
    meta_description: article?.meta_description || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!article && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, article, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Title is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    else if (!/^[a-z0-9-]+$/.test(form.slug)) errs.slug = "Slug must be lowercase letters, numbers, and hyphens only"
    if (!form.excerpt.trim()) errs.excerpt = "Excerpt is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function save(status?: string) {
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
        excerpt: form.excerpt,
        content: form.content,
        featured_image: form.featured_image || null,
        status: status || form.status,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : status === "published" ? new Date().toISOString() : null,
        category_id: form.category_id || null,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      }
      if (article) {
        payload.author_id = payload.author_id || article.author_id
        const { data, error } = await updateArticle(article.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: status === "published" ? "publish" : "update",
          entity_type: "article",
          entity_id: article.id,
          description: form.title,
        })
        toast.success(status === "published" ? "Article published" : "Article updated")
        router.push("/admin/articles")
      } else {
        payload.author_id = user?.id || null
        const { data, error } = await createArticle(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: status === "published" ? "create_and_publish" : "create",
          entity_type: "article",
          entity_id: data?.id || null,
          description: form.title,
        })
        toast.success(status === "published" ? "Article created and published" : "Article created as draft")
        router.push("/admin/articles")
      }
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = article?.status === "published" ? `/news/${article.slug}` : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        {previewUrl && (
          <Button asChild href={previewUrl} variant="outline" size="md">
            <Eye size={14} /> Preview
          </Button>
        )}
        <Button onClick={() => save("draft")} variant="outline" disabled={saving}>
          <Save size={14} /> Save Draft
        </Button>
        <Button onClick={() => save("published")} variant="primary" disabled={saving}>
          <Send size={14} /> {form.status === "published" ? "Update" : "Publish"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
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
                hint="URL-friendly identifier (e.g. my-article-title)"
                required
              />
              <Textarea
                label="Excerpt"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                error={errors.excerpt}
                hint="Brief summary shown in article lists"
                required
                rows={3}
              />
              <Textarea
                label="Content"
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                hint="Full article content (supports plain text or HTML)"
                rows={16}
                className="font-mono text-xs"
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
                hint="Title used in search engines (leave blank to use article title)"
              />
              <Textarea
                label="Meta Description"
                value={form.meta_description}
                onChange={(e) => update("meta_description", e.target.value)}
                hint="Description shown in search engine results"
                rows={3}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1.5">Status</p>
                <Badge variant={form.status === "published" ? "success" : form.status === "draft" ? "warning" : "default"}>
                  {form.status}
                </Badge>
              </div>
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
                label="Publish Date"
                type="date"
                value={form.published_at}
                onChange={(e) => update("published_at", e.target.value)}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category</CardTitle>
            </CardHeader>
            <CardBody>
              <Select
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                options={[
                  { value: "", label: "— No category —" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
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
                folder="articles"
                aspectRatio="video"
                hint="Recommended size: 1200x630px"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}