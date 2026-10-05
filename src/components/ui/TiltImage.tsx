import { useEffect, useRef } from 'react'
import { gsap, parallax, useReducedMotion } from '@/lib/motion'
import { asset } from '@/lib/asset'

/**
 * A product illustration that answers the pointer: it tilts toward the
 * cursor in 3D and lifts slightly, and drifts a little against the scroll.
 *
 * The tilt is written straight to style.transform from the pointer event —
 * never React state — so it tracks at frame rate without re-rendering.
 * Under reduced motion it is a still image.
 */
export function TiltImage({
  src,
  className = '',
  drift = 36,
}: {
  src: string
  className?: string
  /** Scroll parallax distance in px; 0 to disable. */
  drift?: number
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = wrap.current
    if (!el || reduced || !drift) return
    const ctx = gsap.context(() => parallax(el, drift), el)
    return () => ctx.revert()
  }, [reduced, drift])

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !img.current || !wrap.current) return
    const r = wrap.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    img.current.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px) scale(1.04)`
  }

  const onLeave = () => {
    if (img.current) img.current.style.transform = ''
  }

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`illo select-none ${className}`}
      aria-hidden="true"
    >
      <img
        ref={img}
        src={asset(src)}
        alt=""
        width="960"
        height="720"
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-auto w-full transition-transform duration-500 ease-[var(--ease-brand)] will-change-transform"
      />
    </div>
  )
}
