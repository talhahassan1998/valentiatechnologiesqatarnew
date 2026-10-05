import {
  capabilities,
  clientProof,
  contactDetails,
  partners,
  positioning,
  products,
  sectors,
  voiceAssistant,
} from '@/data/content'
import { resolveIntent, type Intent } from '@/lib/voiceIntent'

// Public by the owner's choice: this ships in the bundle, so the key must be
// restricted to the site's domain and quota-capped in Google Cloud Console.
const KEY = import.meta.env.VITE_GEMINI_KEY as string | undefined
const API = 'https://generativelanguage.googleapis.com/v1beta/models'
// Flash is often briefly overloaded (503); lite is the spare.
const MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest']

/** Every route the model may send the visitor to; anything else is dropped. */
const ROUTES = [
  ...voiceAssistant.pages.map((p) => p.to),
  ...products.map((p) => `/solutions#${p.id}`),
  ...sectors.map((s) => `/sectors#${s.id}`),
  ...capabilities.map((c) => `/services#${c.id}`),
]

const SYSTEM = `You are ${voiceAssistant.name}, a helpful general-purpose voice assistant living on the Valentia Technologies website (healthcare software, Doha, Qatar).
Answer ANY question the visitor asks (general knowledge, news, weather, maths, advice, anything) like a smart assistant would. Use Google Search when it is available for anything current or factual.
Never give medical, legal or financial advice: no diagnoses, treatments, dosages or symptom assessments. For those, say briefly that you can't advise on that and suggest a qualified professional (or emergency services if it sounds urgent). Explaining what Valentia's software does in clinical settings is fine.
Replies are read aloud and shown on screen: one to three short sentences of plain text, no markdown, no lists, no URLs, no em dashes.
For questions about Valentia itself, use the site facts below and never invent company details; if they do not cover it, suggest the contact page.
Set "to" only when the visitor asks to go somewhere on this site or a specific page clearly answers them. It must be exactly one of: ${ROUTES.join(', ')}. Otherwise leave it out.
Today's date is ${new Date().toDateString()}.

SITE FACTS
${JSON.stringify({
  positioning: `${positioning.lead} ${positioning.rest}`,
  products: products.map(({ title, body, points }) => ({ title, body, points })),
  sectors: sectors.map(({ name, body, products }) => ({ name, body, products })),
  services: capabilities.map(({ title, body, points }) => ({ title, body, points })),
  clients: clientProof,
  partners: partners.map((p) => p.name),
  contact: {
    location: contactDetails.location,
    email: contactDetails.email,
    phone: contactDetails.phone,
    responseTime: contactDetails.responseTime,
  },
})}`

type Turn = { role: 'user' | 'model'; parts: { text: string }[] }
// Short rolling memory so follow-ups like "and how much does it cost?" work.
const history: Turn[] = []

// Google Search grounding has no free-tier quota. Try it, and after the first
// refusal stop asking for this page load — enabling billing turns it on.
let searchAllowed = true

/** Asks Gemini; falls back to keyword matching when there is no key or the call fails. */
export async function askAssistant(text: string): Promise<Intent> {
  if (!KEY) return resolveIntent(text)
  const turn: Turn = { role: 'user', parts: [{ text: text.slice(0, 500) }] }
  try {
    let res = await call(turn, searchAllowed, MODELS[0])
    if ((res.status === 429 || res.status === 400) && searchAllowed) {
      searchAllowed = false
      res = await call(turn, false, MODELS[0])
    }
    if (res.status === 503) res = await call(turn, searchAllowed, MODELS[1])
    if (!res.ok) throw new Error(`Gemini ${res.status}`)
    const data = await res.json()
    // Grounded answers can arrive split across several parts.
    const raw = (data.candidates[0].content.parts as { text?: string }[])
      .map((p) => p.text ?? '')
      .join('')
    const out = JSON.parse(raw) as Intent
    history.push(turn, { role: 'model', parts: [{ text: out.reply }] })
    history.splice(0, history.length - 10)
    return { reply: out.reply, to: out.to && ROUTES.includes(out.to) ? out.to : undefined }
  } catch (err) {
    console.warn('[jarvis] falling back to keywords:', err)
    const local = resolveIntent(text)
    // Keywords only cover site navigation; don't pretend a general question was misheard.
    return local.reply === voiceAssistant.fallback ? { reply: voiceAssistant.offline } : local
  }
}

function call(turn: Turn, search: boolean, model: string) {
  return fetch(`${API}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY! },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [...history, turn],
      ...(search && { tools: [{ google_search: {} }] }),
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: { reply: { type: 'STRING' }, to: { type: 'STRING' } },
          required: ['reply'],
        },
        // Voice needs speed over depth.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })
}
