import { useEffect, useRef, useState } from 'react'
import { asset } from '@/lib/asset'

/*
 * Frame-sequence scrubber, adapted from the scroll-site-generator skill
 * (.claude/skills/scroll-site-generator/assets/useFrameSequence.ts).
 *
 * Loads public/frames/<name>/ (manifest.json + numbered WebP frames) and
 * exposes draw(canvas, progress). Compressed blobs stay resident (a couple of
 * MB); decoded frames live only in a sliding window around the playhead, so
 * scrubbing stays smooth without holding hundreds of MB of pixels.
 */

/** A decoded frame: ImageBitmap (fast path) or an <img> fallback. */
type Frame =
  | { kind: 'bitmap'; img: ImageBitmap }
  | { kind: 'element'; img: HTMLImageElement; url: string }

/**
 * createImageBitmap can throw in backgrounded tabs and some webviews; fall
 * back to an HTMLImageElement, which decodes everywhere. Both are drawImage
 * sources.
 */
async function decodeBlob(blob: Blob): Promise<Frame> {
  try {
    return { kind: 'bitmap', img: await createImageBitmap(blob) }
  } catch {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.decoding = 'async'
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('img decode failed'))
      img.src = url
    })
    return { kind: 'element', img, url }
  }
}

function releaseFrame(f: Frame) {
  if (f.kind === 'bitmap') f.img.close()
  else URL.revokeObjectURL(f.url)
}

export function useFrameSequence(name: string) {
  const blobs = useRef<(Blob | null)[]>([])
  const frames = useRef<Map<number, Frame>>(new Map())
  const decoding = useRef<Set<number>>(new Set())
  const count = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    const store = frames.current
    ;(async () => {
      const base = `frames/${name}/`
      const m: { count: number; pattern: string } = await fetch(asset(base + 'manifest.json')).then(
        (r) => r.json(),
      )
      if (!alive) return
      count.current = m.count
      blobs.current = new Array(m.count).fill(null)
      const url = (i: number) => asset(base + m.pattern.replace('%03d', String(i + 1).padStart(3, '0')))

      await Promise.all(
        Array.from({ length: m.count }, async (_, i) => {
          try {
            const b = await fetch(url(i)).then((r) => r.blob())
            if (alive) blobs.current[i] = b
          } catch {
            /* a missing frame falls back to its nearest neighbour */
          }
        }),
      )
      if (!alive) return
      setReady(true)
    })()
    return () => {
      alive = false
      store.forEach(releaseFrame)
      store.clear()
    }
  }, [name])

  function decode(i: number) {
    if (frames.current.has(i) || decoding.current.has(i) || !blobs.current[i]) return
    decoding.current.add(i)
    decodeBlob(blobs.current[i]!)
      .then((f) => frames.current.set(i, f))
      .catch(() => {})
      .finally(() => decoding.current.delete(i))
  }

  /** Decode ahead of and behind the playhead; evict far-away frames. */
  function manageWindow(center: number) {
    const AHEAD = 16
    const KEEP = 32
    for (let d = 0; d <= AHEAD; d++) {
      if (center + d < count.current) decode(center + d)
      if (center - d >= 0) decode(center - d)
    }
    if (frames.current.size > KEEP * 2) {
      for (const [idx, f] of frames.current) {
        if (Math.abs(idx - center) > KEEP) {
          releaseFrame(f)
          frames.current.delete(idx)
        }
      }
    }
  }

  function nearestDecoded(i: number): Frame | null {
    if (frames.current.has(i)) return frames.current.get(i)!
    for (let d = 1; d < count.current; d++) {
      if (frames.current.has(i - d)) return frames.current.get(i - d)!
      if (frames.current.has(i + d)) return frames.current.get(i + d)!
    }
    return null
  }

  /**
   * progress in [0,1] -> draw the matching frame, cover-fit. `focusY` moves
   * the frame's centre to that fraction of the canvas height (0.5 = centred),
   * so the subject can sit below overlaid copy; `zoom` < 1 shrinks it from
   * cover. Returns true only once the exact frame was painted — until then
   * the nearest decoded frame stands in, and the caller should keep asking.
   */
  function draw(canvas: HTMLCanvasElement | null, progress: number, focusY = 0.5, zoom = 1): boolean {
    if (!canvas || count.current === 0) return false
    const i = Math.round(Math.min(1, Math.max(0, progress)) * (count.current - 1))
    manageWindow(i)
    const frame = nearestDecoded(i)
    if (!frame) return false
    const src = frame.img

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cw = Math.round(canvas.clientWidth * dpr)
    const ch = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw
      canvas.height = ch
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    ctx.clearRect(0, 0, cw, ch)
    const s = Math.max(cw / src.width, ch / src.height) * zoom
    const w = src.width * s
    const h = src.height * s
    ctx.drawImage(src, (cw - w) / 2, ch * focusY - h / 2, w, h)
    return frames.current.has(i)
  }

  return { ready, draw }
}
