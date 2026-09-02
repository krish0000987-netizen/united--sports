// ============================================================================
// Admin CRUD data layer.
//
// CONTRACT: every mutating/listing function returns `{ data, error }` where
// `error` is a human-readable string or null. Functions never throw — the
// admin UI checks `error` and shows a toast. All queries run under the
// signed-in admin's cookie session, so RLS enforces permissions server-side.
// ============================================================================

import { createClient } from "@/lib/supabase/server"

export type Result<T = Record<string, unknown>> = { data: (T & { id: string }) | null; error: string | null }

function errMessage(e: { message?: string } | null): string {
  return e?.message || "Something went wrong. Please try again."
}

// ── Who am I (used by activity logging + forms) ─────────────────────────────

export async function getCurrentUser() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
      return {
        id: user.id,
        email: user.email || null,
        profile: profile as { full_name?: string; role?: string; is_active?: boolean } | null,
      }
    }
  } catch {
    // Continue to check admin session cookie
  }

  try {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    const adminCookie = cookieStore.get("ua_admin_session")?.value
    if (adminCookie) {
      const parsed = JSON.parse(adminCookie)
      return {
        id: "master-admin",
        email: parsed.email || "admin@unitedsports.org",
        profile: {
          full_name: "Super Admin",
          role: "super_admin",
          is_active: true,
        },
      }
    }
  } catch {
    // Ignore
  }

  return null
}

export async function createActivityLog(input: {
  admin_user_id: string | null
  admin_email: string | null
  action: string
  entity_type: string
  entity_id: string | null
  description?: string | null
}) {
  try {
    const supabase = await createClient()
    await supabase.from("activity_logs").insert({
      admin_user_id: input.admin_user_id,
      admin_email: input.admin_email,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      description: input.description || null,
    })
  } catch {
    // Activity logging is best-effort; never block the user action.
  }
}

// ── Site settings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) return { id: "default", site_name: "United Sports" }
  return data
}

export async function updateSiteSettings(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (!settings) return { data: null, error: "No site settings row exists. Run the database seed first." }
  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", settings.id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function createArticle(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("articles").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateArticle(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("articles").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteArticle(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("articles").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getArticleById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getArticleById:", error.message); return null }
  return data
}

