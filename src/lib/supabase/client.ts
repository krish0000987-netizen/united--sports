import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = "https://ulrltmnzwemjdrcmssej.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscmx0bW56d2VtamRyY21zc2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjE5OTksImV4cCI6MjEwMzY5Nzk5OX0.wKyeyzp5Ti0oxyACuaKMaDffpspxby_FhxdcegvnLHg"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  return createBrowserClient(url, key)
}

export const isSupabaseConfigured = () => {
  return true
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
export const SUPABASE_STORAGE_BUCKET = "media"

export function getPublicStorageUrl(path: string | null | undefined): string {
  if (!path) return ""
  if (path.startsWith("http")) return path
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${path}`
}
