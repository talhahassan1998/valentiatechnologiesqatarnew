import { useEffect, useRef } from 'react'
import { gsap, useReducedMotion } from '@/lib/motion'
import { Section } from '@/components/ui/Primitives'
import { positioning } from '@/data/content'

/**
 * The statement immediately after the hero — establishes what the company is
 * before any capability detail. Words brighten in reading order as the line
 * enters.
 *
 * The brighten used to be scrubbed against scroll, which left words at 12%
 * opacity whenever a reader stopped mid-section (unreadable). It now plays
 * once, in sequence, when the line arrives. The three proof cards that sat
 * under it were cut: the hero lead already carries those facts.
 */
export function Positioning() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current || reduced) return
    const el = root.current

    const ctx = gsap.context(() => {
      // fromTo with immediateRender:false: the dim start state is only written
      // when the trigger fires, so a reader who lands below it sees full text.
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.12 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.03,
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  const leadWords = positioning.lead.split(' ').length

  return (
    <Section className="relative">
      <div ref={root}>
        <p className="text-h2 font-display mx-auto max-w-4xl text-center font-semibold text-white">
          {`${positioning.lead} ${positioning.rest}`.split(' ').map((w, i) => (
            <span
              key={`${w}-${i}`}
              data-word
              className={`inline-block ${i < leadWords ? 'text-v-crimson-400' : ''}`}
            >
              {w}&nbsp;
            </span>
          ))}
        </p>
      </div>
    </Section>
  )
}
