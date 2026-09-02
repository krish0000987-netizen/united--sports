import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminProfile } from "@/lib/cms/types"

export interface ServerAuthUser {
  id: string
  email: string
  profile: AdminProfile
}

export async function getServerUser(): Promise<ServerAuthUser | null> {
  const c = await createClient()
  const { data: { user } } = await c.auth.getUser()
  if (!user) return null

  const { data: profile } = await c
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle()

  const defaultProfile: AdminProfile = {
    id: profile?.id || user.id,
    user_id: user.id,
    email: user.email || "",
    full_name: profile?.full_name || user.user_metadata?.full_name || "Admin",
    role: (profile?.role as AdminProfile["role"]) || "super_admin",
    is_active: profile?.is_active ?? true,
    created_at: profile?.created_at || new Date().toISOString(),
    updated_at: profile?.updated_at || new Date().toISOString(),
  }

  return {
    id: user.id,
    email: user.email || "",
    profile: defaultProfile,
  }
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
