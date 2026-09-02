// ============================================================================
// Public + shared server-side CMS reads.
// Every public page renders through these functions — no Supabase calls in JSX.
// All queries run under the caller's cookie session so RLS decides visibility:
// anonymous visitors only ever see published rows.
// Built-in graceful fallbacks ensure the website renders even if Supabase
// is still being configured or during cold starts.
// ============================================================================

import { createPublicClient } from "@/lib/supabase/server"
import type {
  SiteSettings,
  Page,
  Article,
  ArticleCategory,
  Event,
  Programme,
  Athlete,
  Team,
  Testimonial,
  GalleryItem,
  HomepageSection,
  HomepageHero,
  HomepageFeatured,
  NavigationItem,
  FooterSection,
} from "./types"

// ── Default Fallback Data ───────────────────────────────────────────────────

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "default-settings",
  site_name: "UnitedAthletes for India Foundation",
  logo_url: "/assets/logo-circle.png",
  favicon_url: "/favicon.ico",
  description: "An athlete-focused organisation committed to creating a stronger ecosystem for athletes across India.",
  email: "contact@unitedathletes.org",
  phone: "+91 98765 43210",
  address: "New Delhi, India",
  whatsapp: "+91 98765 43210",
  facebook_url: "https://facebook.com",
  instagram_url: "https://instagram.com",
  youtube_url: "https://youtube.com",
  twitter_url: "https://twitter.com",
  linkedin_url: "https://linkedin.com",
  footer_text: "Empowering Athletes. Enabling Dreams.",
  primary_color: "#C9A227",
  secondary_color: "#0B1D3A",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const DEFAULT_HOMEPAGE_HERO: HomepageHero = {
  id: "default-hero",
  heading: "Empowering India's Sporting Future",
  subheading: "UnitedAthletes for India Foundation",
  button_text: "Explore Programmes",
  button_url: "/programmes",
  background_image: "/assets/texture-navy.jpg",
  overlay_opacity: 0.6,
  is_enabled: true,
  display_order: 1,
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  {
    id: "sec-mission",
    section_key: "mission",
    section_type: "mission",
    title: "Dedicated to empowering athletes across India with opportunities, facilities, equipment and support.",
    subtitle: "Our Mission",
    description: "Empowering athletes. Enabling dreams.",
    content: null,
    is_visible: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-about",
    section_key: "about",
    section_type: "about",
    title: "Building a stronger sporting ecosystem",
    subtitle: "About Us",
    description: "UnitedAthletes for India Foundation works to identify, support, and develop sporting talent across India, providing athletes with the resources, equipment, and facilities they need.",
    content: null,
    is_visible: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-programmes",
    section_key: "programmes",
    section_type: "programmes",
    title: "Our Programmes",
    subtitle: "What We Do",
    description: "Structured initiatives designed to support athletes at every stage of their journey.",
    content: null,
    is_visible: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-athletes",
    section_key: "athletes",
    section_type: "athletes",
    title: "Our Athletes",
    subtitle: "Athletes",
    description: "Meet the talented individuals making strides across different sporting disciplines.",
    content: null,
    is_visible: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-events",
    section_key: "events",
    section_type: "events",
    title: "Upcoming Events & Meets",
    subtitle: "Events",
    description: "Join us at tournaments, training camps, trials, and community gatherings.",
    content: null,
    is_visible: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-news",
    section_key: "news",
    section_type: "news",
    title: "Latest News & Updates",
    subtitle: "News",
    description: "Stories and announcements from our sports community.",
    content: null,
    is_visible: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-testimonials",
    section_key: "testimonials",
    section_type: "testimonials",
    title: "Voices of our Community",
    subtitle: "Testimonials",
    description: "",
    content: null,
    is_visible: true,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-gallery",
    section_key: "gallery",
    section_type: "gallery",
    title: "Moments Captured",
    subtitle: "Gallery",
    description: "",
    content: null,
    is_visible: true,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "sec-cta",
    section_key: "cta",
    section_type: "cta",
    title: "Ready to make a difference?",
    subtitle: "Join Us",
    description: "Support an athlete today and become part of India's sporting journey.",
    content: {
      button_text: "Get Involved",
      button_href: "/get-involved",
      background_image: "/assets/community.jpg",
    },
    is_visible: true,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { id: "nav-1", label: "Home", url: "/", href: "/", type: "header", target: "_self", display_order: 1, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-2", label: "About", url: "/about", href: "/about", type: "header", target: "_self", display_order: 2, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-3", label: "Programmes", url: "/programmes", href: "/programmes", type: "header", target: "_self", display_order: 3, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-4", label: "Get Involved", url: "/get-involved", href: "/get-involved", type: "header", target: "_self", display_order: 4, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-5", label: "News", url: "/news", href: "/news", type: "header", target: "_self", display_order: 5, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-6", label: "Events", url: "/events", href: "/events", type: "header", target: "_self", display_order: 6, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-7", label: "Athletes", url: "/athletes", href: "/athletes", type: "header", target: "_self", display_order: 7, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-8", label: "Gallery", url: "/gallery", href: "/gallery", type: "header", target: "_self", display_order: 8, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
  { id: "nav-9", label: "Contact", url: "/contact", href: "/contact", type: "header", target: "_self", display_order: 9, is_active: true, is_external: false, parent_id: null, created_at: "", updated_at: "" },
]

export const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    id: "foot-explore",
    title: "Explore",
    display_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
    links: [
      { id: "fl-1", section_id: "foot-explore", label: "Home", href: "/", is_external: false, display_order: 1, created_at: "", updated_at: "" },
      { id: "fl-2", section_id: "foot-explore", label: "About Us", href: "/about", is_external: false, display_order: 2, created_at: "", updated_at: "" },
      { id: "fl-3", section_id: "foot-explore", label: "Programmes", href: "/programmes", is_external: false, display_order: 3, created_at: "", updated_at: "" },
      { id: "fl-4", section_id: "foot-explore", label: "News", href: "/news", is_external: false, display_order: 4, created_at: "", updated_at: "" },
      { id: "fl-5", section_id: "foot-explore", label: "Events", href: "/events", is_external: false, display_order: 5, created_at: "", updated_at: "" },
      { id: "fl-6", section_id: "foot-explore", label: "Athletes", href: "/athletes", is_external: false, display_order: 6, created_at: "", updated_at: "" },
      { id: "fl-7", section_id: "foot-explore", label: "Gallery", href: "/gallery", is_external: false, display_order: 7, created_at: "", updated_at: "" },
      { id: "fl-8", section_id: "foot-explore", label: "Contact", href: "/contact", is_external: false, display_order: 8, created_at: "", updated_at: "" },
    ],
  },
  {
    id: "foot-involved",
    title: "Get Involved",
    display_order: 2,
    is_active: true,
    created_at: "",
    updated_at: "",
    links: [
      { id: "fl-9", section_id: "foot-involved", label: "Support Athletes", href: "/get-involved", is_external: false, display_order: 1, created_at: "", updated_at: "" },
      { id: "fl-10", section_id: "foot-involved", label: "Provide Equipment", href: "/get-involved", is_external: false, display_order: 2, created_at: "", updated_at: "" },
      { id: "fl-11", section_id: "foot-involved", label: "Partner With Us", href: "/get-involved", is_external: false, display_order: 3, created_at: "", updated_at: "" },
      { id: "fl-12", section_id: "foot-involved", label: "Contact Us", href: "/contact", is_external: false, display_order: 4, created_at: "", updated_at: "" },
    ],
  },
]

