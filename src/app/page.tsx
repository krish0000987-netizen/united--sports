import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Trophy, Calendar, Users, ArrowRight, Newspaper, MessageSquareQuote, Images } from "lucide-react"
import {
  getSiteSettingsServer,
  getArticlesServer,
  getEventsServer,
  getProgrammesServer,
  getAthletesServer,
  getTestimonialsServer,
  getGalleryItemsServer,
  getHomepageSectionsServer,
} from "@/lib/cms/server"
import { formatDate } from "@/lib/format"
import Image from "next/image"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "United Sports - Your Premier Sports Community",
  description: "United Sports connects athletes, programmes, events and teams. Join our community of sports enthusiasts.",
}

export default async function HomePage() {
  const [settings, sections, articles, events, programmes, athletes, testimonials, gallery] = await Promise.all([
    getSiteSettingsServer(),
    getHomepageSectionsServer(),
    getArticlesServer({ status: "published", limit: 3 }),
    getEventsServer({ upcoming: true, limit: 3 }),
    getProgrammesServer({ status: "published", limit: 4 }),
    getAthletesServer({ status: "active", limit: 4 }),
    getTestimonialsServer({ status: "active", limit: 3 }),
    getGalleryItemsServer({ status: "active", limit: 6 }),
  ])

  const sectionByKey = (key: string) => sections.find((s) => s.section_key === key)
  const hero = sectionByKey("hero")
  const programmesSection = sectionByKey("programmes")
  const athletesSection = sectionByKey("athletes")
  const eventsSection = sectionByKey("events")
  const newsSection = sectionByKey("news")
  const testimonialsSection = sectionByKey("testimonials")
  const ctaSection = sectionByKey("cta")

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      {/* Hero Section */}
      {hero?.is_visible !== false && (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
          <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-32">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 text-xs font-semibold text-white mb-6">
                <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                {settings?.site_name || "United Sports"} • Community of Champions
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.1]">
                {hero?.title || settings?.description?.split('.')[0] || "Unite. Train. Compete. Win."}
              </h1>
              <p className="mt-6 text-white/80 text-lg max-w-2xl">
                {hero?.subtitle || hero?.description || settings?.description || "Your premier destination for sports programmes, events, athletes and teams. Join our community and be part of something great."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/programmes">
                  <Button variant="gold" size="lg">
                    Explore Programmes
                    <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
                <Link href="/athletes">
                  <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#0B1D3A]">
                    Meet Our Athletes
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl">
              <div>
                <p className="text-3xl font-bold text-[#C9A227]">{athletes.length || 100}+</p>
                <p className="text-xs text-white/70 mt-1">Athletes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#C9A227]">{programmes.length || 50}+</p>
                <p className="text-xs text-white/70 mt-1">Programmes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#C9A227]">{events.length || 20}+</p>
                <p className="text-xs text-white/70 mt-1">Events</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="flex-1">
        {/* Programmes Section */}
        {programmesSection?.is_visible !== false && programmes.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">What We Offer</p>
                <h2 className="text-3xl font-bold text-[#0B1D3A] mt-1">
                  {programmesSection?.title || "Our Programmes"}
                </h2>
                <p className="text-slate-500 mt-2 max-w-2xl">
                  {programmesSection?.subtitle || programmesSection?.description || "Training programmes designed to help you reach your peak performance."}
                </p>
              </div>
              <Link href="/programmes" className="hidden md:inline-flex">
                <Button variant="outline" size="sm">View All <ArrowRight size={14} className="ml-1" /></Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {programmes.map((p) => (
                <Link key={p.id} href={`/programmes/${p.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                  {p.image && (
                    <div className="relative aspect-video bg-slate-100">
                      <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-[#0B1D3A] text-lg">{p.title}</h3>
                    {p.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Athletes Section */}
        {athletesSection?.is_visible !== false && athletes.length > 0 && (
          <section className="bg-slate-50 py-16">
            <div className="max-w-[1280px] mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Our Champions</p>
                  <h2 className="text-3xl font-bold text-[#0B1D3A] mt-1">
                    {athletesSection?.title || "Featured Athletes"}
                  </h2>
                  <p className="text-slate-500 mt-2 max-w-2xl">
                    {athletesSection?.subtitle || athletesSection?.description || "Meet the talented athletes who represent United Sports."}
                  </p>
                </div>
                <Link href="/athletes" className="hidden md:inline-flex">
                  <Button variant="outline" size="sm">View All <ArrowRight size={14} className="ml-1" /></Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {athletes.map((a) => (
                  <Link key={a.id} href={`/athletes/${a.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all text-center p-5">
                    {a.photo ? (
                      <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden bg-slate-100 mb-4">
                        <Image src={a.photo} alt={a.name} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                      </div>
                    ) : (
                      <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-[#0B1D3A] to-[#C9A227] grid place-items-center text-white text-3xl font-bold mb-4">
                        {a.name.charAt(0)}
                      </div>
                    )}
                    <h3 className="font-semibold text-[#0B1D3A]">{a.name}</h3>
                    {a.sport && <p className="text-xs text-slate-500 mt-1">{a.sport}</p>}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events Section */}
        {eventsSection?.is_visible !== false && events.length > 0 && (
          <section className="max-w-[1280px] mx-auto px-4 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Mark Your Calendar</p>
                <h2 className="text-3xl font-bold text-[#0B1D3A] mt-1">
                  {eventsSection?.title || "Upcoming Events"}
                </h2>
                <p className="text-slate-500 mt-2 max-w-2xl">
                  {eventsSection?.subtitle || eventsSection?.description || "Don't miss out on these exciting upcoming events."}
                </p>
              </div>
              <Link href="/events" className="hidden md:inline-flex">
                <Button variant="outline" size="sm">View All <ArrowRight size={14} className="ml-1" /></Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {events.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  {e.featured_image && (
                    <div className="relative aspect-video bg-slate-100">
                      <Image src={e.featured_image} alt={e.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar size={12} />
                      {formatDate(e.event_date, "long")}
                    </div>
                    <h3 className="font-semibold text-[#0B1D3A] text-lg line-clamp-2">{e.title}</h3>
                    {e.location && <p className="text-sm text-slate-500 mt-2">{e.location}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* News Section */}
        {newsSection?.is_visible !== false && articles.length > 0 && (
          <section className="bg-[#FAF6F0] py-16">
            <div className="max-w-[1280px] mx-auto px-4">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Stay Updated</p>
                  <h2 className="text-3xl font-bold text-[#0B1D3A] mt-1">
                    {newsSection?.title || "Latest News & Insights"}
                  </h2>
                  <p className="text-slate-500 mt-2 max-w-2xl">
                    {newsSection?.subtitle || newsSection?.description || "The latest news, updates, and insights from United Sports."}
                  </p>
                </div>
                <Link href="/news" className="hidden md:inline-flex">
                  <Button variant="outline" size="sm">View All <ArrowRight size={14} className="ml-1" /></Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {articles.map((a) => (
                  <Link key={a.id} href={`/news/${a.slug}`} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                    {a.featured_image && (
                      <div className="relative aspect-video bg-slate-100">
                        <Image src={a.featured_image} alt={a.title} fill className="object-cover group-hover:scale-105 transition duration-500" unoptimized />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="text-xs font-semibold text-[#C9A227]">
                        {a.published_at ? formatDate(a.published_at) : formatDate(a.created_at)}
                      </div>
                      <h3 className="font-semibold text-[#0B1D3A] mt-2 line-clamp-2">{a.title}</h3>
                      {a.excerpt && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{a.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonialsSection?.is_visible !== false && testimonials.length > 0 && (
          <section className="bg-[#0B1D3A] text-white py-16">
            <div className="max-w-[1280px] mx-auto px-4">
              <div className="text-center mb-10">
                <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">What People Say</p>
                <h2 className="text-3xl font-bold mt-1">
                  {testimonialsSection?.title || "Community Voices"}
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
                    <div className="text-amber-400 text-lg">★★★★★</div>
                    <p className="mt-3 text-sm text-white/85 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      {t.photo ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-700 shrink-0">
                          <Image src={t.photo} alt={t.name} fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[#C9A227] grid place-items-center text-[#0B1D3A] font-bold shrink-0">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        {t.role && <div className="text-xs text-white/60">{t.role}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        {ctaSection?.is_visible !== false && (
          <section className="max-w-[1280px] mx-auto px-4 py-16">
            <div className="rounded-3xl bg-gradient-to-br from-[#0B1D3A] to-[#1a3a6b] p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-[#C9A227]/20 rounded-full blur-2xl" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {ctaSection?.title || "Ready to Join United Sports?"}
                  </h2>
                  <p className="text-white/70 text-sm md:text-base mt-2 max-w-xl">
                    {ctaSection?.subtitle || ctaSection?.description || "Become part of our growing sports community. Train, compete, and achieve your goals with us."}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href="/contact">
                    <Button variant="gold" size="lg">Get in Touch</Button>
                  </Link>
                  <Link href="/programmes">
                    <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#0B1D3A]">
                      View Programmes
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  )
}