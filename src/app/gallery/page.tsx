import { getGalleryItemsServer } from "@/lib/cms/server"
import PublicShell from "@/components/site/PublicShell"
import { PageHero } from "@/components/site/PageHero"
import { Reveal } from "@/components/site/Reveal"

export const revalidate = 60

export const metadata = {
  title: "Gallery",
  description: "Moments captured from UnitedAthletes events, training, and community life.",
}

export default async function GalleryPage() {
  const items = await getGalleryItemsServer({ status: "published" })
  const categories = [...new Set(items.map((g) => g.category).filter(Boolean))] as string[]

  return (
    <PublicShell>
      <PageHero
        eyebrow="Gallery"
        title={<>Moments <span className="text-gold-gradient">Captured</span></>}
        subtitle="A look at our events, athletes, training sessions, and community moments."
        image="/assets/equipment.jpg"
        alt="Premium sports equipment on a dark surface"
      />

      <section className="mx-auto max-w-7xl px-5 py-24">
        {items.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Gallery photos will be published soon.
          </p>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-3">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {items.map((g, i) => (
                <Reveal key={g.id} delay={i * 40}>
                  <figure className="group relative aspect-square overflow-hidden rounded-sm border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.image_url}
                      alt={g.alt_text || g.title || "Gallery image"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {(g.title || g.category) && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/95 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {g.title && (
                          <p className="line-clamp-1 font-display text-sm">{g.title}</p>
                        )}
                        {g.category && (
                          <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary">
                            {g.category}
                          </p>
                        )}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </PublicShell>
  )
}
