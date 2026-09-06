import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTeamBySlugServer, getTeamAthletesServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const team = await getTeamBySlugServer(slug)
  if (!team) return { title: 'Team Not Found' }
  return {
    title: `${team.name} | Teams`,
    description: team.description || `Learn about ${team.name}`,
    openGraph: {
      title: team.name,
      description: team.description || undefined,
      images: team.cover_image ? [{ url: team.cover_image }] : undefined,
    },
  }
}

export default async function TeamDetailPage({ params }: Props) {
  const { slug } = await params
  const team = await getTeamBySlugServer(slug)

  if (!team) {
    notFound()
  }

  // Real roster: team_athletes join rows with the athlete records
  const roster = await getTeamAthletesServer(team.id)

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-5 py-24">
        {team.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={team.cover_image}
            alt={team.name}
            className="mb-10 w-full rounded-sm object-cover shadow-[var(--shadow-lift)]"
          />
        )}

        <div className="flex items-center gap-5">
          {team.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              className="h-16 w-16 rounded-full object-contain ring-1 ring-primary/40"
            />
          )}
          <div>
            <p className="eyebrow">Teams{team.sport ? ` · ${team.sport}` : ''}</p>
            <div className="rule-gold mt-3" />
            <h1 className="mt-4 text-4xl sm:text-5xl">{team.name}</h1>
          </div>
        </div>

        {typeof team.description === "string" && team.description.trim().length > 0 && team.description.trim() !== "[object Object]" && (
          <div
            className="cms-content mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: team.description }}
          />
        )}

        <div className="mt-14">
          <h2 className="text-2xl">Roster</h2>
          <div className="rule-gold mt-3" />
          {roster.length === 0 ? (
            <p className="mt-6 text-muted-foreground">No athletes assigned to this team yet.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((row: { athlete: { id: string; slug: string; name: string; sport: string | null; photo: string | null } } | null) => {
                const athlete = row?.athlete
                if (!athlete) return null
                return (
                  <Link
                    key={athlete.id}
                    href={`/athletes/${athlete.slug}`}
                    className="surface-card group flex items-center gap-4 rounded-sm p-5 transition-transform duration-500 hover:-translate-y-1"
                  >
                    {athlete.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={athlete.photo}
                        alt={athlete.name}
                        loading="lazy"
                        className="h-14 w-14 rounded-full object-cover ring-1 ring-primary/40"
                      />
                    ) : (
                      <div className="grid h-14 w-14 place-items-center rounded-full bg-navy-light font-display text-xl text-primary">
                        {athlete.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-display text-lg group-hover:text-primary">{athlete.name}</p>
                      {athlete.sport && (
                        <p className="text-xs uppercase tracking-[0.2em] text-primary">{athlete.sport}</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  )
}
