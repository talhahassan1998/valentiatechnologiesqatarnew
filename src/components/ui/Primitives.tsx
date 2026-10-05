import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, useReducedMotion } from '@/lib/motion'

type ButtonProps = {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({
  children,
  href = '#',
  variant = 'primary',
  className = '',
}: ButtonProps) {
  // Apple pill: flat, no shadow or sheen; the pill shape is the action
  // signal. Press scales down (btn-press). 44px tall for touch.
  const base =
    'btn-press inline-flex min-h-11 items-center justify-center rounded-full px-[1.375rem] text-base duration-200'

  const styles =
    variant === 'primary'
      ? 'bg-v-blue-600 text-on-brand hover:bg-v-blue-500'
      : 'border border-v-blue-400 text-v-blue-300 hover:bg-v-blue-600/8'

  // Internal hrefs must route, not reload — fixed here rather than at every
  // call site, since all buttons funnel through this one component.
  const internal = href.startsWith('/')
  const cls = `${base} ${styles} ${className}`
  const inner = <span>{children}</span>

  return internal ? (
    <Link to={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  // Apple's "tagline": the product-name line above a headline. Crimson is
  // Valentia's emphasis colour, used here once per page.
  return <p className="text-tagline font-semibold text-v-crimson-400">{children}</p>
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'center',
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'
  const head = useRef<HTMLDivElement>(null)
  const reducedHead = useReducedMotion()

  useEffect(() => {
    if (!head.current) return
    const el = head.current
    const ctx = gsap.context(() => {
      if (reducedHead) return
      // One timeline so the eyebrow, title and lead arrive as a sequence
      // rather than three independent triggers landing at the same instant.
      //
      // immediateRender:false on every tween, for the same reason
      // revealChildren sets it: the start state must not be written until the
      // trigger actually runs, or a heading the reader lands *below* (deep
      // link, refresh mid-page, scroll restore) is pinned at opacity 0 by a
      // trigger whose start is already behind them.
      const tl = gsap.timeline({
        defaults: { immediateRender: false },
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
      tl.fromTo(
        '[data-heading-eyebrow]',
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
      )
        .fromTo(
          '[data-heading-line]',
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power3.out' },
          '-=0.4',
        )
        .fromTo(
          '[data-heading-lead]',
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.65',
        )
    }, el)
    return () => ctx.revert()
  }, [reducedHead])

  return (
    <div ref={head} className={`flex flex-col gap-5 ${alignment} max-w-3xl`}>
      {eyebrow && (
        <div data-heading-eyebrow>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h2 className="text-h2 overflow-hidden text-white">
        <span data-heading-line className="block">{title}</span>
      </h2>
      {lead && (
        <p data-heading-lead className="text-lead max-w-2xl text-v-ink-400">
          {lead}
        </p>
      )}
    </div>
  )
}

export function Section({
  children,
  className = '',
  id,
  backdrop,
}: {
  children: ReactNode
  className?: string
  id?: string
  /**
   * Full-bleed layers painted behind the content. They belong here rather than in `children`: children are
   * wrapped in the max-w-7xl content column, so a backdrop passed there is
   * clipped to the text measure and its edge lands exactly on the copy, with
   * no margin between the two.
   */
  backdrop?: ReactNode
}) {
  return (
    <section id={id} className={`relative px-6 py-24 md:px-12 md:py-32 ${className}`}>
      {backdrop}
      {/* relative, so section content always stacks above the backdrop —
          those are absolutely positioned siblings, and without a stacking
          context here they would paint over the copy rather than behind it. */}
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  )
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: ReactNode
  lead: string
}) {
  const root = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!root.current) return
    const el = root.current
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        // fromTo, not from: an interrupted `from` leaves the element at the
        // start state — here, header copy stuck at opacity 0.
        .fromTo('[data-pagehero-line]', { yPercent: 110 }, { yPercent: 0, duration: 1 })
        .fromTo(
          '[data-pagehero-fade]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          '-=0.55',
        )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={root} className="px-6 pb-20 pt-32 text-center md:px-12 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-4xl">
        <div data-pagehero-fade>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1 className="text-h1 mt-3 overflow-hidden font-semibold text-white">
          <span data-pagehero-line className="block">{title}</span>
        </h1>
        <p data-pagehero-fade className="text-lead mx-auto mt-5 max-w-2xl text-v-ink-400">
          {lead}
        </p>
      </div>
    </section>
  )
}
