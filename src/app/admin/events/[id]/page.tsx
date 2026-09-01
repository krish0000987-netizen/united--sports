import { PageHeader } from "@/components/admin/PageHeader"
import { EventForm } from "@/components/admin/events/EventForm"
import { getEventById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EventEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === "new"
  const event = isNew ? null : await getEventById(id)
  if (!isNew && !event) notFound()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title={isNew ? "New Event" : "Edit Event"}
        back="/admin/events"
      />
      <EventForm event={event} />
    </div>
  )
}