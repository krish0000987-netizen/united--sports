"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Settings,
  CreditCard,
  Layers,
  Code,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { Input, Textarea, Select } from "@/components/ui/form"
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/admin"
import { Button } from "@/components/admin/Button"
import { ImageUploader } from "@/components/admin/ImageUploader"
import { toast } from "@/components/ui/toast"
import {
  createCmsPage as createPage,
  updateCmsPage as updatePage,
  createActivityLog,
  getCurrentUser,
} from "@/lib/cms/client-actions"
import { slugify } from "@/lib/utils"
import { Page } from "@/lib/cms/types"

interface ValueItem {
  title: string
  text: string
}

interface WayItem {
  title: string
  text: string
}

export function PageForm({ page }: { page: Page | null }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"fields" | "raw">("fields")

  // Base page form fields
  const [form, setForm] = useState({
    title: page?.title || "",
    slug: page?.slug || "",
    excerpt: page?.excerpt || "",
    content: page?.content || "",
    featured_image: page?.featured_image || null,
    status: page?.status || "draft",
    meta_title: page?.meta_title || "",
    meta_description: page?.meta_description || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Structured fields for specific pages
  const isAbout = form.slug === "about"
  const isGetInvolved = form.slug === "get-involved"
  const isContact = form.slug === "contact"
  const isDonate = form.slug === "donate"
  const hasStructuredFields = isAbout || isGetInvolved || isContact || isDonate

  // Try parsing existing content if JSON
  const parsedContent = (() => {
    if (!page?.content) return {}
    try {
      return JSON.parse(page.content)
    } catch {
      return {}
    }
  })()

  // About page state
  const [aboutStoryTitle, setAboutStoryTitle] = useState(
    parsedContent.story_title || "Talent can come from anywhere"
  )
  const [aboutStoryBody, setAboutStoryBody] = useState(
    parsedContent.story_body ||
      "UnitedAthletes for India Foundation is an athlete-focused organisation committed to creating a stronger ecosystem for athletes across India.\n\nWe believe that talent can come from anywhere, but access to opportunities, facilities, equipment and support can determine how far that talent goes. UnitedAthletes works to provide athletes with the resources and opportunities they need to pursue excellence in sport."
  )
  const [aboutMission, setAboutMission] = useState(
    parsedContent.mission ||
      "To empower athletes by creating opportunities, providing resources, and building an ecosystem where sporting talent can thrive."
  )
  const [aboutVision, setAboutVision] = useState(
    parsedContent.vision ||
      "A stronger India where every talented athlete has the opportunity, facilities, equipment and support needed to achieve their goals."
  )
  const [aboutValues, setAboutValues] = useState<ValueItem[]>(
    Array.isArray(parsedContent.values) && parsedContent.values.length > 0
      ? parsedContent.values
      : [
          { title: "Athlete First", text: "Every initiative begins with the needs, aspirations and development of athletes." },
          { title: "Opportunity", text: "We believe talent deserves access to opportunities regardless of background." },
          { title: "Excellence", text: "We encourage athletes to continuously improve and pursue higher levels of performance." },
          { title: "Accessibility", text: "We work toward making sports facilities, equipment and resources more accessible." },
          { title: "Community", text: "Athletes become stronger when supported by a connected sporting community." },
        ]
  )
  const [aboutProvide, setAboutProvide] = useState<string[]>(
    Array.isArray(parsedContent.what_we_provide) && parsedContent.what_we_provide.length > 0
      ? parsedContent.what_we_provide
      : [
          "Sports facilities and infrastructure",
          "Sports equipment",
          "Athlete development opportunities",
          "Training and support resources",
          "Platforms for athlete engagement",
          "Sports community initiatives",
          "Opportunities to pursue sporting goals",
        ]
  )
  const [aboutCommitmentTitle, setAboutCommitmentTitle] = useState(
    parsedContent.commitment_title ||
      "We don't just support athletes. We create opportunities for them to move forward."
  )
  const [aboutCommitmentBody, setAboutCommitmentBody] = useState(
    parsedContent.commitment_body ||
      "UnitedAthletes is committed to building an ecosystem where athletes can focus on their passion, develop their abilities and move closer to achieving their dreams."
  )

  // Get Involved page state
  const [giWaysEyebrow, setGiWaysEyebrow] = useState(parsedContent.ways_eyebrow || "Ways to Support")
  const [giWaysTitle, setGiWaysTitle] = useState(
    parsedContent.ways_title || "Choose how you want to make a difference"
  )
  const [giWays, setGiWays] = useState<WayItem[]>(
    Array.isArray(parsedContent.ways) && parsedContent.ways.length > 0
      ? parsedContent.ways
      : [
          { title: "Support Athlete Development", text: "Help athletes access the resources, opportunities and support they need to continue their sporting journey." },
          { title: "Provide Sports Equipment", text: "Contribute sports equipment and resources that can directly support athletes and sporting initiatives." },
          { title: "Support Sports Facilities", text: "Help create better access to quality sports facilities and training environments." },
          { title: "Partner With Us", text: "Organisations and businesses can collaborate with UnitedAthletes to support athlete-focused initiatives and sports development programmes." },
          { title: "Support an Athlete", text: "Help talented athletes overcome resource limitations and continue working toward their sporting goals." },
        ]
  )
  const [giDonationTitle, setGiDonationTitle] = useState(
    parsedContent.donation_title || "Donate to Athletes"
  )
  const [giDonationDesc, setGiDonationDesc] = useState(
    parsedContent.donation_desc ||
      "Fund training, gear, nutrition, and tournament travel via Razorpay. 80G tax benefit eligible."
  )
  const [giBannerHeading, setGiBannerHeading] = useState(
    parsedContent.banner_heading || "Every contribution becomes"
  )
  const [giBannerHighlight, setGiBannerHighlight] = useState(
    parsedContent.banner_highlight || "training time, gear, and a chance to compete."
  )

  // Contact page state
  const [contactEyebrow, setContactEyebrow] = useState(parsedContent.hero_eyebrow || "Contact")
  const [contactSubtitle, setContactSubtitle] = useState(
    parsedContent.hero_subtitle || "Athletes, coaches, organisations and supporters — we'd love to hear from you."
  )
  const [contactBannerHeading, setContactBannerHeading] = useState(
    parsedContent.banner_heading || "Together, we can build a"
  )
  const [contactBannerHighlight, setContactBannerHighlight] = useState(
    parsedContent.banner_highlight || "stronger sporting India."
  )
  const [contactBannerTagline, setContactBannerTagline] = useState(
    parsedContent.banner_tagline || "Empowering Athletes. Enabling Dreams."
  )

  // Donate page state
  const [donateEyebrow, setDonateEyebrow] = useState(
    parsedContent.hero_eyebrow || "Fuel India's Sporting Journey"
  )
  const [donateSubtitle, setDonateSubtitle] = useState(
    parsedContent.hero_subtitle ||
      "Every champion begins with an opportunity. Your contribution provides the coaching, equipment, nutrition, and tournament access India's talented athletes need to reach the podium."
  )
  const [donateImpactSubheading, setDonateImpactSubheading] = useState(
    parsedContent.impact_subheading || "Direct Athlete Impact"
  )
  const [donateImpactHeading, setDonateImpactHeading] = useState(
    parsedContent.impact_heading || "Where your contribution goes"
  )
  const [donateImpactBody, setDonateImpactBody] = useState(
    parsedContent.impact_body ||
      "Talent is distributed evenly across India, but resources and opportunities are not. By donating through UnitedAthletes Foundation, you remove the financial barriers that keep gifted youngsters from realizing their full sporting potential."
  )

  useEffect(() => {
    if (!page && form.title && !form.slug) {
      setForm((f) => ({ ...f, slug: slugify(form.title) }))
    }
  }, [form.title, page, form.slug])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: "" }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Title is required"
    if (!form.slug.trim()) errs.slug = "Slug is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function compileFinalContent(): string | null {
    if (activeTab === "raw") {
      return form.content.trim() ? form.content : null
    }

    if (isAbout) {
      const data = {
        story_title: aboutStoryTitle,
        story_body: aboutStoryBody,
        mission: aboutMission,
        vision: aboutVision,
        values: aboutValues.filter((v) => v.title.trim()),
        what_we_provide: aboutProvide.filter((p) => p.trim()),
        commitment_title: aboutCommitmentTitle,
        commitment_body: aboutCommitmentBody,
      }
      return JSON.stringify(data, null, 2)
    }

    if (isGetInvolved) {
      const data = {
        ways_eyebrow: giWaysEyebrow,
        ways_title: giWaysTitle,
        ways: giWays.filter((w) => w.title.trim()),
        donation_title: giDonationTitle,
        donation_desc: giDonationDesc,
        banner_heading: giBannerHeading,
        banner_highlight: giBannerHighlight,
      }
      return JSON.stringify(data, null, 2)
    }

    if (isContact) {
      const data = {
        hero_eyebrow: contactEyebrow,
        hero_subtitle: contactSubtitle,
        banner_heading: contactBannerHeading,
        banner_highlight: contactBannerHighlight,
        banner_tagline: contactBannerTagline,
      }
      return JSON.stringify(data, null, 2)
    }

    if (isDonate) {
      const data = {
        hero_eyebrow: donateEyebrow,
        hero_subtitle: donateSubtitle,
        impact_subheading: donateImpactSubheading,
        impact_heading: donateImpactHeading,
        impact_body: donateImpactBody,
      }
      return JSON.stringify(data, null, 2)
    }

    return form.content.trim() ? form.content : null
  }

  async function save() {
    if (!validate()) {
      toast.error("Please fix the errors before saving")
      return
    }
    setSaving(true)
    try {
      const finalContent = compileFinalContent()
      const user = await getCurrentUser()
      const payload: any = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: finalContent,
        featured_image: form.featured_image || null,
        status: form.status,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
      }

      if (page) {
        const { error } = await updatePage(page.id, payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "update",
          entity_type: "page",
          entity_id: page.id,
          description: form.title,
        })
        toast.success("Page updated successfully")
        router.refresh()
      } else {
        const { data, error } = await createPage(payload)
        if (error) {
          toast.error(error)
          return
        }
        await createActivityLog({
          admin_user_id: user?.id || null,
          admin_email: user?.email || null,
          action: "create",
          entity_type: "page",
          entity_id: data?.id || null,
          description: form.title,
        })
        toast.success("Page created successfully")
        router.push("/admin/pages")
      }
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = page?.status === "published" ? `/${page.slug}` : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-14 lg:top-0 bg-slate-50 py-3 z-10 -mt-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {hasStructuredFields && (
            <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("fields")}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "fields"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers size={13} className="inline mr-1.5" />
                Structured Fields
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, content: compileFinalContent() || "" }))
                  setActiveTab("raw")
                }}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === "raw"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Code size={13} className="inline mr-1.5" />
                Raw Content / JSON
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {previewUrl && (
            <Button asChild href={previewUrl} variant="outline">
              <Eye size={14} /> View Live Page
            </Button>
          )}
          <Button onClick={save} variant="primary" disabled={saving}>
            <Save size={14} /> {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main info card */}
          <Card>
            <CardHeader>
              <CardTitle>Page Basics</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Page Title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  error={errors.title}
                  required
                />
                <Input
                  label="URL Slug"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  error={errors.slug}
                  hint="Public path, e.g. about, contact, get-involved"
                  required
                />
              </div>
              <Textarea
                label="Hero Eyebrow / Excerpt"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={2}
                hint="Displayed as the top eyebrow label or summary in the hero header"
              />
            </CardBody>
          </Card>

          {/* Structured Editor for ABOUT US */}
          {isAbout && activeTab === "fields" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Who We Are (Story Section)</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Section Title"
                    value={aboutStoryTitle}
                    onChange={(e) => setAboutStoryTitle(e.target.value)}
                  />
                  <Textarea
                    label="Story Paragraphs (Separate paragraphs with blank lines)"
                    value={aboutStoryBody}
                    onChange={(e) => setAboutStoryBody(e.target.value)}
                    rows={6}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mission & Vision</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Textarea
                    label="Our Mission Statement"
                    value={aboutMission}
                    onChange={(e) => setAboutMission(e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Our Vision Statement"
                    value={aboutVision}
                    onChange={(e) => setAboutVision(e.target.value)}
                    rows={3}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Core Values ({aboutValues.length})</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAboutValues([...aboutValues, { title: "", text: "" }])}
                  >
                    <Plus size={14} /> Add Value
                  </Button>
                </CardHeader>
                <CardBody className="space-y-4">
                  {aboutValues.map((val, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Value #{idx + 1}
                        </span>
                        {aboutValues.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setAboutValues(aboutValues.filter((_, i) => i !== idx))
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove value"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <Input
                        label="Value Title"
                        value={val.title}
                        onChange={(e) => {
                          const updated = [...aboutValues]
                          updated[idx].title = e.target.value
                          setAboutValues(updated)
                        }}
                        placeholder="e.g. Athlete First"
                      />
                      <Textarea
                        label="Description"
                        value={val.text}
                        onChange={(e) => {
                          const updated = [...aboutValues]
                          updated[idx].text = e.target.value
                          setAboutValues(updated)
                        }}
                        rows={2}
                        placeholder="Short sentence explaining this core value"
                      />
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>What We Provide Checklist ({aboutProvide.length} items)</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAboutProvide([...aboutProvide, ""])}
                  >
                    <Plus size={14} /> Add Checklist Item
                  </Button>
                </CardHeader>
                <CardBody className="space-y-3">
                  {aboutProvide.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      <Input
                        value={item}
                        onChange={(e) => {
                          const updated = [...aboutProvide]
                          updated[idx] = e.target.value
                          setAboutProvide(updated)
                        }}
                        placeholder="e.g. Sports facilities and infrastructure"
                      />
                      {aboutProvide.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setAboutProvide(aboutProvide.filter((_, i) => i !== idx))
                          }
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Our Commitment Banner</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Commitment Headline"
                    value={aboutCommitmentTitle}
                    onChange={(e) => setAboutCommitmentTitle(e.target.value)}
                  />
                  <Textarea
                    label="Commitment Body Text"
                    value={aboutCommitmentBody}
                    onChange={(e) => setAboutCommitmentBody(e.target.value)}
                    rows={3}
                  />
                </CardBody>
              </Card>
            </div>
          )}

          {/* Structured Editor for GET INVOLVED */}
          {isGetInvolved && activeTab === "fields" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ways to Support Header</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Eyebrow"
                      value={giWaysEyebrow}
                      onChange={(e) => setGiWaysEyebrow(e.target.value)}
                    />
                    <Input
                      label="Section Headline"
                      value={giWaysTitle}
                      onChange={(e) => setGiWaysTitle(e.target.value)}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Ways to Support Cards ({giWays.length})</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGiWays([...giWays, { title: "", text: "" }])}
                  >
                    <Plus size={14} /> Add Card
                  </Button>
                </CardHeader>
                <CardBody className="space-y-4">
                  {giWays.map((way, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Avenue #{idx + 1}
                        </span>
                        {giWays.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setGiWays(giWays.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <Input
                        label="Title"
                        value={way.title}
                        onChange={(e) => {
                          const updated = [...giWays]
                          updated[idx].title = e.target.value
                          setGiWays(updated)
                        }}
                      />
                      <Textarea
                        label="Description"
                        value={way.text}
                        onChange={(e) => {
                          const updated = [...giWays]
                          updated[idx].text = e.target.value
                          setGiWays(updated)
                        }}
                        rows={2}
                      />
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Online Donation Callout Box</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Callout Card Title"
                    value={giDonationTitle}
                    onChange={(e) => setGiDonationTitle(e.target.value)}
                  />
                  <Textarea
                    label="Callout Description"
                    value={giDonationDesc}
                    onChange={(e) => setGiDonationDesc(e.target.value)}
                    rows={2}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bottom Callout Banner</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Banner Main Headline"
                    value={giBannerHeading}
                    onChange={(e) => setGiBannerHeading(e.target.value)}
                  />
                  <Input
                    label="Banner Gold Highlight"
                    value={giBannerHighlight}
                    onChange={(e) => setGiBannerHighlight(e.target.value)}
                  />
                </CardBody>
              </Card>
            </div>
          )}

          {/* Structured Editor for CONTACT */}
          {isContact && activeTab === "fields" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Page Hero & Headers</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Eyebrow"
                    value={contactEyebrow}
                    onChange={(e) => setContactEyebrow(e.target.value)}
                  />
                  <Textarea
                    label="Subtitle"
                    value={contactSubtitle}
                    onChange={(e) => setContactSubtitle(e.target.value)}
                    rows={2}
                  />
                </CardBody>
              </Card>

              <Card className="border-amber-300 bg-amber-50/50">
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                    <Sparkles size={16} className="text-[#C9A227]" />
                    Live Phone, WhatsApp & Office Address
                  </div>
                  <Button asChild href="/admin/settings" variant="outline" size="sm">
                    <Settings size={13} className="mr-1" /> Open Site Settings
                  </Button>
                </CardHeader>
                <CardBody>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    The contact details shown in the left column (Phone, WhatsApp direct link,
                    and physical address) are dynamically managed under{" "}
                    <strong>Site Settings</strong> so that they stay synchronized across the
                    header, footer, and contact page.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bottom Banner</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Headline First Part"
                      value={contactBannerHeading}
                      onChange={(e) => setContactBannerHeading(e.target.value)}
                    />
                    <Input
                      label="Gold Highlight Part"
                      value={contactBannerHighlight}
                      onChange={(e) => setContactBannerHighlight(e.target.value)}
                    />
                  </div>
                  <Input
                    label="Bottom Tagline"
                    value={contactBannerTagline}
                    onChange={(e) => setContactBannerTagline(e.target.value)}
                  />
                </CardBody>
              </Card>
            </div>
          )}

          {/* Structured Editor for DONATE */}
          {isDonate && activeTab === "fields" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Hero Section</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Hero Eyebrow"
                    value={donateEyebrow}
                    onChange={(e) => setDonateEyebrow(e.target.value)}
                  />
                  <Textarea
                    label="Hero Subtitle"
                    value={donateSubtitle}
                    onChange={(e) => setDonateSubtitle(e.target.value)}
                    rows={3}
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Athlete Impact Description</CardTitle>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Subheading / Eyebrow"
                      value={donateImpactSubheading}
                      onChange={(e) => setDonateImpactSubheading(e.target.value)}
                    />
                    <Input
                      label="Impact Heading"
                      value={donateImpactHeading}
                      onChange={(e) => setDonateImpactHeading(e.target.value)}
                    />
                  </div>
                  <Textarea
                    label="Detailed Impact Statement"
                    value={donateImpactBody}
                    onChange={(e) => setDonateImpactBody(e.target.value)}
                    rows={4}
                  />
                </CardBody>
              </Card>

              <Card className="border-emerald-300 bg-emerald-50/50">
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
                    <CreditCard size={16} className="text-emerald-600" />
                    Razorpay Payment Gateway Settings
                  </div>
                  <Button
                    asChild
                    href="/admin/donations/settings"
                    variant="outline"
                    size="sm"
                  >
                    Payment Settings →
                  </Button>
                </CardHeader>
                <CardBody>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Live and Test Razorpay Key ID and Secret can be updated in the Payment
                    Gateway panel. All transactions are logged under Donations.
                  </p>
                </CardBody>
              </Card>
            </div>
          )}

          {/* Raw / Generic Editor (For unhandled pages or when Raw tab is chosen) */}
          {(!hasStructuredFields || activeTab === "raw") && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {hasStructuredFields ? "Raw Content / JSON Code" : "Page Content"}
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <Textarea
                  label="Content"
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  rows={18}
                  className="font-mono text-xs"
                  hint={
                    hasStructuredFields
                      ? "Structured JSON payload for this page"
                      : "HTML, markdown or plain text content"
                  }
                />
              </CardBody>
            </Card>
          )}

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization (SEO)</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => update("meta_title", e.target.value)}
                placeholder="Page Title | UnitedAthletes Foundation"
              />
              <Textarea
                label="Meta Description"
                value={form.meta_description}
                onChange={(e) => update("meta_description", e.target.value)}
                rows={3}
                placeholder="Short summary for Google search results and social cards"
              />
            </CardBody>
          </Card>
        </div>

        {/* Right column: Status & Image */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Status</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                value={form.status}
                onChange={(e) => update("status", e.target.value as any)}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published (Live on Website)" },
                  { value: "archived", label: "Archived" },
                ]}
              />
              <div className="text-xs text-slate-500 pt-1">
                Only published pages are visible to the public. Drafts remain hidden.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured / Hero Image</CardTitle>
            </CardHeader>
            <CardBody>
              <ImageUploader
                value={form.featured_image}
                onChange={(url) => update("featured_image", url)}
                folder="pages"
                aspectRatio="video"
                hint="Background or header image for this page (1920x1080 recommended)"
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Site Links</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">
                  Public URL for this page:
                </span>
                <code className="text-[#0B1D3A] font-bold">/{form.slug || "..."}</code>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/pages"
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  ← Back to All Pages
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}