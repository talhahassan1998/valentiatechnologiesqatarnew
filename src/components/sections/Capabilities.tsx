import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { revealChildren, gsap } from '@/lib/motion'
import { Button, Section, SectionHeading } from '@/components/ui/Primitives'
import { capabilities } from '@/data/content'

/**
 * Homepage teaser for /services: a compact two-column index, not a card grid.
 * The page already carries the suite map above it; a third wall of cards made
 * the three sections read as one repeated block. Each entry links through to
 * its expanded block on /services, anchored by the capability id.
 */
export function Capabilities() {
  const root = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-item]', { stagger: 0.06 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="technology" className="relative">
      <SectionHeading
        title="Software built for clinical reality"
        lead="Six disciplines that make up a working healthcare technology estate, engineered to interoperate, not to stand alone."
      />

      <ul ref={root} className="mt-14 grid gap-x-16 md:grid-cols-2">
        {capabilities.map((c) => (
          <li key={c.id} data-item className="border-t border-v-ink-500/25">
            <Link to={`/services#${c.id}`} className="group block py-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-h3 text-white">{c.title}</h3>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 text-v-blue-400 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M1 7h11M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-v-ink-300">{c.body}</p>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <Button href="/services" variant="ghost">
          Explore Services
        </Button>
      </div>
    </Section>
  )
}
