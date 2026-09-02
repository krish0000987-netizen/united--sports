"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-navy-deep/85 backdrop-blur-xl border-b border-border py-2"
          : "bg-transparent py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {settings?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt={`${settings.site_name} emblem`}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-contain ring-1 ring-primary/40"
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-lg text-primary-foreground ring-1 ring-primary/40">
              U
            </div>
          )}
          <span className="leading-none">
            <span className="block font-display text-lg tracking-wide">
              United<span className="text-primary">Athletes</span>
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
              for India Foundation
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "relative text-sm font-semibold uppercase tracking-[0.14em] transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-foreground/80",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {phone && (
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 text-primary" />
              {phone}
            </a>
          )}
          <Link
            href="/get-involved"
            className="rounded-sm bg-primary px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.12em] text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            Get Involved
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-sm border border-border p-2 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-navy-deep/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/60 py-3 text-sm font-semibold uppercase tracking-[0.16em]",
                  pathname === item.href && "text-primary",
                )}
              >
                {item.label}
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
          </nav>
        </div>
      )}
    </header>
  )
}
