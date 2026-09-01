import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer, getGalleryItemsServer } from "@/lib/cms/server"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Gallery | United Sports",
  description: "Browse our photo gallery showcasing events, athletes, and moments from United Sports.",
}

export default async function GalleryPage() {
  const [settings, items] = await Promise.all([
    getSiteSettingsServer(),
    getGalleryItemsServer({ status: "active" }),
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Moments Captured</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Gallery</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            A look at our events, athletes, training sessions, and community moments.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-lg">No gallery items to display yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((g) => (
              <div
                key={g.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 hover:shadow-xl transition"
              >
                <Image
                  src={g.image_url}
                  alt={g.title || "Gallery image"}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  unoptimized
                />
                {(g.title || g.category) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
                    {g.title && <p className="text-white text-sm font-semibold line-clamp-1">{g.title}</p>}
                    {g.category && <p className="text-white/70 text-xs uppercase tracking-wider mt-0.5">{g.category}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}
