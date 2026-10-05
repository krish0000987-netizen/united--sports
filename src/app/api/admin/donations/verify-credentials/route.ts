import { NextRequest, NextResponse } from "next/server"
import { getServerUser } from "@/lib/cms/auth-server"
import { verifyRazorpayCredentials } from "@/lib/cms/donations"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user || !user.profile?.is_active) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { key_id, key_secret } = await req.json()
    const result = await verifyRazorpayCredentials(key_id, key_secret)

    if (!result.valid) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Razorpay credentials verified successfully! Connection is working.",
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error verifying credentials"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