export const DEFAULT_PROGRAMMES: Programme[] = [
  {
    id: "prog-1",
    title: "Facility Access & Infrastructure",
    slug: "facility-access-infrastructure",
    description: "Opening doors to modern sports complexes, tracks, and courts so athletes never lack a place to train.",
    image: "/assets/facility.jpg",
    content: "<p>Access to quality sporting infrastructure is the foundation of athletic excellence. We partner with top academies and facilities across India to ensure our athletes have regular access to world-class grounds, courts, and training environments.</p>",
    status: "published",
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "prog-2",
    title: "Equipment & Gear Grants",
    slug: "equipment-gear-grants",
    description: "Providing high-grade equipment, competition gear, and athletic footwear to promising talent.",
    image: "/assets/equipment.jpg",
    content: "<p>No athlete should have their potential limited by equipment costs. We provide direct gear grants and specialized sporting equipment to ensure athletes can compete on an equal footing.</p>",
    status: "published",
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "prog-3",
    title: "Athlete Mentorship & Coaching",
    slug: "athlete-mentorship-coaching",
    description: "Connecting athletes with experienced coaches, mentors, and sports science specialists.",
    image: "/assets/support.jpg",
    content: "<p>Guided coaching and mental conditioning are crucial for long-term athletic success. Our mentorship network links emerging athletes with certified coaches and seasoned professionals.</p>",
    status: "published",
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
]

export const DEFAULT_ATHLETES: Athlete[] = [
  {
    id: "ath-1",
    name: "Aarav Sharma",
    slug: "aarav-sharma",
    photo: "/assets/about-athlete.jpg",
    sport: "Badminton",
    category: "Singles / Senior",
    biography: "National ranking badminton player training for international competitions.",
    achievements: "State Champion 2025, National Quarter-finalist 2025",
    profile_details: null,
    nationality: "Indian",
    status: "published",
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ath-2",
    name: "Priya Patel",
    slug: "priya-patel",
    photo: "/assets/hero-athletes.jpg",
    sport: "Athletics",
    category: "Track & Field / 400m",
    biography: "Sprint specialist aiming for national podium finishes and record timings.",
    achievements: "Junior National Gold Medalist 2024",
    profile_details: null,
    nationality: "Indian",
    status: "published",
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "ath-3",
    name: "Rohan Verma",
    slug: "rohan-verma",
    photo: "/assets/para-athlete.jpg",
    sport: "Para Athletics",
    category: "Javelin Throw / F46",
    biography: "Dedicated para-athlete representing India at major championships.",
    achievements: "Asian Para Games Silver 2023, National Gold 2024",
    profile_details: null,
    nationality: "Indian",
    status: "published",
    display_order: 3,
    created_at: "",
    updated_at: "",
  },
]

export const DEFAULT_EVENTS: Event[] = [
  {
    id: "ev-1",
    title: "National Talent Hunt Trials 2026",
    slug: "national-talent-hunt-trials-2026",
    description: "Open talent identification trials across badminton, athletics, and archery for junior athletes.",
    event_date: "2026-10-15",
    start_time: "08:00",
    end_time: "17:00",
    location: "Jawaharlal Nehru Stadium, New Delhi",
    featured_image: "/assets/facility.jpg",
    registration_url: "/contact",
    status: "published",
    created_at: "",
    updated_at: "",
  },
  {
    id: "ev-2",
    title: "UnitedAthletes High Performance Workshop",
    slug: "unitedathletes-high-performance-workshop",
    description: "Intensive training camp and sports science symposium for coaches and athletes.",
    event_date: "2026-11-20",
    start_time: "09:30",
    end_time: "16:00",
    location: "National Sports Academy, Bengaluru",
    featured_image: "/assets/support.jpg",
    registration_url: "/contact",
    status: "published",
    created_at: "",
    updated_at: "",
  },
]

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Foundation Launches Elite Athlete Support Program",
    slug: "foundation-launches-elite-athlete-support-program",
    excerpt: "Comprehensive funding and training support announced for 50 promising athletes across India.",
    content: "<p>UnitedAthletes for India Foundation today announced the launch of its 2026-27 Elite Support Cohort, offering direct financial aid, equipment access, and sports science guidance to talented youngsters across multiple states.</p>",
    featured_image: "/assets/support.jpg",
    author_id: null,
    author: "UnitedAthletes Editorial",
    category_id: null,
    category: { name: "Announcements", slug: "announcements" },
    status: "published",
    published_at: "2026-08-15T10:00:00Z",
    meta_title: null,
    meta_description: null,
    og_title: null,
    og_description: null,
    og_image: null,
    canonical_url: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "art-2",
    title: "Grassroots Scouting Campaign Reaches 12 Districts",
    slug: "grassroots-scouting-campaign-reaches-12-districts",
    excerpt: "Over 800 young athletes screened in the latest regional development phase.",
    content: "<p>Our scout team has completed regional fitness assessments and talent identification trials across rural and semi-urban districts, identifying exceptional promise in track and field and racquet sports.</p>",
    featured_image: "/assets/community.jpg",
    author_id: null,
    author: "UnitedAthletes Editorial",
    category_id: null,
    category: { name: "Grassroots", slug: "grassroots" },
    status: "published",
    published_at: "2026-08-28T14:30:00Z",
    meta_title: null,
    meta_description: null,
    og_title: null,
    og_description: null,
    og_image: null,
    canonical_url: null,
    created_at: "",
    updated_at: "",
  },
]

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Vikram Malhotra",
    role: "Senior Athletics Coach",
    photo: null,
    quote: "UnitedAthletes provides the exact infrastructure and consistent backing that our athletes need to transition from local talent to international contenders.",
    status: "published",
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "test-2",
    name: "Sunita Rao",
    role: "National Badminton Finalist",
    photo: null,
    quote: "Having access to professional coaching and top-tier equipment without financial stress has completely transformed my focus and confidence on court.",
    status: "published",
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
]

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  { id: "gal-1", title: "Training Session", image_url: "/assets/facility.jpg", alt_text: "Indoor sports arena", description: "Indoor training facilities", category: "Facilities", status: "published", display_order: 1, created_at: "", updated_at: "" },
  { id: "gal-2", title: "Equipment Distribution", image_url: "/assets/equipment.jpg", alt_text: "Athletic equipment", description: "Equipment and gear distribution", category: "Gear", status: "published", display_order: 2, created_at: "", updated_at: "" },
  { id: "gal-3", title: "Athlete Focus", image_url: "/assets/about-athlete.jpg", alt_text: "Badminton player in focus", description: "Athletes at competition", category: "Athletes", status: "published", display_order: 3, created_at: "", updated_at: "" },
  { id: "gal-4", title: "Community Huddle", image_url: "/assets/community.jpg", alt_text: "Athletes together", description: "Community gatherings", category: "Community", status: "published", display_order: 4, created_at: "", updated_at: "" },
]

