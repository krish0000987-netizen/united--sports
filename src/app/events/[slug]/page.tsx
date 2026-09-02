import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { getEventBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { formatDate, formatTime } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlugServer(slug)
  if (!event) return { title: 'Event Not Found' }
  return {
    title: `${event.title} | Events`,
    description: event.description || `Learn about ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      images: event.featured_image ? [{ url: event.featured_image }] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlugServer(slug)

  if (!event) {
    notFound()
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-5 py-24">
        <p className="eyebrow">Events</p>
        <div className="rule-gold mt-4" />
        <h1 className="mt-6 text-4xl sm:text-5xl">{event.title}</h1>

        {event.description && (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{event.description}</p>
        )}

        {event.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.featured_image}
            alt={event.title}
            className="mt-10 w-full rounded-sm object-cover shadow-[var(--shadow-lift)]"
          />
        )}

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {event.event_date && (
            <li className="surface-card rounded-sm p-5">
              <CalendarDays className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</p>
              <p className="mt-1 font-display text-lg">{formatDate(event.event_date, 'long')}</p>
            </li>
          )}
          {(event.start_time || event.end_time) && (
            <li className="surface-card rounded-sm p-5">
              <Clock className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Time</p>
              <p className="mt-1 font-display text-lg">
                {formatTime(event.start_time)}
                {event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
              </p>
            </li>
          )}
          {event.location && (
            <li className="surface-card rounded-sm p-5">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Location</p>
              <p className="mt-1 font-display text-lg leading-snug">{event.location}</p>
            </li>
          )}
        </ul>

        {event.registration_url && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-12 inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1"
          >
            Register now
          </a>
        )}
      </section>
    </PublicShell>
  )
}
