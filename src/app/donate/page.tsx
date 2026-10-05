import { Metadata } from "next"
import PublicShell from "@/components/site/PublicShell"
import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"
import { DonationForm } from "@/components/site/DonationForm"
import { getPublicRazorpayConfig } from "@/lib/cms/donations"
import {
  Trophy,
  Dumbbell,
  ShieldCheck,
  HeartHandshake,
  FileCheck2,
  Users,
  Target,
  Sparkles,
  HelpCircle,
} from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Donate & Support Indian Athletes",
  description:
    "Contribute directly to training, equipment, tournament travel, and nutrition for aspiring and elite athletes across India. Powered by Razorpay with 80G tax benefits.",
}

const IMPACT_TIERS = [
  {
    amount: "₹1,000",
    title: "Essential Gear & Training Kit",
    desc: "Provides high-grade athletic footwear, resistance bands, and personal protective sports gear for grassroot athletes.",
    icon: Dumbbell,
  },
  {
    amount: "₹2,500",
    title: "One Month of Sports Nutrition",
    desc: "Funds customized dietary supplements, protein intakes, and sports dietetics essential for intense competitive training.",
    icon: Target,
  },
  {
    amount: "₹5,000",
    title: "State & National Tournament Travel",
    desc: "Covers tournament registration fees, inter-state travel, and verified accommodation for promising competitors.",
    icon: Trophy,
  },
  {
    amount: "₹10,000",
    title: "High-Performance Coaching Clinic",
    desc: "Enables specialized one-on-one coaching, video biomechanics analysis, and physiotherapy sessions.",
    icon: Sparkles,
  },
]

const FAQS = [
  {
    q: "Is my contribution tax-exempt under Section 80G?",
    a: "Yes. UnitedAthletes for India Foundation is a registered Section 8 non-profit organization. Donations may be eligible for tax exemption under Section 80G of the Indian Income Tax Act. Please provide your PAN number during checkout to receive an 80G certificate.",
  },
  {
    q: "Which payment methods can I use via Razorpay?",
    a: "You can pay with all major payment instruments supported by Razorpay in India: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit cards (Visa, MasterCard, RuPay, Amex), Net Banking across 50+ banks, and popular digital wallets.",
  },
  {
    q: "How are the donated funds utilized?",
    a: "100% of public donations are channeled directly into athlete development programmes, including equipment procurement, specialized coaching stipends, athlete travel grants, and nutritional support.",
  },
  {
    q: "Will I get an instant donation receipt?",
    a: "Yes! Immediately after your payment is processed, you will see a detailed on-screen confirmation with your receipt ID. A formal receipt will also be sent to your registered email address.",
  },
  {
    q: "Can organizations or companies contribute via Corporate CSR?",
    a: "Yes! We welcome Corporate Social Responsibility partnerships and sports sponsorships. Please reach out to our team at contact@unitedathletes.org or via our contact page for CSR agreements.",
  },
]

export default async function DonatePage() {
  const config = await getPublicRazorpayConfig()

  return (
    <PublicShell>
      {/* Hero Section */}
      <PageHero
        eyebrow="Fuel India's Sporting Journey"
        title={
          <>
            Back our athletes. <span className="text-gold-gradient">Build champions.</span>
          </>
        }
        subtitle="Every champion begins with an opportunity. Your contribution provides the coaching, equipment, nutrition, and tournament access India's talented athletes need to reach the podium."
        image="/assets/support.jpg"
        alt="Athletes training on track under golden light"
      />

      {/* Main Donation Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Mission & Impact */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal>
              <p className="eyebrow">Direct Athlete Impact</p>
              <div className="rule-gold mt-4" />
              <h2 className="mt-4 text-3xl sm:text-4xl font-display uppercase tracking-wide leading-tight">
                Where your <span className="text-gold-gradient">contribution goes</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Talent is distributed evenly across India, but resources and opportunities are not. By donating through UnitedAthletes Foundation, you remove the financial barriers that keep gifted youngsters from realizing their full sporting potential.
              </p>
            </Reveal>

            {/* Impact Tiers */}
            <div className="space-y-4 pt-2">
              {IMPACT_TIERS.map((tier, idx) => (
                <Reveal key={tier.title} delay={idx * 80}>
                  <div className="surface-card rounded-xl border border-border p-4.5 sm:p-5 flex items-start gap-4 transition-transform duration-300 hover:-translate-y-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <tier.icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-primary text-base sm:text-lg tracking-wide">
                          {tier.amount}
                        </span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <h3 className="font-bold text-sm sm:text-base text-foreground">
                          {tier.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {tier.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Trust Points */}
            <Reveal delay={350}>
              <div className="p-5 rounded-xl bg-background/80 border border-border space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                  <FileCheck2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Section 8 Non-Profit Registered (MCA, Govt. of India)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% Secure Checkout verified by Razorpay</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
                  <HeartHandshake className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Regular Impact Updates shared with registered donors</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Interactive Donation Form */}
          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <DonationForm initialConfig={config} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 80G Tax Exemption Banner */}
      <section className="border-y border-border bg-card/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="surface-card rounded-2xl border border-primary/30 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none hidden md:block" />
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <FileCheck2 size={14} /> Tax Exemption
              </span>
              <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wide">
                Double the Impact: <span className="text-gold-gradient">Tax Deductible Contributions</span>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As a recognized sports development foundation under Section 8 of the Companies Act, donations made to UnitedAthletes for India Foundation qualify for tax deductions under Section 80G of the Indian Income Tax Act. Ensure you enter your Permanent Account Number (PAN) at checkout to receive your official 80G tax exemption receipt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <Reveal>
          <div className="text-center">
            <p className="eyebrow">Frequently Asked Questions</p>
            <div className="rule-gold mx-auto mt-4" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-display uppercase tracking-wide">
              Everything you need to know about <span className="text-gold-gradient">donating</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 70}>
              <div className="surface-card rounded-xl border border-border p-6 transition-all hover:border-primary/40">
                <h3 className="font-bold text-base sm:text-lg text-foreground flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed pl-8">
                  {faq.a}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PublicShell>
  )
}
