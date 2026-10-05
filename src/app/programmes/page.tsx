import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getProgrammesServer, getPageBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('programmes')
  return {
    title: page?.meta_title || 'Programmes',
    description: page?.meta_description || 'Explore the UnitedAthletes programmes supporting athletes across India.',
  }
}

export default async function ProgrammesPage() {
  const [programmes, page] = await Promise.all([
    getProgrammesServer({ status: 'published' }),
    getPageBySlugServer('programmes'),
  ])

  return (
    <PublicShell>
      <PageHero
        eyebrow={page?.excerpt || "Programmes"}
        title={<>What we <span className="text-gold-gradient">do</span></>}
        subtitle={page?.meta_description || page?.excerpt || "Everything an athlete needs to keep going — from facility access to equipment, community and opportunity."}
        image={page?.featured_image || "/assets/programme-hero.jpg"}
        alt="Athletes training at a sports facility"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {programmes.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Programmes will be published soon.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {programmes.map((programme, i) => (
              <Reveal key={programme.id} delay={i * 90}>
                <Link
                  href={`/programmes/${programme.slug}`}
                  className="surface-card group block h-full overflow-hidden rounded-sm transition-transform duration-500 hover:-translate-y-2"
                >
                  {programme.image && (
                    <div className="relative h-52 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={programme.image}
                        alt={programme.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <span className="font-display text-sm tracking-[0.3em] text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-3 text-2xl">{programme.title}</h2>
                    {programme.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {programme.description}
                      </p>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                      Learn more
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-border bg-navy">
        <div className="mx-auto max-w-7xl px-5 py-24">
          <Reveal>
            <p className="eyebrow">Our Approach</p>
            <div className="rule-gold mt-4" />
            <h2 className="mt-6 max-w-3xl text-4xl sm:text-5xl">
              An athlete-first path from ambition to achievement
            </h2>
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
            {["Discover", "Support", "Equip", "Develop", "Connect", "Empower"].map((step, i) => (
              <Reveal key={step} delay={i * 90}>
                <div className="h-full bg-navy-deep p-7">
                  <span className="font-display text-xs tracking-[0.3em] text-primary">
                    Step {i + 1}
                  </span>
                  <p className="mt-4 font-display text-2xl">{step}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={200}>
            <p className="mt-10 max-w-2xl leading-relaxed text-muted-foreground">
              Our objective is to make the journey from sporting ambition to achievement more accessible.
            </p>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  )
}
