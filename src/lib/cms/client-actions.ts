// ============================================================================
// Browser-side admin CRUD actions ("use client" safe).
//
// Client admin components import from here. Every action runs under the
// signed-in admin's Supabase session; RLS enforces permissions server-side.
// Same { data, error } contract as the server admin-actions module.
// ============================================================================

import { createClient } from "@/lib/supabase/client"

export type Result<T = Record<string, unknown>> = { data: (T & { id: string }) | null; error: string | null }

function errMessage(e: { message?: string } | null): string {
  return e?.message || "Something went wrong. Please try again."
}

// ── Who am I / activity logging ──────────────────────────────────────────────

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
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

export async function createActivityLog(input: {
  admin_user_id: string | null
  admin_email: string | null
  action: string
  entity_type: string
  entity_id: string | null
  description?: string | null
}) {
  try {
    const supabase = createClient()
    await supabase.from("activity_logs").insert({
      admin_user_id: input.admin_user_id,
      admin_email: input.admin_email,
      action: input.action,
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      description: input.description || null,
    })
  } catch {
    // best-effort
  }
}

// ── Site settings ────────────────────────────────────────────────────────────

export async function updateSiteSettings(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data: settings } = await supabase
    .from("site_settings")
    .select("id")
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

export async function createArticle(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("articles").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateArticle(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("articles").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteArticle(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("articles").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
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

export async function createCategory(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("categories").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateCategory(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("categories").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteCategory(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
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

export async function createEvent(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("events").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateEvent(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("events").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteEvent(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishEvent(id: string) {
  return updateEvent(id, { status: "published" })
}

export async function unpublishEvent(id: string) {
  return updateEvent(id, { status: "draft" })
}

// ── Programmes ───────────────────────────────────────────────────────────────

export async function createProgramme(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("programmes").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateProgramme(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("programmes").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteProgramme(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("programmes").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishProgramme(id: string) {
  return updateProgramme(id, { status: "published" })
}

export async function unpublishProgramme(id: string) {
  return updateProgramme(id, { status: "draft" })
}

// ── Athletes ─────────────────────────────────────────────────────────────────

export async function createAthlete(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("athletes").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateAthlete(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("athletes").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteAthlete(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("athletes").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishAthlete(id: string) {
  return updateAthlete(id, { status: "published" })
}

export async function unpublishAthlete(id: string) {
  return updateAthlete(id, { status: "draft" })
}

// ── Teams ────────────────────────────────────────────────────────────────────

export async function createTeam(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("teams").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateTeam(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("teams").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteTeam(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("teams").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishTeam(id: string) {
  return updateTeam(id, { status: "published" })
}

export async function unpublishTeam(id: string) {
  return updateTeam(id, { status: "draft" })
}

// ── Team roster ──────────────────────────────────────────────────────────────

export async function addTeamAthlete(teamId: string, athleteId: string, displayOrder = 0): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("team_athletes")
    .insert({ team_id: teamId, athlete_id: athleteId, display_order: displayOrder })
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function removeTeamAthlete(teamId: string, athleteId: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase
    .from("team_athletes")
    .delete()
    .eq("team_id", teamId)
    .eq("athlete_id", athleteId)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Testimonials ─────────────────────────────────────────────────────────────

export async function createTestimonial(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("testimonials").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateTestimonial(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("testimonials").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteTestimonial(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("testimonials").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishTestimonial(id: string) {
  return updateTestimonial(id, { status: "published" })
}

export async function unpublishTestimonial(id: string) {
  return updateTestimonial(id, { status: "draft" })
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export async function createGalleryItem(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("gallery").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateGalleryItem(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("gallery").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteGalleryItem(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("gallery").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function publishGalleryItem(id: string) {
  return updateGalleryItem(id, { status: "published" })
}

export async function unpublishGalleryItem(id: string) {
  return updateGalleryItem(id, { status: "draft" })
}

// ── CMS Pages ────────────────────────────────────────────────────────────────

export async function createCmsPage(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("pages").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateCmsPage(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("pages").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteCmsPage(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("pages").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Navigation ───────────────────────────────────────────────────────────────

export async function createNavigationItem(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("navigation_items").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateNavigationItem(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("navigation_items").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteNavigationItem(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("navigation_items").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Footer ───────────────────────────────────────────────────────────────────

export async function createFooterSection(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("footer_sections").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateFooterSection(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("footer_sections").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteFooterSection(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("footer_sections").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

export async function createFooterLink(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("footer_links").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateFooterLink(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("footer_links").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteFooterLink(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("footer_links").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Homepage ─────────────────────────────────────────────────────────────────

export async function updateHomepageHero(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("homepage_hero")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function updateHomepageSection(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("homepage_sections")
    .update(input)
    .eq("id", id)
    .select()
    .single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function createHomepageSection(input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("homepage_sections").insert(input).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteHomepageSection(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Enquiries ────────────────────────────────────────────────────────────────

export async function updateEnquiry(id: string, status: string, notes?: string): Promise<Result> {
  const supabase = createClient()
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

export async function deleteEnquiry(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("enquiries").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}

// ── Admin users ──────────────────────────────────────────────────────────────

export async function updateAdminUser(id: string, input: Record<string, unknown>): Promise<Result> {
  const supabase = createClient()
  const { data, error } = await supabase.from("profiles").update(input).eq("id", id).select().single()
  if (error) return { data: null, error: errMessage(error) }
  return { data, error: null }
}

export async function deleteAdminUser(id: string): Promise<Result<never>> {
  const supabase = createClient()
  const { error } = await supabase.from("profiles").delete().eq("id", id)
  if (error) return { data: null, error: errMessage(error) }
  return { data: null, error: null }
}
