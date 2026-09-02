import { createClient } from "@/lib/supabase/client"
import { AdminProfile } from "@/lib/cms/types"

export type AdminRole = "super_admin" | "admin" | "editor"

export interface AuthUser {
  id: string
  email: string
  profile: AdminProfile | null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const c = createClient()
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

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.profile || !user.profile.is_active) return false
  return ["super_admin", "admin", "editor"].includes(user.profile.role)
}

export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.profile || !user.profile.is_active) return false
  return user.profile.role === "super_admin"
}

export async function hasRole(roles: AdminRole[]): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user || !user.profile || !user.profile.is_active) return false
  return roles.includes(user.profile.role)
}

export async function signOut(): Promise<void> {
  const c = createClient()
  await c.auth.signOut()
}

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const c = createClient()
  const { error } = await c.auth.signInWithPassword({ email, password })
  return { error: error?.message || null }
}
