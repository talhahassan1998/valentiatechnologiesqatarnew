import { useEffect, useRef } from 'react'
import { gsap, revealChildren } from '@/lib/motion'
import { Section, SectionHeading } from '@/components/ui/Primitives'
import { engagement } from '@/data/content'

export function Engagement() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => revealChildren(el, '[data-model]', { stagger: 0.09 }), el)
    return () => ctx.revert()
  }, [])

  return (
    <Section id="engagement" className=" bg-v-ink-950 scroll-mt-24">
      <SectionHeading
        title="Three ways we work with you"
        lead="Most engagements begin as one of these and grow into another. We would rather scope honestly than sell a programme you do not need."
      />

      <div ref={root} className="mt-16 grid gap-4 md:grid-cols-3">
        {engagement.map((e) => (
          <article
            key={e.model}
            data-model
            className="group card-surface card-surface-deep card-static p-8 md:p-10"
          >
            <h3 className="text-h3 text-white">{e.model}</h3>
            <p className="mt-4 text-sm leading-relaxed text-v-ink-300">{e.body}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
