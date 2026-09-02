import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // Ignore signOut errors
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("ua_admin_session", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
  })
  return res
}
