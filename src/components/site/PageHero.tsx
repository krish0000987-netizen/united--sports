import type { ReactNode } from "react"

import { Reveal } from "./Reveal"

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  alt,
  children,
}: {
  eyebrow: string
  title: ReactNode
  subtitle?: string
  image: string
  alt: string
  children?: ReactNode
}) {
  return (
    <section className="grain relative flex min-h-[48vh] sm:min-h-[58vh] items-end overflow-hidden pt-24 sm:pt-28 bg-navy-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-60 sm:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-10 sm:pt-16">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <div className="rule-gold mt-3 sm:mt-4" />
          <h1 className="mt-4 sm:mt-6 max-w-4xl text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] sm:leading-[0.95] tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
