import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getSiteSettingsServer } from "@/lib/cms/server"
import { ContactForm } from "./ContactForm"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Contact | United Sports",
  description: "Get in touch with United Sports. We'd love to hear from you.",
}

export default async function ContactPage() {
  const settings = await getSiteSettingsServer()

  return (
    <div className="min-h-screen flex flex-col">
      <Header settings={settings} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1D3A] via-[#0B1D3A] to-[#1a3a6b] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative max-w-[1280px] mx-auto px-4 py-20 md:py-28">
          <p className="text-sm font-semibold text-[#C9A227] uppercase tracking-wider">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Contact Us</h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl">
            Have a question or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-12 w-full">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {settings?.email && (
            <InfoCard
              icon={<Mail size={20} />}
              label="Email"
              value={settings.email}
              href={`mailto:${settings.email}`}
            />
          )}
          {settings?.phone && (
            <InfoCard
              icon={<Phone size={20} />}
              label="Phone"
              value={settings.phone}
              href={`tel:${settings.phone}`}
            />
          )}
          {settings?.whatsapp && (
            <InfoCard
              icon={<MessageCircle size={20} />}
              label="WhatsApp"
              value={settings.whatsapp}
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              external
            />
          )}
          {settings?.address && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="h-10 w-10 rounded-full bg-[#0B1D3A]/10 text-[#0B1D3A] grid place-items-center mb-3">
                <MapPin size={20} />
              </div>
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Address</p>
              <p className="text-sm text-slate-800 mt-1 whitespace-pre-wrap">{settings.address}</p>
            </div>
          )}
        </div>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-[#0B1D3A] mb-6">Send us a message</h2>
          <ContactForm />
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  )
}

function InfoCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className="h-10 w-10 rounded-full bg-[#0B1D3A]/10 text-[#0B1D3A] grid place-items-center mb-3">
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p className="text-sm text-slate-800 mt-1 break-all">{value}</p>
    </a>
  )
}
