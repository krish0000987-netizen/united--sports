"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Heart } from "lucide-react"
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
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const phone = settings?.phone || ""

  const logo = settings?.logo_url || "/assets/logo-circle.png"

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-navy-deep/95 backdrop-blur-xl border-b border-border/80 shadow-md shadow-black/25",
        scrolled ? "py-2 sm:py-2.5 bg-navy-deep/98 border-border" : "py-3 sm:py-3.5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={`${settings?.site_name || "UnitedAthletes"} emblem`}
            width={44}
            height={44}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-1 ring-primary/40 bg-white/5 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/logo-circle.png"
            }}
          />
          <span className="leading-none">
            <span className="block font-display text-base sm:text-lg tracking-wide whitespace-nowrap">
              United<span className="text-primary">Athletes</span>
            </span>
            <span className="block text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground whitespace-nowrap">
              for India Foundation
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2.5 lg:flex xl:gap-4 2xl:gap-6 ml-3 sm:ml-4 xl:ml-6 mr-auto">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative whitespace-nowrap text-xs font-semibold uppercase tracking-[0.06em] xl:text-[13px] xl:tracking-[0.08em] 2xl:text-sm 2xl:tracking-[0.1em] transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/90",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex xl:gap-3 ml-auto">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:text-primary whitespace-nowrap mr-1"
            >
              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
              {phone}
            </a>
          )}
          <Link
            href="/get-involved"
            className="shrink-0 whitespace-nowrap rounded-sm border border-primary/40 bg-transparent px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary transition-all duration-300 hover:bg-primary/10 xl:px-3.5 xl:py-2"
          >
            Get Involved
          </Link>
          <Link
            href="/donate"
            className="shrink-0 whitespace-nowrap rounded-sm bg-gradient-gold px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-navy-deep shadow-md shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50 flex items-center gap-1.5 ring-1 ring-primary/40"
          >
            <Heart size={14} className="fill-navy-deep text-navy-deep" />
            <span>Donate</span>
          </Link>
        </div>

        {/* Mobile controls: Always-visible Donate button + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/donate"
            className="flex items-center gap-1.5 rounded-sm bg-gradient-gold px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-navy-deep shadow-sm shadow-primary/25"
          >
            <Heart size={12} className="fill-navy-deep text-navy-deep" />
            <span>Donate</span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border p-2 text-foreground/90"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-navy-deep/98 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-7xl px-5 pt-4 pb-2">
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="w-full text-center rounded-sm bg-gradient-gold py-3 text-xs font-black uppercase tracking-[0.14em] text-navy-deep shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              <Heart size={15} className="fill-navy-deep text-navy-deep" />
              <span>Donate to Athletes</span>
            </Link>
          </div>
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-2">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-[0.16em] flex items-center justify-between",
                  pathname === item.href ? "text-primary" : "text-foreground/90",
                  item.href === "/donate" && "text-primary font-bold",
                )}
              >
                <span>{item.label}</span>
                {item.href === "/donate" && (
                  <span className="text-[10px] bg-primary text-navy-deep font-black px-2 py-0.5 rounded">
                    NEW
                  </span>
                )}
              </Link>
            ))}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                className="py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary"
              >
                {phone}
              </a>
            )}
            <div className="pt-2 pb-3">
              <Link
                href="/get-involved"
                onClick={() => setOpen(false)}
                className="block w-full text-center rounded-sm border border-primary/40 bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-primary"
              >
                Get Involved
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
