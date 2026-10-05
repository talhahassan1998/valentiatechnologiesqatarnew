<!-- Source: design-md-library/apple/DESIGN.md (VoltAgent/awesome-design-md, MIT),
     adapted to Valentia's brand: logo blue replaces Apple's Action Blue, crimson is
     kept as emphasis, SF Pro falls back to Inter. Content and IA are Valentia's own. -->
---
name: Valentia Technologies
description: Apple-inspired healthcare software site. Neutral gallery surfaces, one blue action colour, crimson emphasis.
colors:
  action-blue: "#3d47d5"
  action-blue-hover: "#4e58eb"
  action-blue-on-dark: "#6b73ef"
  emphasis-crimson: "#9d1a40"
  emphasis-crimson-on-dark: "#d95d7e"
  canvas: "#ffffff"
  parchment: "#f5f5f7"
  hover-step: "#e8e8ed"
  hairline: "#d2d2d7"
  ink: "#1d1d1f"
  ink-secondary: "#636366"
  tile-dark: "#1d1d1f"
  ground-dark: "#0b0b0c"
  void: "#000000"
  body-on-dark: "#d2d2d7"
  secondary-on-dark: "#a1a1a6"
typography:
  display:
    fontFamily: "-apple-system, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "-apple-system, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  subtitle:
    fontFamily: "-apple-system, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.5vw, 1.3125rem)"
    fontWeight: 600
    lineHeight: 1.19
  tagline:
    fontFamily: "-apple-system, SF Pro Display, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.3125rem)"
    fontWeight: 600
    lineHeight: 1.19
  lead:
    fontFamily: "-apple-system, SF Pro Text, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.7vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "-apple-system, SF Pro Text, Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.47
  label:
    fontFamily: "-apple-system, SF Pro Text, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.29
rounded:
  sm: "8px"
  md: "12px"
  lg: "18px"
  pill: "9999px"
spacing:
  gutter: "24px"
  gutter-md: "48px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.action-blue-hover}"
  button-secondary:
    textColor: "{colors.action-blue}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "44px"
  card:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.lg}"
    padding: "40px"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  nav:
    textColor: "{colors.ink}"
    height: "56px"
---

# Design System: Valentia Technologies

## Overview

**Creative North Star: "The Clinical Gallery"**

Apple's gallery grammar applied to healthcare software: near-invisible UI, generous air, one idea per full-bleed tile, and the product (the V mark, the platforms, the proof) presented like an exhibit. Surfaces are neutral white and parchment by day and near-black tiles by night; the colour change between sections is the divider. Valentia's logo blue is the only action colour and crimson is the brand's emphasis, used once per view.

Light is the default theme; dark is a full alternative behind the toggle. The home hero and the closing band stay dark in both themes as the page's two dark tiles.

