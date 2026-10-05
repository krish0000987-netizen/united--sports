import { MapPin, Phone } from "lucide-react"

import { getSiteSettingsServer, getPageBySlugServer } from "@/lib/cms/server"
import PublicShell from "@/components/site/PublicShell"
import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { ContactForm } from "./ContactForm"

export const revalidate = 60

export async function generateMetadata() {
  const page = await getPageBySlugServer("contact")
  return {
    title: page?.meta_title || "Contact",
    description:
      page?.meta_description ||
      "Reach UnitedAthletes for India Foundation — athletes, coaches, organisations and supporters, we'd love to hear from you.",
  }
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([
    getSiteSettingsServer(),
    getPageBySlugServer("contact"),
  ])

  let parsed: Record<string, any> = {}
  if (typeof page?.content === "string" && page.content.trim()) {
    try {
      parsed = JSON.parse(page.content)
    } catch {
      // plain text or non-json
    }
  }

  const heroEyebrow = parsed.hero_eyebrow || page?.excerpt || "Contact"
  const heroSubtitle =
    parsed.hero_subtitle ||
    page?.excerpt ||
    "Athletes, coaches, organisations and supporters — we'd love to hear from you."
  const heroImage = page?.featured_image || parsed.hero_image || "/assets/facility.jpg"
  const bannerHeading = parsed.banner_heading || "Together, we can build a"
  const bannerHighlight = parsed.banner_highlight || "stronger sporting India."
  const bannerTagline = parsed.banner_tagline || "Empowering Athletes. Enabling Dreams."

  return (
    <PublicShell>
      <PageHero
        eyebrow={heroEyebrow}
        title={<>Let&apos;s <span className="text-gold-gradient">talk sport</span></>}
        subtitle={heroSubtitle}
        image={heroImage}
        alt="Modern indoor sports arena lit at night"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <p className="eyebrow">Contact Us</p>
            <div className="rule-gold mt-4" />
            <h2 className="mt-6 text-4xl sm:text-5xl">
              {settings?.site_name || "UnitedAthletes for India Foundation"}
            </h2>
            <ul className="mt-10 space-y-6">
              {settings?.phone && (
                <li className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Phone & WhatsApp
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                        className="text-lg hover:text-primary"
                      >
                        {settings.phone}
                      </a>
                      {settings.whatsapp && (
                        <a
                          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello UnitedAthletes Foundation!")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/20 px-3 py-1 text-xs font-extrabold text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                        >
                          Chat on WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )}
              {settings?.address && (
                <li className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Address
                    </p>
                    <p className="max-w-sm text-lg leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-navy">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">
              {bannerHeading}{" "}
              <span className="text-gold-gradient">{bannerHighlight}</span>
            </h2>
            <p className="mt-8 font-display text-2xl">{settings?.site_name || "UnitedAthletes"}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-primary">
              {bannerTagline}
            </p>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  )
}
