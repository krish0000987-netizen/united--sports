import { PageHeader } from "@/components/admin/PageHeader"
import { ArticleCategoryForm } from "@/components/admin/article-categories/ArticleCategoryForm"
import { getArticleCategories } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ArticleCategoryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  let category: Awaited<ReturnType<typeof getArticleCategories>>[number] | null = null
  if (!isNew) {
    const all = await getArticleCategories()
    category = all.find((c) => c.id === id) || null
    if (!category) notFound()
  }

  return (
    <div>
      <PageHeader
        title={isNew ? "New Category" : "Edit Category"}
        back="/admin/article-categories"
      />
      <ArticleCategoryForm category={category} />
    </div>
  )
}