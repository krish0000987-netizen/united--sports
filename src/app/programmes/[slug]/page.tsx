import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getProgrammeBySlugServer } from "@/lib/cms/server"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const programme = await getProgrammeBySlugServer(slug)
  if (!programme) return { title: "Programme Not Found" }
  return {
    title: `${programme.title} | United Sports`,
    description: programme.description || `Learn more about our ${programme.title} programme.`,
  }
}

export default async function ProgrammeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, programme] = await Promise.all([
    getSiteSettingsServer(),
    getProgrammeBySlugServer(slug),
  ])

  if (!programme) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-20">
          <Link href="/programmes" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to programmes
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">{programme.title}</h1>
          {programme.description && (
            <p className="mt-4 text-white/80 text-lg max-w-3xl">{programme.description}</p>
          )}
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {programme.image && (
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 mb-10">
            <Image src={programme.image} alt={programme.title} fill className="object-cover" unoptimized priority />
          </div>
        )}

        {programme.content ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {programme.content}
          </div>
        ) : (
          <p className="text-slate-500">More details coming soon.</p>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link href="/contact">
            <Button variant="gold">Enquire about this programme</Button>
          </Link>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  )
}
