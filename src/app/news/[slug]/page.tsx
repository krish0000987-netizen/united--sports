import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlugServer } from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { formatDate } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlugServer(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || `Read ${article.title}`,
    openGraph: {
      title: article.og_title || article.meta_title || article.title,
      description: article.og_description || article.meta_description || article.excerpt || undefined,
      images: article.og_image || article.featured_image
        ? [{ url: (article.og_image || article.featured_image)! }]
        : undefined,
      type: 'article',
    },
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticleBySlugServer(slug)

  if (!article) {
    notFound()
  }

  return (
    <PublicShell>
      <article className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {article.featured_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.featured_image}
              alt={article.title}
              className="mb-10 w-full rounded-sm object-cover shadow-[var(--shadow-lift)]"
            />
          )}

          <p className="eyebrow">
            {article.category?.name || 'News'}
            {article.published_at && <span className="ml-3 text-muted-foreground">{formatDate(article.published_at, 'long')}</span>}
          </p>
          <div className="rule-gold mt-4" />

          <h1 className="mt-6 text-4xl sm:text-5xl">{article.title}</h1>

          {article.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          )}

          {article.content && (
            <div
              className="cms-content mt-10 max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          )}
        </div>
      </article>
    </PublicShell>
  )
}
