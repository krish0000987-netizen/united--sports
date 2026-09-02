# UnitedAthletes — Public Website + Admin CMS

One Next.js (App Router) application: the existing UnitedAthletes public website and a full admin CMS, both reading and writing a single Supabase project. Supabase is the single source of truth — content edited in the admin panel appears on the public site, and existing site content is seeded in the database and manageable from the admin.

---

## 1. Architecture

```
Public website (SSR)  ─┐
                       ├─▶ src/lib/cms/* ─▶ Supabase (Postgres + Auth + Storage) ─▶ RLS decides visibility
Admin panel (/admin)  ─┘
```

- **Public pages** render on the server via `src/lib/cms/server.ts` reads. Queries run under the caller's cookie session, so RLS guarantees anonymous visitors only ever see `published` rows.
- **Admin panel** (`/admin`) is guarded in `src/middleware.ts` (session check + redirect) and in the `(dashboard)` layout. All writes go through `src/lib/cms/admin-actions.ts`, which validates session + role, writes through Supabase (RLS enforced server-side), and records activity logs.
- **Client components** use `src/lib/cms/client-actions.ts` (browser Supabase client, RLS-scoped writes).
- **`src/lib/cms/data.ts`** re-exports `admin-actions` for server components (legacy import path kept working).

### Key files

| Path | Purpose |
| --- | --- |
| `src/lib/supabase/server.ts` | Cookie-bound SSR client (`@supabase/ssr`) + service-role admin client |
| `src/lib/supabase/client.ts` | Browser client |
| `src/lib/cms/server.ts` | All public reads (typed, status-filtered) |
| `src/lib/cms/admin-actions.ts` | All admin CRUD / publish / media / settings actions |
| `src/lib/cms/client-actions.ts` | Browser-side writes for client components |
| `src/lib/cms/types.ts` | DB row types + `Result<T>` contract |
| `src/middleware.ts` | Session refresh + `/admin` guard |
| `supabase/migrations/` | Reproducible schema, RLS, seed, catch-up migrations |

---

## 2. Supabase project setup

