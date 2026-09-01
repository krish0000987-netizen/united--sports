export type ArticleStatus = "draft" | "published" | "archived"
export type EventStatus = "upcoming" | "live" | "completed" | "cancelled"
export type ProgrammeStatus = "draft" | "published" | "archived"
export type AthleteStatus = "active" | "inactive" | "retired"
export type TeamStatus = "active" | "inactive"
export type TestimonialStatus = "active" | "archived"
export type GalleryStatus = "active" | "archived"
export type EnquiryStatus = "new" | "contacted" | "resolved"
export type PageStatus = "draft" | "published" | "archived"
export type AdminRole = "super_admin" | "admin" | "editor"

export interface SiteSettings {
  id: string
  site_name: string
  logo_url: string | null
  favicon_url: string | null
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  whatsapp: string | null
  facebook_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  primary_color: string | null
  secondary_color: string | null
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string | null
  excerpt: string | null
  featured_image: string | null
  meta_title: string | null
  meta_description: string | null
  status: PageStatus
  created_at: string
  updated_at: string
}

export interface ArticleCategory {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image: string | null
  author_id: string | null
  category_id: string | null
  status: ArticleStatus
  published_at: string | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: ArticleCategory | null
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  event_date: string
  start_time: string
  end_time: string
  location: string | null
  featured_image: string | null
  registration_url: string | null
  status: EventStatus
  created_at: string
  updated_at: string
}

export interface Programme {
  id: string
  title: string
  slug: string
  description: string | null
  image: string | null
  content: string | null
  status: ProgrammeStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface Athlete {
  id: string
  name: string
  slug: string
  photo: string | null
  sport: string | null
  category: string | null
  biography: string | null
  achievements: string | null
  nationality: string | null
  status: AthleteStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  slug: string
  sport: string | null
  description: string | null
  logo: string | null
  cover_image: string | null
  status: TeamStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  name: string
  slug: string
  role: string | null
  photo: string | null
  quote: string
  status: TestimonialStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  title: string | null
  slug: string | null
  image_url: string
  description: string | null
  category: string | null
  status: GalleryStatus
  display_order: number
  created_at: string
  updated_at: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: EnquiryStatus
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  admin_user_id: string | null
  admin_email: string | null
  action: string
  entity_type: string
  entity_id: string | null
  description: string | null
  created_at: string
}

export interface HomepageSection {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  description: string | null
  content: Record<string, unknown>
  is_visible: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  parent_id: string | null
  is_external: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface FooterSection {
  id: string
  title: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  links?: FooterLink[]
}

export interface FooterLink {
  id: string
  section_id: string
  label: string
  href: string
  is_external: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface AdminProfile {
  id: string
  user_id: string
  email: string | null
  full_name: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
  updated_at: string
}