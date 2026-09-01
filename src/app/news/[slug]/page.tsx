import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getArticleBySlugServer } from "@/lib/cms/server"
import { formatDate } from "@/lib/format"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticleBySlugServer(slug)
  if (!article) return { title: "Article Not Found" }
  return {
    title: article.meta_title || `${article.title} | United Sports`,
    description: article.meta_description || article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.featured_image ? [article.featured_image] : undefined,
    },
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, article] = await Promise.all([
    getSiteSettingsServer(),
    getArticleBySlugServer(slug),
  ])

  if (!article) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-20">
          <Link href="/news" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to news
          </Link>
          <div className="text-sm text-[#C9A227] font-semibold mb-3">
            {article.published_at ? formatDate(article.published_at, "long") : formatDate(article.created_at, "long")}
            {article.category?.name && <span className="text-white/60 font-normal"> • {article.category.name}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold max-w-4xl">{article.title}</h1>
          {article.excerpt && (
            <p className="mt-4 text-white/80 text-lg max-w-3xl">{article.excerpt}</p>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {article.featured_image && (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 mb-10">
            <Image src={article.featured_image} alt={article.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {article.content ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        ) : (
          <p className="text-slate-500">Full article content coming soon.</p>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
