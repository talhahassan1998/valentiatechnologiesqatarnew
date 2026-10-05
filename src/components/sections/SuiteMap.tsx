import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap, revealChildren } from '@/lib/motion'
import { Button, Section, SectionHeading } from '@/components/ui/Primitives'
import { products, sectors, suiteMap } from '@/data/content'
import { asset } from '@/lib/asset'
import { TiltImage } from '@/components/ui/TiltImage'

const byId = new Map(products.map((p) => [p.id, p]))

// Maha serves oncology, which is not one of the five sectors; without its own
// row the "six platforms" heading would only show five.
const unsectored = products.filter((p) => !sectors.some((s) => s.products.includes(p.id)))

type Row = {
  key: string
  title: string
  href?: string
  illustration: string
  body: string
  platforms: string[]
}

const rows: Row[] = [
  ...sectors.map((s) => ({
    key: s.id,
    title: s.name,
    href: `/sectors#${s.id}`,
    illustration: s.illustration,
    body: s.body,
    platforms: s.products,
  })),
  ...unsectored.map((p) => ({
    key: p.id,
    title: 'Oncology',
    illustration: p.illustration,
    body: p.body,
    platforms: [p.id],
  })),
]

/**
 * Homepage view of the suite: each care setting with the platforms that serve
 * it. Replaces the separate Solutions (6 cards) and Sectors (5 cards) grids,
 * which listed the same six products twice and left the reader to join them.
 * The full detail stays on /solutions and /sectors.
 */
export function SuiteMap() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-row]', { stagger: 0.07 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="suite" className="relative scroll-mt-24">
      <SectionHeading title={suiteMap.title} lead={suiteMap.lead} />

      <div ref={root} className="mt-16 flex flex-col">
        {rows.map((s) => (
          <div
            key={s.key}
            data-row
            className="grid items-center gap-5 border-t border-v-ink-500/25 py-8 md:grid-cols-[9rem_minmax(0,1fr)_minmax(0,0.9fr)] md:gap-10"
          >
            <TiltImage src={s.illustration} drift={0} className="w-28 md:w-36" />
            <div>
              {s.href ? (
                <Link to={s.href} className="group inline-flex items-center gap-3 text-white">
                  <h3 className="text-h3 decoration-v-blue-400 decoration-1 underline-offset-[6px] group-hover:underline">
                    {s.title}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-h3 text-white">{s.title}</h3>
              )}
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-v-ink-300">{s.body}</p>
            </div>

            <ul className="flex flex-wrap content-start gap-2 md:justify-end">
              {s.platforms.map((id) => {
                const p = byId.get(id)
                if (!p) return null
                return (
                  <li key={id}>
                    <Link
                      to={`/solutions#${p.id}`}
                      className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-sm)] border border-v-ink-500/35 bg-v-ink-800 px-3.5 text-sm font-medium text-white transition-colors duration-300 hover:border-v-blue-400 hover:bg-v-ink-700"
                    >
                      <img src={asset(p.icon)} alt="" width="26" height="27" className="h-5 w-5" />
                      {p.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button href="/solutions" variant="ghost">
          Explore Solutions
        </Button>
      </div>
    </Section>
  )
}
