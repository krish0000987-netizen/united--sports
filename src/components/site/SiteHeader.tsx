"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Heart, ChevronRight, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { NavigationItem, SiteSettings } from "@/lib/cms/types"

export function SiteHeader({
  settings,
  nav,
}: {
  settings: SiteSettings | null
  nav: NavigationItem[]
}) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", onKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const phone = settings?.phone || ""
  const whatsapp = settings?.whatsapp || settings?.phone || ""
  const logo = settings?.logo_url || "/assets/logo-circle.png"

  // Center navigation links (content pages only — action buttons sit together on the right)
  const navItems = nav.filter(
    (item) =>
      item.href !== "/donate" &&
      item.label?.toLowerCase() !== "donate" &&
      item.href !== "/get-involved" &&
      item.label?.toLowerCase() !== "get involved",
  )

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-[#0B1D3A]/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25",
          scrolled ? "py-2 bg-[#0B1D3A]/98 border-[#C9A227]/25 shadow-xl" : "py-2.5 sm:py-3",
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
          {/* Brand Emblem & Logo */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3 transition-transform hover:opacity-95"
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative shrink-0">
              <img
                src={logo}
                alt={`${settings?.site_name || "UnitedAthletes"} emblem`}
                width={44}
                height={44}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-[#C9A227]/60 group-hover:ring-[#C9A227] bg-white/5 transition-all shadow-md shadow-black/40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/logo-circle.png"
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0B1D3A]" title="Foundation Active" />
            </div>
            <span className="leading-none">
              <span className="block font-display text-base sm:text-lg tracking-wide text-white whitespace-nowrap">
                United<span className="text-[#C9A227] drop-shadow-[0_0_8px_rgba(201,162,39,0.3)]">Athletes</span>
              </span>
              <span className="block text-[0.55rem] sm:text-[0.62rem] uppercase tracking-[0.22em] text-slate-300 font-medium whitespace-nowrap">
                for India Foundation
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 2xl:gap-2 mx-auto">
            {navItems.map((item) => {
              const active = isRouteActive(item.href)

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "relative px-2 py-1.5 xl:px-2.5 2xl:px-3 text-[11px] xl:text-[12px] 2xl:text-[13px] font-bold uppercase tracking-[0.06em] rounded-md transition-all duration-200 whitespace-nowrap",
                    active
                      ? "text-[#C9A227] bg-[#C9A227]/10"
                      : "text-slate-200/90 hover:text-white hover:bg-white/5",
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-[#C9A227] via-amber-300 to-[#C9A227] rounded-full shadow-[0_0_8px_rgba(201,162,39,0.9)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Right Action Area: Get Involved + Donate (Always fully visible side-by-side) */}
          <div className="hidden lg:flex shrink-0 items-center gap-2 xl:gap-3">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="hidden 2xl:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-[#C9A227] px-2.5 py-1.5 rounded-full border border-white/10 hover:border-[#C9A227]/40 bg-white/5 transition-all whitespace-nowrap"
                title="Call UnitedAthletes"
              >
                <Phone className="h-3.5 w-3.5 text-[#C9A227] shrink-0" />
                <span>{phone}</span>
              </a>
            )}

            <Link
              href="/get-involved"
              className={cn(
                "inline-flex shrink-0 whitespace-nowrap rounded-md border border-[#C9A227]/70 bg-[#C9A227]/10 hover:bg-[#C9A227] hover:text-[#0B1D3A] px-3 py-1.5 xl:px-3.5 xl:py-2 text-[11.5px] xl:text-xs font-bold uppercase tracking-[0.08em] text-[#C9A227] transition-all duration-200 shadow-sm",
                pathname === "/get-involved" && "bg-[#C9A227] text-[#0B1D3A]"
              )}
            >
              Get Involved
            </Link>

            <Link
              href="/donate"
              className="group inline-flex shrink-0 whitespace-nowrap rounded-md bg-gradient-to-r from-[#DFB738] via-[#C9A227] to-[#B38918] hover:from-[#E8C44D] hover:via-[#D4AC2D] hover:to-[#C09623] text-[#0B1D3A] px-3.5 py-1.5 xl:px-4 xl:py-2 text-[11.5px] xl:text-xs font-black uppercase tracking-[0.09em] shadow-[0_0_18px_rgba(201,162,39,0.35)] hover:shadow-[0_0_26px_rgba(201,162,39,0.55)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 items-center gap-1.5 ring-1 ring-amber-300/60"
            >
              <Heart size={14} className="fill-[#0B1D3A] text-[#0B1D3A] group-hover:scale-110 transition-transform" />
              <span>Donate</span>
            </Link>
          </div>

          {/* Mobile Controls: High-visibility Donate CTA + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/donate"
              className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#DFB738] via-[#C9A227] to-[#B38918] text-[#0B1D3A] px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.08em] shadow-md shadow-[#C9A227]/30 ring-1 ring-amber-300/50"
            >
              <Heart size={13} className="fill-[#0B1D3A] text-[#0B1D3A]" />
              <span>Donate</span>
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "h-9 w-9 grid place-items-center rounded-md border transition-colors",
                open
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:text-white",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Drawer & Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-[56px] sm:top-[64px] z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[#0B1D3A] border-b border-[#C9A227]/25 shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick Donation Spotlight Banner */}
            <div className="p-4 bg-gradient-to-br from-[#12284C] to-[#0B1D3A] border-b border-white/10">
              <div className="rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                  <Heart size={14} className="fill-[#C9A227]" />
                  <span>Support Indian Athletes</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  100% of donations directly sponsor equipment, training facilities & nutrition for grassroot champions.
                </p>
                <Link
                  href="/donate"
                  onClick={() => setOpen(false)}
                  className="mt-3 w-full text-center rounded-lg bg-gradient-to-r from-[#DFB738] via-[#C9A227] to-[#B38918] text-[#0B1D3A] py-2.5 text-xs font-black uppercase tracking-wider shadow-md shadow-[#C9A227]/30 flex items-center justify-center gap-2"
                >
                  <Heart size={14} className="fill-[#0B1D3A]" />
                  <span>Donate to Athletes</span>
                </Link>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="p-4 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1">
                Navigation
              </div>
              {navItems.map((item) => {
                const isDonate = item.href === "/donate" || item.label?.toLowerCase() === "donate"
                const active = isRouteActive(item.href)

                if (isDonate) {
                  return (
                    <Link
                      key={item.id}
                      href="/donate"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-black uppercase tracking-[0.08em] bg-gradient-to-r from-[#DFB738] via-[#C9A227] to-[#B38918] text-[#0B1D3A] shadow-md my-1.5"
                    >
                      <span className="flex items-center gap-2">
                        <Heart size={16} className="fill-[#0B1D3A]" />
                        <span>Donate to Athletes</span>
                      </span>
                      <ChevronRight size={16} />
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-[0.08em] transition-colors",
                      active
                        ? "bg-[#C9A227]/15 text-[#C9A227] border-l-4 border-[#C9A227] font-bold"
                        : "text-slate-200 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={14} className={active ? "text-[#C9A227]" : "text-slate-400"} />
                  </Link>
                )
              })}

              <div className="pt-2">
                <Link
                  href="/get-involved"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full text-center rounded-lg border border-[#C9A227]/50 bg-[#C9A227]/5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C9A227] hover:bg-[#C9A227] hover:text-[#0B1D3A] transition-colors"
                >
                  <span>Get Involved</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </nav>

            {/* Mobile Direct Contact & Help */}
            <div className="p-4 border-t border-white/10 bg-black/20 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Contact & Support
              </div>
              <div className="grid grid-cols-2 gap-2">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200 hover:text-[#C9A227] transition-colors"
                  >
                    <Phone size={13} className="text-[#C9A227]" />
                    <span className="truncate">{phone}</span>
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-medium text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                  >
                    <MessageCircle size={13} className="text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Social icons */}
              <div className="flex items-center justify-center gap-5 pt-2 text-slate-400">
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#C9A227] transition-colors">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#C9A227] transition-colors">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.5 0 9 1.582 9 4.615V8z"/></svg>
                  </a>
                )}
                {settings?.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noreferrer" aria-label="Twitter / X" className="hover:text-[#C9A227] transition-colors">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-[#C9A227] transition-colors">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
