"use client"
import Link from "next/link"
import { useState } from "react"
import { Heart, Menu, X, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { NavigationItem, SiteSettings } from "@/lib/cms/types"
import { useEffect } from "react"
import { getNavigationItems } from "@/lib/cms/data"

export function Header({ settings }: { settings: SiteSettings | null }) {
  const [open, setOpen] = useState(false)
  const [nav, setNav] = useState<NavigationItem[]>([])
  const pathname = usePathname()

  useEffect(() => {
    getNavigationItems().then(setNav).catch(() => setNav([]))
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* top trust bar */}
      <div className="hidden md:block bg-[#0B1D3A] text-white text-xs">
        <div className="max-w-[1280px] mx-auto px-4 h-8 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
            {settings?.site_name || "United Sports"} • Your Premier Sports Community
          </span>
          <span className="flex items-center gap-4">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5">
                <Phone size={12} /> {settings.phone}
              </a>
            )}
            <Link href="/contact" className="hover:underline">Contact</Link>
          </span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 h-[64px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-9 object-contain" />
          ) : (
            <div className="h-9 w-9 rounded-xl bg-[#0B1D3A] flex items-center justify-center text-white font-bold text-lg">U</div>
          )}
          <div className="leading-tight">
            <div className="font-bold text-[#0B1D3A] text-[15px] tracking-tight">
              {settings?.site_name || "United Sports"}
              <span className="text-[#C9A227]">.com</span>
            </div>
            <div className="text-[10px] tracking-[0.14em] text-slate-500 font-semibold uppercase">Unite. Train. Compete.</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.id}
              href={n.href}
              className={`px-3 py-2 text-sm font-medium rounded-full ${
                pathname === n.href
                  ? "text-[#0B1D3A] bg-slate-100"
                  : "text-slate-700 hover:text-[#0B1D3A] hover:bg-slate-50"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden md:inline-flex">
            <Button variant="gold" size="sm" className="shadow-[0_4px_14px_rgba(201,162,39,0.35)]">
              Get in Touch
            </Button>
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-slate-200">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {nav.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            <Link href="/contact" className="flex-1">
              <Button variant="gold" className="w-full">Get in Touch</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}