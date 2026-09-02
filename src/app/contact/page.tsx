import { MapPin, Phone } from "lucide-react"

import { getSiteSettingsServer } from "@/lib/cms/server"
import PublicShell from "@/components/site/PublicShell"
import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { ContactForm } from "./ContactForm"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Contact",
  description: "Reach UnitedAthletes for India Foundation — athletes, coaches, organisations and supporters, we'd love to hear from you.",
}

export default async function ContactPage() {
  const settings = await getSiteSettingsServer()

  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s <span className="text-gold-gradient">talk sport</span></>}
        subtitle="Athletes, coaches, organisations and supporters — we'd love to hear from you."
        image="/assets/facility.jpg"
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
              Together, we can build a{" "}
              <span className="text-gold-gradient">stronger sporting India.</span>
            </h2>
            <p className="mt-8 font-display text-2xl">UnitedAthletes</p>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-primary">
              Empowering Athletes. Enabling Dreams.
            </p>
          </Reveal>
        </div>
      </section>
    </PublicShell>
  )
}
