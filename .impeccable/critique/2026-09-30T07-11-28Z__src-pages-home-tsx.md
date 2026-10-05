---
target: home page
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 4
timestamp: 2026-09-30T07-11-28Z
slug: src-pages-home-tsx
---
Method: dual-agent (A: design review · B: detector + browser) plus technical audit agent

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Hero caption and partner carousel auto-advance with no indicator or pause |
| 2 | Match System / Real World | 3 | Clinical vocabulary is concrete; "achieve excellence", "industry-leading" are boilerplate |
| 3 | User Control and Freedom | 2 | Hero loop cannot be stopped (WCAG 2.2.2); carousel pauses only on hover/focus |
| 4 | Consistency and Standards | 2 | Inner pages keep eyebrows; hero primary is "Explore Services", everywhere else "Get in Touch" |
| 5 | Error Prevention | 2 | Contact form has no required markers; +92 phone with no context |
| 6 | Recognition Rather Than Recall | 3 | Clear nav; card link affordance appears only on hover |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 2 | 17 near-identical cards in three consecutive grids; stats restated |
| 9 | Error Recovery | 2 | Native-only validation, no inline errors or aria-invalid |
| 10 | Help and Documentation | n/a | Persuade surface |
| **Total** | | **18/32** | **Acceptable (56%)** |

## Design Specificity Verdict
Half authored, half interchangeable. Specific: the 3D V-fold hero, the Digital Anatomy pinned layer diagram (the site's peak and the purest expression of "The Clinical Instrument"), the proof block. Interchangeable: Solutions (6) + Sectors (5) + Capabilities (6) as three consecutive identical 3-column card grids, and a boilerplate lower third. Detector (browser, 4 pages): radial-spotlight-glow x8 on home (section washes, page-hero glows, CTA panel; undocumented in DESIGN.md), low-contrast footer copyright (2.9:1 light, 2.0:1 dark), a leftover section eyebrow in DigitalAnatomy, width transition on the card hairline, heavy shadow on a static active partner card. False positives: Inter (documented brand font), hero kicker, primary button shadow, carousel off-screen slides, Industries heading rhythm.

## Priority Issues
- [P0] Contact channels undermine credibility: gmail.com address and +92 (Pakistan) phone/WhatsApp under "Doha, Qatar" (content.ts 612-614). Fix: domain email and +974 line, or label the number. Owner decision. Command: clarify.
- [P1] Rotating hero hides the value proposition and never stops; aria-live re-announces every cycle; hardcoded size bypasses text-display token. Fix: static H1 that says what Valentia does, one proof line, Get in Touch as primary. Command: clarify + harden.
- [P1] Card-grid plateau (17 cards). Fix: merge Solutions and Sectors into one setting-to-platform view, drop per-card bullets on home, move Capabilities to a compact list; lead with indici. Command: distill + layout.
- [P1] Motion and a11y: GSAP reveals ignore reduced motion in 11 sections; mobile menu clips its CTA and does not scroll; desktop nav breaks at 768px; force-dark mobile menu links 3.5:1. Command: harden + adapt + animate.
- [P1] Performance: hero WebGL renders off screen (69 draws/s); ContactCta loads the 235 kB gz Three.js chunk on every desktop page and crosses the hero boundary; HDR from raw.githack.com. Command: optimize.
- [P2] Proof section written as boilerplate ("Our customers achieve excellence", ethos paragraph), duplicate 250-practices line, Qatar ambulance deployment buried. Command: clarify.

## Persona Red Flags
- Jordan: hero may show "Every system, one language." with no mention of healthcare; Solutions / Sectors / Services read as synonyms.
- Riley: hero never stops; form has no required markers or inline errors; ghosted "Healthcare" in scrubbed Positioning headline.
- Casey (390px): ~17,400px home; menu CTA unreachable; contact links 17px tall.
- Dr. Noor, Doha hospital CIO: Qatar ambulance deployment is the 6th bullet; evaluation ends on a gmail address and a +92 number.

## Minor Observations
Section washes and radial glows contradict "quiet surfaces"; non-interactive cards lift (Lift Means Live); /about Story grid leaves empty cells; Engagement numbered; /contact stacks two crimson headlines; hover-only card affordance; theme-color static; transition-all and a padding animation in nav items; industries images load eagerly.

## Questions to Consider
- If Digital Anatomy already explains the six disciplines, why does the Capabilities grid exist on home?
- Why is the only Qatar deployment the last bullet on a Qatar-focused site?
- Would a Doha CIO rather see a spinning V, or a real screenshot of CareMonX in an ambulance control room?
