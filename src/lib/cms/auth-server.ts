import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminProfile } from "@/lib/cms/types"

export interface ServerAuthUser {
  id: string
  email: string
  profile: AdminProfile
}

export async function getServerUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get("ua_admin_session")?.value

  // 1. Check Supabase Auth
  try {
    const c = await createClient()
    const { data: { user } } = await c.auth.getUser()
    if (user) {
      const { data: profile } = await c
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      return {
        id: user.id,
        email: user.email || "",
        profile: {
          id: profile?.id || user.id,
          user_id: user.id,
          email: user.email || "",
          full_name: profile?.full_name || user.user_metadata?.full_name || "Super Admin",
          role: (profile?.role as AdminProfile["role"]) || "super_admin",
          is_active: profile?.is_active ?? true,
          created_at: profile?.created_at || new Date().toISOString(),
          updated_at: profile?.updated_at || new Date().toISOString(),
        },
      }
    }
  } catch {
    // Continue to check admin cookie
  }

  // 2. Check Admin Session Cookie
  if (adminCookie) {
    try {
      const parsed = JSON.parse(adminCookie)
      return {
        id: "master-admin",
        email: parsed.email || "admin@unitedsports.org",
        profile: {
          id: "master-admin",
          user_id: "master-admin",
          email: parsed.email || "admin@unitedsports.org",
          full_name: "Super Admin",
          role: "super_admin",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    } catch {
      // Invalid cookie JSON
    }
  }

  return null
}

export async function requireAdmin(): Promise<ServerAuthUser> {
  const user = await getServerUser()
  if (!user) redirect("/admin/login")
  if (!user.profile.is_active) {
    redirect("/admin/login?error=inactive")
  }
  return user
}

export async function requireSuperAdmin(): Promise<ServerAuthUser> {
  const user = await requireAdmin()
  if (user.profile.role !== "super_admin") {
    redirect("/admin?error=unauthorized")
  }
  return user
}
