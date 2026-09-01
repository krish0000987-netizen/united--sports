import { PageHeader } from "@/components/admin/PageHeader"
import { NavigationManager } from "@/components/admin/navigation/NavigationManager"
import { getAllNavigationItems } from "@/lib/cms/data"

export const dynamic = "force-dynamic"

export default async function NavigationPage() {
  const items = await getAllNavigationItems()

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Navigation"
        description="Manage the items shown in your website navigation menu."
      />
      <NavigationManager items={items} />
    </div>
  )
}