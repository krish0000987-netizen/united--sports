import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const DEFAULT_SUPABASE_URL = "https://ulrltmnzwemjdrcmssej.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscmx0bW56d2VtamRyY21zc2VqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjE5OTksImV4cCI6MjEwMzY5Nzk5OX0.wKyeyzp5Ti0oxyACuaKMaDffpspxby_FhxdcegvnLHg"

const PROTECTED_PREFIX = '/admin'
const PUBLIC_ADMIN_PATHS = ['/admin/login']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  const adminSessionCookie = request.cookies.get('ua_admin_session')?.value
  let isAuthenticated = Boolean(adminSessionCookie)

  if (!isAuthenticated) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            )
          },
        },
      })

      const { data: { user } } = await supabase.auth.getUser()
      if (user) isAuthenticated = true
    } catch {
      // Fallback
    }
  }

  const path = request.nextUrl.pathname
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.some((p) => path.startsWith(p))

  // Unauthenticated user hitting a protected admin route → login
  if (!isAuthenticated && path.startsWith(PROTECTED_PREFIX) && !isPublicAdmin) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Authenticated user hitting the login page → straight to dashboard
  if (isAuthenticated && isPublicAdmin) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
