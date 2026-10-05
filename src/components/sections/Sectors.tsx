import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { products, sectors } from '@/data/content'
import { TiltImage } from '@/components/ui/TiltImage'

const productTitle = (id: string) => products.find((p) => p.id === id)?.title ?? id

/**
 * The five care settings. Each card states the problems the sector reports and
 * links to the products that answer them.
 */
export function Sectors({ compact = false }: { compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-sector]', { stagger: 0.08, scale: 0.97 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="sectors" className="relative overflow-hidden scroll-mt-24"
    >
      <SectionHeading
        title="Five settings, one standard"
        lead="Primary, supported living, out of hours, community and emergency care. Each has its own pressures, and its own platform."
      />

      {/* 6-col track: a row of three then a row of two, so five sectors leave no gap.
          ponytail: tuned for five; revisit the spans if the count changes. */}
      <div ref={root} className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {sectors.map((s, i) => (
          <div
            key={s.id}
            id={compact ? undefined : s.id}
            data-sector
            className={`group relative card-surface card-static p-8 md:p-10 lg:scroll-mt-24 ${
              i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
            } ${i === sectors.length - 1 && sectors.length % 2 ? 'md:col-span-2 lg:col-span-3' : ''}`}
          >
            <TiltImage src={s.illustration} drift={0} className="w-40" />
            <h3 className="text-h3 mt-5 text-white">{s.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-v-ink-300">{s.body}</p>

            {!compact && (
              <ul className="mt-7 flex flex-col gap-3 border-t border-v-crimson-500/20 pt-5">
                {s.challenges.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-v-ink-400">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 bg-v-crimson-500"
                      aria-hidden="true"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex flex-wrap gap-2">
              {s.products.map((id) => (
                <Link
                  key={id}
                  to={`/solutions#${id}`}
                  className="tap-target rounded-[var(--radius-sm)] border border-v-ink-500/35 px-3 py-2 text-xs text-v-ink-300 transition-colors duration-300 hover:border-v-blue-400 hover:bg-v-blue-600/10 hover:text-white"
                >
                  {productTitle(id)}
                </Link>
              ))}
            </div>

          </div>
        ))}
      </div>
    </Section>
  )
}