// ── Site settings (single row) ───────────────────────────────────────────────

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_SITE_SETTINGS
    const { data, error } = await c
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()
    if (error || !data) return DEFAULT_SITE_SETTINGS
    return data as SiteSettings
  } catch (err) {
    console.error("[cms] getSiteSettingsServer error:", err)
    return DEFAULT_SITE_SETTINGS
  }
}

// ── Pages ────────────────────────────────────────────────────────────────────

export async function getPagesServer(): Promise<Page[]> {
  try {
    const c = createPublicClient()
    if (!c) return []
    const { data, error } = await c
      .from("pages")
      .select("*")
      .order("updated_at", { ascending: false })
    if (error) return []
    return (data as Page[]) || []
  } catch {
    return []
  }
}

export async function getPageBySlugServer(slug: string): Promise<Page | null> {
  try {
    const c = createPublicClient()
    if (!c) return null
    const { data, error } = await c
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error) return null
    return (data as Page) ?? null
  } catch {
    return null
  }
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getArticlesServer(opts?: {
  status?: string
  limit?: number
  categoryId?: string
}): Promise<Article[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_ARTICLES.slice(0, opts?.limit || 10)
    let q = c
      .from("articles")
      .select("*, category:categories(name, slug)")
      .order("published_at", { ascending: false, nullsFirst: false })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.categoryId) q = q.eq("category_id", opts.categoryId)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_ARTICLES.slice(0, opts?.limit || 10)
    return data as unknown as Article[]
  } catch {
    return DEFAULT_ARTICLES.slice(0, opts?.limit || 10)
  }
}

