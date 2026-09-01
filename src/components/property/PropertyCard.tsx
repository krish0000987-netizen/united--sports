import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Heart, MapPin, Bed, Bath, Square, BadgeCheck, Star } from "lucide-react"
import { Property } from "@/lib/data/mock"

export function PropertyCard({ p }: { p: Property }){
  const isRent = p.listing_type==="rent" || p.listing_type==="pg" || p.listing_type==="lease" || p.listing_type==="commercial_rent"
  return (
    <Link href={`/property/${p.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isRent?"bg-emerald-600 text-white":"bg-[#0B1D3A] text-white"}`}>{isRent? (p.listing_type==="pg"?"PG": "Rent"):"Sale"}</span>
          {p.is_featured && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#C9A227] text-[#0B1D3A]">Featured</span>}
        </div>
        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/95 grid place-items-center shadow hover:bg-white"><Heart size={14} className="text-slate-600"/></button>
        {p.is_verified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 shadow">
            <BadgeCheck size={14} className="text-emerald-600"/> Verified
            {p.verification.rera_available && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">RERA</span>}
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">{p.images.length} photos</div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[#0B1D3A] leading-tight line-clamp-2 text-[15px]">{p.title}</h3>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12}/>{p.locality}, {p.city}</div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#0B1D3A]">{isRent? `${formatPrice(p.rent_amount||p.price)}/mo` : formatPrice(p.price)}</span>
          {p.area>0 && <span className="text-xs text-slate-500">• ₹{Math.round(p.price/p.area).toLocaleString("en-IN")}/sqft</span>}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 border-t pt-3">
          {p.bedrooms>0 && <span className="flex items-center gap-1"><Bed size={14}/> {p.bedrooms} BHK</span>}
          {p.bathrooms>0 && <span className="flex items-center gap-1"><Bath size={14}/> {p.bathrooms} Bath</span>}
          {p.area>0 && <span className="flex items-center gap-1"><Square size={14}/> {p.area.toLocaleString()} sqft</span>}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><img src={p.owner.avatar} alt="" className="h-6 w-6 rounded-full"/>{p.owner.name} {p.owner.verified && <Star size={12} className="text-[#C9A227] fill-[#C9A227]"/>}</span>
          <span className="text-xs text-slate-400">{p.locality}</span>
        </div>
      </div>
    </Link>
  )
}
