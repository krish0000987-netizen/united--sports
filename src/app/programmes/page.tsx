import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getProgrammesServer } from "@/lib/cms/server"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Programmes | United Sports",
  description: "Explore our sports training programmes designed to help you reach peak performance.",
}

export default async function ProgrammesPage() {
  const [settings, programmes] = await Promise.all([
    getSiteSettingsServer(),
    getProgrammesServer({ status: "published" }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">What We Offer</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Our Programmes</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            Training programmes designed to help athletes of all levels reach their peak performance.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {programmes.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No programmes available at the moment.</p>
            <p className="text-sm mt-2">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map((p) => (
              <Link
                key={p.id}
                href={`/programmes/${p.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {p.image && (
                  <div className="relative aspect-video bg-slate-100">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-[#0B1D3A] text-lg">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-3">{p.description}</p>
                  )}
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-[#C9A227]">
                    Learn more <ArrowRight size={14} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
