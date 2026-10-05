import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader, AddButton } from "@/components/admin/PageHeader"
import { ActionButtons } from "@/components/admin/ActionButtons"
import { getEvents, deleteEvent } from "@/lib/cms/data"
import { formatDate, formatTime } from "@/lib/format"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Events"
        description="Manage sports events, matches, tournaments and registrations."
        action={<AddButton href="/admin/events/new" label="New Event" />}
      />

      <Card>
        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Create your first event to get started."
            action={<AddButton href="/admin/events/new" label="New Event" />}
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Date</TH>
                <TH>Location</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {events.map((e) => (
                <TR key={e.id}>
                  <TD>
                    <Link href={`/admin/events/${e.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A]">
                      {e.title}
                    </Link>
                    {e.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{e.description}</p>}
                  </TD>
                  <TD className="text-xs">
                    {formatDate(e.event_date)}
                    <div className="text-slate-500">{formatTime(e.start_time)}</div>
                  </TD>
                  <TD className="text-xs">{e.location || "—"}</TD>
                  <TD>
                    <Badge variant={e.status === "upcoming" || e.status === "published" || e.status === "live" ? "success" : e.status === "completed" ? "info" : "default"}>
                      {e.status}
                    </Badge>
                  </TD>
                  <TD>
                    <ActionButtons
                      id={e.id}
                      title={e.title}
                      editHref={`/admin/events/${e.id}`}
                      viewHref={e.status !== "cancelled" && e.status !== "draft" ? `/events/${e.slug}` : null}
                      entityType="event"
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