import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getTeamBySlugServer } from "@/lib/cms/server"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const team = await getTeamBySlugServer(slug)
  if (!team) return { title: "Team Not Found" }
  return {
    title: `${team.name} | United Sports`,
    description: team.description?.slice(0, 160) || `Learn more about team ${team.name}.`,
  }
}

export default async function TeamDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, team] = await Promise.all([
    getSiteSettingsServer(),
    getTeamBySlugServer(slug),
  ])

  if (!team) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      {team.cover_image && (
        <div className="relative w-full h-64 md:h-80 bg-slate-100">
          <Image src={team.cover_image} alt={team.name} fill className="object-cover" unoptimized priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D3A]/80 to-transparent" />
        </div>
      )}

      <section className={`relative overflow-hidden ${team.cover_image ? "-mt-24" : ""} bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-16 md:py-20">
          <Link href="/teams" className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4">
            <ArrowLeft size={14} className="mr-1" /> Back to teams
          </Link>
          <div className="flex items-center gap-5">
            {team.logo && (
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden bg-white shrink-0">
                <Image src={team.logo} alt={team.name} fill className="object-contain" unoptimized />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">{team.name}</h1>
              {team.sport && <p className="mt-2 text-[#C9A227] font-semibold uppercase tracking-wider text-sm">{team.sport}</p>}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {team.description ? (
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {team.description}
          </div>
        ) : (
          <p className="text-slate-500">More details coming soon.</p>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
