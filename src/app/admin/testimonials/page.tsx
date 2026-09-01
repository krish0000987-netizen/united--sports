import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getTestimonials, deleteTestimonial } from "@/lib/cms/data"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Testimonials"
        description="Manage testimonials shown across the website."
        action={<AddButton href="/admin/testimonials/new" label="New Testimonial" />}
      />

      <Card>
        {testimonials.length === 0 ? (
          <EmptyState
            title="No testimonials yet"
            description="Add your first testimonial."
            action={<AddButton href="/admin/testimonials/new" label="New Testimonial" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Person</TH>
                <TH>Role</TH>
                <TH>Status</TH>
                <TH>Order</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {testimonials.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {t.photo && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <Image src={t.photo} alt={t.name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <Link href={`/admin/testimonials/${t.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                        {t.name}
                      </Link>
                    </div>
                  </TD>
                  <TD className="text-xs">{t.role || "—"}</TD>
                  <TD>
                    <Badge variant={t.status === "active" ? "success" : "default"}>
                      {t.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{t.display_order}</TD>
                  <TD>
                    <ActionButtons
                      id={t.id}
                      title={t.name}
                      editHref={`/admin/testimonials/${t.id}`}
                      entityType="testimonial"
                      onDelete={() => deleteTestimonial(t.id)}
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