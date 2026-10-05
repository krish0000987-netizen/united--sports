import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { HomepageSectionsManager } from "@/components/admin/homepage/HomepageSectionsManager"
import { HomepageHeroEditor } from "@/components/admin/homepage/HomepageHeroEditor"
import { getHomepageSections, getHomepageHero } from "@/lib/cms/admin-actions"

export const dynamic = "force-dynamic"

export default async function HomepagePage() {
  const [sections, hero] = await Promise.all([
    getHomepageSections(),
    getHomepageHero(),
  ])

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Homepage"
        description="Edit the hero, section content, visibility and ordering of your homepage."
      />
      <HomepageHeroEditor hero={hero} />
      <HomepageSectionsManager sections={sections} />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Looking to manage the site Footer or Header Navbar?</h4>
          <p className="text-xs text-slate-500 mt-0.5">Footer columns, links, social handles, and navbar tabs are configured in their dedicated managers.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/footer" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-800 hover:border-[#0B1D3A] transition-colors">
            Manage Footer →
          </Link>
          <Link href="/admin/navigation" className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-800 hover:border-[#0B1D3A] transition-colors">
            Manage Navbar →
          </Link>
        </div>
      </div>
    </div>
  )
}
