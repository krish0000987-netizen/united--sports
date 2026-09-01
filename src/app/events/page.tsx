import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getEventsServer } from "@/lib/cms/server"
import { formatDate, formatTime } from "@/lib/format"
import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Event } from "@/lib/cms/types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Events | United Sports",
  description: "Browse upcoming and past events from United Sports.",
}

const statusStyles: Record<string, string> = {
  upcoming: "bg-emerald-100 text-emerald-700",
  live: "bg-red-100 text-red-700",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-rose-100 text-rose-700",
}

export default async function EventsPage() {
  const [settings, allEvents] = await Promise.all([
    getSiteSettingsServer(),
    getEventsServer(),
  ])

  const today = new Date().toISOString().split("T")[0]
  const upcoming = allEvents.filter((e) => e.event_date >= today)
  const past = allEvents.filter((e) => e.event_date < today).reverse()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Mark Your Calendar</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Events</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            Stay up to date with our upcoming events and revisit highlights from past occasions.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        <h2 className="text-2xl font-bold text-[#0B1D3A] mb-6">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="text-slate-500 py-8">No upcoming events scheduled.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#0B1D3A] mb-6">Past Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      {event.featured_image && (
        <div className="relative aspect-video bg-slate-100">
          <Image
            src={event.featured_image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            unoptimized
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[event.status] || statusStyles.upcoming}`}
          >
            {event.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Calendar size={12} />
          <span>{formatDate(event.event_date, "long")}</span>
          {event.start_time && <span>• {formatTime(event.start_time)}</span>}
        </div>
        <h3 className="font-semibold text-[#0B1D3A] text-lg line-clamp-2">{event.title}</h3>
        {event.location && (
          <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={12} />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
