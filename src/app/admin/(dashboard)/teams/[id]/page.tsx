import { PageHeader } from "@/components/admin/PageHeader"
import { TeamForm } from "@/components/admin/teams/TeamForm"
import { getTeamById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function TeamEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const team = isNew ? null : await getTeamById(id)
  if (!isNew && !team) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Team" : "Edit Team"}
        back="/admin/teams"
      />
      <TeamForm team={team} />
    </div>
  )
}