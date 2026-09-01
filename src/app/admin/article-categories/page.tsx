import { Card, Table, THead, TBody, TR, TH, TD, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getArticleCategories, deleteArticleCategory } from "@/lib/cms/data"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ArticleCategoriesPage() {
  const categories = await getArticleCategories()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Article Categories"
        description="Organize articles into categories."
        action={<AddButton href="/admin/article-categories/new" label="New Category" />}
      />

      <Card>
        {categories.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Create your first article category."
            action={<AddButton href="/admin/article-categories/new" label="New Category" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Slug</TH>
                <TH>Description</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {categories.map((c) => (
                <TR key={c.id}>
                  <TD>
                    <Link href={`/admin/article-categories/${c.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                      {c.name}
                    </Link>
                  </TD>
                  <TD className="text-xs text-slate-500">/{c.slug}</TD>
                  <TD className="text-xs text-slate-700 line-clamp-1">{c.description || "—"}</TD>
                  <TD>
                    <ActionButtons
                      id={c.id}
                      title={c.name}
                      editHref={`/admin/article-categories/${c.id}`}
                      entityType="article category"
                      onDelete={() => deleteArticleCategory(c.id)}
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