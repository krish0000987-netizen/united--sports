import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ToastContainer } from "@/components/ui/toast"
import { requireAdmin } from "@/lib/cms/auth-server"

export const metadata = {
  title: "Admin Panel | UnitedAthletes",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="admin-root min-h-screen bg-slate-50 flex">
      <AdminSidebar profile={user.profile} email={user.email} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-slate-200 h-14 px-6 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft size={14} />
            Back to Website
          </Link>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden md:inline">Logged in as <strong className="text-slate-900">{user.email}</strong></span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1D3A] text-white font-bold">
              {user.profile?.role || "admin"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">{children}</main>
      </div>
      <ToastContainer />
    </div>
  )
}