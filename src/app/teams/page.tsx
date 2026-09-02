import { Metadata } from 'next'
import Link from 'next/link'
import { getTeamsServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Teams',
  description: 'Teams and squads supported by UnitedAthletes for India Foundation.',
}

export default async function TeamsPage() {
  const teams = await getTeamsServer({ status: 'published' })

  return (
    <PublicShell>
      <PageHero
        eyebrow="Teams"
        title={<>Stronger <span className="text-gold-gradient">together</span></>}
        subtitle="Squads and teams representing UnitedAthletes across sporting disciplines."
        image="/assets/community.jpg"
        alt="Athletes standing together in a huddle"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {teams.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Team profiles will be published soon.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, i) => (
              <Reveal key={team.id} delay={i * 90}>
                <Link
                  href={`/teams/${team.slug}`}
                  className="surface-card group block h-full overflow-hidden rounded-sm transition-transform duration-500 hover:-translate-y-2"
                >
                  {team.cover_image && (
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={team.cover_image}
                        alt={team.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-4">
                      {team.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          className="h-12 w-12 rounded-full object-contain ring-1 ring-primary/40"
                        />
                      )}
                      <div>
                        <h2 className="text-xl">{team.name}</h2>
                        {team.sport && (
                          <p className="text-xs uppercase tracking-[0.2em] text-primary">{team.sport}</p>
                        )}
                      </div>
                    </div>
                    {team.description && (
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {team.description}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </PublicShell>
  )
}
