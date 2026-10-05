import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Primitives'
import { hero } from '@/data/content'
import { gsap, ScrollTrigger, useIsCompact, useReducedMotion } from '@/lib/motion'
import { useFrameSequence } from '@/lib/useFrameSequence'
import { CURTAIN_UP, curtainIsUp } from '@/components/ui/Preloader'

/**
 * Home hero: a scroll-driven film of the logo, under one static message.
 *
 * The film (public/frames/hero, 121 frames) was generated with Higgsfield /
 * Kling from a render of the real 3D V, so the mark on screen is the logo's
 * own geometry:
 *   0.0 -> 0.5  particles stream in and assemble the V (a dissolve clip,
 *               played in reverse so it lands exactly on the logo)
 *   0.5 -> 1.0  slow camera push-in, pulses running along the vitals line
 *
 * The assembly plays by itself once the curtain lifts; the push-in is
 * scrubbed by scroll while the film stays pinned. Reduced motion shows the
 * settled logo frame and nothing moves.
 */
const SETTLED = 0.5

export function Hero() {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const compact = useIsCompact()
  const { ready, draw } = useFrameSequence('hero')
  // Playhead parts: the self-playing intro and the scroll-driven remainder.
  const intro = useRef({ value: 0 })
  const scroll = useRef(0)

  // Draw loop: runs on GSAP's ticker (shared with Lenis), but only paints when
  // the playhead moves or the target frame has not been decoded yet.
  useEffect(() => {
    if (!ready) return
    // The settled V sits below the copy: lower and a touch smaller on desktop.
    const focusY = compact ? 0.78 : 0.79
    const zoom = compact ? 1 : 0.8
    let painted = -1
    const render = () => {
      // Intro owns 0 -> 0.5; once the reader scrolls, scroll owns 0.5 -> 1
      // (and a scroll before the intro finishes simply takes over).
      const shown = reduced
        ? SETTLED
        : scroll.current > 0
          ? Math.max(intro.current.value, SETTLED + scroll.current * (1 - SETTLED))
          : intro.current.value
      if (shown === painted) return
      if (draw(canvas.current, shown, focusY, zoom)) painted = shown
    }
    render()
    gsap.ticker.add(render)
    const onResize = () => {
      painted = -1
    }
    window.addEventListener('resize', onResize)
    return () => {
      gsap.ticker.remove(render)
      window.removeEventListener('resize', onResize)
    }
  }, [ready, reduced, compact, draw])

  useEffect(() => {
    if (!root.current) return

    // Reduced motion: no entrance, no film. Show the copy outright.
    if (reduced) {
      root.current
        .querySelectorAll<HTMLElement>('[data-enter-line], [data-enter-fade]')
        .forEach((n) => {
          n.style.opacity = '1'
          n.style.transform = 'none'
        })
      return
    }

    const el = root.current
    const ctx = gsap.context(() => {
      let entrance: gsap.core.Timeline | null = null
      const playEntrance = () => {
        if (entrance) return
        // fromTo, not from: an interrupted `from` leaves the headline stranded
        // below its overflow-hidden mask.
        entrance = gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-enter-line]', { yPercent: 115 }, { yPercent: 0, duration: 1.05, stagger: 0.08 })
          .fromTo(
            '[data-enter-fade]',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
            '-=0.6',
          )
          // The logo assembles itself as the copy arrives.
          .to(intro.current, { value: SETTLED, duration: 2.6, ease: 'power2.inOut' }, 0.1)
      }
      if (curtainIsUp()) playEntrance()
      else window.addEventListener(CURTAIN_UP, playEntrance, { once: true })
      const fallback = window.setTimeout(playEntrance, 2600)

      // The push-in follows the scroll while the film is pinned.
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scroll.current = self.progress
        },
      })

      return () => {
        window.removeEventListener(CURTAIN_UP, playEntrance)
        window.clearTimeout(fallback)
        entrance?.progress(1).kill()
      }
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    // Tall wrapper = scroll length for the push-in; the stage inside sticks.
    <div ref={root} className={`force-dark relative bg-v-ink-900 ${reduced ? '' : 'h-[220svh]'}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Side fades: at reduced zoom the frame is narrower than the viewport,
            so its edges dissolve into the ground instead of cutting off. */}
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-hidden="true"
        />

        {/* Legibility scrim, weighted to the top where the centred copy sits
            above the mark. Also hides the frame's top edge when it is shifted
            down behind the copy. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-v-ink-900 via-v-ink-900/85 via-30% to-transparent to-55%"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-v-ink-900"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 top-0 px-6 pt-24 md:px-12 md:pt-28">
          <div className="mx-auto w-full max-w-4xl text-center">
            <p data-enter-fade className="text-tagline font-semibold text-v-crimson-400">
              {hero.kicker}
            </p>

            <h1 className="text-display mt-3 font-semibold text-white">
              <span className="block overflow-hidden pb-1">
                <span data-enter-line className="block">
                  {hero.title}
                </span>
              </span>
            </h1>

            <p data-enter-fade className="text-lead mx-auto mt-5 max-w-2xl text-v-ink-300">
              {hero.lead}
            </p>

            <div data-enter-fade className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact">Get in Touch</Button>
              <Button href="/solutions" variant="ghost">
                Explore Solutions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
