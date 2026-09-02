import { PageHeader } from "@/components/admin/PageHeader"
import { PageForm } from "@/components/admin/pages/PageForm"
import { getPageById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const page = isNew ? null : await getPageById(id)
  if (!isNew && !page) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Page" : "Edit Page"}
        back="/admin/pages"
      />
      <PageForm page={page} />
    </div>
  )
}