import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getEventBySlugServer } from "@/lib/cms/server"
import { formatDate, formatTime } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, MapPin, ExternalLink } from "lucide-react"
import Image from "next/image"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlugServer(slug)
  if (!event) return { title: "Event Not Found" }
  return {
    title: `${event.title} | United Sports`,
    description: event.description?.slice(0, 160) || `Join us for ${event.title}.`,
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, event] = await Promise.all([
    getSiteSettingsServer(),
    getEventBySlugServer(slug),
  ])

  if (!event) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-20">
          <Link href="/events" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to events
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-white/80 text-sm">
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> {formatDate(event.event_date, "long")}</span>
            {event.start_time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {formatTime(event.start_time)}{event.end_time ? ` - ${formatTime(event.end_time)}` : ""}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {event.featured_image && (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 mb-10">
            <Image src={event.featured_image} alt={event.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {event.description && (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {event.description}
          </div>
        )}

        {event.registration_url && (
          <div className="mt-10">
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="lg">
                Register Now <ExternalLink size={16} className="ml-2" />
              </Button>
            </a>
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
