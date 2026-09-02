// ============================================================================
// Public + shared server-side CMS reads.
// Every public page renders through these functions — no Supabase calls in JSX.
// All queries run under the caller's cookie session so RLS decides visibility:
// anonymous visitors only ever see published rows.
// ============================================================================

import { createClient } from "@/lib/supabase/server"
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

// ── Site settings (single row) ───────────────────────────────────────────────

export async function getSiteSettingsServer(): Promise<SiteSettings | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error("[cms] getSiteSettingsServer failed:", error.message)
    return null
  }
  return data as SiteSettings | null
}

// ── Pages ────────────────────────────────────────────────────────────────────

export async function getPagesServer(): Promise<Page[]> {
  const c = await createClient()
  const { data, error } = await c
    .from("pages")
    .select("*")
    .order("updated_at", { ascending: false })
  if (error) { console.error("[cms] getPagesServer:", error.message); return [] }
  return (data as Page[]) || []
}

export async function getPageBySlugServer(slug: string): Promise<Page | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getPageBySlugServer:", error.message); return null }
  return (data as Page) ?? null
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getArticlesServer(opts?: {
  status?: string
  limit?: number
  categoryId?: string
}): Promise<Article[]> {
  const c = await createClient()
  let q = c
    .from("articles")
    .select("*, category:categories(name, slug)")
    .order("published_at", { ascending: false, nullsFirst: false })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.categoryId) q = q.eq("category_id", opts.categoryId)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getArticlesServer:", error.message); return [] }
  return (data as unknown as Article[]) || []
}

export async function getArticleBySlugServer(slug: string): Promise<Article | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("articles")
    .select("*, category:categories(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getArticleBySlugServer:", error.message); return null }
  return (data as unknown as Article) ?? null
}

export async function getArticleCategoriesServer(): Promise<ArticleCategory[]> {
  const c = await createClient()
  const { data, error } = await c
    .from("categories")
    .select("*")
    .order("name")
  if (error) { console.error("[cms] getArticleCategoriesServer:", error.message); return [] }
  return (data as ArticleCategory[]) || []
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function getEventsServer(opts?: {
  status?: string
  limit?: number
  upcoming?: boolean
}): Promise<Event[]> {
  const c = await createClient()
  let q = c
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.upcoming) q = q.gte("event_date", new Date().toISOString().split("T")[0])
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getEventsServer:", error.message); return [] }
  return (data as Event[]) || []
}

export async function getEventBySlugServer(slug: string): Promise<Event | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getEventBySlugServer:", error.message); return null }
  return (data as Event) ?? null
}

// ── Programmes ───────────────────────────────────────────────────────────────

export async function getProgrammesServer(opts?: {
  status?: string
  limit?: number
}): Promise<Programme[]> {
  const c = await createClient()
  let q = c
    .from("programmes")
    .select("*")
    .order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getProgrammesServer:", error.message); return [] }
  return (data as Programme[]) || []
}

export async function getProgrammeBySlugServer(slug: string): Promise<Programme | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("programmes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getProgrammeBySlugServer:", error.message); return null }
  return (data as Programme) ?? null
}

// ── Athletes ─────────────────────────────────────────────────────────────────

export async function getAthletesServer(opts?: {
  status?: string
  limit?: number
  sport?: string
}): Promise<Athlete[]> {
  const c = await createClient()
  let q = c
    .from("athletes")
    .select("*")
    .order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.sport) q = q.eq("sport", opts.sport)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getAthletesServer:", error.message); return [] }
  return (data as Athlete[]) || []
}

export async function getAthleteBySlugServer(slug: string): Promise<Athlete | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("athletes")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getAthleteBySlugServer:", error.message); return null }
  return (data as Athlete) ?? null
}

// ── Teams ────────────────────────────────────────────────────────────────────

export async function getTeamsServer(opts?: {
  status?: string
  limit?: number
}): Promise<Team[]> {
  const c = await createClient()
  let q = c
    .from("teams")
    .select("*")
    .order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getTeamsServer:", error.message); return [] }
  return (data as Team[]) || []
}

export async function getTeamBySlugServer(slug: string): Promise<Team | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()
  if (error) { console.error("[cms] getTeamBySlugServer:", error.message); return null }
  return (data as Team) ?? null
}

/** Roster rows for a team with the athlete record joined in. */
export async function getTeamAthletesServer(teamId: string) {
  const c = await createClient()
  const { data, error } = await c
    .from("team_athletes")
    .select("*, athlete:athletes(*)")
    .eq("team_id", teamId)
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getTeamAthletesServer:", error.message); return [] }
  return data || []
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function getTestimonialsServer(opts?: {
  status?: string
  limit?: number
}): Promise<Testimonial[]> {
  const c = await createClient()
  let q = c
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getTestimonialsServer:", error.message); return [] }
  return (data as Testimonial[]) || []
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export async function getGalleryItemsServer(opts?: {
  status?: string
  limit?: number
  category?: string
}): Promise<GalleryItem[]> {
  const c = await createClient()
  let q = c
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.category) q = q.eq("category", opts.category)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getGalleryItemsServer:", error.message); return [] }
  return (data as GalleryItem[]) || []
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomepageHeroServer(): Promise<HomepageHero | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("homepage_hero")
    .select("*")
    .eq("is_enabled", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) { console.error("[cms] getHomepageHeroServer:", error.message); return null }
  return (data as HomepageHero) ?? null
}

export async function getHomepageSectionsServer(): Promise<HomepageSection[]> {
  const c = await createClient()
  const { data, error } = await c
    .from("homepage_sections")
    .select("*")
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getHomepageSectionsServer:", error.message); return [] }
  return (data as HomepageSection[]) || []
}

export async function getHomepageFeaturedServer(
  sectionId: string,
): Promise<HomepageFeatured | null> {
  const c = await createClient()
  const { data, error } = await c
    .from("homepage_featured")
    .select("*")
    .eq("section_id", sectionId)
    .maybeSingle()
  if (error) { console.error("[cms] getHomepageFeaturedServer:", error.message); return null }
  return (data as HomepageFeatured) ?? null
}

// ── Navigation ───────────────────────────────────────────────────────────────

export async function getNavigationItemsServer(): Promise<NavigationItem[]> {
  const c = await createClient()
  const { data, error } = await c
    .from("navigation_items")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getNavigationItemsServer:", error.message); return [] }
  return (data as unknown as NavigationItem[]) || []
}

// ── Footer ───────────────────────────────────────────────────────────────────

export async function getFooterSectionsServer(): Promise<FooterSection[]> {
  const c = await createClient()
  const { data: sections, error } = await c
    .from("footer_sections")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getFooterSectionsServer:", error.message); return [] }
  if (!sections || sections.length === 0) return []
  const { data: links, error: linksError } = await c
    .from("footer_links")
    .select("*")
    .in("section_id", sections.map((s) => s.id))
    .order("display_order", { ascending: true })
  if (linksError) { console.error("[cms] getFooterSectionsServer links:", linksError.message); return [] }
  return (sections as FooterSection[]).map((s) => ({
    ...s,
    links: (links || []).filter((l) => l.section_id === s.id),
  }))
}
