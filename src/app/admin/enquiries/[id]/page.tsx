import { PageHeader } from "@/components/admin/PageHeader"
import { EnquiryManager } from "@/components/admin/enquiries/EnquiryManager"
import { getEnquiryById } from "@/lib/cms/data"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const enquiry = await getEnquiryById(id)
  if (!enquiry) notFound()

  return (
    <div>
      <PageHeader
        title="Enquiry"
        description={`From ${enquiry.name}`}
        back="/admin/enquiries"
      />
      <EnquiryManager enquiry={enquiry} />
    </div>
  )
}