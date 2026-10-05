import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { CountUp } from '@/components/ui/CountUp'
import { RegionFlag } from '@/components/ui/RegionFlag'
import { clientProof, metrics } from '@/data/content'

export function Clients() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-reveal]', { stagger: 0.07 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section
      id="clients"
      className="relative overflow-hidden scroll-mt-24"
    >
      <SectionHeading
        title={clientProof.title}
        lead={clientProof.lead}
      />

      <div ref={root} className="mt-16">
        {/* The metrics are the section's proof, so they get the contained
            panel treatment the closing CTA uses — a bordered plate lit from
            two corners — rather than a full-bleed wash behind the whole
            section. Keeping the gradient inside a panel is what stops it
            reading as a tinted band across the page. */}
        <div
          data-reveal
          className="relative border-y border-v-ink-500/25"
        >

          {/* Hairline dividers between cells rather than a gap-px grid: the
              panel is one plate, so the cells read as divisions of it, not as
              separate cards floating on it.

              `divide-*` draws the rules between grid items for us and follows
              the column count at each breakpoint, so there is no per-index
              border arithmetic to get wrong when the grid reflows. */}
          <div className="relative grid divide-y divide-v-ink-500/25 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
            {metrics.map((m) => (
              <div key={m.label} className="px-8 py-10">
                <p className="text-h2 font-display font-semibold text-white">
                  <CountUp value={m.value} />
                </p>
                <p className="mt-3 text-sm leading-relaxed text-v-ink-300">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <h3 className="text-eyebrow font-semibold text-white">In service</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 border-t border-v-ink-500/25 pt-5 sm:grid-cols-2">
              {clientProof.proof.map((p) => (
                <li
                  key={p}
                  className="group flex items-start gap-3 text-sm leading-relaxed text-v-ink-300 transition-colors duration-300 hover:text-white"
                >
                  {/* The V-fold, marking each line. Decorative — the text
                      beside it carries the meaning. */}
                  <svg
                    className="mt-1.5 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                    width="10"
                    height="8"
                    viewBox="0 0 14 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 1L7 11L13 1" stroke="var(--color-v-blue-500)" strokeWidth="2" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="text-eyebrow font-semibold text-white">Where</h3>
            {/* flex-wrap, and whitespace-nowrap on each chip: the collection
                reflows rather than clipping, while a two-word region like
                "New Zealand" never breaks across lines. */}
            <ul className="mt-5 flex flex-wrap gap-2 border-t border-v-crimson-500/20 pt-5">
              {clientProof.regions.map((r) => (
                <li
                  key={r}
                  className="group flex items-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] border border-v-ink-500/35 px-3 py-2 text-xs text-v-ink-300 transition-colors duration-300 hover:border-v-blue-400 hover:bg-v-ink-800 hover:text-white"
                >
                  <span className="opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <RegionFlag region={r} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
