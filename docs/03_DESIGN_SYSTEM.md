# Design System

## Brand palette

### Deep Navy

`#0B1426`

Primary dark background and dominant brand color.

### Steel Blue

`#28445F`

Secondary surfaces, borders, muted graphic elements and interface panels.

### Signal Amber

`#F2A900`

Primary CTA, active states, highlighted zones and selected operational accents.

Do not use amber for large walls of text.

### Cloud White

`#F4F7F9`

Light text on dark backgrounds and optional light sections.

### Graphite

`#18202A`

Primary text on light backgrounds and dark-neutral surfaces.

## Color usage

Recommended balance:

- 55–65% Deep Navy
- 15–20% Cloud White
- 10–15% Steel Blue
- 5–8% Graphite
- 2–5% Signal Amber

Amber should feel deliberate and valuable.

## Logo

Primary supplied asset:

`/brand/atreides-logo-horizontal-dark-2400.png`

The current asset is optimized for a dark background.

Requirements:

- never distort
- preserve aspect ratio
- provide sufficient clear space
- do not place on busy imagery
- do not recolor without an approved vector source
- use a text fallback for accessibility

## Typography

Use a modern sans-serif available through Next.js font loading.

Preferred direction:

- Headings: `Manrope`, `Sora` or `Space Grotesk`
- Body/UI: `Inter`

Use at most two font families.

If using Google Fonts through `next/font`, choose one heading family and Inter for body.

## Type scale

Desktop guidance:

- Hero H1: 64–80 px, tightly tracked
- Section H2: 40–56 px
- H3: 22–28 px
- Body large: 18–20 px
- Body: 16–18 px
- Label/eyebrow: 12–14 px uppercase with tracking

Mobile:

- Hero H1: 42–52 px
- H2: 32–40 px
- Body: 16–18 px

## Layout

- max content width: approximately 1200–1280 px
- generous horizontal padding
- strong grid alignment
- large section spacing
- clear hierarchy
- avoid excessive centered text

## Shape language

Derived from the logo:

- modular square or rectangular panels
- restrained corner radii
- grid structures
- grouped zones
- clear borders
- subtle glow only around high-priority signals

Recommended radius:

- cards: 16–24 px
- buttons: 10–14 px
- chips: fully rounded or 8–10 px

## Buttons

Primary:

- Signal Amber background
- Deep Navy text
- strong contrast
- medium weight

Secondary:

- transparent or Deep Navy
- subtle Steel Blue border
- Cloud White text

All buttons require:

- hover state
- focus-visible state
- disabled state where relevant
- minimum touch target around 44 px

## Cards

- dark elevated surfaces
- thin border with low-opacity Steel Blue or Cloud White
- minimal shadow
- meaningful grouping
- no decorative card overload

## Motion

Motion should be subtle and functional:

- fade/translate reveal
- dashboard pulse for active alert
- heatmap intensity transition
- hover transitions

Respect `prefers-reduced-motion`.

Do not create constant distracting animation.

## Product visual

The hero dashboard should include a refined conceptual interface with:

- top status bar
- venue grid or map
- highlighted zones
- one prioritized alert
- camera/zone labels
- status such as `Zur Prüfung`
- restrained data labels

Use the brand colors. Avoid red as the dominant accent. Red, if used at all, is only a critical status color and not a brand color.

## Imagery

Prefer:

- abstract venue maps
- operational diagrams
- interface visuals
- subtle architectural/night-event context
- controlled crowd-flow abstractions

Avoid:

- hooded hackers
- ominous CCTV closeups
- aggressive bouncers
- police-style tactical imagery
- identifiable faces as the main visual
