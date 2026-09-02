import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAthleteBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { Check } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const athlete = await getAthleteBySlugServer(slug)
  if (!athlete) return { title: 'Athlete Not Found' }
  return {
    title: `${athlete.name} | Athletes`,
    description: athlete.biography || `Meet ${athlete.name}, ${athlete.sport || 'athlete'}.`,
    openGraph: {
      title: athlete.name,
      description: athlete.biography || undefined,
      images: athlete.photo ? [{ url: athlete.photo }] : undefined,
    },
  }
}

export default async function AthleteDetailPage({ params }: Props) {
  const { slug } = await params
  const athlete = await getAthleteBySlugServer(slug)

  if (!athlete) {
    notFound()
  }

  const achievements = (athlete.achievements || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-5 py-24">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            {athlete.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={athlete.photo}
                alt={athlete.name}
                className="w-full max-w-xs rounded-sm object-cover shadow-[var(--shadow-lift)]"
              />
            ) : (
              <div className="grid w-full max-w-xs place-items-center rounded-sm bg-navy-light py-24 font-display text-6xl text-primary ring-1 ring-primary/30">
                {athlete.name.charAt(0)}
              </div>
            )}
            <div className="mt-6 space-y-1 text-sm text-muted-foreground">
              {athlete.sport && <p><span className="text-primary uppercase tracking-[0.2em] text-xs">Sport</span><br />{athlete.sport}</p>}
              {athlete.category && <p><span className="text-primary uppercase tracking-[0.2em] text-xs">Category</span><br />{athlete.category}</p>}
              {athlete.nationality && <p><span className="text-primary uppercase tracking-[0.2em] text-xs">Nationality</span><br />{athlete.nationality}</p>}
            </div>
          </div>

          <div>
            <p className="eyebrow">Athletes</p>
            <div className="rule-gold mt-4" />
            <h1 className="mt-6 text-4xl sm:text-5xl">{athlete.name}</h1>

            {athlete.biography && (
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{athlete.biography}</p>
            )}

            {athlete.profile_details && (
              <div
                className="cms-content mt-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: athlete.profile_details }}
              />
            )}

            {achievements.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl">Achievements</h2>
                <div className="rule-gold mt-3" />
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  {achievements.map((a) => (
                    <li key={a} className="flex items-center gap-4 py-4">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
