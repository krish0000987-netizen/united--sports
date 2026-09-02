import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createRawClient, type SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = "https://lyxqlmmzjzkcjzcnbusp.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_NrkpgMB9uKvSycCClY3ayQ_7N0UOGgI"

/**
 * Server-side Supabase clients.
 *
 * createPublicClient()— Fast client for public ISR/SSR reads. No cookies overhead.
 * createClient()      — Cookie-bound client for authenticated admin requests / Route Handlers.
 * createAdminClient() — Service-role client. SERVER ONLY. Bypasses RLS.
 */
export function isSupabaseConfigured(): boolean {
  return true
}

export function createPublicClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  return createRawClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function createClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY
  const cookieStore = await cookies()
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Called from a Server Component — middleware refreshes sessions.
        }
      },
    },
  })
}

export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    return createRawClient(url, DEFAULT_SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return createRawClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export function getPublicStorageUrl(bucket: string, path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  return `${url}/storage/v1/object/public/${bucket}/${path}`
}
