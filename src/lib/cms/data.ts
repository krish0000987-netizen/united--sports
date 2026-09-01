import { createClient as createBrowserClient } from "@/lib/supabase/client"
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
  Enquiry,
  ActivityLog,
  HomepageSection,
  NavigationItem,
  FooterSection,
  FooterLink,
  AdminProfile,
} from "./types"
import { getPublicStorageUrl } from "@/lib/supabase/client"

export { getCurrentUser } from "./auth"

// Helper: get browser client safely
function client() {
  return createBrowserClient()
}

// ============================================================================
// SITE SETTINGS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const c = client()
  if (!c) return null
  const { data, error } = await c.from("site_settings").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle()
  if (error) {
    console.error("getSiteSettings error:", error)
    return null
  }
  return data
}

export async function updateSiteSettings(id: string, updates: Partial<SiteSettings>): Promise<{ data: SiteSettings | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("site_settings").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

// ============================================================================
// PAGES
// ============================================================================

export async function getPages(opts?: { status?: string }): Promise<Page[]> {
  const c = client()
  if (!c) return []
  let q = c.from("pages").select("*").order("updated_at", { ascending: false })
  if (opts?.status) q = q.eq("status", opts.status)
  const { data, error } = await q
  if (error) {
    console.error("getPages error:", error)
    return []
  }
  return data || []
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("pages").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

export async function getPageById(id: string): Promise<Page | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("pages").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createPage(page: Partial<Page>): Promise<{ data: Page | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("pages").insert(page).select().single()
  return { data, error: error?.message || null }
}

export async function updatePage(id: string, updates: Partial<Page>): Promise<{ data: Page | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("pages").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deletePage(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("pages").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ARTICLES
// ============================================================================

export async function getArticles(opts?: { status?: string; limit?: number; categoryId?: string }): Promise<Article[]> {
  const c = client()
  if (!c) return []
  let q = c.from("articles").select("*, category:articles_categories(*)").order("published_at", { ascending: false, nullsFirst: false })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.categoryId) q = q.eq("category_id", opts.categoryId)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getArticles error:", error)
    return []
  }
  return data || []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("articles").select("*, category:articles_categories(*)").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

export async function getArticleById(id: string): Promise<Article | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("articles").select("*, category:articles_categories(*)").eq("id", id).maybeSingle()
  return data
}

export async function createArticle(article: Partial<Article>): Promise<{ data: Article | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("articles").insert(article).select().single()
  return { data, error: error?.message || null }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<{ data: Article | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("articles").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteArticle(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("articles").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ARTICLE CATEGORIES
// ============================================================================

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("articles_categories").select("*").order("name")
  if (error) {
    console.error("getArticleCategories error:", error)
    return []
  }
  return data || []
}

export async function createArticleCategory(cat: Partial<ArticleCategory>): Promise<{ data: ArticleCategory | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("articles_categories").insert(cat).select().single()
  return { data, error: error?.message || null }
}

export async function updateArticleCategory(id: string, updates: Partial<ArticleCategory>): Promise<{ data: ArticleCategory | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("articles_categories").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteArticleCategory(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("articles_categories").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// EVENTS
// ============================================================================

export async function getEvents(opts?: { status?: string; limit?: number; upcoming?: boolean }): Promise<Event[]> {
  const c = client()
  if (!c) return []
  let q = c.from("events").select("*").order("event_date", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.upcoming) q = q.gte("event_date", new Date().toISOString().split("T")[0])
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getEvents error:", error)
    return []
  }
  return data || []
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("events").select("*").eq("slug", slug).maybeSingle()
  return data
}

export async function getEventById(id: string): Promise<Event | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("events").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createEvent(event: Partial<Event>): Promise<{ data: Event | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("events").insert(event).select().single()
  return { data, error: error?.message || null }
}

export async function updateEvent(id: string, updates: Partial<Event>): Promise<{ data: Event | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("events").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("events").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// PROGRAMMES
// ============================================================================

export async function getProgrammes(opts?: { status?: string; limit?: number }): Promise<Programme[]> {
  const c = client()
  if (!c) return []
  let q = c.from("programmes").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getProgrammes error:", error)
    return []
  }
  return data || []
}

export async function getProgrammeBySlug(slug: string): Promise<Programme | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("programmes").select("*").eq("slug", slug).eq("status", "published").maybeSingle()
  return data
}

export async function getProgrammeById(id: string): Promise<Programme | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("programmes").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createProgramme(programme: Partial<Programme>): Promise<{ data: Programme | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("programmes").insert(programme).select().single()
  return { data, error: error?.message || null }
}

export async function updateProgramme(id: string, updates: Partial<Programme>): Promise<{ data: Programme | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("programmes").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteProgramme(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("programmes").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ATHLETES
// ============================================================================

export async function getAthletes(opts?: { status?: string; limit?: number; sport?: string }): Promise<Athlete[]> {
  const c = client()
  if (!c) return []
  let q = c.from("athletes").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.sport) q = q.eq("sport", opts.sport)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getAthletes error:", error)
    return []
  }
  return data || []
}

export async function getAthleteBySlug(slug: string): Promise<Athlete | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("athletes").select("*").eq("slug", slug).maybeSingle()
  return data
}

export async function getAthleteById(id: string): Promise<Athlete | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("athletes").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createAthlete(athlete: Partial<Athlete>): Promise<{ data: Athlete | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("athletes").insert(athlete).select().single()
  return { data, error: error?.message || null }
}

export async function updateAthlete(id: string, updates: Partial<Athlete>): Promise<{ data: Athlete | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("athletes").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteAthlete(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("athletes").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// TEAMS
// ============================================================================

export async function getTeams(opts?: { status?: string; limit?: number }): Promise<Team[]> {
  const c = client()
  if (!c) return []
  let q = c.from("teams").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getTeams error:", error)
    return []
  }
  return data || []
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("teams").select("*").eq("slug", slug).maybeSingle()
  return data
}

export async function getTeamById(id: string): Promise<Team | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("teams").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createTeam(team: Partial<Team>): Promise<{ data: Team | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("teams").insert(team).select().single()
  return { data, error: error?.message || null }
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<{ data: Team | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("teams").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteTeam(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("teams").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// TESTIMONIALS
// ============================================================================

export async function getTestimonials(opts?: { status?: string; limit?: number }): Promise<Testimonial[]> {
  const c = client()
  if (!c) return []
  let q = c.from("testimonials").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getTestimonials error:", error)
    return []
  }
  return data || []
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("testimonials").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createTestimonial(t: Partial<Testimonial>): Promise<{ data: Testimonial | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("testimonials").insert(t).select().single()
  return { data, error: error?.message || null }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<{ data: Testimonial | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("testimonials").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteTestimonial(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("testimonials").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// GALLERY
// ============================================================================

export async function getGalleryItems(opts?: { status?: string; limit?: number; category?: string }): Promise<GalleryItem[]> {
  const c = client()
  if (!c) return []
  let q = c.from("gallery").select("*").order("display_order", { ascending: true })
  if (opts?.status) q = q.eq("status", opts.status)
  if (opts?.category) q = q.eq("category", opts.category)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) {
    console.error("getGalleryItems error:", error)
    return []
  }
  return data || []
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("gallery").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createGalleryItem(item: Partial<GalleryItem>): Promise<{ data: GalleryItem | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("gallery").insert(item).select().single()
  return { data, error: error?.message || null }
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<{ data: GalleryItem | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("gallery").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteGalleryItem(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("gallery").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ENQUIRIES
// ============================================================================

export async function getEnquiries(opts?: { status?: string }): Promise<Enquiry[]> {
  const c = client()
  if (!c) return []
  let q = c.from("enquiries").select("*").order("created_at", { ascending: false })
  if (opts?.status) q = q.eq("status", opts.status)
  const { data, error } = await q
  if (error) {
    console.error("getEnquiries error:", error)
    return []
  }
  return data || []
}

export async function getEnquiryById(id: string): Promise<Enquiry | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("enquiries").select("*").eq("id", id).maybeSingle()
  return data
}

export async function createEnquiry(enquiry: Partial<Enquiry>): Promise<{ data: Enquiry | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("enquiries").insert(enquiry).select().single()
  return { data, error: error?.message || null }
}

export async function updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<{ data: Enquiry | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("enquiries").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteEnquiry(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("enquiries").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ACTIVITY LOGS
// ============================================================================

export async function getActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(limit)
  if (error) {
    console.error("getActivityLogs error:", error)
    return []
  }
  return data || []
}

export async function createActivityLog(log: Partial<ActivityLog>): Promise<void> {
  const c = client()
  if (!c) return
  await c.from("activity_logs").insert(log)
}

// ============================================================================
// HOMEPAGE SECTIONS
// ============================================================================

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("homepage_sections").select("*").order("display_order", { ascending: true })
  if (error) {
    console.error("getHomepageSections error:", error)
    return []
  }
  return data || []
}

export async function getHomepageSectionByKey(key: string): Promise<HomepageSection | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("homepage_sections").select("*").eq("section_key", key).maybeSingle()
  return data
}

export async function updateHomepageSection(id: string, updates: Partial<HomepageSection>): Promise<{ data: HomepageSection | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("homepage_sections").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

// ============================================================================
// NAVIGATION
// ============================================================================

export async function getNavigationItems(): Promise<NavigationItem[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("navigation_items").select("*").order("display_order", { ascending: true })
  if (error) {
    console.error("getNavigationItems error:", error)
    return []
  }
  return (data || []).filter((n: NavigationItem) => n.is_active)
}

export async function getAllNavigationItems(): Promise<NavigationItem[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("navigation_items").select("*").order("display_order", { ascending: true })
  if (error) {
    console.error("getAllNavigationItems error:", error)
    return []
  }
  return data || []
}

export async function createNavigationItem(item: Partial<NavigationItem>): Promise<{ data: NavigationItem | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("navigation_items").insert(item).select().single()
  return { data, error: error?.message || null }
}

export async function updateNavigationItem(id: string, updates: Partial<NavigationItem>): Promise<{ data: NavigationItem | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("navigation_items").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteNavigationItem(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("navigation_items").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// FOOTER
// ============================================================================

export async function getFooterSections(): Promise<FooterSection[]> {
  const c = client()
  if (!c) return []
  const { data: sections, error: sErr } = await c.from("footer_sections").select("*").eq("is_active", true).order("display_order", { ascending: true })
  if (sErr) {
    console.error("getFooterSections error:", sErr)
    return []
  }
  if (!sections || sections.length === 0) return []
  const { data: links, error: lErr } = await c.from("footer_links").select("*").in("section_id", sections.map((s: FooterSection) => s.id)).order("display_order", { ascending: true })
  if (lErr) {
    console.error("getFooterLinks error:", lErr)
    return sections
  }
  return sections.map((s: FooterSection) => ({ ...s, links: (links || []).filter((l: FooterLink) => l.section_id === s.id) }))
}

export async function getAllFooterSections(): Promise<FooterSection[]> {
  const c = client()
  if (!c) return []
  const { data: sections, error: sErr } = await c.from("footer_sections").select("*").order("display_order", { ascending: true })
  if (sErr) {
    console.error("getAllFooterSections error:", sErr)
    return []
  }
  if (!sections || sections.length === 0) return []
  const { data: links } = await c.from("footer_links").select("*").in("section_id", sections.map((s: FooterSection) => s.id)).order("display_order", { ascending: true })
  return sections.map((s: FooterSection) => ({ ...s, links: (links || []).filter((l: FooterLink) => l.section_id === s.id) }))
}

export async function createFooterSection(s: Partial<FooterSection>): Promise<{ data: FooterSection | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("footer_sections").insert(s).select().single()
  return { data, error: error?.message || null }
}

export async function updateFooterSection(id: string, updates: Partial<FooterSection>): Promise<{ data: FooterSection | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("footer_sections").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteFooterSection(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("footer_sections").delete().eq("id", id)
  return { error: error?.message || null }
}

export async function createFooterLink(l: Partial<FooterLink>): Promise<{ data: FooterLink | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("footer_links").insert(l).select().single()
  return { data, error: error?.message || null }
}

export async function updateFooterLink(id: string, updates: Partial<FooterLink>): Promise<{ data: FooterLink | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("footer_links").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

export async function deleteFooterLink(id: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  const { error } = await c.from("footer_links").delete().eq("id", id)
  return { error: error?.message || null }
}

// ============================================================================
// ADMIN PROFILES
// ============================================================================

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const c = client()
  if (!c) return null
  const { data } = await c.from("profiles").select("*").eq("user_id", userId).maybeSingle()
  return data
}

export async function getAllAdminProfiles(): Promise<AdminProfile[]> {
  const c = client()
  if (!c) return []
  const { data, error } = await c.from("profiles").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("getAllAdminProfiles error:", error)
    return []
  }
  return (data || []).filter((p: AdminProfile) => ["super_admin", "admin", "editor"].includes(p.role))
}

export async function updateAdminProfile(id: string, updates: Partial<AdminProfile>): Promise<{ data: AdminProfile | null; error: string | null }> {
  const c = client()
  if (!c) return { data: null, error: "Supabase not configured" }
  const { data, error } = await c.from("profiles").update(updates).eq("id", id).select().single()
  return { data, error: error?.message || null }
}

// ============================================================================
// STORAGE
// ============================================================================

export async function uploadMedia(file: File, folder: string = "uploads"): Promise<{ url: string | null; path: string | null; error: string | null }> {
  const c = client()
  if (!c) return { url: null, path: null, error: "Supabase not configured" }

  // Validate file
  const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"]
  if (!validTypes.includes(file.type)) {
    return { url: null, path: null, error: `Invalid file type: ${file.type}. Allowed: PNG, JPEG, GIF, WebP, SVG.` }
  }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { url: null, path: null, error: `File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(0)}MB` }
  }

  const ext = file.name.split(".").pop() || "png"
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { data, error } = await c.storage.from("media").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    return { url: null, path: null, error: error.message }
  }

  const { data: urlData } = c.storage.from("media").getPublicUrl(data.path)
  return { url: urlData.publicUrl, path: data.path, error: null }
}

export async function deleteMedia(path: string): Promise<{ error: string | null }> {
  const c = client()
  if (!c) return { error: "Supabase not configured" }
  // Extract path from URL if needed
  const cleanPath = path.includes("/storage/v1/object/public/media/")
    ? path.split("/storage/v1/object/public/media/")[1]
    : path
  const { error } = await c.storage.from("media").remove([cleanPath])
  return { error: error?.message || null }
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats() {
  const c = client()
  if (!c) return null

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: draftArticles },
    { count: eventsCount },
    { count: athletesCount },
    { count: teamsCount },
    { count: programmesCount },
    { count: galleryCount },
    { count: testimonialsCount },
    { count: enquiriesCount },
    { count: newEnquiries },
  ] = await Promise.all([
    c.from("articles").select("*", { count: "exact", head: true }),
    c.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    c.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    c.from("events").select("*", { count: "exact", head: true }),
    c.from("athletes").select("*", { count: "exact", head: true }),
    c.from("teams").select("*", { count: "exact", head: true }),
    c.from("programmes").select("*", { count: "exact", head: true }),
    c.from("gallery").select("*", { count: "exact", head: true }),
    c.from("testimonials").select("*", { count: "exact", head: true }),
    c.from("enquiries").select("*", { count: "exact", head: true }),
    c.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
  ])

  return {
    articles: { total: totalArticles || 0, published: publishedArticles || 0, draft: draftArticles || 0 },
    events: eventsCount || 0,
    athletes: athletesCount || 0,
    teams: teamsCount || 0,
    programmes: programmesCount || 0,
    gallery: galleryCount || 0,
    testimonials: testimonialsCount || 0,
    enquiries: { total: enquiriesCount || 0, new: newEnquiries || 0 },
  }
}