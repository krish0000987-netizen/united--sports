import { getSiteSettingsServer, getNavigationItemsServer, getFooterSectionsServer } from "@/lib/cms/server"
import { SiteHeader } from "@/components/site/SiteHeader"
import { SiteFooter } from "@/components/site/SiteFooter"
import { WhatsAppButton } from "@/components/site/WhatsAppButton"

export default async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, nav, footerSections] = await Promise.all([
    getSiteSettingsServer(),
    getNavigationItemsServer(),
    getFooterSectionsServer(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} nav={nav} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} sections={footerSections} />
      <WhatsAppButton settings={settings} />
    </div>
  )
}