export async function getArticles(opts?: { limit?: number; status?: string; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("articles")
    .select("*, category:categories(name, slug)")
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.ilike("title", `%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getArticles:", error.message); return [] }
  return data || []
}

export async function getAllArticles() {
  return getArticles()
}

export async function publishArticle(id: string) {
  return updateArticle(id, { status: "published", published_at: new Date().toISOString() })
}

export async function unpublishArticle(id: string) {
  return updateArticle(id, { status: "draft" })
}

export async function archiveArticle(id: string) {
  return updateArticle(id, { status: "archived" })
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function createCategory(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateCategory(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteCategory(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) { console.error("[cms] getCategories:", error.message); return [] }
  return data || []
}

export async function getArticleCategories() {
  return getCategories()
}

export async function createArticleCategory(input: Record<string, unknown>) {
  return createCategory(input)
}

export async function updateArticleCategory(id: string, input: Record<string, unknown>) {
  return updateCategory(id, input)
}

export async function deleteArticleCategory(id: string) {
  return deleteCategory(id)
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function createEvent(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateEvent(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteEvent(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getEventById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getEventById:", error.message); return null }
  return data
}

export async function getEvents(opts?: { limit?: number; status?: string; search?: string }) {
  const supabase = await createClient()
  let q = supabase.from("events").select("*").order("event_date", { ascending: true })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.ilike("title", `%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getEvents:", error.message); return [] }
  return data || []
}

export async function getAllEvents() {
  return getEvents()
}

export async function publishEvent(id: string) {
  return updateEvent(id, { status: "published" })
}

export async function unpublishEvent(id: string) {
  return updateEvent(id, { status: "draft" })
}

// ── Programmes ───────────────────────────────────────────────────────────────

export async function createProgramme(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("programmes").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateProgramme(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("programmes").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteProgramme(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("programmes").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getProgrammeById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("programmes").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getProgrammeById:", error.message); return null }
  return data
}

export async function getProgrammes(opts?: { status?: string; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("programmes")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.ilike("title", `%${opts.search}%`)
  const { data, error } = await q
  if (error) { console.error("[cms] getProgrammes:", error.message); return [] }
  return data || []
}

export async function getAllProgrammes() {
  return getProgrammes()
}

export async function publishProgramme(id: string) {
  return updateProgramme(id, { status: "published" })
}

export async function unpublishProgramme(id: string) {
  return updateProgramme(id, { status: "draft" })
}

// ── Athletes ─────────────────────────────────────────────────────────────────

export async function createAthlete(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("athletes").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateAthlete(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("athletes").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteAthlete(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("athletes").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getAthleteById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("athletes").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getAthleteById:", error.message); return null }
  return data
}

export async function getAthletes(opts?: { status?: string; sport?: string; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("athletes")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.sport && opts.sport !== "all") q = q.eq("sport", opts.sport)
  if (opts?.search) q = q.ilike("name", `%${opts.search}%`)
  const { data, error } = await q
  if (error) { console.error("[cms] getAthletes:", error.message); return [] }
  return data || []
}

export async function getAllAthletes() {
  return getAthletes()
}

export async function publishAthlete(id: string) {
  return updateAthlete(id, { status: "published" })
}

export async function unpublishAthlete(id: string) {
  return updateAthlete(id, { status: "draft" })
}

// ── Teams ────────────────────────────────────────────────────────────────────

export async function createTeam(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateTeam(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteTeam(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("teams").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getTeamById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("teams").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getTeamById:", error.message); return null }
  return data
}

export async function getTeams(opts?: { status?: string; sport?: string; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("teams")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.sport && opts.sport !== "all") q = q.eq("sport", opts.sport)
  if (opts?.search) q = q.ilike("name", `%${opts.search}%`)
  const { data, error } = await q
  if (error) { console.error("[cms] getTeams:", error.message); return [] }
  return data || []
}

export async function getAllTeams() {
  return getTeams()
}

export async function publishTeam(id: string) {
  return updateTeam(id, { status: "published" })
}

export async function unpublishTeam(id: string) {
  return updateTeam(id, { status: "draft" })
}

// ── Team roster ──────────────────────────────────────────────────────────────

export async function getTeamAthletes(teamId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_athletes")
    .select("*, athlete:athletes(*)")
    .eq("team_id", teamId)
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getTeamAthletes:", error.message); return [] }
  return data || []
}

export async function addTeamAthlete(teamId: string, athleteId: string, displayOrder = 0): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_athletes")
    .insert({ team_id: teamId, athlete_id: athleteId, display_order: displayOrder })
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function removeTeamAthlete(teamId: string, athleteId: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("team_athletes")
    .delete()
    .eq("team_id", teamId)
    .eq("athlete_id", athleteId)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function createTestimonial(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("testimonials").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateTestimonial(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("testimonials").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteTestimonial(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getTestimonialById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getTestimonialById:", error.message); return null }
  return data
}

export async function getTestimonials(opts?: { status?: string; limit?: number; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.ilike("name", `%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getTestimonials:", error.message); return [] }
  return data || []
}

export async function getAllTestimonials() {
  return getTestimonials()
}

export async function publishTestimonial(id: string) {
  return updateTestimonial(id, { status: "published" })
}

export async function unpublishTestimonial(id: string) {
  return updateTestimonial(id, { status: "draft" })
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export async function createGalleryItem(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("gallery").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateGalleryItem(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("gallery").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteGalleryItem(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery").select("image_url").eq("id", id).maybeSingle()
  // Best effort: also delete the underlying storage object when it lives in our bucket
  if (data?.image_url) {
    const marker = "/storage/v1/object/public/media/"
    const idx = data.image_url.indexOf(marker)
    if (idx !== -1) {
      const path = data.image_url.substring(idx + marker.length)
      await supabase.storage.from("media").remove([path])
    }
  }
  const { error } = await supabase.from("gallery").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getGalleryItemById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("gallery").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getGalleryItemById:", error.message); return null }
  return data
}

export async function getGalleryItems(opts?: { status?: string; category?: string; limit?: number; search?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.category && opts.category !== "all") q = q.eq("category", opts.category)
  if (opts?.search) q = q.ilike("title", `%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getGalleryItems:", error.message); return [] }
  return data || []
}

export async function getAllGalleryItems() {
  return getGalleryItems()
}

export async function publishGalleryItem(id: string) {
  return updateGalleryItem(id, { status: "published" })
}

export async function unpublishGalleryItem(id: string) {
  return updateGalleryItem(id, { status: "draft" })
}

// ── CMS Pages ────────────────────────────────────────────────────────────────

export async function createCmsPage(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("pages").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateCmsPage(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("pages").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteCmsPage(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("pages").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getCmsPageById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getCmsPageById:", error.message); return null }
  return data
}

export async function getAllCmsPages() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("pages").select("*").order("updated_at", { ascending: false })
  if (error) { console.error("[cms] getAllCmsPages:", error.message); return [] }
  return data || []
}

// ── Navigation ───────────────────────────────────────────────────────────────

export async function createNavigationItem(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("navigation_items").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateNavigationItem(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("navigation_items").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteNavigationItem(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("navigation_items").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getAllNavigationItems() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getAllNavigationItems:", error.message); return [] }
  return data || []
}

export async function updateNavigationOrder(items: { id: string; display_order: number }[]): Promise<Result<null>> {
  const supabase = await createClient()
  const results = await Promise.all(
    items.map((item) =>
      supabase.from("navigation_items").update({ display_order: item.display_order }).eq("id", item.id),
    ),
  )
  const firstError = results.find((r) => r.error)?.error
  if (firstError) return { data: null, error: errMessage(firstError) }
  return { data: null, error: null }
}

// ── Footer ───────────────────────────────────────────────────────────────────

export async function createFooterSection(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("footer_sections").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateFooterSection(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("footer_sections").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteFooterSection(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("footer_sections").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getAllFooterSections() {
  const supabase = await createClient()
  const { data: sections, error } = await supabase
    .from("footer_sections")
    .select("*")
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getAllFooterSections:", error.message); return [] }
  const { data: links, error: linksError } = await supabase
    .from("footer_links")
    .select("*")
    .order("display_order", { ascending: true })
  if (linksError) { console.error("[cms] getAllFooterSections links:", linksError.message); return [] }
  return (sections || []).map((s) => ({
    ...s,
    links: (links || []).filter((l) => l.section_id === s.id),
  }))
}

export async function createFooterLink(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("footer_links").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateFooterLink(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("footer_links").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteFooterLink(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("footer_links").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getFooterLinks(sectionId?: string) {
  const supabase = await createClient()
  let q = supabase.from("footer_links").select("*").order("display_order", { ascending: true })
  if (sectionId) q = q.eq("section_id", sectionId)
  const { data, error } = await q
  if (error) { console.error("[cms] getFooterLinks:", error.message); return [] }
  return data || []
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function getHomepageHero() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_hero")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle()
  if (error) { console.error("[cms] getHomepageHero:", error.message); return null }
  return data
}

export async function updateHomepageHero(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_hero")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function getHomepageSections() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("display_order", { ascending: true })
  if (error) { console.error("[cms] getHomepageSections:", error.message); return [] }
  return data || []
}

export async function updateHomepageSection(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_sections")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function createHomepageSection(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("homepage_sections").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteHomepageSection(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function updateHomepageSectionOrder(items: { id: string; display_order: number }[]): Promise<Result<null>> {
  const supabase = await createClient()
  const results = await Promise.all(
    items.map((item) =>
      supabase.from("homepage_sections").update({ display_order: item.display_order }).eq("id", item.id),
    ),
  )
  const firstError = results.find((r) => r.error)?.error
  if (firstError) return { data: null, error: errMessage(firstError) }
  return { data: null, error: null }
}

export async function getHomepageFeatured(sectionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_featured")
    .select("*")
    .eq("section_id", sectionId)
    .maybeSingle()
  if (error) { console.error("[cms] getHomepageFeatured:", error.message); return null }
  return data
}

export async function updateHomepageFeatured(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("homepage_featured")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function createHomepageFeatured(input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("homepage_featured").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteHomepageFeatured(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("homepage_featured").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Enquiries ────────────────────────────────────────────────────────────────

export async function updateEnquiry(id: string, status: string, notes?: string): Promise<Result<unknown>> {
  const supabase = await createClient()
  const updateData: Record<string, unknown> = { status }
  if (notes !== undefined) updateData.admin_notes = notes
  const { data, error } = await supabase
    .from("enquiries")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteEnquiry(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("enquiries").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function getEnquiries(opts?: { status?: string; limit?: number; search?: string }) {
  const supabase = await createClient()
  let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false })
  if (opts?.status && opts.status !== "all") q = q.eq("status", opts.status)
  if (opts?.search) q = q.or(`name.ilike.%${opts.search}%,email.ilike.%${opts.search}%,subject.ilike.%${opts.search}%`)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getEnquiries:", error.message); return [] }
  return data || []
}

export async function getEnquiryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("enquiries").select("*").eq("id", id).maybeSingle()
  if (error) { console.error("[cms] getEnquiryById:", error.message); return null }
  return data
}

// ── Admin users (admin_profiles view over profiles) ──────────────────────────

export async function getAllAdminProfiles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) { console.error("[cms] getAllAdminProfiles:", error.message); return [] }
  return data || []
}

export async function updateAdminUser(id: string, input: Record<string, unknown>): Promise<Result<unknown>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteAdminUser(id: string): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Activity logs ────────────────────────────────────────────────────────────

export async function getActivityLogs(opts?: { limit?: number; action?: string }) {
  const supabase = await createClient()
  let q = supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
  if (opts?.action && opts.action !== "all") q = q.eq("action", opts.action)
  if (opts?.limit) q = q.limit(opts.limit)
  const { data, error } = await q
  if (error) { console.error("[cms] getActivityLogs:", error.message); return [] }
  return data || []
}

// ── Dashboard stats (real counts, never fabricated) ──────────────────────────

export async function getDashboardStats() {
  const supabase = await createClient()

  const [
    articlesCount, publishedArticles, draftArticles,
    eventsCount, programmesCount, athletesCount, teamsCount,
    galleryCount, testimonialsCount, enquiriesCount, newEnquiriesCount,
    usersCount, recentArticles, recentEvents, recentEnquiries,
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("programmes").select("*", { count: "exact", head: true }),
    supabase.from("athletes").select("*", { count: "exact", head: true }),
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("gallery").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("id, title, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("events").select("id, title, event_date, status").order("created_at", { ascending: false }).limit(5),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5),
  ])

  return {
    articles: {
      total: articlesCount.count || 0,
      published: publishedArticles.count || 0,
      draft: draftArticles.count || 0,
    },
    events: eventsCount.count || 0,
    programmes: programmesCount.count || 0,
    athletes: athletesCount.count || 0,
    teams: teamsCount.count || 0,
    gallery: galleryCount.count || 0,
    testimonials: testimonialsCount.count || 0,
    enquiries: {
      total: enquiriesCount.count || 0,
      new: newEnquiriesCount.count || 0,
    },
    users: usersCount.count || 0,
    recentArticles: recentArticles.data || [],
    recentEvents: recentEvents.data || [],
    recentEnquiries: recentEnquiries.data || [],
  }
}

// ── Media (Supabase Storage) ─────────────────────────────────────────────────

export async function uploadMedia(
  file: File,
  bucket = "media",
): Promise<{ data: { url: string; path: string } | null; error: string | null }> {
  const supabase = await createClient()
  const ext = file.name.split(".").pop() || "bin"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { cacheControl: "3600", upsert: false })
  if (error) return { data: null, error: errMessage(error) }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { data: { url: urlData.publicUrl, path: data.path }, error: null }
}

export async function deleteMedia(path: string, bucket = "media"): Promise<Result<null>> {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}
