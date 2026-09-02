import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getProgrammes, deleteProgramme } from "@/lib/cms/data"
import { formatDate } from "@/lib/format"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function ProgrammesPage() {
  const programmes = await getProgrammes()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Programmes"
        description="Manage your training programmes and courses."
        action={<AddButton href="/admin/programmes/new" label="New Programme" />}
      />

      <Card>
        {programmes.length === 0 ? (
          <EmptyState
            title="No programmes yet"
            description="Create your first training programme."
            action={<AddButton href="/admin/programmes/new" label="New Programme" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Programme</TH>
                <TH>Status</TH>
                <TH>Order</TH>
                <TH>Updated</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {programmes.map((p) => (
                <TR key={p.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <Link href={`/admin/programmes/${p.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                          {p.title}
                        </Link>
                        {p.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>}
                      </div>
                    </div>
                  </TD>
                  <TD>
                    <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "warning" : "default"}>
                      {p.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{p.display_order}</TD>
                  <TD className="text-xs text-slate-500">{formatDate(p.updated_at)}</TD>
                  <TD>
                    <ActionButtons
                      id={p.id}
                      title={p.title}
                      editHref={`/admin/programmes/${p.id}`}
                      viewHref={p.status === "published" ? `/programmes/${p.slug}` : null}
                      entityType="programme"
                      onDelete={async () => { await deleteProgramme(p.id) }}
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