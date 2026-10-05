import { useEffect, useRef, useState } from 'react'
import { gsap, revealChildren, useReducedMotion } from '@/lib/motion'
import { Section } from '@/components/ui/Primitives'
import { RevealText } from '@/components/ui/RevealText'
import { contactDetails } from '@/data/content'

/**
 * Enquiry form. Posts to Web3Forms, which emails the enquiry to the inbox the
 * access key is registered to. Reports failure honestly rather than pretending.
 */
export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // The heading has its own RevealText; this brings up the supporting copy and
  // the form, which previously appeared with no transition at all.
  useEffect(() => {
    if (!root.current) return
    const el = root.current
    if (reduced) {
      gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 })
      return
    }
    const ctx = gsap.context(() => revealChildren(el, '[data-reveal]', { stagger: 0.08 }), el)
    return () => ctx.revert()
  }, [reduced])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          access_key: contactDetails.web3formsKey,
          subject: `New enquiry from ${data.name}`,
          from_name: 'Valentia website',
        }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) throw new Error(body.message ?? `Request failed: ${res.status}`)
      setStatus('sent')
      setMessage('Thank you. We will be in touch shortly.')
      form.reset()
    } catch {
      setStatus('error')
      setMessage('We could not send that just now. Please try again, or email us directly.')
    }
  }

  // A faint filled ground under each field, so the form reads as a set of
  // inputs rather than floating rules, and the focused field lifts out of the
  // page instead of only changing its underline colour.
  const field =
    'w-full rounded-[var(--radius-md)] border border-v-ink-500 bg-v-ink-900 px-4 py-3 text-white placeholder:text-v-ink-400 transition-colors duration-200 focus:border-v-blue-400 focus:outline-none focus:ring-4 focus:ring-v-blue-400/20'

  return (
    <Section id="contact" className="">
      <div ref={root} className="grid gap-16 lg:grid-cols-[0.85fr_1fr]">
        <div>
          <RevealText
            as="h2"
            className="text-h1 text-white"
            lines={['Let’s talk about your', 'healthcare systems.']}
          />
          <p data-reveal className="text-lead mt-6 max-w-md text-v-ink-300">
            Tell us what you are working on. We will respond with a considered view, not a
            sales pitch.
          </p>

          <div data-reveal className="mt-10 flex flex-col gap-2 text-sm text-v-ink-400">
            <span className="text-eyebrow font-semibold text-white">Qatar</span>
            <span>Valentia Technologies</span>
            <span>Software Development</span>
          </div>
        </div>

        <form data-reveal onSubmit={onSubmit} className="flex flex-col gap-7">
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-eyebrow font-semibold text-v-ink-400">Name</span>
              <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-eyebrow font-semibold text-v-ink-400">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={field}
                placeholder="you@organisation.com"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-eyebrow font-semibold text-v-ink-400">
              Organisation <span className="normal-case tracking-normal">(optional)</span>
            </span>
            <input name="organisation" autoComplete="organization" className={field} placeholder="Hospital, clinic or company" />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-eyebrow font-semibold text-v-ink-400">
              What are you working on?
            </span>
            <textarea
              name="message"
              required
              rows={4}
              className={`${field} resize-none`}
              placeholder="A short description of the challenge or project"
            />
          </label>

          <div className="flex flex-wrap items-center gap-5">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-press min-h-11 rounded-full bg-v-blue-600 px-[1.375rem] text-base text-on-brand duration-200 hover:bg-v-blue-500 disabled:opacity-60"
            >
              {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
            </button>

            {message && (
              <p
                role="status"
                className={`text-sm ${status === 'error' ? 'text-v-crimson-400' : 'text-v-blue-300'}`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </Section>
  )
}
