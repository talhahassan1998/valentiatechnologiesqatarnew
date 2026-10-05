# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Healthcare decision makers in Qatar and the wider GCC evaluating a software partner: hospital, clinic, ambulance-service and health-authority CIOs, IT leads, procurement teams and clinical leads. They arrive comparing vendors, need to judge credibility and fit quickly, and leave either by contacting Valentia or by forwarding the site to colleagues.

## Product Purpose

Corporate site for Valentia Technologies, a healthcare software company in Doha. It presents the six-platform suite and the engineering services behind it, proves the company runs real clinical systems at scale, and turns a qualified visitor into an enquiry (contact form, email, phone or WhatsApp). Success is a well-formed enquiry from the right organisation.

## Positioning

A suite rather than a single system: six platforms covering primary care, home care, telehealth and triage, community care, emergency response and oncology, built to HL7 and FHIR so they interoperate with each other and with a client's existing estate. Clinical-first engineering (work observed on the floor before architecture) and in-service since 2004 across seven regions.

## Operating Context

Visitors read on desktop at work and on mobile between meetings; many will share links internally. English is the working language. A floating voice assistant ("Jarvis", Gemini-backed) answers questions and navigates the site by voice or text.

## Capabilities and Constraints

- Routes: `/`, `/solutions`, `/sectors`, `/services`, `/clients`, `/partners`, `/about`, `/contact`, with anchors per product, sector and service. Deep-link rewrites live in `vercel.json` and `public/_redirects`; deployed on GitHub Pages under a subpath.
- Products: indici (cloud EHR), InnovaCare (home care), Spectrum (telehealth and case management), Vivasta (community care), CareMonX (emergency care), Maha (oncology).
- Sectors: Primary Care, Supported Living, Out of Hours Care, Community Care, Emergency Care.
- Services: Clinical Systems, Interoperability, Health Data & Analytics, Applied AI, Patient Platforms, Security & Compliance.
- Contact form posts to Web3Forms; replies by email within two business days.
- All copy lives in `src/data/content.ts`; colour and type tokens in `src/styles/tokens.css`. The Three.js hero is lazy-loaded and must stay off the critical path.

## Brand Commitments

- Name: Valentia Technologies. Logo mark is the blue and crimson "V" (`public/valentia-logo.png`); brand hues sampled from it (blue `#3D47D5`, crimson `#9D1A40`).
- Voice: plain, clinical, confident, specific. No hype verbs; claims are concrete.

## Evidence on Hand

Confirmed accurate by the owner (2026-09-30):
- 250 general practices running indici; 85% telehealth coverage across deployed services; 600+ people; building healthcare software since 2004.
- Deployments: national ambulance services; out-of-hours and hospital services in Ireland; general practices across Australia; ambulance services in South Africa, Qatar and Dubai; community and age care providers. Regions: New Zealand, Australia, South Pacific, Ireland, South Africa, Qatar, Dubai.
- Technology partners with logos in `public/partners/`: Microsoft, VMware, Fortinet and others listed in `content.ts`.
- Product icons in `public/solutions/`, sector icons in `public/sectors/`.

Absent, must not be fabricated: named client testimonials or quotes, case studies, pricing, certifications or accreditations, team photos.

## Product Principles

1. Credibility before persuasion: a GCC buyer should find proof (deployments, standards, regions) before being asked to act.
2. Specific over impressive: name the product, setting and standard rather than adjectives.
3. One clear next step: every page leads to the same contact path, labelled the same way.
4. Clinical calm: the site should feel as dependable as the software it sells.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Motion must respect `prefers-reduced-motion`; both light and dark themes must hold contrast.
