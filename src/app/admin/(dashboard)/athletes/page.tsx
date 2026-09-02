import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getAllAthletes, deleteAthlete } from "@/lib/cms/admin-actions"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function AthletesPage() {
  const athletes = await getAllAthletes()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Athletes"
        description="Manage your athlete profiles and showcases."
        action={<AddButton href="/admin/athletes/new" label="New Athlete" />}
      />

      <Card>
        {athletes.length === 0 ? (
          <EmptyState
            title="No athletes yet"
            description="Add your first athlete profile."
            action={<AddButton href="/admin/athletes/new" label="New Athlete" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Athlete</TH>
                <TH>Sport</TH>
                <TH>Nationality</TH>
                <TH>Status</TH>
                <TH>Order</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {athletes.map((a) => (
                <TR key={a.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      {a.photo && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                          <Image src={a.photo} alt={a.name} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div>
                        <Link href={`/admin/athletes/${a.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                          {a.name}
                        </Link>
                        {a.category && <p className="text-xs text-slate-500 mt-0.5">{a.category}</p>}
                      </div>
                    </div>
                  </TD>
                  <TD className="text-xs">{a.sport || "—"}</TD>
                  <TD className="text-xs">{a.nationality || "—"}</TD>
                  <TD>
                    <Badge variant={a.status === "published" ? "success" : "default"}>
                      {a.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs">{a.display_order}</TD>
                  <TD>
                    <ActionButtons
                      id={a.id}
                      title={a.name}
                      editHref={`/admin/athletes/${a.id}`}
                      viewHref={a.status === "published" ? `/athletes/${a.slug}` : null}
                      entityType="athlete"
                      onDelete={async () => {
                        await deleteAthlete(a.id)
                      }}
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