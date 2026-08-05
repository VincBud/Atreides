# Implementation Phases

Claude should work in this order.

## Phase 0 — Inspect and plan

- inspect repository
- read all documentation
- identify actual Next.js/Tailwind structure
- verify logo asset
- present a short plan
- make no broad dependency changes

## Phase 1 — Foundation

- metadata and site constants
- fonts
- brand CSS variables
- global background and text styles
- shared container
- buttons
- section heading
- header
- footer
- legal-page shell

Acceptance criteria:

- site renders
- logo is correctly displayed on dark background
- mobile navigation is keyboard accessible
- brand colors are centralized

## Phase 2 — Hero and product visual

- hero copy
- CTAs
- trust strip
- conceptual dashboard visual
- responsive layout

Acceptance criteria:

- product is understandable within a few seconds
- visual does not imply unsupported deployment claims
- no horizontal overflow on mobile

## Phase 3 — Problem and solution

- problem section
- solution section
- feature cards
- coherent transition between problem and product

Acceptance criteria:

- content does not repeat excessively
- cards remain readable at mobile widths
- amber is used sparingly

## Phase 4 — Workflow and use cases

- three-step workflow
- four use-case cards
- optional lightweight connecting line or grid motif

Acceptance criteria:

- content is scannable
- all use cases are grounded in approved positioning

## Phase 5 — Human control and responsible technology

- prominent human-control statement
- responsible-technology principles
- visible qualifier about design status

Acceptance criteria:

- no person classification language
- no autonomous intervention claims
- no unverified compliance claims

## Phase 6 — Pilot and contact

- pilot-program section
- pilot steps
- contact section
- frontend-only form with honest disabled/unconnected state

Acceptance criteria:

- the CTA is clear
- no data is silently lost
- required privacy acknowledgement is visible
- backend status is transparent

## Phase 7 — Legal and SEO

- Impressum placeholders
- Datenschutz matching actual behavior
- canonical
- Open Graph
- robots
- sitemap
- favicon strategy using available logo where appropriate

Acceptance criteria:

- no fabricated legal entity
- no fabricated address or contact data
- all legal placeholders are easy to find

## Phase 8 — Polish

- responsive typography
- hover/focus states
- reduced motion
- spacing consistency
- semantic structure
- performance review

## Phase 9 — Verification

Run:

```bash
npm run lint
npm run build
```

Manually verify:

- 320 px mobile width
- common phone width
- tablet
- desktop
- keyboard navigation
- anchor links
- legal routes
- no console errors
- no missing assets

Provide final report.
