import { PageHeader } from "@/components/admin/PageHeader"
import { HomepageSectionsManager } from "@/components/admin/homepage/HomepageSectionsManager"
import { getHomepageSections } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function HomepagePage() {
  const sections = await getHomepageSections()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Homepage Sections"
        description="Edit content, visibility, and ordering of homepage sections."
      />
      <HomepageSectionsManager sections={sections} />
    </div>
  )
}