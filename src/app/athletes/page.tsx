import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getAthletesServer } from "@/lib/cms/server"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Athletes | United Sports",
  description: "Meet the talented athletes who represent United Sports.",
}

export default async function AthletesPage() {
  const [settings, athletes] = await Promise.all([
    getSiteSettingsServer(),
    getAthletesServer({ status: "active" }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Our Champions</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Athletes</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            Meet the dedicated athletes who represent United Sports across multiple disciplines.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {athletes.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No athletes to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {athletes.map((a) => (
              <Link
                key={a.id}
                href={`/athletes/${a.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all text-center p-6"
              >
                {a.photo ? (
                  <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden bg-slate-100 mb-4">
                    <Image
                      src={a.photo}
                      alt={a.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-[#0B1D3A] to-[#C9A227] grid place-items-center text-white text-3xl font-bold mb-4">
                    {a.name.charAt(0)}
                  </div>
                )}
                <h3 className="font-semibold text-[#0B1D3A]">{a.name}</h3>
                {a.sport && <p className="text-xs text-slate-500 mt-1">{a.sport}</p>}
                {a.category && <p className="text-[10px] uppercase tracking-wider text-[#C9A227] mt-1">{a.category}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
