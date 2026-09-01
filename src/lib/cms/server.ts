import { createClient as createServerClient, getPublicStorageUrl } from "@/lib/supabase/server"
import {
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
  NavigationItem,
  FooterSection,
  AdminProfile,
} from "./types"

function client() {
  return createServerClient()
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle()
  return data
}

// ============================================================================
// PAGES
// ============================================================================

export async function getPagesServer(): Promise<Page[]> {
  const c = await client()
  if (!c) return []
  const { data } = await c.from("pages").select("*").order("updated_at", { ascending: false })
  return (data as Page[]) || []
}

export async function getPageBySlugServer(slug: string): Promise<Page | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

// ============================================================================
// ARTICLES
// ============================================================================

export async function getArticlesServer(opts?: { status?: string; limit?: number; categoryId?: string }): Promise<Article[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("articles").select("*, category:articles_categories(*)").order("published_at", { ascending: false, nullsFirst: false })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.categoryId) q = q.eq("category_id", opts.categoryId)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Article[]) || []
}

export async function getArticleBySlugServer(slug: string): Promise<Article | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("articles").select("*, category:articles_categories(*)").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

export async function getArticleCategoriesServer(): Promise<ArticleCategory[]> {
  const c = await client()
  if (!c) return []
  const { data } = await c.from("articles_categories").select("*").order("name")
  return (data as ArticleCategory[]) || []
}

// ============================================================================
// EVENTS
// ============================================================================

export async function getEventsServer(opts?: { status?: string; limit?: number; upcoming?: boolean }): Promise<Event[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("events").select("*").order("event_date", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.upcoming) q = q.gte("event_date", new Date().toISOString().split("T")[0])
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Event[]) || []
}

export async function getEventBySlugServer(slug: string): Promise<Event | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("events").select("*").eq("slug", slug).maybeSingle()
  return data
}

// ============================================================================
// PROGRAMMES
// ============================================================================

export async function getProgrammesServer(opts?: { status?: string; limit?: number }): Promise<Programme[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("programmes").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Programme[]) || []
}

export async function getProgrammeBySlugServer(slug: string): Promise<Programme | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("programmes").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

// ============================================================================
// ATHLETES
// ============================================================================

export async function getAthletesServer(opts?: { status?: string; limit?: number; sport?: string }): Promise<Athlete[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("athletes").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.sport) q = q.eq("sport", opts.sport)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Athlete[]) || []
}

export async function getAthleteBySlugServer(slug: string): Promise<Athlete | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("athletes").select("*").eq("slug", slug).maybeSingle()
  return data
}

// ============================================================================
// TEAMS
// ============================================================================

export async function getTeamsServer(opts?: { status?: string; limit?: number }): Promise<Team[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("teams").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Team[]) || []
}

export async function getTeamBySlugServer(slug: string): Promise<Team | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("teams").select("*").eq("slug", slug).maybeSingle()
  return data
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export async function getTestimonialsServer(opts?: { status?: string; limit?: number }): Promise<Testimonial[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("testimonials").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as Testimonial[]) || []
}

// ============================================================================
// GALLERY
// ============================================================================

export async function getGalleryItemsServer(opts?: { status?: string; limit?: number; category?: string }): Promise<GalleryItem[]> {
  const c = await client()
  if (!c) return []
  let q = c.from("gallery").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.category) q = q.eq("category", opts.category)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data } = await q
  return (data as GalleryItem[]) || []
}

// ============================================================================
// HOMEPAGE SECTIONS
// ============================================================================

export async function getHomepageSectionsServer(): Promise<HomepageSection[]> {
  const c = await client()
  if (!c) return []
  const { data } = await c.from("homepage_sections").select("*").order("display_order", { ascending: true })
  return (data as HomepageSection[]) || []
}

// ============================================================================
// NAVIGATION
// ============================================================================

export async function getNavigationItemsServer(): Promise<NavigationItem[]> {
  const c = await client()
  if (!c) return []
  const { data } = await c.from("navigation_items").select("*").eq("is_active", true).order("display_order", { ascending: true })
  return (data as NavigationItem[]) || []
}

// ============================================================================
// FOOTER
// ============================================================================

export async function getFooterSectionsServer(): Promise<FooterSection[]> {
  const c = await client()
  if (!c) return []
  const { data: sections } = await c.from("footer_sections").select("*").eq("is_active", true).order("display_order", { ascending: true })
  if (!sections || sections.length === 0) return []
  const { data: links } = await c.from("footer_links").select("*").in("section_id", sections.map((s: any) => s.id)).order("display_order", { ascending: true })
  return (sections as FooterSection[]).map((s) => ({
    ...s,
    links: (links || []).filter((l: any) => l.section_id === s.id),
  }))
}

// ============================================================================
// ADMIN PROFILE
// ============================================================================

export async function getAdminProfileServer(userId: string): Promise<AdminProfile | null> {
  const c = await client()
  if (!c) return null
  const { data } = await c.from("profiles").select("*").eq("user_id", userId).maybeSingle()
  return data as AdminProfile | null
}