import { PageHeader } from "@/components/admin/PageHeader"
import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm"
import { getSiteSettings } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const settings = await getSiteSettings()

  if (!settings) {
    return (
      <div className="max-w-5xl">
        <PageHeader title="Site Settings" description="Configure your website." />
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
          No site settings found. Please run the database seed to create the initial settings row.
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Site Settings" description="Configure your website." />
      <SiteSettingsForm settings={settings} />
    </div>
  )
}