"use client"
import { useState } from "react"
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  IndianRupee,
  Heart,
  TrendingUp,
  Receipt,
  User,
  Mail,
  Phone,
  FileText,
  Calendar,
  X,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardBody, Badge, EmptyState } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { DonationRecord } from "@/lib/cms/types"
import { formatDate } from "@/lib/format"
import Link from "next/link"

export function DonationsManager({
  initialDonations,
  stats,
}: {
  initialDonations: DonationRecord[]
  stats: {
    totalRaised: number
    totalDonations: number
    paidCount: number
    pendingCount: number
    failedCount: number
    averageDonation: number
  }
}) {
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null)

  const filtered = initialDonations.filter((d) => {
    if (filter !== "all" && d.status !== filter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      d.donor_name.toLowerCase().includes(q) ||
      d.donor_email.toLowerCase().includes(q) ||
      (d.donor_phone && d.donor_phone.toLowerCase().includes(q)) ||
      (d.razorpay_payment_id && d.razorpay_payment_id.toLowerCase().includes(q)) ||
      (d.pan_number && d.pan_number.toLowerCase().includes(q)) ||
      (d.purpose && d.purpose.toLowerCase().includes(q))
    )
  })

  function exportCSV() {
    if (filtered.length === 0) return

    const headers = [
      "Donation ID",
      "Date",
      "Donor Name",
      "Email",
      "Phone",
      "PAN Number",
      "Amount (INR)",
      "Purpose",
      "Status",
      "Razorpay Payment ID",
      "Razorpay Order ID",
      "Anonymous",
    ]

    const rows = filtered.map((d) => [
      `"${d.id}"`,
      `"${formatDate(d.created_at, "datetime")}"`,
      `"${d.donor_name.replace(/"/g, '""')}"`,
      `"${d.donor_email.replace(/"/g, '""')}"`,
      `"${(d.donor_phone || "").replace(/"/g, '""')}"`,
      `"${(d.pan_number || "").replace(/"/g, '""')}"`,
      d.amount,
      `"${(d.purpose || "").replace(/"/g, '""')}"`,
      `"${d.status}"`,
      `"${d.razorpay_payment_id || ""}"`,
      `"${d.razorpay_order_id || ""}"`,
      d.is_anonymous ? "Yes" : "No",
    ])

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `unitedathletes_donations_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Raised</span>
            <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{stats.totalRaised.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> From {stats.paidCount} successful donations
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.paidCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Verified payments</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Contribution</span>
            <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Heart size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{stats.averageDonation.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Per verified donor</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="h-8 w-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{stats.pendingCount}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Incomplete checkouts</span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: `All (${initialDonations.length})` },
            { id: "paid", label: `Paid (${stats.paidCount})` },
            { id: "pending", label: `Pending (${stats.pendingCount})` },
            { id: "failed", label: `Failed (${stats.failedCount})` },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === item.id
                  ? "bg-[#0B1D3A] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search and Export */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor, email, PAN..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white outline-none focus:border-amber-500"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="text-xs py-1.5"
          >
            <Download size={13} /> Export CSV
          </Button>

          <Link href="/admin/donations/settings">
            <Button type="button" variant="primary" className="text-xs py-1.5">
              Payment Gateway Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Donations Table */}
      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            title="No donations found"
            description={
              initialDonations.length === 0
                ? "Donations made through your website will appear here in real time."
                : "No donation records match the selected filter or search query."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Donor</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Purpose</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Payment ID / Ref</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        {d.donor_name}
                        {d.is_anonymous && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                            Anon
                          </span>
                        )}
                      </div>
                      <a href={`mailto:${d.donor_email}`} className="text-xs text-slate-500 hover:text-[#0B1D3A]">
                        {d.donor_email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-slate-900 text-base">
                        ₹{Number(d.amount).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-700 max-w-[200px] truncate">
                      {d.purpose || "General Athlete Support"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          d.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : d.status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {d.status === "paid" ? (
                          <CheckCircle2 size={12} />
                        ) : d.status === "pending" ? (
                          <Clock size={12} />
                        ) : (
                          <XCircle size={12} />
                        )}
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                      {d.razorpay_payment_id || d.razorpay_order_id || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(d.created_at, "datetime")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDonation(d)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-lg text-slate-900">Donation Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block">Donated Amount</span>
                <span className="text-3xl font-black text-slate-900">
                  ₹{Number(selectedDonation.amount).toLocaleString("en-IN")}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  selectedDonation.status === "paid"
                    ? "bg-emerald-100 text-emerald-800"
                    : selectedDonation.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedDonation.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 py-1">
                <User size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Donor Name</span>
                  <span className="font-semibold text-slate-900">{selectedDonation.donor_name}</span>
                  {selectedDonation.is_anonymous && (
                    <span className="text-xs text-amber-600 block">(Requested to be anonymous)</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 py-1">
                <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Email Address</span>
                  <a
                    href={`mailto:${selectedDonation.donor_email}`}
                    className="font-medium text-[#0B1D3A] hover:underline"
                  >
                    {selectedDonation.donor_email}
                  </a>
                </div>
              </div>

              {selectedDonation.donor_phone && (
                <div className="flex items-start gap-3 py-1">
                  <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Phone</span>
                    <a
                      href={`tel:${selectedDonation.donor_phone}`}
                      className="font-medium text-slate-800 hover:underline"
                    >
                      {selectedDonation.donor_phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedDonation.pan_number && (
                <div className="flex items-start gap-3 py-1">
                  <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">PAN Number (for 80G tax receipt)</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedDonation.pan_number}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 py-1">
                <Heart size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block">Supported Cause / Purpose</span>
                  <span className="font-medium text-slate-800">{selectedDonation.purpose}</span>
                </div>
              </div>

              {selectedDonation.message && (
                <div className="py-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-amber-900">
                  <strong className="block mb-0.5">Donor Message:</strong>
                  &ldquo;{selectedDonation.message}&rdquo;
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span>{selectedDonation.razorpay_order_id || "—"}</span>
                </div>
                {selectedDonation.razorpay_payment_id && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment ID:</span>
                    <span>{selectedDonation.razorpay_payment_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span>{formatDate(selectedDonation.created_at, "datetime")}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setSelectedDonation(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
