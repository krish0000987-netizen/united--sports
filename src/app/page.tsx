import { Metadata } from 'next'
import Link from 'next/link'
import {
  getSiteSettingsServer,
  getHomepageHeroServer,
  getHomepageSectionsServer,
  getProgrammesServer,
  getAthletesServer,
  getEventsServer,
  getArticlesServer,
  getTestimonialsServer,
  getGalleryItemsServer,
} from '@/lib/cms/server'
import PublicShell from '@/components/site/PublicShell'
import { Reveal } from '@/components/site/Reveal'
import { ArrowRight, MapPin } from 'lucide-react'
import { formatDate } from '@/lib/format'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsServer()
  return {
    title: settings?.site_name || 'UnitedAthletes for India Foundation',
    description:
      settings?.description ||
      'Empowering athletes across India with opportunities, facilities, equipment and support.',
  }
}

// Section renderers keyed by section_key — each reads only published rows.
export default async function HomePage() {
  const [hero, sections, programmes, athletes, events, articles, testimonials, gallery] =
    await Promise.all([
      getHomepageHeroServer(),
      getHomepageSectionsServer(),
      getProgrammesServer({ status: 'published', limit: 6 }),
      getAthletesServer({ status: 'published', limit: 8 }),
      getEventsServer({ status: 'published', limit: 3 }),
      getArticlesServer({ status: 'published', limit: 3 }),
      getTestimonialsServer({ status: 'published', limit: 3 }),
      getGalleryItemsServer({ status: 'published', limit: 8 }),
    ])

  const visible = sections.filter((s) => s.is_visible)

  return (
    <PublicShell>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {hero && (
        <section className="grain relative flex min-h-[85vh] sm:min-h-[92vh] items-center overflow-hidden bg-navy-deep">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.background_image || "/assets/hero-athletes.jpg"}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40"
            style={{ opacity: hero.overlay_opacity ?? 0.6 }}
          />
          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
            <div>
              <p className="eyebrow">{hero.subheading || 'UnitedAthletes for India Foundation'}</p>
              <div className="rule-gold mt-3 sm:mt-4" />
              <h1 className="mt-4 sm:mt-6 max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] sm:leading-[0.95] tracking-tight">
                {hero.heading}
              </h1>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                {hero.button_text && hero.button_url && (
                  <Link
                    href={hero.button_url}
                    className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1 text-center"
                  >
                    {hero.button_text}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
                <Link
                  href="/programmes"
                  className="inline-flex items-center justify-center gap-3 rounded-sm border border-primary/50 px-6 sm:px-8 py-3.5 sm:py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:bg-primary/10 text-center"
                >
                  Explore Opportunities
                </Link>
              </div>

              <dl className="mt-12 sm:mt-16 grid max-w-2xl grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-border pt-6 sm:pt-8">
                {[
                  { k: "14+", v: "Sporting disciplines" },
                  { k: "6", v: "Core programmes" },
                  { k: "1", v: "Athlete-first promise" },
                ].map((s) => (
                  <div key={s.v}>
                    <dt className="font-display text-3xl sm:text-4xl text-primary">{s.k}</dt>
                    <dd className="mt-1 sm:mt-2 text-[0.7rem] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* ── CMS-managed sections ────────────────────────────────────────── */}
      {visible.map((section) => {
        switch (section.section_key) {
          case 'mission':
            return (
              <section key={section.id} className="border-y border-border bg-navy">
                <div className="mx-auto max-w-4xl px-5 py-24 text-center">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'Our Mission'}</p>
                    <div className="rule-gold mx-auto mt-4" />
                    <p className="mt-8 font-display text-3xl leading-[1.15] sm:text-4xl">
                      {section.title}
                      {section.description && (
                        <span className="text-gold-gradient"> {section.description}</span>
                      )}
                    </p>
                  </Reveal>
                </div>
              </section>
            )

          case 'about':
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-24">
                <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'About'}</p>
                    <div className="rule-gold mt-4" />
                    <h2 className="mt-6 text-4xl sm:text-5xl">{section.title}</h2>
                    {section.description && (
                      <p className="mt-6 leading-relaxed text-muted-foreground">{section.description}</p>
                    )}
                    <Link
                      href="/about"
                      className="group mt-8 inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em] text-primary"
                    >
                      More about us
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Reveal>
                  <Reveal delay={140}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/about-athlete.jpg"
                      alt="Indian badminton player mid-smash under a spotlight"
                      loading="lazy"
                      className="w-full rounded-sm object-cover shadow-[var(--shadow-lift)]"
                    />
                  </Reveal>
                </div>
              </section>
            )

          case 'what_we_do':
          case 'programmes':
            return (
              <section key={section.id} className="border-y border-border bg-navy">
                <div className="mx-auto max-w-7xl px-5 py-24">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'What We Do'}</p>
                    <div className="rule-gold mt-4" />
                    <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'Our Programmes'}</h2>
                    {section.description && (
                      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </Reveal>
                  <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {programmes.map((p, i) => (
                      <Reveal key={p.id} delay={i * 90}>
                        <Link
                          href={`/programmes/${p.slug}`}
                          className="surface-card group block h-full overflow-hidden rounded-sm transition-transform duration-500 hover:-translate-y-2"
                        >
                          {p.image && (
                            <div className="relative h-48 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.title}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-7">
                            <h3 className="text-xl">{p.title}</h3>
                            {p.description && (
                              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                {p.description}
                              </p>
                            )}
                            <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                              Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </section>
            )

          case 'events':
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-24">
                <Reveal>
                  <p className="eyebrow">{section.subtitle || 'Events'}</p>
                  <div className="rule-gold mt-4" />
                  <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'Upcoming events'}</h2>
                  {section.description && (
                    <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </Reveal>
                {events.length > 0 ? (
                  <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {events.map((e, i) => (
                      <Reveal key={e.id} delay={i * 90}>
                        <Link
                          href={`/events/${e.slug}`}
                          className="surface-card group flex h-full flex-col rounded-sm p-8 transition-transform duration-500 hover:-translate-y-2"
                        >
                          <span className="font-display text-lg text-primary">
                            {formatDate(e.event_date, 'long')}
                          </span>
                          <h3 className="mt-4 text-2xl">{e.title}</h3>
                          {e.location && (
                            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 shrink-0 text-primary" />
                              {e.location}
                            </p>
                          )}
                          <ArrowRight className="mt-auto h-6 w-6 pt-6 text-primary transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="mt-10 text-muted-foreground">New events will be announced soon.</p>
                )}
              </section>
            )

          case 'sports':
          case 'athletes':
            return (
              <section key={section.id} className="border-y border-border bg-navy">
                <div className="mx-auto max-w-7xl px-5 py-24">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'Athletes'}</p>
                    <div className="rule-gold mt-4" />
                    <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'Our Athletes'}</h2>
                    {section.description && (
                      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </Reveal>
                  {athletes.length > 0 && (
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {athletes.map((a, i) => (
                        <Reveal key={a.id} delay={i * 60}>
                          <Link
                            href={`/athletes/${a.slug}`}
                            className="surface-card group block h-full rounded-sm p-6 text-center transition-transform duration-500 hover:-translate-y-2"
                          >
                            {a.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={a.photo}
                                alt={a.name}
                                loading="lazy"
                                className="mx-auto h-24 w-24 rounded-full object-cover ring-2 ring-primary/40"
                              />
                            ) : (
                              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-navy-light font-display text-2xl text-primary ring-2 ring-primary/40">
                                {a.name.charAt(0)}
                              </div>
                            )}
                            <h3 className="mt-4 text-lg">{a.name}</h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-primary">{a.sport}</p>
                          </Link>
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )

          case 'news':
          case 'articles':
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-24">
                <Reveal>
                  <p className="eyebrow">{section.subtitle || 'News'}</p>
                  <div className="rule-gold mt-4" />
                  <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'Latest news & updates'}</h2>
                  {section.description && (
                    <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </Reveal>
                {articles.length > 0 ? (
                  <div className="mt-14 grid gap-8 md:grid-cols-3">
                    {articles.map((article, i) => (
                      <Reveal key={article.id} delay={i * 90}>
                        <Link
                          href={`/news/${article.slug}`}
                          className="surface-card group flex h-full flex-col rounded-sm p-8 transition-transform duration-500 hover:-translate-y-2"
                        >
                          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {formatDate(article.published_at)}
                          </span>
                          <h3 className="mt-4 text-2xl leading-tight group-hover:text-primary">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                              {article.excerpt}
                            </p>
                          )}
                          <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                            Read story <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="mt-10 text-muted-foreground">News and updates will be published soon.</p>
                )}
              </section>
            )

          case 'testimonials':
            return (
              <section key={section.id} className="border-y border-border bg-navy">
                <div className="mx-auto max-w-7xl px-5 py-24">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'Testimonials'}</p>
                    <div className="rule-gold mt-4" />
                    <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'What our community says'}</h2>
                  </Reveal>
                  {testimonials.length > 0 && (
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                      {testimonials.map((t, i) => (
                        <Reveal key={t.id} delay={i * 90}>
                          <figure className="surface-card h-full rounded-sm p-8">
                            <div className="rule-gold" />
                            <blockquote className="mt-6 text-sm leading-relaxed text-muted-foreground">
                              &ldquo;{t.quote}&rdquo;
                            </blockquote>
                            <figcaption className="mt-6">
                              <p className="font-display text-lg">{t.name}</p>
                              {t.role && (
                                <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-primary">{t.role}</p>
                              )}
                            </figcaption>
                          </figure>
                        </Reveal>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )

          case 'focus':
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-24">
                <Reveal>
                  <p className="eyebrow">{section.subtitle || 'Our Focus'}</p>
                  <div className="rule-gold mt-4" />
                  <h2 className="mt-6 max-w-2xl text-4xl sm:text-5xl">{section.title || 'Four pillars, one athlete'}</h2>
                </Reveal>
                <div className="mt-14 grid gap-8 md:grid-cols-2">
                  {[
                    { n: "01", title: "Athletes", text: "Supporting athletes in their journey from potential to performance.", img: "/assets/para-athlete.jpg", alt: "Indian para-athlete racing on a track" },
                    { n: "02", title: "Facilities", text: "Helping athletes access quality sports infrastructure and training environments.", img: "/assets/facility.jpg", alt: "Modern indoor sports arena" },
                    { n: "03", title: "Equipment", text: "Providing access to essential sports equipment and resources.", img: "/assets/equipment.jpg", alt: "Sports equipment" },
                    { n: "04", title: "Opportunities", text: "Creating pathways for athletes to showcase talent and pursue their goals.", img: "/assets/community.jpg", alt: "Athletes in a huddle" },
                  ].map((f, i) => (
                    <Reveal key={f.title} delay={i * 100}>
                      <article className="group relative h-[26rem] overflow-hidden rounded-sm border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.img}
                          alt={f.alt}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-[1200ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-8">
                          <span className="font-display text-sm tracking-[0.3em] text-primary">
                            {f.n}
                          </span>
                          <h3 className="mt-3 text-3xl">{f.title}</h3>
                          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            {f.text}
                          </p>
                        </div>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </section>
            )

          case 'sports_marquee':
          case 'marquee':
            return (
              <section key={section.id} className="overflow-hidden border-y border-border bg-navy py-20">
                <div className="mx-auto max-w-7xl px-5">
                  <Reveal>
                    <p className="eyebrow">{section.subtitle || 'Sports'}</p>
                    <div className="rule-gold mt-4" />
                    <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
                      {section.description || 'UnitedAthletes supports athletes across multiple sporting disciplines and creates opportunities from diverse backgrounds.'}
                    </p>
                  </Reveal>
                </div>
                <div className="mt-12 flex w-max marquee-track">
                  {[0, 1].map((dup) => (
                    <ul key={dup} className="flex items-center" aria-hidden={dup === 1}>
                      {[
                        "Cricket", "Football", "Badminton", "Tennis", "Athletics", "Swimming",
                        "Archery", "Basketball", "Hockey", "Wrestling", "Boxing", "Volleyball",
                        "Para-Sports", "And More",
                      ].map((s) => (
                        <li
                          key={`${dup}-${s}`}
                          className="flex items-center gap-8 whitespace-nowrap px-8 font-display text-3xl text-foreground/70 sm:text-5xl"
                        >
                          {s}
                          <span className="h-2 w-2 rotate-45 bg-primary" />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </section>
            )

          case 'gallery':
            return (
              <section key={section.id} className="mx-auto max-w-7xl px-5 py-24">
                <Reveal>
                  <p className="eyebrow">{section.subtitle || 'Gallery'}</p>
                  <div className="rule-gold mt-4" />
                  <h2 className="mt-6 text-4xl sm:text-5xl">{section.title || 'Moments captured'}</h2>
                </Reveal>
                {gallery.length > 0 && (
                  <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {gallery.map((g, i) => (
                      <Reveal key={g.id} delay={i * 40}>
                        <figure className="group relative aspect-square overflow-hidden rounded-sm border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={g.image_url}
                            alt={g.alt_text || g.title || 'Gallery image'}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </figure>
                      </Reveal>
                    ))}
                  </div>
                )}
              </section>
            )

          case 'cta': {
            const ctaContent = (section.content || {}) as Record<string, string>
            return (
              <section key={section.id} className="grain relative overflow-hidden border-y border-border">
                {ctaContent.background_image && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ctaContent.background_image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
                  </>
                )}
                <div className="relative mx-auto max-w-7xl px-5 py-24">
                  <Reveal>
                    <h2 className="max-w-3xl text-4xl sm:text-5xl">
                      {section.title}{' '}
                      <span className="text-gold-gradient">{section.description ?? ''}</span>
                    </h2>
                    {ctaContent.button_text && ctaContent.button_href && (
                      <Link
                        href={ctaContent.button_href}
                        className="group mt-10 inline-flex items-center gap-3 rounded-sm bg-primary px-8 py-4 text-sm font-extrabold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-300 hover:-translate-y-1"
                      >
                        {ctaContent.button_text}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}
                  </Reveal>
                </div>
              </section>
            )
          }

          default:
            return null
        }
      })}

      {!hero && visible.length === 0 && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-muted-foreground">Content will be added soon. Check back later!</p>
        </div>
      )}
    </PublicShell>
  )
}
