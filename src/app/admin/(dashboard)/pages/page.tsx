import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getPages, deletePage } from "@/lib/cms/data"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PagesPage() {
  const pages = await getPages()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Pages"
        description="Manage standalone pages like About, Terms, Privacy Policy, etc."
        action={<AddButton href="/admin/pages/new" label="New Page" />}
      />

      <Card>
        {pages.length === 0 ? (
          <EmptyState
            title="No pages yet"
            description="Create your first page."
            action={<AddButton href="/admin/pages/new" label="New Page" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Slug</TH>
                <TH>Status</TH>
                <TH>Updated</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {pages.map((p) => (
                <TR key={p.id}>
                  <TD>
                    <Link href={`/admin/pages/${p.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                      {p.title}
                    </Link>
                  </TD>
                  <TD className="text-xs text-slate-500">/{p.slug}</TD>
                  <TD>
                    <Badge variant={p.status === "published" ? "success" : p.status === "draft" ? "warning" : "default"}>
                      {p.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs text-slate-500">{formatDate(p.updated_at, "datetime")}</TD>
                  <TD>
                    <ActionButtons
                      id={p.id}
                      title={p.title}
                      editHref={`/admin/pages/${p.id}`}
                      viewHref={p.status === "published" ? `/${p.slug}` : null}
                      entityType="page"
                      onDelete={async () => { await deletePage(p.id) }}
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