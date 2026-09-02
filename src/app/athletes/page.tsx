import { Metadata } from 'next'
import Link from 'next/link'
import { getAthletesServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Athletes',
  description: 'Meet the athletes supported by UnitedAthletes for India Foundation.',
}

export default async function AthletesPage() {
  const athletes = await getAthletesServer({ status: 'published' })

  return (
    <PublicShell>
      <PageHero
        eyebrow="Athletes"
        title={<>Talent <span className="text-gold-gradient">in motion</span></>}
        subtitle="Meet the athletes whose journeys we support across India."
        image="/assets/hero-athletes.jpg"
        alt="Athletes in action under golden light"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {athletes.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Athlete profiles will be published soon.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {athletes.map((athlete, i) => (
              <Reveal key={athlete.id} delay={i * 60}>
                <Link
                  href={`/athletes/${athlete.slug}`}
                  className="surface-card group block h-full rounded-sm p-6 text-center transition-transform duration-500 hover:-translate-y-2"
                >
                  {athlete.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={athlete.photo}
                      alt={athlete.name}
                      loading="lazy"
                      className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-primary/40 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-navy-light font-display text-2xl text-primary ring-2 ring-primary/40">
                      {athlete.name.charAt(0)}
                    </div>
                  )}
                  <h2 className="mt-4 text-lg">{athlete.name}</h2>
                  {athlete.sport && (
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{athlete.sport}</p>
                  )}
                  {athlete.category && (
                    <p className="mt-1 text-xs text-muted-foreground">{athlete.category}</p>
                  )}
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  )
}
