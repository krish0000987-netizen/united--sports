import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { getEventsServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { formatDate, formatTime } from '@/lib/format'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events',
  description: 'Meets, trials, camps and community gatherings from UnitedAthletes.',
}

export default async function EventsPage() {
  const events = await getEventsServer({ status: 'published' })

  return (
    <PublicShell>
      <PageHero
        eyebrow="Events"
        title={<>Mark your <span className="text-gold-gradient">calendar</span></>}
        subtitle="Meets, trials, camps and community gatherings — be part of the action."
        image="/assets/facility.jpg"
        alt="Modern indoor sports arena lit at night"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {events.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No events available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 90}>
                <Link
                  href={`/events/${event.slug}`}
                  className="surface-card group flex h-full flex-col rounded-sm p-8 transition-transform duration-500 hover:-translate-y-2"
                >
                  <span className="font-display text-lg text-primary">
                    {formatDate(event.event_date, 'long')}
                  </span>
                  <h2 className="mt-4 text-2xl leading-tight">{event.title}</h2>
                  {event.start_time && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatTime(event.start_time)}
                      {event.end_time ? ` – ${formatTime(event.end_time)}` : ''}
                    </p>
                  )}
                  {event.location && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />
                      {event.location}
                    </p>
                  )}
                  {event.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                    View event
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  )
}
