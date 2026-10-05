import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { voiceAssistant as copy } from '@/data/content'
import { askAssistant } from '@/lib/gemini'
import { parseWake } from '@/lib/voiceIntent'

const WAKE_KEY = 'jarvis-wake'

// lib.dom ships the SpeechRecognition event types but not the constructor
// (it is still prefixed in Chromium and Safari), so declare just what we use.
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition
const SR: RecognitionCtor | undefined =
  typeof window === 'undefined'
    ? undefined
    : ((window as unknown as { SpeechRecognition?: RecognitionCtor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: RecognitionCtor }).webkitSpeechRecognition)

type Status = 'idle' | 'listening' | 'thinking' | 'speaking'

/**
 * Floating mic orb. Click once to start a conversation — it keeps listening
 * until clicked again. Optional wake-word mode listens for "Hey Jarvis".
 * The mic is paused while an answer is fetched and spoken, otherwise it would
 * transcribe its own voice and answer itself.
 */
export function VoiceAssistant() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [talking, setTalking] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [heard, setHeard] = useState('')
  const [reply, setReply] = useState<string>(copy.prompt)
  const [typed, setTyped] = useState('')
  const [wake, setWake] = useState(() => {
    try {
      return !!SR && localStorage.getItem(WAKE_KEY) === '1'
    } catch {
      return false
    }
  })

  // Recogniser and speech callbacks outlive the render that created them, so
  // everything they read lives in refs.
  const rec = useRef<Recognition | null>(null)
  const panel = useRef<HTMLDivElement>(null)
  const talkRef = useRef(false)
  const wakeRef = useRef(wake)
  const busy = useRef(false) // thinking or speaking: mic paused
  const awaiting = useRef(false) // heard "Hey Jarvis" alone, next phrase is the question
  const askId = useRef(0)
  const navRef = useRef(navigate)
  useEffect(() => {
    navRef.current = navigate
  }, [navigate])

  const stopRec = () => {
    const r = rec.current
    rec.current = null
    r?.abort()
  }

  /** (Re)start the mic in whatever mode is wanted right now. */
  const run = () => {
    stopRec()
    const mode = talkRef.current ? 'talk' : wakeRef.current ? 'wake' : null
    if (!mode || busy.current || !SR) {
      if (!busy.current) setStatus('idle')
      return
    }
    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = false
    r.continuous = true
    r.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript.trim()
      if (!text) return
      if (mode === 'talk' || awaiting.current) {
        awaiting.current = false
        return void ask(text)
      }
      const cmd = parseWake(text)
      if (cmd === null) return
      setOpen(true)
      if (cmd) return void ask(cmd)
      awaiting.current = true
      setStatus('listening')
    }
    r.onerror = (e) => {
      if (e.error !== 'not-allowed' && e.error !== 'service-not-allowed') return
      setReply(copy.micDenied)
      talkRef.current = false
      setTalking(false)
      toggleWake(false)
    }
    // Chrome ends a session after a silence even in continuous mode.
    r.onend = () => {
      if (rec.current !== r) return
      rec.current = null
      // ponytail: fixed 300ms restart delay, back off if Chrome starts rate-limiting
      setTimeout(() => {
        if (!rec.current && !busy.current) run()
      }, 300)
    }
    rec.current = r
    r.start()
    setStatus(mode === 'talk' ? 'listening' : 'idle')
  }

  const ask = async (text: string) => {
    const id = ++askId.current
    busy.current = true
    stopRec()
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    setHeard(text)
    setStatus('thinking')
    const intent = await askAssistant(text)
    if (id !== askId.current) return // a newer question overtook this one
    setReply(intent.reply)
    if (intent.to) navRef.current(intent.to)

    const done = () => {
      if (id !== askId.current) return
      busy.current = false
      run()
    }
    if (!('speechSynthesis' in window)) return done()
    const u = new SpeechSynthesisUtterance(intent.reply)
    u.onend = done
    u.onerror = done
    setStatus('speaking')
    speechSynthesis.speak(u)
  }

  const toggleTalk = () => {
    const on = !talkRef.current
    talkRef.current = on
    setTalking(on)
    if (on) setOpen(true)
    // Stopping mid-answer: silence it and hand the mic back to wake mode.
    askId.current++
    busy.current = false
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    run()
  }

  const toggleWake = (on: boolean) => {
    wakeRef.current = on
    setWake(on)
    try {
      localStorage.setItem(WAKE_KEY, on ? '1' : '0')
    } catch {
      // Private mode: the toggle still works for this visit.
    }
    if (on) setReply(copy.wakeOn)
    if (!busy.current) run()
  }

  const close = () => {
    talkRef.current = false
    setTalking(false)
    askId.current++
    busy.current = false
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    setOpen(false)
    run() // keeps the wake listener if it is on
  }

  useEffect(() => {
    if (!open) return
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Resume always-listening on later visits (mic permission is remembered);
  // release the mic on unmount.
  useEffect(() => {
    if (wakeRef.current) run()
    return () => {
      talkRef.current = false
      wakeRef.current = false
      stopRec()
    }
  }, [])

  const statusText =
    status === 'listening' ? copy.listening : status === 'thinking' ? copy.thinking : reply

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-label={copy.name}
          data-lenis-prevent
          className="w-[min(22rem,calc(100vw-2rem))] rounded-[var(--radius-md)] outline-none border border-v-ink-500/35 bg-v-ink-800 p-4 shadow-lg"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-eyebrow font-semibold text-white">
              {copy.name}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-3 -mt-3 flex h-11 w-11 items-center justify-center text-v-ink-300 transition-colors hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {heard && <p className="mb-2 text-sm text-v-ink-400">“{heard}”</p>}
          <p aria-live="polite" className="text-sm text-v-ink-100">
            {statusText}
          </p>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!typed.trim()) return
              void ask(typed)
              setTyped('')
            }}
          >
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={copy.placeholder}
              aria-label={copy.placeholder}
              className="w-full rounded-[var(--radius-sm)] border border-v-ink-500/35 bg-v-ink-900 px-3 py-2 text-sm text-white placeholder:text-v-ink-400 focus:border-v-blue-400 focus:outline-none"
            />
          </form>
          {SR && (
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-v-ink-300">
              <input
                type="checkbox"
                checked={wake}
                onChange={(e) => toggleWake(e.target.checked)}
                className="accent-v-blue-600"
              />
              {copy.wakeToggle}
            </label>
          )}
        </div>
      )}

      <button
        type="button"
        aria-label={talking ? copy.stopLabel : copy.label}
        aria-pressed={talking}
        onClick={() => (SR ? toggleTalk() : (setOpen(true), setReply(copy.noMic)))}
        className={`relative flex h-14 w-14 items-center justify-center btn-press rounded-full text-on-brand shadow-lg transition-colors ${
          talking ? 'bg-v-crimson-600 hover:bg-v-crimson-500' : 'bg-v-blue-600 hover:bg-v-blue-500'
        }`}
      >
        {status === 'listening' && (
          <span className="absolute inset-0 rounded-full bg-v-crimson-500/60 motion-safe:animate-ping" />
        )}
        {wake && !talking && (
          // Always-listening indicator: the mic is live even when idle.
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-v-blue-600 bg-v-crimson-400" />
        )}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="relative">
          {talking ? (
            // Stop square while a conversation is live.
            <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" />
          ) : (
            <>
              <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M5 11a7 7 0 0 0 14 0M12 18v3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}
