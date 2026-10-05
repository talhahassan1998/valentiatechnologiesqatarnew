// Relative .ts import (not '@/') so node can load this file directly in
// voiceIntent.test.mjs.
import {
  capabilities,
  contactDetails,
  positioning,
  products,
  sectors,
  voiceAssistant,
} from '../data/content.ts'

export type Intent = { reply: string; to?: string }

/** "Health Data & Analytics" -> ['health data', 'analytics'], so either half is heard. */
const phrases = (title: string) => title.toLowerCase().split(/\s*&\s*/)

/**
 * Maps one spoken or typed utterance to a reply and an optional route.
 * Keyword matching over content.ts, no model — ponytail: swap for an LLM
 * behind a proxy if free-form questions matter.
 */
export function resolveIntent(input: string): Intent {
  const text = input.toLowerCase().trim()
  const has = (p: string) => text.includes(p)

  if (!text) return { reply: voiceAssistant.fallback }
  if (/\b(help|what can you do|commands)\b/.test(text)) return { reply: voiceAssistant.help }

  const product = products.find((p) => has(p.title.toLowerCase()))
  if (product) return { reply: `${product.title}. ${product.body}`, to: `/solutions#${product.id}` }

  const sector = sectors.find((s) => has(s.name.toLowerCase()))
  if (sector) return { reply: `${sector.name}. ${sector.body}`, to: `/sectors#${sector.id}` }

  const cap = capabilities.find((c) => phrases(c.title).some(has))
  if (cap) return { reply: `${cap.title}. ${cap.body}`, to: `/services#${cap.id}` }

  const page = voiceAssistant.pages.find((p) => p.words.some(has))
  if (page?.to === '/contact') {
    return {
      reply: `You can email ${contactDetails.email} or call ${contactDetails.phone}. ${contactDetails.responseTime}`,
      to: page.to,
    }
  }
  if (page?.to === '/about') {
    return { reply: `${positioning.lead} ${positioning.rest}`, to: page.to }
  }
  if (page) return { reply: `Opening ${page.name}.`, to: page.to }

  if (/^(hi|hello|hey)\b/.test(text)) return { reply: voiceAssistant.greeting }
  return { reply: voiceAssistant.fallback }
}

/**
 * Wake-word check for always-listening mode. null = no wake word; '' = wake
 * word alone (wait for the command); otherwise the command said after it.
 * Recognisers often hear "jarvis" as "jervis" or "travis", hence the loose match.
 */
export function parseWake(input: string): string | null {
  const m = input.match(/\b(?:hey|hi|ok|okay)?\s*(?:jarvis|jervis|travis)\b[\s,.!?]*(.*)$/i)
  return m ? m[1].trim() : null
}