export async function getArticleBySlugServer(slug: string): Promise<Article | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_ARTICLES.find((a) => a.slug === slug) || null
    const { data, error } = await c
      .from("articles")
      .select("*, category:categories(name, slug)")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error || !data) return DEFAULT_ARTICLES.find((a) => a.slug === slug) || null
    return data as unknown as Article
  } catch {
    return DEFAULT_ARTICLES.find((a) => a.slug === slug) || null
  }
}

export async function getArticleCategoriesServer(): Promise<ArticleCategory[]> {
  try {
    const c = createPublicClient()
    if (!c) return []
    const { data, error } = await c
      .from("categories")
      .select("*")
      .order("name")
    if (error) return []
    return (data as ArticleCategory[]) || []
  } catch {
    return []
  }
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function getEventsServer(opts?: {
  status?: string
  limit?: number
  upcoming?: boolean
}): Promise<Event[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_EVENTS.slice(0, opts?.limit || 10)
    let q = c
      .from("events")
      .select("*")
      .order("event_date", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.upcoming) q = q.gte("event_date", new Date().toISOString().split("T")[0])
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_EVENTS.slice(0, opts?.limit || 10)
    return data as Event[]
  } catch {
    return DEFAULT_EVENTS.slice(0, opts?.limit || 10)
  }
}

