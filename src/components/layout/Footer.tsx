"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { SiteSettings, FooterSection } from "@/lib/cms/types"
import { getFooterSections, getSiteSettings } from "@/lib/cms/data"
import { Phone, Mail, MapPin } from "lucide-react"

export function Footer({ settings: initialSettings }: { settings: SiteSettings | null }) {
  const [sections, setSections] = useState<FooterSection[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings)

  useEffect(() => {
    getFooterSections().then(setSections).catch(() => setSections([]))
    if (!initialSettings) {
      getSiteSettings().then(setSettings).catch(() => setSettings(null))
    }
  }, [initialSettings])

  return (
    <footer className="bg-[#0B1D3A] text-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 py-14">
        <div className="grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              {settings?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logo_url} alt={settings.site_name} className="h-9 w-9 object-contain" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-[#C9A227] flex items-center justify-center text-[#0B1D3A] font-bold">U</div>
              )}
              <div>
                <div className="font-bold text-white">{settings?.site_name || "United Sports"}</div>
                <div className="text-xs text-slate-400">{settings?.description?.split('.')[0] || "Unite. Train. Compete."}</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {settings?.description || "Your premier destination for sports programmes, events, athletes and teams. Join our community and be part of something great."}
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-white">
                  <Phone size={14} /> {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail size={14} /> {settings.email}
                </a>
              )}
              {settings?.address && (
                <span className="flex items-start gap-2">
                  <MapPin size={14} className="mt-0.5 shrink-0" /> {settings.address}
                </span>
              )}
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-2">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white" title="Facebook">f</a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white" title="Instagram">ig</a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white" title="Twitter">tw</a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white" title="YouTube">yt</a>
              )}
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.id}>
              <div className="font-semibold text-white mb-3">{s.title}</div>
              <ul className="space-y-2 text-sm text-slate-400">
                {(s.links || []).map((l) => (
                  <li key={l.id}>
                    <Link
                      href={l.href}
                      target={l.is_external ? "_blank" : undefined}
                      rel={l.is_external ? "noreferrer" : undefined}
                      className="hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {settings?.site_name || "United Sports"}. All rights reserved.</span>
          <span className="flex gap-4">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}