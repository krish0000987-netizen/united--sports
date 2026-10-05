import { NextRequest, NextResponse } from "next/server"
import { getServerUser } from "@/lib/cms/auth-server"
import { getRazorpaySettings, updateRazorpaySettings } from "@/lib/cms/donations"
import { createActivityLog } from "@/lib/cms/admin-actions"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const user = await getServerUser()
  if (!user || !user.profile?.is_active) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const settings = await getRazorpaySettings()
    return NextResponse.json({ success: true, settings })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load settings"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getServerUser()
  if (!user || !user.profile?.is_active) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  // Only super_admin or admin can change payment keys
  if (user.profile.role !== "super_admin" && user.profile.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Permission denied: Only administrators can modify payment settings" },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const result = await updateRazorpaySettings(body)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // Best-effort activity log
    try {
      await createActivityLog({
        admin_user_id: user.id,
        admin_email: user.email,
        action: "update",
        entity_type: "razorpay_settings",
        entity_id: "razorpay",
        description: `Updated Razorpay settings (${body.mode || "mode"}, key: ${body.key_id ? body.key_id.slice(0, 10) + "..." : "unchanged"})`,
      })
    } catch {
      // Ignore log failure
    }

    return NextResponse.json({ success: true, settings: result.data })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save settings"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