export async function getEventBySlugServer(slug: string): Promise<Event | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_EVENTS.find((e) => e.slug === slug) || null
    const { data, error } = await c
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error || !data) return DEFAULT_EVENTS.find((e) => e.slug === slug) || null
    return data as Event
  } catch {
    return DEFAULT_EVENTS.find((e) => e.slug === slug) || null
  }
}

// ── Programmes ───────────────────────────────────────────────────────────────

export async function getProgrammesServer(opts?: {
  status?: string
  limit?: number
}): Promise<Programme[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_PROGRAMMES.slice(0, opts?.limit || 10)
    let q = c
      .from("programmes")
      .select("*")
      .order("display_order", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_PROGRAMMES.slice(0, opts?.limit || 10)
    return data as Programme[]
  } catch {
    return DEFAULT_PROGRAMMES.slice(0, opts?.limit || 10)
  }
}

export async function getProgrammeBySlugServer(slug: string): Promise<Programme | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_PROGRAMMES.find((p) => p.slug === slug) || null
    const { data, error } = await c
      .from("programmes")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error || !data) return DEFAULT_PROGRAMMES.find((p) => p.slug === slug) || null
    return data as Programme
  } catch {
    return DEFAULT_PROGRAMMES.find((p) => p.slug === slug) || null
  }
}

// ── Athletes ─────────────────────────────────────────────────────────────────

export async function getAthletesServer(opts?: {
  status?: string
  limit?: number
  sport?: string
}): Promise<Athlete[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_ATHLETES.slice(0, opts?.limit || 10)
    let q = c
      .from("athletes")
      .select("*")
      .order("display_order", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.sport) q = q.eq("sport", opts.sport)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_ATHLETES.slice(0, opts?.limit || 10)
    return data as Athlete[]
  } catch {
    return DEFAULT_ATHLETES.slice(0, opts?.limit || 10)
  }
}

export async function getAthleteBySlugServer(slug: string): Promise<Athlete | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_ATHLETES.find((a) => a.slug === slug) || null
    const { data, error } = await c
      .from("athletes")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error || !data) return DEFAULT_ATHLETES.find((a) => a.slug === slug) || null
    return data as Athlete
  } catch {
    return DEFAULT_ATHLETES.find((a) => a.slug === slug) || null
  }
}

// ── Teams ────────────────────────────────────────────────────────────────────

export async function getTeamsServer(opts?: {
  status?: string
  limit?: number
}): Promise<Team[]> {
  try {
    const c = createPublicClient()
    if (!c) return []
    let q = c
      .from("teams")
      .select("*")
      .order("display_order", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error) return []
    return (data as Team[]) || []
  } catch {
    return []
  }
}

