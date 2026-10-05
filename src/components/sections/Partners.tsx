import { useEffect, useRef } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { partners, partnersIntro } from '@/data/content'
import { asset } from '@/lib/asset'

/**
 * Technology partners — a continuous marquee.
 *
 * The list is rendered twice and the track slides by half its width on a CSS
 * loop (see PARTNER MARQUEE in index.css), so it repeats endlessly with no
 * seam. Hover or focus pauses it; reduced motion stops it and leaves a
 * hand-scrollable row.
 */
export function Partners() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 })
        return
      }
      // fromTo, not from: an interrupted `from` would leave the rail invisible.
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <Section id="partners" className="relative overflow-hidden scroll-mt-24">
      <div className="flex flex-col items-center gap-8">
        <SectionHeading title="Technology partners" lead={partnersIntro} />
      </div>

      {/* Masked at both edges so cards dissolve rather than being cut off by
          a hard boundary. */}
      <div
        ref={root}
        role="region"
        aria-label="Technology partners"
        className="partner-rail relative mt-16 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div className="partner-track flex w-max items-stretch">
          {[0, 1].map((copy) =>
            partners.map((p) => (
              // The second copy only exists to close the loop; hide it from
              // assistive tech so each partner is announced once.
              <article
                key={`${copy}-${p.name}`}
                aria-hidden={copy === 1 || undefined}
                className="partner-card px-3"
              >
                <PartnerCard partner={p} />
              </article>
            )),
          )}
        </div>
      </div>
    </Section>
  )
}

/**
 * One partner. The logo plate stays white in both themes — the supplied PNGs
 * are opaque artwork on white and would sit on a visible box otherwise.
 */
function PartnerCard({ partner }: { partner: (typeof partners)[number] }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-v-ink-500/40 bg-v-ink-800">
      {/* Square by design — the card above clips it with overflow-hidden, so
          the plate inherits the card's corners without its own radius. */}
      <div className="flex h-40 items-center justify-center bg-on-brand px-5 py-5">
        <img
          src={asset(partner.logo)}
          alt={partner.name}
          width="324"
          height="144"
          // Eager: the marquee brings every logo into view within one loop,
          // and a lazy one would slide in as an empty plate.
          loading="eager"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-h3 text-white">{partner.name}</h3>
        <p className="text-sm leading-relaxed text-v-ink-300">{partner.body}</p>
      </div>
    </div>
  )
}
