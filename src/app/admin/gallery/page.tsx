import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getGalleryItems, deleteGalleryItem } from "@/lib/cms/data"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function GalleryPage() {
  const items = await getGalleryItems()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Gallery"
        description="Manage images and albums shown in your gallery section."
        action={<AddButton href="/admin/gallery/new" label="Add Item" />}
      />

      <Card>
        {items.length === 0 ? (
          <EmptyState
            title="No gallery items yet"
            description="Upload images to your gallery."
            action={<AddButton href="/admin/gallery/new" label="Add Item" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Image</TH>
                <TH>Category</TH>
                <TH>Status</TH>
                <TH>Order</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {items.map((g) => (
                <TR key={g.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Image src={g.image_url} alt={g.title || "Gallery"} fill className="object-cover" unoptimized />
                      </div>
                      <Link href={`/admin/gallery/${g.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A] line-clamp-1">
                        {g.title || "Untitled"}
                      </Link>
                    </div>
                  </TD>
                  <TD className="text-xs">{g.category || "—"}</TD>
                  <TD>
                    <Badge variant={g.status === "active" ? "success" : "default"}>
                      {g.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{g.display_order}</TD>
                  <TD>
                    <ActionButtons
                      id={g.id}
                      title={g.title || "Untitled"}
                      editHref={`/admin/gallery/${g.id}`}
                      entityType="gallery item"
                      onDelete={() => deleteGalleryItem(g.id)}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  )
}