import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProgrammeBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const programme = await getProgrammeBySlugServer(slug)
  if (!programme) return { title: 'Programme Not Found' }
  return {
    title: `${programme.title} | Programmes`,
    description: programme.description || `Learn about ${programme.title}`,
    openGraph: {
      title: programme.title,
      description: programme.description || undefined,
      images: programme.image ? [{ url: programme.image }] : undefined,
    },
  }
}

export default async function ProgrammeDetailPage({ params }: Props) {
  const { slug } = await params
  const programme = await getProgrammeBySlugServer(slug)

  if (!programme) {
    notFound()
  }

  return (
    <PublicShell>
      <section className="mx-auto max-w-4xl px-5 py-24">
        <p className="eyebrow">Programmes</p>
        <div className="rule-gold mt-4" />
        <h1 className="mt-6 text-4xl sm:text-5xl">{programme.title}</h1>

        {programme.description && (
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{programme.description}</p>
        )}

        {programme.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={programme.image}
            alt={programme.title}
            className="mt-10 w-full rounded-sm object-cover shadow-[var(--shadow-lift)]"
          />
        )}

        {typeof programme.content === "string" && programme.content.trim().length > 0 && programme.content.trim() !== "[object Object]" && (
          <div
            className="cms-content mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: programme.content }}
          />
        )}

        <Link
          href="/contact"
          className="group mt-14 inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1"
        >
          Talk to us about this programme
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </PublicShell>
  )
}
