import { NextResponse } from "next/server"
import { getPublicRazorpayConfig } from "@/lib/cms/donations"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  try {
    const config = await getPublicRazorpayConfig()
    return NextResponse.json({ success: true, config })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load donation configuration"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
