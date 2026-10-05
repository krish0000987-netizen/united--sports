import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getArticlesServer, getPageBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { formatDate } from '@/lib/format'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlugServer('news')
  return {
    title: page?.meta_title || 'News & Updates',
    description: page?.meta_description || 'The latest news, updates, and stories from the UnitedAthletes community.',
  }
}

export default async function NewsPage() {
  const [articles, page] = await Promise.all([
    getArticlesServer({ status: 'published' }),
    getPageBySlugServer('news'),
  ])

  return (
    <PublicShell>
      <PageHero
        eyebrow={page?.excerpt || "News"}
        title={<>Latest news & <span className="text-gold-gradient">updates</span></>}
        subtitle={page?.meta_description || page?.excerpt || "Stories, announcements and insights from the UnitedAthletes community."}
        image={page?.featured_image || "/assets/support.jpg"}
        alt="Coach and athlete clasping hands"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {articles.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No articles available yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article.id} delay={i * 90}>
                <Link
                  href={`/news/${article.slug}`}
                  className="surface-card group flex h-full flex-col overflow-hidden rounded-sm transition-transform duration-500 hover:-translate-y-2"
                >
                  {article.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {article.category?.name || 'News'}
                      {article.published_at && (
                        <span className="ml-3">{formatDate(article.published_at)}</span>
                      )}
                    </span>
                    <h2 className="mt-4 text-2xl leading-tight group-hover:text-primary">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                      Read story
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
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
