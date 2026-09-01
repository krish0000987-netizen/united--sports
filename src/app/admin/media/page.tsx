import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { MediaGrid } from "@/components/admin/media/MediaGrid"
import { getGalleryItems } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function MediaPage() {
  const items = await getGalleryItems()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Media Library"
        description="All uploaded images and media assets."
        action={<AddButton href="/admin/gallery/new" label="Upload Media" />}
      />
      <MediaGrid items={items} />
    </div>
  )
}