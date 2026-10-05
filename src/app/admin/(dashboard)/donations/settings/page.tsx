import { PageHeader } from "@/components/admin/PageHeader"
import { RazorpaySettingsForm } from "@/components/admin/donations/RazorpaySettingsForm"
import { getRazorpaySettings } from "@/lib/cms/donations"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Razorpay & Payment Gateway Settings | Admin Panel",
}

export default async function RazorpaySettingsPage() {
  const settings = await getRazorpaySettings()

  return (
    <div>
      <PageHeader
        title="Razorpay Payment Gateway Settings"
        description="Configure your Razorpay Key ID and Secret Key, switch between Test and Live modes, and customize the donation experience."
      />
      <RazorpaySettingsForm initialSettings={settings} />
    </div>
  )
}
