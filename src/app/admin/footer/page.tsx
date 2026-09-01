import { PageHeader } from "@/components/admin/PageHeader"
import { FooterManager } from "@/components/admin/footer/FooterManager"
import { getAllFooterSections } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function FooterPage() {
  const sections = await getAllFooterSections()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Footer"
        description="Manage the columns and links in your website footer."
      />
      <FooterManager sections={sections} />
    </div>
  )
}