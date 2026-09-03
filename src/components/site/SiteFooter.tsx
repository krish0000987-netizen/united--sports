import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

import { SiteSettings, FooterSection } from "@/lib/cms/types"

export function SiteFooter({
  settings,
  sections,
}: {
  settings: SiteSettings | null
  sections: FooterSection[]
}) {
  const logo = settings?.logo_url || "/assets/logo-circle.png"

  return (
    <footer className="border-t border-border bg-navy-deep">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:px-8 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt={`${settings?.site_name || "UnitedAthletes"} emblem`}
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-primary/40 bg-white/5"
            />
            <span className="font-display text-2xl">
              United<span className="text-primary">Athletes</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {settings?.description ||
              "UnitedAthletes for India Foundation — an athlete-focused organisation building a stronger sporting ecosystem across India."}
          </p>
          <p className="mt-5 font-display text-lg text-primary">
            Empowering Athletes. Enabling Dreams.
          </p>
        </div>

        {sections.map((s) => (
          <div key={s.id}>
            <h3 className="text-sm tracking-[0.2em]">{s.title}</h3>
            <div className="rule-gold mt-4" />
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {(s.links || []).map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.href}
                    target={l.is_external ? "_blank" : undefined}
                    rel={l.is_external ? "noreferrer" : undefined}
                    className="transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm tracking-[0.2em]">Contact</h3>
          <div className="rule-gold mt-4" />
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            {settings?.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-primary">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary">
                  {settings.email}
                </a>
              </li>
            )}
            {settings?.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {settings?.site_name || "UnitedAthletes for India Foundation"}. A
            Section 8 Company.
          </span>
          <span className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-primary">Admin</Link>
            <span className="uppercase tracking-[0.24em]">Made for India&apos;s athletes</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
