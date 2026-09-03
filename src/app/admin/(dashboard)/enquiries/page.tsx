import { Card, Table, THead, TBody, TR, TH, TD, Badge, EmptyState } from "@/components/ui/admin"
import { PageHeader } from "@/components/admin/PageHeader"
import { EnquiryActionButtons } from "@/components/admin/enquiries/EnquiryActionButtons"
import { getEnquiries, deleteEnquiry } from "@/lib/cms/data"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries()

  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Enquiries"
        description="Manage contact form submissions from your website."
      />

      <Card>
        {enquiries.length === 0 ? (
          <EmptyState
            title="No enquiries yet"
            description="Contact form submissions will appear here."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>From</TH>
                <TH>Subject</TH>
                <TH>Status</TH>
                <TH>Date</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {enquiries.map((e) => (
                <TR key={e.id}>
                  <TD>
                    <Link href={`/admin/enquiries/${e.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A] block">
                      {e.name}
                    </Link>
                    <a href={`mailto:${e.email}`} className="text-xs text-slate-500 hover:text-[#0B1D3A]">
                      {e.email}
                    </a>
                  </TD>
                  <TD className="line-clamp-1">{e.subject || "—"}</TD>
                  <TD>
                    <Badge variant={e.status === "new" ? "warning" : e.status === "resolved" ? "success" : "info"}>
                      {e.status}
                    </Badge>
                  </TD>
                  <TD className="text-xs text-slate-500">{formatDate(e.created_at, "datetime")}</TD>
                  <TD>
                    <EnquiryActionButtons
                      id={e.id}
                      title={e.name}
                      viewHref={`/admin/enquiries/${e.id}`}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  )
}