import { PageHeader } from "@/components/admin/PageHeader"
import { ArticleForm } from "@/components/admin/articles/ArticleForm"
import { getArticleById, getArticleCategories } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const [article, categories] = await Promise.all([
    isNew ? Promise.resolve(null) : getArticleById(id),
    getArticleCategories(),
  ])

  if (!isNew && !article) {
    notFound()
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Article" : "Edit Article"}
        description={isNew ? "Create a new article for your website" : "Update this article"}
        back="/admin/articles"
      />
      <ArticleForm article={article} categories={categories} />
    </div>
  )
}