export async function getTeamBySlugServer(slug: string): Promise<Team | null> {
  try {
    const c = createPublicClient()
    if (!c) return null
    const { data, error } = await c
      .from("teams")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
    if (error) return null
    return (data as Team) ?? null
  } catch {
    return null
  }
}

/** Roster rows for a team with the athlete record joined in. */
export async function getTeamAthletesServer(teamId: string) {
  try {
    const c = createPublicClient()
    if (!c) return []
    const { data, error } = await c
      .from("team_athletes")
      .select("*, athlete:athletes(*)")
      .eq("team_id", teamId)
      .order("display_order", { ascending: true })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonialsServer(opts?: {
  status?: string
  limit?: number
}): Promise<Testimonial[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_TESTIMONIALS.slice(0, opts?.limit || 10)
    let q = c
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_TESTIMONIALS.slice(0, opts?.limit || 10)
    return data as Testimonial[]
  } catch {
    return DEFAULT_TESTIMONIALS.slice(0, opts?.limit || 10)
  }
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export async function getGalleryItemsServer(opts?: {
  status?: string
  limit?: number
  category?: string
}): Promise<GalleryItem[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_GALLERY_ITEMS.slice(0, opts?.limit || 10)
    let q = c
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true })
    if (opts?.status) q = q.eq("status", opts.status)
    if (opts?.category) q = q.eq("category", opts.category)
    if (opts?.limit) q = q.limit(opts.limit)
    const { data, error } = await q
    if (error || !data || data.length === 0) return DEFAULT_GALLERY_ITEMS.slice(0, opts?.limit || 10)
    return data as GalleryItem[]
  } catch {
    return DEFAULT_GALLERY_ITEMS.slice(0, opts?.limit || 10)
  }
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomepageHeroServer(): Promise<HomepageHero | null> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_HOMEPAGE_HERO
    const { data, error } = await c
      .from("homepage_hero")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle()
    if (error || !data) return DEFAULT_HOMEPAGE_HERO
    return data as HomepageHero
  } catch {
    return DEFAULT_HOMEPAGE_HERO
  }
}

export async function getHomepageSectionsServer(): Promise<HomepageSection[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_HOMEPAGE_SECTIONS
    const { data, error } = await c
      .from("homepage_sections")
      .select("*")
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_HOMEPAGE_SECTIONS
    return data as HomepageSection[]
  } catch {
    return DEFAULT_HOMEPAGE_SECTIONS
  }
}

export async function getHomepageFeaturedServer(
  sectionId: string,
): Promise<HomepageFeatured | null> {
  try {
    const c = createPublicClient()
    if (!c) return null
    const { data, error } = await c
      .from("homepage_featured")
      .select("*")
      .eq("section_id", sectionId)
      .maybeSingle()
    if (error) return null
    return (data as HomepageFeatured) ?? null
  } catch {
    return null
  }
}

// ── Navigation ───────────────────────────────────────────────────────────────

export async function getNavigationItemsServer(): Promise<NavigationItem[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_NAVIGATION_ITEMS
    const { data, error } = await c
      .from("navigation_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error || !data || data.length === 0) return DEFAULT_NAVIGATION_ITEMS
    return data as unknown as NavigationItem[]
  } catch {
    return DEFAULT_NAVIGATION_ITEMS
  }
}

// ── Footer ───────────────────────────────────────────────────────────────────

export async function getFooterSectionsServer(): Promise<FooterSection[]> {
  try {
    const c = createPublicClient()
    if (!c) return DEFAULT_FOOTER_SECTIONS
    const { data: sections, error } = await c
      .from("footer_sections")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
    if (error || !sections || sections.length === 0) return DEFAULT_FOOTER_SECTIONS
    const { data: links } = await c
      .from("footer_links")
      .select("*")
      .in("section_id", sections.map((s) => s.id))
      .order("display_order", { ascending: true })
    return (sections as FooterSection[]).map((s) => ({
      ...s,
      links: (links || []).filter((l) => l.section_id === s.id),
    }))
  } catch {
    return DEFAULT_FOOTER_SECTIONS
  }
}
