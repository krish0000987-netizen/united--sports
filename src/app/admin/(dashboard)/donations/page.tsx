import { PageHeader } from "@/components/admin/PageHeader"
import { DonationsManager } from "@/components/admin/donations/DonationsManager"
import { getDonationsList } from "@/lib/cms/donations"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Donations | Admin Panel",
}

export default async function DonationsPage() {
  const { donations, stats } = await getDonationsList()

  return (
    <div>
      <PageHeader
        title="Donations & Contributions"
        description="Monitor online contributions, donor details, and payment statuses via Razorpay."
      />
      <DonationsManager initialDonations={donations} stats={stats} />
    </div>
  )
}
