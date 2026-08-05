# Technical Specification

## Existing foundation

The repository already contains a fresh Next.js 16 application created with recommended defaults.

Before implementation, verify:

- App Router
- TypeScript
- Tailwind CSS
- ESLint
- `src/` directory
- current package versions

Adapt to the actual scaffold rather than assuming filenames.

## Architecture

Recommended structure:

```text
src/
  app/
    datenschutz/
      page.tsx
    impressum/
      page.tsx
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    layout/
      Header.tsx
      Footer.tsx
    sections/
      Hero.tsx
      Problem.tsx
      Solution.tsx
      Workflow.tsx
      UseCases.tsx
      HumanControl.tsx
      ResponsibleTechnology.tsx
      PilotProgram.tsx
      Contact.tsx
    ui/
      ButtonLink.tsx
      SectionHeading.tsx
      ProductVisual.tsx
  lib/
    site.ts
```

This is guidance, not a rigid requirement.

## Rendering

Prefer Server Components by default.

Use Client Components only where interaction requires them, for example:

- mobile menu
- optional form validation
- small motion interactions

Do not convert the whole page into a Client Component.

## CSS

Use Tailwind for layout and component styling.

Use `globals.css` for:

- CSS variables
- base typography
- selection styles
- focus outline defaults
- reduced-motion behavior
- background grid utilities if needed

Define the brand palette as CSS variables and/or Tailwind-compatible arbitrary values.

Suggested variables:

```css
--atreides-navy: #0B1426;
--atreides-steel: #28445F;
--atreides-amber: #F2A900;
--atreides-cloud: #F4F7F9;
--atreides-graphite: #18202A;
```

## Accessibility

Required:

- semantic landmarks
- one clear H1
- logical heading hierarchy
- keyboard-accessible mobile navigation
- visible focus styles
- useful alt text
- decorative images with empty alt
- sufficient contrast
- labels for every field
- form errors tied to fields
- no information conveyed by color alone
- reduced-motion support

## Product visual implementation

Build the dashboard visual in HTML/CSS/SVG where possible.

Advantages:

- responsive
- crisp
- editable
- accessible
- visually aligned with the site

Do not use a misleading screenshot that implies a deployed production system.

Possible components:

- venue map grid
- camera zones
- heat cells
- alert panel
- status chip
- trend line
- operator-review button or status

## Contact form

Initial version must not pretend to send data.

Implement one of these safe states:

### Preferred until backend decision

- complete form UI
- client-side validation
- submit button disabled or handled with an honest “not yet connected” state
- clear notice that no data is transmitted

### Later options

Only after owner approval:

- Resend + API route
- Supabase table + RLS
- Formspree or another approved service

When connected later, add:

- rate limiting
- spam protection
- server-side validation
- privacy-policy details
- success and error states

## SEO

Implement:

- metadata in `layout.tsx`
- page title and description
- canonical URL based on `https://atreides-security.com`
- Open Graph metadata
- Twitter card metadata
- sitemap
- robots
- meaningful heading structure
- descriptive internal anchors

Do not create fake structured data for an organization with missing legal details.

A generic `WebSite` JSON-LD object is optional but not necessary for v1.

## Images

Use Next.js `Image` for the supplied logo.

Do not upscale low-resolution assets unnecessarily.

## Performance

Aim for:

- minimal client JavaScript
- no heavy animation library
- no autoplay video
- no large stock imagery
- responsive image sizing
- font optimization through `next/font`
- no layout shifts caused by missing dimensions

## Security

- no secrets in client code
- no environment variables until required
- no dangerouslySetInnerHTML unless justified
- no external scripts
- no analytics in v1
- no cookie banner in v1 because no optional tracking is planned

## Legal pages

Create clear placeholders rather than fabricated information.

The privacy page must match actual v1 behavior:

- static website
- no analytics
- no active contact transmission while form backend is disabled
- server logs/hosting details must remain generic unless deployment provider is confirmed

After deployment to Vercel or another host, update the privacy policy accordingly.

## Quality commands

Run:

```bash
npm run lint
npm run build
```

If a typecheck script exists, run it. Otherwise the Next.js production build covers TypeScript checks.

## Git discipline

At meaningful milestones, propose commits such as:

- `feat: establish Atreides design system and layout`
- `feat: build landing page sections`
- `feat: add legal pages and metadata`
- `fix: polish responsive navigation and accessibility`

Do not commit automatically unless explicitly requested.
