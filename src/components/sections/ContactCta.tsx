import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, Button } from '@/components/ui/Primitives'

/**
 * Shared closing band. Every page ends somewhere; this is where.
 *
 * Apple's dark product tile: full-bleed near-black, one centred stack of
 * headline, line and pill, with the logo's V resting beneath it the way a
 * product sits under its name. The V is the logo's traced geometry (shared
 * with the favicon and the 3D hero), so it costs nothing to load.
 */
export function ContactCta({
  title = 'Let us look at your systems together.',
  lead = 'Tell us what you are working on. We will respond with a considered view, not a sales pitch.',
}: {
  title?: string
  lead?: string
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(
      () => revealChildren(el, '[data-cta]', { stagger: 0.09, y: 22, start: 'top 82%' }),
      el,
    )
    return () => ctx.revert()
  }, [])

  return (
    <Section className="force-dark bg-v-ink-800">
      <div ref={root} className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 data-cta className="text-h1 font-semibold text-white">
          {title}
        </h2>
        <p data-cta className="text-lead mt-5 max-w-2xl text-v-ink-400">
          {lead}
        </p>
        <div data-cta className="mt-8">
          <Button href="/contact">Get in Touch</Button>
        </div>

        <svg
          data-cta
          viewBox="4 8 56 48"
          className="mt-16 h-auto w-40 md:w-48"
          aria-hidden="true"
        >
          <path
            d="M6.00 16.40 L21.04 16.40 L35.03 43.36 L29.13 53.37 L26.78 53.37 L6.00 17.01 Z"
            fill="var(--color-v-blue-600)"
          />
          <path
            d="M42.80 10.63 L54.72 12.55 L58.00 16.40 L38.37 53.37 L30.06 53.37 L34.71 44.33 L47.99 18.71 L38.70 16.40 Z"
            fill="var(--color-v-crimson-600)"
          />
        </svg>
      </div>
    </Section>
  )
}
