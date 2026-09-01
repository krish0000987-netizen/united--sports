import { PageHeader } from "@/components/admin/PageHeader"
import { GalleryForm } from "@/components/admin/gallery/GalleryForm"
import { getGalleryItemById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function GalleryEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const item = isNew ? null : await getGalleryItemById(id)
  if (!isNew && !item) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "Add Gallery Item" : "Edit Gallery Item"}
        back="/admin/gallery"
      />
      <GalleryForm item={item} />
    </div>
  )
}