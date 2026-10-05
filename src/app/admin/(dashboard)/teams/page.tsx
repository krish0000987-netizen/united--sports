import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getAllTeams, deleteTeam } from "@/lib/cms/admin-actions"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function TeamsPage() {
  const teams = await getAllTeams()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Teams"
        description="Manage your sports teams and their profiles."
        action={<AddButton href="/admin/teams/new" label="New Team" />}
      />

      <Card>
        {teams.length === 0 ? (
          <EmptyState
            title="No teams yet"
            description="Add your first sports team."
            action={<AddButton href="/admin/teams/new" label="New Team" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Team</TH>
                <TH>Sport</TH>
                <TH>Status</TH>
                <TH>Order</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {teams.map((t) => (
                <TR key={t.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {t.logo && (
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image src={t.logo} alt={t.name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <Link href={`/admin/teams/${t.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                          {t.name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">/{t.slug}</p>
                      </div>
                    </div>
                  </TD>
                  <TD className="text-xs">{t.sport || "—"}</TD>
                  <TD>
                    <Badge variant={t.status === "active" || t.status === "published" ? "success" : "default"}>
                      {t.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{t.display_order}</TD>
                  <TD>
                    <ActionButtons
                      id={t.id}
                      title={t.name}
                      editHref={`/admin/teams/${t.id}`}
                      viewHref={t.status === "active" || t.status === "published" ? `/teams/${t.slug}` : null}
                      entityType="team"
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