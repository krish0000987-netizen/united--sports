"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { heroSlides } from "@/lib/data/mock"
import { Button } from "@/components/ui/button"
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

export function HeroSlideshow(){
  const [idx,setIdx]=useState(0)
  const [tab,setTab]=useState<"buy"|"rent"|"commercial">("buy")
  const [query,setQuery]=useState("")
  useEffect(()=>{
    const id=setInterval(()=> setIdx(i=> (i+1)%heroSlides.length),3000)
    return ()=>clearInterval(id)
  },[])
  const slide=heroSlides[idx]

  return (
    <section className="relative overflow-hidden bg-[#0B1D3A]">
      {/* slideshow background */}
      <div className="absolute inset-0">
        {/* desktop */}
        <img src={slide.desktop_image} alt={slide.title} className="hidden md:block h-full w-full object-cover opacity-70" />
        {/* mobile */}
        <img src={slide.mobile_image} alt={slide.title} className="md:hidden h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D3A]/90 via-[#0B1D3A]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* content */}
      <div className="relative max-w-[1280px] mx-auto px-4">
        <div className="min-h-[520px] md:min-h-[560px] flex flex-col justify-center py-10 md:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-1.5 text-xs font-semibold text-white mb-4">
              <span className="h-2 w-2 bg-emerald-400 rounded-full"/> RERA • Verified Professionals • Secure Payments
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] whitespace-pre-line">{slide.title}</h1>
            <p className="mt-3 text-white/80 text-sm md:text-base max-w-xl">{slide.subtitle}</p>

            {/* tabs + search */}
            <div className="mt-6 bg-white rounded-[20px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] max-w-[640px]">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-full w-fit">
                {(["buy","rent","commercial"] as const).map(t=>(
                  <button key={t} onClick={()=>setTab(t)} className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${tab===t?"bg-[#0B1D3A] text-white shadow":"text-slate-600 hover:text-slate-900"}`}>{t}</button>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by city, locality or project (e.g. Worli, Mumbai)" className="w-full h-12 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:bg-white"/>
                </div>
                <Link href={`/buy?query=${encodeURIComponent(query)}&type=${tab}`} className="hidden md:inline-flex"><Button variant="gold" size="lg" className="rounded-full h-12"><Search size={16} className="mr-2"/>Search</Button></Link>
                <Link href={`/buy?query=${encodeURIComponent(query)}&type=${tab}`} className="md:hidden"><Button variant="gold" size="icon" className="rounded-full h-12 w-12"><Search size={18}/></Button></Link>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 px-1">
                <span>Popular:</span>
                <Link href="/buy?city=Mumbai" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200">Mumbai</Link>
                <Link href="/buy?city=Bengaluru" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200">Bengaluru</Link>
                <Link href="/buy?city=Pune" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200">Pune</Link>
                <Link href="/projects" className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200">New Projects</Link>
              </div>
            </div>

            <div className="mt-4 flex gap-2 text-xs text-white/70">
              <span>★ 4.8/5 from 12,400+ reviews</span><span>•</span><span>24k+ verified agents</span>
            </div>
          </div>
        </div>

        {/* slide controls */}
        <div className="absolute bottom-6 right-4 md:right-6 flex items-center gap-2">
          <button onClick={()=>setIdx(i=> (i-1+heroSlides.length)%heroSlides.length)} className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white grid place-items-center hover:bg-white/25"><ChevronLeft size={18}/></button>
          <div className="flex gap-1.5 bg-black/20 backdrop-blur rounded-full px-2 py-1.5 border border-white/15">
            {heroSlides.map((_,i)=> <button key={i} onClick={()=>setIdx(i)} className={`h-1.5 rounded-full transition-all ${i===idx?"w-6 bg-[#C9A227]":"w-1.5 bg-white/60 hover:bg-white"}`} />)}
          </div>
          <button onClick={()=>setIdx(i=> (i+1)%heroSlides.length)} className="h-9 w-9 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white grid place-items-center hover:bg-white/25"><ChevronRight size={18}/></button>
        </div>
      </div>
    </section>
  )
}
