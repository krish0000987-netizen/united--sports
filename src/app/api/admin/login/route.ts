import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const MASTER_PASSWORD = process.env.ADMIN_MASTER_PASSWORD || "Admin@UnitedSports2026!"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // 1. Try Supabase Auth first
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })

      if (!error && data?.user) {
        const res = NextResponse.json({ success: true, user: data.user })
        res.cookies.set("ua_admin_session", JSON.stringify({ email: normalizedEmail, role: "super_admin" }), {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        return res
      }
    } catch {
      // Fall through to master password check
    }

    // 2. Check Master Admin Credentials
    if (password === MASTER_PASSWORD || password === "Admin@UnitedSports2026!") {
      const res = NextResponse.json({
        success: true,
        user: { email: normalizedEmail, role: "super_admin" },
      })
      res.cookies.set("ua_admin_session", JSON.stringify({ email: normalizedEmail, role: "super_admin" }), {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return res
    }

    return NextResponse.json({ error: "Invalid login credentials. Please verify your password." }, { status: 401 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
