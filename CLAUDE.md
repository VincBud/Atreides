# Atreides Website — Claude Code Instructions

## Mission

Build the official German-language website for **Atreides**, an AI-powered Venue Intelligence platform for clubs, festivals, beer tents, event halls and security providers.

This is a completely new and independent project. Build the site from scratch using the existing Next.js application in this repository.

## Hard rules

1. Do not inspect, copy, reference or reuse Buddy or any other project.
2. Use only the information and decisions contained in this repository.
3. Do not invent customers, pilots, testimonials, certifications, performance metrics or partnerships.
4. Do not present planned capabilities as already deployed.
5. Do not make unverified privacy, hosting, processing-location or compliance claims.
6. Do not use facial recognition, biometric identification or language that classifies people as “dangerous”.
7. Atreides is a human-controlled decision-support system. The final assessment and action always remain with security staff.
8. Keep legal and company details as explicit placeholders until the owner supplies them.
9. Build mobile-first and production-quality.
10. Do not install unnecessary dependencies.

## Approved stack

- Next.js 16 with App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Native browser APIs where sufficient

## Source files

Read every file in `docs/` before changing application code.

The supplied logo is located at:

`public/brand/atreides-logo-horizontal-dark-2400.png`

## Work method

1. Inspect the current repository and summarize the existing scaffold.
2. Read all project documentation.
3. Write a short implementation plan before editing.
4. Implement the website phase by phase as defined in `docs/06_IMPLEMENTATION_PHASES.md`.
5. Keep components small, semantic and reusable.
6. Use accessible HTML and visible focus states.
7. After each major phase, check the page in mobile and desktop layouts.
8. At completion, run:
   - `npm run lint`
   - `npm run build`
9. Fix all newly introduced errors and warnings that affect correctness or accessibility.
10. Report:
   - files created or changed
   - checks run and results
   - placeholders still requiring owner input

## Visual direction

The website must feel:

- strategic
- calm
- precise
- premium B2B
- technologically advanced
- operational rather than futuristic-gimmicky

Avoid:

- generic cyber-security imagery
- hooded hackers
- red warning overload
- aggressive military styling
- excessive glassmorphism
- noisy gradients
- fake surveillance footage
- stock-photo clichés

## Initial scope

Create:

- responsive header
- hero
- product/dashboard visual
- problem section
- solution section
- three-step workflow
- use cases
- human-control section
- responsible-technology/privacy section
- pilot-program CTA
- contact section or lightweight lead form
- footer
- `/impressum`
- `/datenschutz`
- metadata, sitemap and robots
- responsive and accessible implementation

Do not add a CMS, login, dashboard backend, analytics, cookies or database unless explicitly requested.
