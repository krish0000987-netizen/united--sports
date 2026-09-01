import Link from "next/link"
import { PropertyCard } from "@/components/property/PropertyCard"
import { mockProperties, cities, categories, blogPosts, agents, testimonials } from "@/lib/data/mock"
import { BadgeCheck, Shield, Building2, Users, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CategoryGrid(){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <div className="flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-[#0B1D3A]">Explore by Category</h2>
        <Link href="/buy" className="text-sm font-semibold text-[#0B1D3A] flex items-center gap-1">View all <ArrowRight size={14}/></Link>
      </div>
      <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map(c=>(
          <Link key={c.label} href={`/buy?type=${c.type}`} className="bg-white border border-slate-200 rounded-2xl p-4 text-center hover:shadow-md hover:border-[#C9A227]/30 transition">
            <div className="text-2xl">{c.icon}</div>
            <div className="mt-2 text-sm font-semibold text-[#0B1D3A]">{c.label}</div>
            <div className="text-xs text-slate-500">{c.count} listings</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function FeaturedProperties({ title="Featured Properties" }: {title?:string}){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#0B1D3A]">{title}</h2>
          <p className="text-sm text-slate-500">Handpicked verified homes • Real photos • RERA where applicable</p>
        </div>
        <Link href="/buy" className="hidden md:inline-flex"><Button variant="outline" size="sm">View All <ArrowRight size={14} className="ml-1"/></Button></Link>
      </div>
      <div className="mt-5 grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockProperties.slice(0,8).map(p=> <PropertyCard key={p.id} p={p} />)}
      </div>
    </section>
  )
}

export function CityGrid(){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-bold text-[#0B1D3A]">Explore Cities</h2>
      <p className="text-sm text-slate-500">Top metros with verified inventory</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cities.map(c=>(
          <Link key={c.name} href={`/buy?city=${c.name}`} className="group relative overflow-hidden rounded-2xl h-40 border border-slate-200">
            <img src={c.image} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
            <div className="absolute bottom-0 p-3 text-white">
              <div className="font-semibold">{c.name}</div>
              <div className="text-xs text-white/80">{c.count.toLocaleString()} properties • {c.state}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function TrustStrip(){
  return (
    <section className="bg-[#FAF6F0] border-y border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 py-8 grid md:grid-cols-4 gap-6">
        {[
          { icon:BadgeCheck, title:"Verification Before Transaction", desc:"Identity, KYC & document checks before listing goes live."},
          { icon:Shield, title:"RERA Information", desc:"State-wise RERA authorities, rules & project verification guidance."},
          { icon:Building2, title:"Professionals You Can Trust", desc:"Agents, builders & advocates with credentials & reviews."},
          { icon:Users, title:"Fraud Protection", desc:"Verify before you pay • Report & evidence • Admin investigation."},
        ].map(f=>(
          <div key={f.title} className="flex gap-3">
            <f.icon className="text-[#C9A227] shrink-0" size={22}/>
            <div><div className="font-semibold text-[#0B1D3A] text-sm">{f.title}</div><div className="text-xs text-slate-600 mt-1 leading-relaxed">{f.desc}</div></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AgentPreview(){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <h2 className="text-xl md:text-2xl font-bold text-[#0B1D3A]">Top Rated Agents</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {agents.map(a=>(
          <div key={a.name} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4">
            <img src={a.image} alt={a.name} className="h-16 w-16 rounded-2xl object-cover"/>
            <div>
              <div className="font-semibold text-[#0B1D3A] flex items-center gap-1">{a.name} {a.verified && <BadgeCheck size={14} className="text-emerald-600"/>}</div>
              <div className="text-xs text-slate-500">{a.city} • {a.deals} deals • ★ {a.rating}</div>
              <div className="text-xs text-slate-600 mt-1">{a.phone}</div>
              <Link href={`/agents`} className="text-xs font-semibold text-[#0B1D3A] underline">View profile</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function BlogPreview(){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <div className="flex items-end justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-[#0B1D3A]">Insights & Guides</h2>
        <Link href="/blog" className="text-sm font-semibold text-[#0B1D3A]">View all</Link>
      </div>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        {blogPosts.map(b=>(
          <Link key={b.id} href={`/blog/${b.slug}`} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition">
            <img src={b.image} alt={b.title} className="h-44 w-full object-cover"/>
            <div className="p-4">
              <div className="text-xs font-semibold text-[#C9A227]">{b.category} • {b.date}</div>
              <div className="font-semibold text-[#0B1D3A] mt-1 leading-tight line-clamp-2">{b.title}</div>
              <div className="text-sm text-slate-500 mt-1 line-clamp-2">{b.excerpt}</div>
              <div className="text-xs text-slate-400 mt-2">By {b.author}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function TestimonialsSection(){
  return (
    <section className="bg-[#0B1D3A] text-white">
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold">What Our Users Say</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {testimonials.map(t=>(
            <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-amber-400">★★★★★</div>
              <p className="mt-2 text-sm text-white/85 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-3 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-white/60">{t.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection(){
  return (
    <section className="max-w-[1280px] mx-auto px-4 py-10">
      <div className="rounded-[24px] bg-gradient-to-br from-[#0B1D3A] to-[#1a3a6b] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
        <div className="absolute -right-10 -top-10 h-40 w-40 bg-[#C9A227]/20 rounded-full blur-2xl"/>
        <div>
          <h3 className="text-xl md:text-2xl font-bold">Own a property? Sell or rent faster.</h3>
          <p className="text-white/70 text-sm mt-1">Free listing • Verified enquiries • Dedicated support • Earn featured boost</p>
        </div>
        <div className="flex gap-2">
          <Link href="/sell"><Button variant="gold">Post Property FREE</Button></Link>
          <Link href="/partners"><Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[#0B1D3A]">Become Partner</Button></Link>
        </div>
      </div>
    </section>
  )
}
