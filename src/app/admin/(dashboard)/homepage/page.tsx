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
    </div>
  )
}
