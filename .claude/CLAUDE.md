# Valentia Technologies — working notes

Corporate site for Valentia Technologies (healthcare software, Qatar).
React 19 + TypeScript + Vite + Tailwind v4 + React Router 7, GSAP/ScrollTrigger,
Lenis. Hero film and illustrations generated with Higgsfield.

**Read `README.md` first** — stack, brand hexes, `src/` structure, routing
rules and deployment notes live there and are not repeated here.

## Commands

```bash
npm run dev      # vite, http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

Run `npm run build` before calling a change done — `tsc -b` is the only
typecheck in the pipeline. `npm run lint` is oxlint, not eslint.

## Rules that bite

- **Colour and type come from `src/styles/tokens.css`.** Single source of
  truth. Don't hardcode hexes or px sizes in components.
- **Copy lives in `src/data/content.ts`.** Don't inline strings in sections.
- **Scrolling goes through `scrollToTop()` / `scrollToAnchor()` in
  `src/lib/motion.ts`** — Lenis patches `window.scrollTo`, so anything else
  animates a full scroll through the outgoing page. Never add react-router's
  `<ScrollRestoration>`.
- **`RouteTransition` owns ScrollTrigger lifecycle.** Individual sections must
  not call `ScrollTrigger.refresh()` in their own cleanup.
- The home hero is a scroll-scrubbed frame film (`public/frames/hero/`, played
  by `src/lib/useFrameSequence.ts`), generated with Higgsfield from a render of
  the logo V. There is no Three.js any more; don't add it back for decoration.
- Deep-link rewrites are committed for both hosts (`vercel.json`,
  `public/_redirects`); keep them in sync if routes change.

## Skills

`.claude/skills/scroll-site-generator/` — builds cinematic scroll-driven
product pages (Higgsfield stills + Kling clips scrubbed frame-by-frame, then a
full brand page below). Its `.env` still holds the placeholder key; set
`HF_KEY` there before any generation run. Video generation costs real credits —
confirm with the user before starting one.
