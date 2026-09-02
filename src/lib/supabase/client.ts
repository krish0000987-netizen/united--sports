import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = "https://lyxqlmmzjzkcjzcnbusp.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_NrkpgMB9uKvSycCClY3ayQ_7N0UOGgI"

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
