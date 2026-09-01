import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getTeamsServer } from "@/lib/cms/server"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Teams | United Sports",
  description: "Discover the teams competing under United Sports.",
}

export default async function TeamsPage() {
  const [settings, teams] = await Promise.all([
    getSiteSettingsServer(),
    getTeamsServer({ status: "active" }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">On The Field</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Teams</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            Discover the teams competing under United Sports.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {teams.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No teams to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teams.map((t) => (
              <Link
                key={t.id}
                href={`/teams/${t.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all text-center p-6"
              >
                {t.logo ? (
                  <div className="relative h-24 w-24 mx-auto rounded-xl overflow-hidden bg-slate-100 mb-4">
                    <Image src={t.logo} alt={t.name} fill className="object-contain group-hover:scale-105 transition duration-500" unoptimized />
                  </div>
                ) : (
                  <div className="h-24 w-24 mx-auto rounded-xl bg-gradient-to-br from-[#0B1D3A] to-[#C9A227] grid place-items-center text-white text-3xl font-bold mb-4">
                    {t.name.charAt(0)}
                  </div>
                )}
                <h3 className="font-semibold text-[#0B1D3A]">{t.name}</h3>
                {t.sport && <p className="text-xs text-slate-500 mt-1">{t.sport}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
