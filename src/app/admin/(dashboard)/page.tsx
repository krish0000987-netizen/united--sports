import Link from "next/link"
import {
  Newspaper, Calendar, Trophy, Users, BookOpen,
  Images, MessageSquareQuote, Mail, Activity, ArrowRight,
  Plus, Home as HomeIcon,
} from "lucide-react"
import { Card, CardHeader, CardTitle, StatCard, Badge, THead, TBody, TR, TH, TD, Table } from "@/components/ui/admin"
import { getDashboardStats, getArticles, getEnquiries, getActivityLogs } from "@/lib/cms/admin-actions"
import { requireAdmin } from "@/lib/cms/auth-server"
import { formatDistanceToNow } from "@/lib/format"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const user = await requireAdmin()
  const [stats, recentArticles, recentEnquiries, activityLogs] = await Promise.all([
    getDashboardStats(),
    getArticles({ limit: 5 }),
    getEnquiries({ limit: 8 }),
    getActivityLogs({ limit: 8 }),
  ])

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back, {user.profile?.full_name || user.email}. Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Articles"
            value={stats.articles.total}
            hint={`${stats.articles.published} published • ${stats.articles.draft} draft`}
            icon={<Newspaper size={20} />}
          />
          <StatCard
            label="Events"
            value={stats.events}
            icon={<Calendar size={20} />}
          />
          <StatCard
            label="Athletes"
            value={stats.athletes}
            icon={<Trophy size={20} />}
          />
          <StatCard
            label="Teams"
            value={stats.teams}
            icon={<Users size={20} />}
          />
          <StatCard
            label="Programmes"
            value={stats.programmes}
            icon={<BookOpen size={20} />}
          />
          <StatCard
            label="Gallery Items"
            value={stats.gallery}
            icon={<Images size={20} />}
          />
          <StatCard
            label="Testimonials"
            value={stats.testimonials}
            icon={<MessageSquareQuote size={20} />}
          />
          <StatCard
            label="Enquiries"
            value={stats.enquiries.total}
            hint={`${stats.enquiries.new} new`}
            icon={<Mail size={20} />}
          />
          <StatCard
            label="Admin Users"
            value={stats.users}
            icon={<Activity size={20} />}
          />
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction href="/admin/articles/new" icon={<Plus size={16} />} label="New Article" />
          <QuickAction href="/admin/events/new" icon={<Plus size={16} />} label="New Event" />
          <QuickAction href="/admin/athletes/new" icon={<Plus size={16} />} label="New Athlete" />
          <QuickAction href="/admin/teams/new" icon={<Plus size={16} />} label="New Team" />
          <QuickAction href="/admin/programmes/new" icon={<Plus size={16} />} label="New Programme" />
          <QuickAction href="/admin/gallery/new" icon={<Plus size={16} />} label="Add Gallery" />
          <QuickAction href="/admin/testimonials/new" icon={<Plus size={16} />} label="New Testimonial" />
          <QuickAction href="/admin/homepage" icon={<HomeIcon size={16} />} label="Edit Homepage" />
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Articles</CardTitle>
            <Link href="/admin/articles" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <div className="p-0">
            {recentArticles.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No articles yet. Create your first article!</p>
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Title</TH>
                    <TH>Status</TH>
                    <TH>Date</TH>
                  </TR>
                </THead>
                <TBody>
                  {recentArticles.map((a) => (
                    <TR key={a.id}>
                      <TD>
                        <Link href={`/admin/articles/${a.id}`} className="font-medium text-slate-900 hover:text-[#0B1D3A] line-clamp-1">
                          {a.title}
                        </Link>
                      </TD>
                      <TD>
                        <Badge variant={a.status === "published" ? "success" : a.status === "draft" ? "warning" : "default"}>
                          {a.status}
                        </Badge>
                      </TD>
                      <TD className="text-xs text-slate-500">{formatDistanceToNow(a.created_at)}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </div>
        </Card>

        {/* Recent Enquiries */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Enquiries</CardTitle>
            <Link href="/admin/enquiries" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <div className="p-0">
            {recentEnquiries.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">No enquiries yet.</p>
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>From</TH>
                    <TH>Subject</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {recentEnquiries.slice(0, 5).map((e) => (
                    <TR key={e.id}>
                      <TD>
                        <Link href={`/admin/enquiries/${e.id}`} className="font-medium hover:text-[#0B1D3A] line-clamp-1">
                          {e.name}
                        </Link>
                        <div className="text-xs text-slate-500">{e.email}</div>
                      </TD>
                      <TD className="line-clamp-1">{e.subject || "—"}</TD>
                      <TD>
                        <Badge variant={e.status === "new" ? "warning" : e.status === "resolved" ? "success" : "info"}>
                          {e.status}
                        </Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </div>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Link href="/admin/activity-logs" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </CardHeader>
        <div className="p-0">
          {activityLogs.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">No activity yet. Admin actions will appear here.</p>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Admin</TH>
                  <TH>Action</TH>
                  <TH>Entity</TH>
                  <TH>When</TH>
                </TR>
              </THead>
              <TBody>
                {activityLogs.map((log) => (
                  <TR key={log.id}>
                    <TD className="text-xs">{log.admin_email || "—"}</TD>
                    <TD>
                      <Badge variant={log.action.includes("delete") ? "danger" : log.action.includes("create") ? "success" : "info"}>
                        {log.action}
                      </Badge>
                    </TD>
                    <TD className="text-xs">
                      <span className="font-medium">{log.entity_type}</span>
                      {log.description && <span className="text-slate-500 ml-1.5">— {log.description}</span>}
                    </TD>
                    <TD className="text-xs text-slate-500">{formatDistanceToNow(log.created_at)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#0B1D3A] hover:bg-slate-50 text-sm font-medium text-slate-700 hover:text-[#0B1D3A] transition-colors"
    >
      {icon}
      {label}
    </Link>
  )
}