1. Create a project at [supabase.com](https://supabase.com).
2. Note the **Project URL**, **anon key**, and **service_role key** (Settings → API).
3. Link the CLI and push migrations:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push   # applies all migrations in order (idempotent design)
```

> If you are linking an existing/shared project (as this repo is), read the migrations first — `20260902000003_cms_alignment.sql` and `20260902000004_seed_catchup.sql` adapt remote drift (legacy `articles_categories` FK repoint, missing columns) and are safe to re-run.

---

## 3. Environment variables

Create `.env.local`:

```bash
# Required (browser-safe, exposed by design)
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

# Server-only. NEVER prefix with NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

For **Vercel**, add the same three variables in Project → Settings → Environment Variables. The service-role key is used only by `createAdminClient()` in `src/lib/supabase/server.ts` (server modules); it is never imported by anything reachable from the browser bundle. Do not commit `.env.local`.

---

## 4. Database migrations

Applied in filename order; all CMS migrations are idempotent (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`).

| Migration | What it does |
| --- | --- |
| `20260901000001_initial_schema.sql` | Core tables, indexes, triggers, base RLS |
| `20260901000002_seed_data.sql` | Initial content seed |
| `20260902000001_content_migration.sql` | Migrates the pre-existing site content into the DB |
| `20260902000002_rls_hardening.sql` | Tightens RLS, adds `public.is_admin()` / `is_super_admin()` |
| `20260902000003_cms_alignment.sql` | Creates `homepage_hero`, `homepage_sections` + featured picks; storage bucket `media` + storage policies; profiles trigger; `update_updated_at` trigger fn; utility functions |
| `20260902000004_seed_catchup.sql` | Creates `categories` + `team_athletes`, repoints `articles.category_id` FK to `categories`, adds `gallery.alt_text`, seeds all site content (nav, footer, programmes, athletes, teams, rosters, testimonials, events, 5 articles, 7 gallery items, site settings, hero, sections) |

---

## 5. Storage

Single public bucket **`media`** (5 MB limit, images only), created by the alignment migration with policies:

- Public `SELECT` (read) on `storage.objects` where `bucket_id = 'media'`
- `INSERT / UPDATE / DELETE` only when `public.is_admin()`

Uploads go through `/api/upload` (admin session required; validates session + role server-side, size/MIME validation, organised folder prefixes, returns public URL). Old files are removed when an admin replaces or deletes an image via the media library actions.

---

## 6. RLS policies

- **Anonymous / public**: `SELECT` only on CMS tables, and only rows where `status = 'published'` (or `is_active` for nav/footer). No inserts anywhere except `enquiries` (public contact form).
- **Admins** (`profiles.role IN ('super_admin','admin','editor')` and `is_active`): full CRUD on CMS tables via `public.is_admin()`.
- **Users & roles screens**: super_admin only (enforced in actions **and** RLS).
- **Storage**: public read of `media`, admin-only writes.

Verified live: anon `INSERT` → `42501 new row violates row-level security policy`; anon reads return published rows only.

---

## 7. Admin user creation

Admins are Supabase Auth users with a matching `profiles` row. The `on_auth_user_created` trigger auto-creates the profile (role `editor`) on sign-up.

**First admin (Dashboard method — recommended):**

1. Supabase Dashboard → Authentication → Users → **Add user** (email + password, **Auto-confirm user** ON).
2. Copy the new user's UID.
3. SQL Editor:

```sql
INSERT INTO profiles (id, user_id, name, email, role, is_active)
VALUES ('<uid>', '<uid>', 'Site Administrator', '<email>', 'super_admin', true)
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', is_active = true;
```

**Additional admins:** create them in-app at `/admin/users` (super_admin only) — it creates the auth user and profile in one step, with role and active flag.

---

## 8. Role management

| Role | Access |
| --- | --- |
| `super_admin` | Everything: users, roles, settings, activity logs, all content |
| `admin` | All content + enquiries + settings; no user management |
| `editor` | Content CRUD (articles, events, programmes, athletes, teams, testimonials, gallery, homepage, pages, navigation, footer); no users / settings / activity logs |

Enforced twice: in `admin-actions.ts` (session + role check before every write) and in Postgres RLS (`public.is_admin()` / `public.is_super_admin()`), so a forged browser request cannot bypass it.

---

## 9. Login process

1. Visit `/admin` → redirected to `/admin/login?redirect=/admin`.
2. Sign in with the admin email/password (Supabase Auth, persistent cookie session; middleware refreshes the session on every request).
3. The layout re-checks `profiles.is_active` — a deactivated account is signed out with a message.

---

## 10. CMS modules

Every action performs: validation → Supabase write → activity log → query invalidation → toast. Fake success is impossible — the `{ data, error }` result is checked and real errors surface in the UI.

| Module | Admin route |
| --- | --- |
| Dashboard (real counts, recent activity, quick actions) | `/admin` |
| Homepage hero + sections + featured picks | `/admin/homepage` |
| Pages | `/admin/pages` |
| Navigation (reorder, activate/deactivate, internal/external) | `/admin/navigation` |
| Footer sections + links | `/admin/footer` |
| Site settings (logo, contact, socials, SEO defaults) | `/admin/settings` |
| Articles (+ categories, publish/unpublish/archive, preview) | `/admin/articles` |
| Events | `/admin/events` |
| Programmes | `/admin/programmes` |
| Athletes | `/admin/athletes` |
| Teams (+ roster management) | `/admin/teams`, roster editor on `/admin/teams/[id]` |
| Testimonials | `/admin/testimonials` |
| Gallery / media library | `/admin/gallery`, `/admin/media` |
| Enquiries (status + internal notes) | `/admin/enquiries` |
| Admin users (super_admin) | `/admin/users` |
| Activity logs | `/admin/activity-logs` |

## 11. Publishing workflow

Content tables carry `status` (`draft` / `published` / `archived`). Public reads filter `status = 'published'`; admin lists show everything with status chips and Publish / Unpublish / Archive controls. Save Draft → Preview (public detail page opens) → Publish. Unpublish hides from the public site while the row stays manageable in admin.

## 12. Editing the homepage

`/admin/homepage` edits the live homepage:

- **Hero**: heading, subheading, two CTA buttons, background image, overlay, enable/disable.
- **Sections**: title / description / visibility / order per section, plus **featured picks** (which programmes, athletes, events, articles, testimonials appear) with ordering.

Changes render immediately on `/` — no code edits, no rebuilds.

## 13. Managing media

Upload via `/api/upload` from any image field or the media library. Files land in the `media` bucket with organised prefixes; the returned public URL is stored as the image reference in the relevant row. The library supports preview, search, delete (with file removal), copy URL, title / alt-text editing, categorisation.

## 14. Managing enquiries

The public contact form posts to `/api/enquiries`, which validates and inserts into `enquiries` (the only anon-writable table). `/admin/enquiries` lists / searches / filters them; the detail page supports status (new / contacted / resolved) and internal notes. Dashboard counts are real.

## 15. Production deployment (Vercel)

1. Push this repo to GitHub and import into Vercel.
2. Add the three environment variables from §3.
3. Build command `npm run build`; no special output configuration needed.
4. In Supabase → Authentication → URL Configuration, add `https://<your-domain>/admin/login` and `https://<your-domain>/admin` to redirect URLs.
5. Deploy.

---

## Verification performed

- `tsc --noEmit` — **0 errors**
- `npm run lint` — **0 errors** (28 pre-existing unused-import warnings)
- `npm run build` — **passes** (all routes compiled, incl. `/admin/*` and middleware)
- Live DB (linked Supabase project): migrations applied; anon-key REST reads return seeded rows from every CMS table; anon INSERT blocked by RLS (`42501`); published-only filtering confirmed (5 published articles)
- Live server smoke test: `/` and all listing + detail pages → **200**; `/admin` unauthenticated → **307 → `/admin/login?redirect=/admin`**; homepage `<h1>`, nav links, news title, programmes content all rendered **from the database**
