"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, Building2, User } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href:"/", icon:Home, label:"Home"},
  { href:"/buy", icon:Search, label:"Search"},
  { href:"/saved", icon:Heart, label:"Saved"},
  { href:"/sell", icon:Building2, label:"Post"},
  { href:"/auth/login", icon:User, label:"Account"},
]

export function MobileBottomNav(){
  const pathname = usePathname()
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200">
      <div className="grid grid-cols-5">
        {items.map(it=>{
          const active = pathname===it.href
          return (
            <Link key={it.href} href={it.href} className={cn("flex flex-col items-center justify-center py-2.5 text-[11px] font-medium", active?"text-[#0B1D3A]":"text-slate-500")}>
              <it.icon size={18} className={cn(active && "text-[#C9A227]")} />
              {it.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
