"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, Textarea } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody, Badge } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { toast } from "@/components/ui/toast"
import { updateEnquiry, createActivityLog, getCurrentUser } from "@/lib/cms/data"
import { Enquiry } from "@/lib/cms/types"
import { formatDate } from "@/lib/format"

export function EnquiryManager({ enquiry }: { enquiry: Enquiry }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(enquiry.status)
  const [adminNotes, setAdminNotes] = useState(enquiry.admin_notes || "")

  async function save() {
    setSaving(true)
    try {
      const { error } = await updateEnquiry(enquiry.id, {
        status,
        admin_notes: adminNotes.trim() || null,
      })
      if (error) {
        toast.error(error)
        return
      }
      const user = await getCurrentUser()
      await createActivityLog({
        admin_user_id: user?.id || null,
        admin_email: user?.email || null,
        action: "update",
        entity_type: "enquiry",
        entity_id: enquiry.id,
        description: `${enquiry.name} → ${status}`,
      })
      toast.success("Enquiry updated")
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-2 sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3">
        <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
          <ArrowLeft size={14} /> Back to enquiries
        </Link>
        <Button onClick={save} variant="primary" disabled={saving}>
          <Save size={14} /> {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardBody>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={6}
                placeholder="Internal notes (not visible to the enquirer)..."
                hint="Only visible to administrators."
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Current Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                options={[
                  { value: "new", label: "New" },
                  { value: "contacted", label: "Contacted" },
                  { value: "resolved", label: "Resolved" },
                ]}
              />
              <div>
                <Badge variant={status === "new" ? "warning" : status === "resolved" ? "success" : "info"}>
                  {status}
                </Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Name</p>
                <p className="font-medium text-slate-900">{enquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Email</p>
                <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 text-[#0B1D3A] hover:underline">
                  <Mail size={14} /> {enquiry.email}
                </a>
              </div>
              {enquiry.phone && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Phone</p>
                  <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1.5 text-[#0B1D3A] hover:underline">
                    <Phone size={14} /> {enquiry.phone}
                  </a>
                </div>
              )}
              {enquiry.subject && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Subject</p>
                  <p className="font-medium text-slate-900">{enquiry.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Received</p>
                <p className="text-slate-700">{formatDate(enquiry.created_at, "datetime")}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}