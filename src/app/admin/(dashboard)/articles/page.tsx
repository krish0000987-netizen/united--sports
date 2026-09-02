import Link from "next/link"
import { Edit, Eye } from "lucide-react"
import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { getArticles } from "@/lib/cms/data"
import { formatDate } from "@/lib/format"
import { DeleteArticleButton } from "@/components/admin/articles/DeleteArticleButton"

export const dynamic = "force-dynamic"

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Articles"
        description="Manage your news, blog posts and announcements."
        action={<AddButton href="/admin/articles/new" label="New Article" />}
      />

      <Card>
        {articles.length === 0 ? (
          <EmptyState
            title="No articles yet"
            description="Get started by creating your first article."
            action={<AddButton href="/admin/articles/new" label="New Article" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Status</TH>
                <TH>Category</TH>
                <TH>Created</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {articles.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <Link href={`/admin/articles/${a.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                      {a.title}
                    </Link>
                    {a.excerpt && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{a.excerpt}</p>}
                  </TD>
                  <TD>
                    <Badge variant={a.status === "published" ? "success" : a.status === "draft" ? "warning" : "default"}>
                      {a.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{(a as any).category?.name || "—"}</TD>
                  <TD className="text-xs text-slate-500">{formatDate(a.created_at)}</TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "published" && (
                        <Link
                          href={`/news/${a.slug}`}
                          target="_blank"
                          className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                          title="View on website"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${a.id}`}
                        className="h-8 w-8 grid place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </Link>
                      <DeleteArticleButton id={a.id} title={a.title} />
                    </div>
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