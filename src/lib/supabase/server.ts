import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createRawClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase clients.
 *
 * createClient()     — cookie-bound client for Server Components / Route Handlers.
 *                      Reads the user's session from cookies so RLS + auth work.
 * createAdminClient()— service-role client. SERVER ONLY. Bypasses RLS.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    },
  )
}

/**
 * Service-role client. Bypasses RLS. NEVER import this from client components.
 * Returns null when SUPABASE_SERVICE_ROLE_KEY is not configured.
 */
export function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createRawClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export function getPublicStorageUrl(bucket: string, path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return path
  return `${url}/storage/v1/object/public/${bucket}/${path}`
}
