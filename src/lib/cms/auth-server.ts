import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminProfile } from "@/lib/cms/types"

export interface ServerAuthUser {
  id: string
  email: string
  profile: AdminProfile | null
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

  return {
    id: user.id,
    email: user.email || "",
    profile: profile as AdminProfile | null,
  }
}

export async function requireAdmin(): Promise<ServerAuthUser> {
  const user = await getServerUser()
  if (!user) redirect("/admin/login")
  if (!user.profile || !user.profile.is_active) {
    redirect("/admin/login?error=inactive")
  }
  if (!["super_admin", "admin", "editor"].includes(user.profile.role)) {
    redirect("/admin/login?error=unauthorized")
  }
  return user
}

export async function requireSuperAdmin(): Promise<ServerAuthUser> {
  const user = await requireAdmin()
  if (user.profile?.role !== "super_admin") {
    redirect("/admin?error=unauthorized")
  }
  return user
}
