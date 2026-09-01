import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getAthleteBySlugServer } from "@/lib/cms/server"
import Image from "next/image"
import { ArrowLeft, Trophy, Flag } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const athlete = await getAthleteBySlugServer(slug)
  if (!athlete) return { title: "Athlete Not Found" }
  return {
    title: `${athlete.name} | United Sports`,
    description: athlete.biography?.slice(0, 160) || `Learn more about athlete ${athlete.name}.`,
  }
}

export default async function AthleteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, athlete] = await Promise.all([
    getSiteSettingsServer(),
    getAthleteBySlugServer(slug),
  ])

  if (!athlete) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-20">
          <Link href="/athletes" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to athletes
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">{athlete.name}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-white/80 text-sm">
            {athlete.sport && <span className="inline-flex items-center gap-1.5"><Trophy size={14} /> {athlete.sport}</span>}
            {athlete.nationality && <span className="inline-flex items-center gap-1.5"><Flag size={14} /> {athlete.nationality}</span>}
            {athlete.category && <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">{athlete.category}</span>}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            {athlete.photo ? (
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100">
                <Image src={athlete.photo} alt={athlete.name} fill className="object-cover" unoptimized priority />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-[#0B1D3A] to-[#C9A227] grid place-items-center text-white text-7xl font-bold">
                {athlete.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="md:col-span-2 space-y-8">
            {athlete.biography && (
              <div>
                <h2 className="text-2xl font-bold text-[#0B1D3A] mb-3">Biography</h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{athlete.biography}</div>
              </div>
            )}

            {athlete.achievements && (
              <div>
                <h2 className="text-2xl font-bold text-[#0B1D3A] mb-3">Achievements</h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{athlete.achievements}</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  )
}