**Key Characteristics:**
- Neutral surfaces (white, parchment #f5f5f7, near-black #1d1d1f); no tinted greys.
- One action colour (logo blue #3d47d5); crimson is emphasis only, never a button.
- Pill buttons, flat: no shadow, no sheen, no lift; press scales to 0.96.
- System SF Pro on Apple devices, Inter elsewhere; headlines 600 with tight tracking; body 17px.
- Centred section headings; alternating white/parchment tiles; no borders between sections.
- No decorative gradients and no shadows on UI. The logo V is the one ornament.

## Colors

### Primary
- **Action Blue** (#3d47d5): every link, pill, focus ring and active nav marker. Hover (#4e58eb). On dark tiles, links use #6b73ef.

### Secondary
- **Emphasis Crimson** (#9d1a40; #d95d7e on dark): the page-hero tagline and the accent line of a headline. Never a fill, never a second CTA colour.

### Neutral
- **Canvas** (#ffffff): page ground. **Parchment** (#f5f5f7): alternate tiles, cards, footer. **Hover Step** (#e8e8ed). **Hairline** (#d2d2d7 at low alpha).
- **Ink** (#1d1d1f): all headings and body. **Ink Secondary** (#636366): leads and captions (5.9:1 on white).
- **Dark tiles**: ground #0b0b0c, tile #1d1d1f, void #000; text #d2d2d7 / #a1a1a6.

### Named Rules
**The One Action Rule.** Blue means clickable. A non-interactive label is ink.

**The Crimson Once Rule.** At most one crimson moment per viewport.

**The Ramp Not Hex Rule.** Components use the ink ramp tokens (`--color-v-ink-*`), so both themes stay correct from one set.

## Typography

**Display / Body:** `-apple-system` (SF Pro on Apple devices) with Inter as the open fallback. JetBrains Mono only for data and numerals in sequences.

### Hierarchy
- **Display** (600, clamp(2.5rem, 5.5vw, 4.5rem), 1.07): home hero headline only.
- **Headline** (600, clamp(2.25rem, 4.6vw, 3.5rem), 1.07): page heroes, closing band.
- **Title** (600, clamp(1.75rem, 3.2vw, 2.5rem), 1.1): section headings, centred.
- **Subtitle** (600, ~21px, 1.19): card and row titles.
- **Tagline** (600, ~21px, crimson): the line above a page-hero headline.
- **Lead** (400, clamp(1.125rem, 1.7vw, 1.5rem), 1.4, ink secondary): the line under a heading.
- **Body** (400, 17px, 1.47). **Label** (600, 14px, ink): form fields, list captions, footer heads.

### Named Rules
**The Weight 600 Rule.** Headlines are 600, never 700; body is 400; there is no 500.

## Layout

Content sits in a `max-w-7xl` column (24px gutters, 48px from `md`); headings and leads centre in a ~3xl measure. Sections are full-bleed tiles with generous vertical padding (96-128px) and no borders: every second section on a page sits on parchment, and dark tiles (hero, Digital Anatomy, closing band) break the rhythm. Collections use grids with no empty cells, or rows separated by a single hairline.

## Elevation & Depth

Flat by default. Depth comes from the surface change (white, parchment, dark tile). The only shadows are `--shadow-lg` for floating overlays (dropdowns, the voice panel) and `--shadow-product` for imagery resting on a surface. The nav is frosted glass: page ground at 80% with `saturate(180%) blur(20px)`.

## Shapes

Utility controls 8px, panels and inputs 12px, cards and media 18px, buttons and chips-as-actions full pills. The logo's V-fold is the one recurring silhouette (footer notch, list bullets).

## Components

### Buttons
- **Primary:** Action Blue pill, white 17px label, 44px tall, no arrow, no shadow. Hover to #4e58eb; press scales to 0.96.
- **Secondary:** blue outline pill with blue label; hover adds an 8% blue wash.
- **Labels:** one per intent: "Get in Touch", "Explore Solutions", "Explore Services".

### Cards / Containers
- 18px radius, parchment fill (page-ground fill on parchment tiles), whisper hairline border, 32-40px padding.
- Interactive cards step to the hover ground; `card-static` cards do not respond at all.

### Inputs / Fields
- 12px radius, 1px #86868b border (3.6:1), page-ground fill, blue border plus a soft blue ring on focus. Labels above in Label style; the optional field is marked "(optional)".

### Navigation
- 56px frosted bar, always on; 12px links in ink secondary, current page marked with a crimson V. Small blue pill "Get in Touch" on the right. Dark frosted over the home hero. Mobile: full-width scrollable drawer from `lg` down.

### Footer
- Parchment, dense link columns with ink column heads, fine print at the bottom.

### Voice Assistant (signature)
- 56px Action Blue orb bottom-right; crimson with a stop square while a conversation is live.

## Do's and Don'ts

### Do:
- **Do** take every colour and type size from `src/styles/tokens.css`.
- **Do** keep blue for actions and crimson for one emphasis per view.
- **Do** alternate white and parchment tiles; let the colour change divide sections.
- **Do** check every surface in both themes and at 390px; light is the default.
- **Do** honour `prefers-reduced-motion` for every reveal.

### Don't:
- **Don't** add shadows, sheens or hover lifts to cards or buttons.
- **Don't** use decorative gradients or glow washes.
- **Don't** put borders between sections, or small uppercase mono eyebrows above headings.
- **Don't** number unordered collections, or auto-advance content.
- **Don't** use em dashes in visible copy.
- **Don't** give two buttons with the same destination different labels.
