import { PageHeader } from "@/components/admin/PageHeader"
import { AthleteForm } from "@/components/admin/athletes/AthleteForm"
import { getAthleteById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AthleteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const athlete = isNew ? null : await getAthleteById(id)
  if (!isNew && !athlete) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Athlete" : "Edit Athlete"}
        back="/admin/athletes"
      />
      <AthleteForm athlete={athlete} />
    </div>
  )
}