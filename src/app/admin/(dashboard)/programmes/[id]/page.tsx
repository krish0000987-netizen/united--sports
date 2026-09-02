import { PageHeader } from "@/components/admin/PageHeader"
import { ProgrammeForm } from "@/components/admin/programmes/ProgrammeForm"
import { getProgrammeById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function ProgrammeEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const programme = isNew ? null : await getProgrammeById(id)
  if (!isNew && !programme) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Programme" : "Edit Programme"}
        back="/admin/programmes"
      />
      <ProgrammeForm programme={programme} />
    </div>
  )
}